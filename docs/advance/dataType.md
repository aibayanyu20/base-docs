# 数据类型

## 常用数据类型

1. 基本数据类型：`string/number/boolean/undefined/null`
2. 引用数据类型：`object/symbol(ES6)`

判断类型的几种方式：

`typeof/instanceof/Object.prototype.toString/constructor`

## typeof 判断类型

基本类型的判断

```js
typeof 5; // 'number'
typeof 'lisi'; // 'string'
typeof undefined; // undefined
typeof true; // boolean
typeof Symbol('aaa'); // Symbol
```

- 需要注意的是`null`是一种特例：

```js
typeof null; // 'object'
```

为什么`null`是`object`类型呢？

这算是一个历史的遗留的原因，在设计 JS 语言的时候，值的设计是前 32 位，并且用前三位表示数据类型，因为`000`开头的数据类型为`object`，
并且`null`的取值为 32 位全部为 0，所以使用`typeof`的时候，你会发现他是一个`object`类型。

引用类型的判断

```js
const foo = {};
typeof foo; // object
const arr = [];
typeof arr; // object
const info = new Date();
typeof info; // object
// 这算是复杂类型
const fn = () => {};
typeof fn; // function
```

根据上面的判断我们发现，数组、对象、内置对象都是`object`类型，无法使用`typeof`进行区分。

### 使用 instanceof 判断类型

根据上面的代码，我们发现，数组、对象、内置对象、构造函数等等的类型，我们使用`typeof`无法进行区分，
所以我们需要使用其他方法进行判断，这里我们使用的是`instanceof`进行判断。

- 原理

其实真实比较的就是被实例化的方法或者对象，是否存在对应的构造函数例如：`a instanceof B`表示 a 原型链上是否存在`B`的构造函数
