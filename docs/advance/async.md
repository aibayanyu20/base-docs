# 异步流程

异步流程是在前端开发中常见的，也是难点之一。本章我们学习一下异步流程。

## 初体验

既然是初体验，我们就用一个红绿灯例子通过几种方式来实现。

<code src="./demo/demo6.tsx"></code>

主要是采用的是回调的方式和 promise 的方式实现的同步流程。

**那么什么是同步任务，什么是异步任务呢？**

同步任务：是需要被主线程消化的任务，这些任务一起形成执行栈。

异步任务：不仅如此主线的任务，主线程空闲时，即执行栈为空时，系统将会执行任务队列中的任务，即异步操作

下面来举几个例子：

- 下面例子的输出结果

```js
const t1 = new Date();
setTimeout(() => {
  const t3 = new Date();
  console.log('setTimeout block');
  console.log('t3 - t1 = ', t3 - t1);
}, 100);
let t2 = new Date();
while (t2 - t1 < 200) {
  t2 = new Date();
}
console.log('end here');
// 输出的顺序
// end here
// setTimeout block
// t3 - t1 = 200
```

我们可以看到，定时器的时间是 100ms，我们主线任务是需要执行 200ms，在计时完成后还是会先执行主线的任务，只有当主线的任务全部执行完成了，才会开始执行队列中的任务。

- 上面的例子比较容易看出，下面我们在举个例子

```js
setTimeout(() => {
  console.log(1);
}, 1);

setTimeout(() => {
  console.log(2);
}, 0);
```

> 这个例子我们看到了，时间差就是 1ms，按道理来说这里应该会先执行第二个，在执行第一个，但是在 Chrome 浏览器中确是相反的，事实上两个定时器谁先进入队列就先执行谁，并不会严格按照 1ms 和 0ms 去执行。
> 在 MDN 给出了最小的延迟时间是 4ms,另外定时器还有一个最大延迟的概念，根据不同的浏览器效果是不一样的。

## 宏任务与微任务

在我们整体去介绍宏任务之前，我们先分析一个例子：

```js
console.log('start here');
new Promise((resolve, reject) => {
  console.log('first promise constrcutor');
  resolve();
})
  .then(() => {
    console.log('first promise then');
    return new Promise((resolve) => {
      console.log('second promise');
    }).then(() => {
      console.log('second promise then');
    });
  })
  .then(() => {
    console.log('another first promise then');
  });

console.log('end here');
```

结果打印的顺序如下：

1. 首先执行的就是`start here`
2. 接着会实例化一个`Promise`构造函数，同时会执行同步代码`first promise constrcutor`，同时会将第一处的`Promise`的`then`方法放到队列中去。
3. 继续执行同步的代码`end here`
4. 同步代码执行完成，开始执行任务队列中的逻辑，输出`first promise then`以及`second promise`,会将第二处的`Promise`的`then`方法放到队列中去。
5. 执行第二个任务中的`then`方法，输出`second promise then`
6. 最后输出`another first promise then`

这个整体的流程并不是很简单，涉及到了`Promise`的新特性。

这个`Promise`的队列又和`setTimeout`中的队列不太相同，在任务队列中的异步任务其实又分为了宏任务和微任务，也就是说这两个都是异步操作的，但是是两个不用的队列。

哪些是宏任务：

1. setTimeout
2. setInterval
3. I/O
4. 事件
5. postMessage
6. setImmediate(NodeJs 中的特性，浏览器已经废弃该 API)
7. requestAnimationFrame
8. UI 渲染

哪些是微任务：

1. Promise.then
2. MutationObserver
3. process.nextTick(NodeJs)

那么微任务与宏任务哪个优先级会更高一些呢？

我们用一个例子来看一下：

```js
console.log('start here');
const foo = () =>
  new Promise((resolve, reject) => {
    console.log('first promise constructor');
    let promise1 = new Promise((resolve, reject) => {
      console.log('second promise constructor');
      setTimeout(() => {
        console.log('setTimeout here');
        resolve();
      }, 0);
      resolve(1);
    });
    resolve(0);
    promise1.then((arg) => {
      console.log(arg);
    });
  });
foo().then((arg) => {
  console.log(arg);
});
console.log('end here');
```

下面我们来分析一下这个的执行过程：

1. 首先执行`start here`，然后执行函数，同步输出`first promise constructor`
2. 继续执行`foo`函数，遇见`promise1`构造函数，同步输出`second promise constructor`以及`end here`，同时按照顺序依次执行一下操作,`setTimeout`回调进入任务队列（宏任务）
   ，`promise1`处理完成函数进入队列（微任务），第一个 promise 完成处理函数，进入任务队列（微任务）
3. 虽然`setTimeout`是率先进入到队列中去的，但是引擎会先执行微任务，按照微任务的顺序先输出`1`的结果，再输出`0`的结果（即第一个匿名的`promise`结果）
4. 此时所有的微任务都执行完毕，开始执行宏任务，输出`setTimeout`回调内容`setTimeout here`

