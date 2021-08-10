---
nav:
  title: 进阶
  path: /advance
---

## JS 进阶计划

打铁还需自身硬，进阶学习必不可少。

## 一网打尽`this`，对上下文说`yes`

在`JS`中的 this 指向很灵活，下面我们来学习一下`this`在 js 中的指向。

### `this`到底指向谁

我们先说一下`this`指向的概念性的知识。

1. 在函数体中，非显示或隐式地简单调用函数时，在严格模式下，函数内的`this`会被绑定到`undefined`上，非严格模式下则会被绑定在`window/global`上。
2. 一般使用`new`方法调用构造函数时，构造函数内的`this`会被绑定到新创建的对象上。
3. 一般通过`call/apply/bind`方法显示调用函数时，函数体内的`this`会被绑定到新创建的对象上。
4. 一般通过上下文对象调用函数时，函数体内的`this`会被绑定到该对象上。
5. 在箭头函数中，`this`的指向时由外层（函数或全局）作用域来决定的。

_目前列举出来的只是大部分的情况，真实环境多种多样，下面我们一起通过几个例子来学习一下_

### 例子分析

1. 全局环境中的`this`

```js
function f1() {
  console.log(this);
}

// 严格模式下
function f2() {
  'use strict';
  console.log(this);
}

f1(); // window

f2(); // undefined
```

> 这种情况相对简单直接，解释了我们第一条原则的`this`指向问题，严格模式下指向的是`undefined`非严格模式下指向的是`window`

2. 给出如下例子，说出`this`指向

```js
const foo = {
  bar: 10,
  fn: function () {
    console.log(this);
    console.log(this.bar);
  },
};

var fn1 = foo.fn;
fn1();
```

在这里例子中`this`的真实指向时`window`而不是`foo`对象，因为在赋值给`fn1`的时候`fn1`仍然是在`window`对象中执行的，所以调用的仍是`window`对象。

```js
console.log(window); // window
console.log(window.bar); // undefined
```

如果我们换一种调用方式如下：

```js
foo.fn();
```

这时候的`this`指向就是调用它的对象。

<Alert type="info">
总结：
  根据上面的例子，我们可以看出，在执行函数时不考虑显示绑定(bind/apply/call)的情况下，如果函数中的this是被上一级对象所调用，那么this指向就一定时上一级的对象；否则指向的就是全局的环境。
</Alert>

3. 上下文对象中的`this`

- 例子一

最终拿到的`this`就是`student`

```js
const student = {
  name: 'test',
  fn: function () {
    return this;
  },
};

console.log(student.fn() === student); // true
```

- 例子二

```js
const person = {
  name: 'test',
  brother: {
    name: 'mike',
    fn: function () {
      return this.name;
    },
  },
};
console.log(person.brother.fn()); // mike
```

> `this`指向的是最后调用它的对象，所以输出的是`mike`

- 例子三：请描述以下代码的运行结果。

```js
const o1 = {
  text: 'o1',
  fn: function () {
    return this.text;
  },
};

const o2 = {
  text: 'o2',
  fn: function () {
    return o1.fn();
  },
};

const o3 = {
  text: 'o3',
  fn: function () {
    const fn = o1.fn;
    return fn();
  },
};

console.log(o1.fn()); // o1
console.log(o2.fn()); // o1
console.log(o3.fn()); // undefined
```

> 点击下方的按钮我们最后打印出来的内容，看到的就是`o1,o1,undefined`，前两个我们都好理解，为什么第三个是 undefined 的呢？

因为在最后一个中，我们通过`const fn = o1.fn`的赋值进行了“裸奔”调用，因此这里的`this`指向`window`，所以运行出来的就是`undefined`。

<br />

<code src="./demo/demo.tsx"></code>

- 如何让上面的例子中的第二个打印`o2`且不使用`call/apply/bind`？

```js
const o1 = {
  text: 'o1',
  fn: function () {
    return this.text;
  },
};

const o2 = {
  text: 'o2',
  fn: o1.fn,
};
console.log(o2.fn()); // o2
```

