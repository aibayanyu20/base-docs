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