由此可见，每次主线程执行栈为空的时候优先执行的就是微任务队列，微任务队列为空的时候才会执行宏任务中的队列。

## Promise 的实现原理

在我们实现 Promise 之前，我们先从`Promise`化一个 API 来聊一下，我们在做小程序开发的时候，一个很经典的例子就是`wx.request`的 API，我们可以发现配置化的 API，经常容易出现的一个问题
就是"回调地狱"问题。所以为了解决这个问题，我们可以将`wx.request`进行`Promise`化开发。

由于我们使用微信小程序的大部分 API 的时候，都会有一个`success`和`fail`，所以我们这里实现一个简易的`Promise`化的函数。

```js
const promisefy = (fn) => (args) =>
  new Promise((resolve, reject) => {
    args.success = function (res) {
      return resolve(res);
    };
    args.fail = function (err) {
      return reject(err);
    };
  });
```

下面我们再使用微信小程序的 API 的时候，我们可以这样使用`const wxRequest = promisefy(wx.request)`来将 API 转化。

通过上面的例子我们不难发现，其实就是一个构造函数创建一个`Promise`的实例。

### 实现`Promise`

1. 分析`Promise`就是一个构造函数。入参为函数类型的参数，这个函数自动具有`resovle`和`reject`方法。
2. 包含了一个`then`方法。需要定义两个参数，分别是`onfulfilled`和`onrejected`，他们都是函数类型的参数。
3. 其中`onfulfilled`通过参数可以获取`Promise`对象经过`resolve`处理后的值。
4. `onrejected`可以获取`Promise`对象经过`reject`处理后的值。
5. 需要存储`Promise`的三种状态`pending/fulfilled/rejected`。状态只会发生一次改变，是不可逆的，也是不能被二次改变的。（只允许在`pedding`下修改状态）

```js
function Promise(executor) {
  const self = this;
  this.status = 'pedding';
  this.value = null;
  this.reason = null;
  function resolve(value) {
    if (self.status === 'pedding') {
      self.value = value;
      self.status = 'fulfilled';
    }
  }

  function reject(reason) {
    if (self.status === 'pedding') {
      self.reason = reason;
      self.status = 'rejected';
    }
  }
}

// 增加原型中的then方法
Promise.prototype.then = function (onfulfilled, onrejected) {
  onfulfilled =
    typeof onfulfilled === 'function' ? onfulfilled : (data) => data;
  onrejected =
    typeof onrejected === 'function'
      ? onrejected
      : (error) => {
          throw error;
        };
  if (this.status === 'fulfilled') {
    onfulfilled(this.value);
  }
  if (this.status === 'rejected') {
    onrejected(this.reason);
  }
};
```

_为什么`then`要放到 Promise 构造函数的原型上，而不是放在构造函数内部呢？_

因为每个`Promise`实例的`then`方法逻辑都是一致的，实例在调用该方法时，可以通过原型`Promise.prototype`来调用，而不是需要每次实例化都创建一个`then`方法，以便节省内存，显然更合适。

这个时候我们使用一下我们自己写的这个`Promise`:

```js
let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('data');
  }, 2000);
});

promise.then((data) => {
  console.log(data);
});
```

我们会发现，代码并没有任何输出信息，为什么呢？

我们在实现逻辑全是同步的，我们自定义的`then`方法中的`onfufilled`也是同步执行的，当时的状态为`pedding`状态，并没有做到 2s 后执行。

那么我们该如何去调用呢？

```js
function Promise(executor) {
  this.status = 'pedding';
  this.onfulfilledFun = Function.prototype;
  this.onrejectedFun = Function.prototype;
  this.value = null;
  this.reason = null;
  const resovle = (data) => {
    if (data instanceof Promise) {
      // 判断当前是不是还是一个Promise
      return data.then(resovle, reject);
    }
    setTimeout(() => {
      if (this.status === 'pedding') {
        this.status = 'fulfilled';
        this.value = data;
        this.onfullfilledFun(data);
      }
    });
  };

  const reject = (reason) => {
    setTimeout(() => {
      if (this.status === 'pedding') {
        this.reason = reason;
        this.status = 'rejected';
        this.onrejectedFun(reason);
      }
    });
  };
  executor(resolve, reject);
}

Promise.prototype.then = function (onfulfilled, onrejected) {
  onfulfilled =
    typeof onfulfilled === 'function' ? onfulfilled : (data) => data;
  onrejected =
    typeof onrejected === 'function'
      ? onrejected
      : (error) => {
          throw error;
        };

  if (this.status === 'pedding') {
    this.onfullfilledFun = onfulfilled;
    this.onrejectedFun = onrejected;
  }
  if (this.status === 'fulfilled') {
    onfulfilled(this.value);
  }

  if (this.status === 'rejected') {
    onrejected(this.reason);
  }
};
```

这个时候，我们整个的实现一个基本的 Promise 就已经完成了，需要注意的是，我们这里采用的是`setTimeout`让`then`回调方法不直接阻止主线的任务流程，
但是我们在正常使用`Promise`的时候，需要放到微任务队列中，我们可以通过`MutationObserver`来模仿`nextTick`。