<br />

<code src="./demo/demo2.tsx"></code>

> 在上面的代码中，我们将`o1.fn`函数赋值给了`o2`，将函数挂载到了`o2`对象，`fn`最终作为`o2`对象的方法被调用。我们根据我们的测试做出以下总结结论。

<Alert type="info">
总结：我们不难看出，`this`指向的都是最终调用它的对象。
</Alert>

- 例子四：通过`call/apply/bind`改变`this`指向。

首先我们来说一下，这三者之间的共同点和区别：

1. 都是用来改变相关函数的 this 指向的。
2. `call/apply`是直接调用相关函数。`bind`不会执行相关函数，而是返回一个新的函数。

我们用一个例子来演示一下：

```ts
const target = [];
fn.call(target, 'arg1', 'arg2');
fn.apply(target, ['arg1', 'arg2']);
fn.bind(target, 'arg1', 'arg2')();
```

我们现在用的这三种方式是等价的，能更直观的区分三者之间的区别。

- 例子五：构造函数和`this`

```ts
function Foo() {
  this.bar = 'FOO';
}
const instance = new Foo();
console.log(instance.bar); // FOO
```

不难看出，我们上面的例子返回的就是一个`FOO`但是在`new`的时候具体做了哪些操作呢？

1. 创建一个对象
2. 将构造函数的`this`指向这个新的对象。
3. 为这个对象添加属性、方法等。
4. 最终返回新的对象。

用代码表述，就像如下：

```js
// 定义空对象
const obj = {};
// 将Foo的原型给obj
obj.__proto__ = Foo.prototype;
// 将Foo的this指向到obj
Foo.call(obj);
```

如果在构造函数中出现`return`的时候，就需要注意了，我们根据两个例子来讲解。

例子 1.

```js
function Foo() {
  this.name = 'Test';
  const o = {};
  return o;
}

const instance = new Foo();
console.log(instance.name); // undefined
```

> 这时候我们打印出来的就是`undefined`为什么会是`undefined`呢？

- 因为在构造函数中返回了一个对象`o`当我们在实例化对象的时候返回的就是`return`出来的这个对象。

```js
function Foo() {
  const name = 'test';
  return 1;
}

const instance = new Foo();
console.log(instance.name); // test
```

> 这时候我们看到真实实例化的对象就是构造函数，并不是 1。所以我们可以总结如下。

<Alert type="info">
如果在构造函数中显式的返回一个值，如果返回的是一个对象（复杂类型），那么this的指向就是返回的这个对象，如果返回的不是一个对象（基本类型），那么this仍然指向的是实例。
</Alert>

例子六：`this`优先级

显式绑定：通过`call/apply/bind/new`对`this`进行绑定。

隐式绑定：根据调用关系确定`this`指向的情况。

点击执行下面的例子：

<code src="./demo/demo3.tsx"></code>

<br/>

根据上面的例子我们不难看出，输出的结果分别是 1 和 2，也就是说`call/apply`的显式绑定一般来说优先级更高一些。

我们再来看一下另一个例子：

<code src="./demo/demo4.tsx"></code>

<br />

当我们点击第一个按钮的时候，输出的是 2，当我们点击第二个按钮的时候输出的是 3，我们可以得出如下的结论：

bar 函数本身是通过`bind`方法构造的函数，其内部已经将`this`绑定为`obj1`，当它再次作为构造函数通过`new`被调用时，返回的实例就已经与`obj1`解绑了，也就是说`new`绑定修改了`bind`绑定中的`this`指向，
因此`new`的优先级高于`bind`。

我们再看一个典型的例子：

<code src="./demo/demo5.tsx"></code>

这个时候我们输出的值为 2，由于`foo`中的`this`绑定到了`obj1`上，所以`bar`中引用的箭头函数也会绑定到`obj1`上，箭头函数的绑定无法被修改。
