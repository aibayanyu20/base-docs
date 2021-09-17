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