到此为止，一个最基本的`Promise`我们就已经实现了，接下来我们将继续完善一些细节。

### 细节完善

我们现在有一个需求，就是在`Promise`实例状态变更之前添加多个`then`方法，接下来看一下我们自己的是不是能实现这种功能。

```js
let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('data');
  }, 2000);
});

promise.then((data) => {
  console.log(`1:${data}`);
});

promise.then((data) => {
  console.log(`2:${data}`);
});
// 输出
// 2:data
```

可以看到我们实现的 Promise 只会输出`2:data`，这是因为第二个`then`方法中的`onFulfilledFun`会覆盖第一个`then`方法中的`onFulfilledFun`，所以我们需要做进一步的改进，存储的时候我们需要存储一个数组，
`onfulfilledArr`，在当前 Promise 被执行的时候循环调用`onfulfilledArr`中的方法即可。

```js
function Promise(executor) {
  this.status = 'pedding';
  this.value = null;
  this.reason = null;
  this.onFulfilledArr = [];
  this.onRejectedArr = [];

  const resolve = (data) => {
    if (data instanceof Promise) {
      // 判断当前是不是还是一个Promise
      return data.then(resovle, reject);
    }
    setTimeout(() => {
      if (this.status === 'pedding') {
        this.value = data;
        this.status = 'fulfilled';
        this.onFulfilledArr.forEach((v) => {
          // 执行
          v(data);
        });
      }
    });
  };

  const reject = (reason) => {
    setTimeout(() => {
      if (this.status === 'pedding') {
        this.reason = reason;
        this.status = 'rejected';
        this.onRejectedArr.forEach((v) => {
          // 执行
          v(reason);
        });
      }
    });
  };
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

Promise.prototype.then = function (onfulfilled, onrejected) {
  onfulfilled =
    typeof onfulfilled === 'function' ? onfulfilled : (data) => data;
  onrejected =
    typeof onrejected === 'function'
      ? onrejected
      : (error) => {
          throw error;
        };
  if (this.status === 'pedding') {
    this.onFulfilledArr.push(onfulfilled);
    this.onRejectedArr.push(onrejected);
  }
  if (this.status === 'fulfilled') {
    onfulfilled(this.value);
  }
  if (this.status === 'rejected') {
    onrejected(this.reason);
  }
};
```

如果我们在执行函数`executor`的时候抛出了异常，我们需要使用`try...catch`进行包裹，防止出现异常捕获不到的问题。

通过我们上面的手写`Promise`我们得到的结论如下：

1. Promise 的状态具有凝固性。（如果状态发生改变，就不会再次进行改变了）
2. Promise 可以在 then 方法第二个参数中进行错误处理。
3. Promise 实例可以添加多个 then 处理场景。

### 链式调用

我们先来看一下在`ES6`中实现的`Promise`的链式调用。

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('aab');
  }, 2000);
});

promise
  .then((data) => {
    console.log(data);
    return `${data} next then`;
  })
  .then((data) => {
    console.log(data);
  });

// 输出
// aab
// aab next then
```

我们分析一下上面的这个例子：

我们的值经过`resolve`处理后，如果在`then`方法体的`onfulfilled`函数中同步显示返回的新值，则将会在新的`Promise`实例`then`方法的`onfulfilled`函数中输出新值。

如果我们直接另一个 Promise 实例呢？

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('123');
  }, 2000);
});

promise
  .then((data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('456');
      }, 4000);
    });
  })
  .then((data) => {
    console.log(data);
  });

// 输出
// 123 2秒后输出的内容
// 456 6秒后输出的内容
```

根据上面的例子我们不难看出，处理支持返回一个普通的值以外，还支持返回一个`Promise`的实例传给下一个`then`。

### 初步实现链式调用

我们可以在我们的`then`方法中直接返回一个`Promise`实例。

```js
Promise.prototype.then = function (onfulfilled, onrejected) {
  onfulfilled =
    typeof onfulfilled === 'function' ? onfulfilled : (data) => data;
  onrejected =
    typeof onrejected === 'function'
      ? onrejected
      : (error) => {
          throw error;
        };
  // 定义一个Promise
  let promise2;
  if (this.status === 'fulfilled') {
    return (promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let res = onfulfilled(this.value);
          resolve(res);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }

  if (this.status === 'rejected') {
    return (promise2 = new Promise((resovle, reject) => {
      setTimeout(() => {
        try {
          let res = onrejected(this.value);
          resovle(res);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }
  if (this.status === 'pedding') {
    return (promise2 = new Promise((resolve, reject) => {
      this.onFulfilledArr.push(() => {
        try {
          let res = onfulfilled(this.value);
          resolve(res);
        } catch (e) {
          reject(e);
        }
      });
      this.onRejectedArr.push(() => {
        try {
          let res = onrejected(this.reason);
          resolve(res);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }
};
```
