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

使用`instanceof`主要是在原型链中去寻找数据，我们使用代码来模拟实现一下：

```js
const instanceofDemo = (a, B) => {
  // 当前不是一个对象
  if (typeof a !== 'object') {
    return false;
  }
  // 当前是一个对象
  while (true) {
    // 判断当前的对象是否为null
    if (a === null) {
      // 已经遍历到最顶端
      return false;
    }
    // 比较原型
    if (B.prototype === a.__proto__) {
      return true;
    } else {
      // 赋值给当前对象的下级的原型链
      a = a.__proto__;
    }
  }
};
```

> 这就是我们在使用`instanceof`的基本原理，从原型链上去寻找，直到原型链的最顶端为止。

### 使用`constructor`和`Object.prototype.toString`判断数据类型

- 我们在判断数据类型的时候，我们使用`Object.prototype.toString`为万能方法。

```js
Object.prototype.toString.call(1);
// [object Number]
Object.prototype.toString.call('1');
// [object String]
Object.prototype.toString.call(undefined);
// [object Undefined]
Object.prototype.toString.call(null);
// [object Null]
Object.prototype.toString.call(true);
// [object Boolean]
Object.prototype.toString.call({});
// [object Object]
Object.prototype.toString.call([]);
// [object Array]
Object.prototype.toString.call(function () {});
// [object Function]
Object.prototype.toString.call(Symbol('asd'));
// [object Symbol]
```

- 使用`constructor`来查看数据类型

```js
const foo = 1;
foo.constructor; // f Number() { [native code] }
const foo1 = '1';
foo1.constructor; // f String() { [native code] }
const foo2 = true;
foo2.constructor; // f Boolean() { [native code] }
const foo3 = [];
foo3.constructor; // f Array() { [native code] }
const foo4 = {};
foo4.constructor; // f Object() { [native code] }
const date = new Date();
date.constructor; // f Date() { [native code] }
const foo5 = Symbol('sas');
foo5.constructor; // f Symbol() { [native code] }
const foo6 = () => 1;
foo6.constructor; // f Function() { [native code] }
const foo7 = undefined;
foo7.constructor; // 报错
const foo8 = null;
foo8.constructor; // 报错
```

对于`undefined`和`null`，我们去读取他的`constructor`发现会报错，由于`constructor`返回的构造函数本身，一般用来判断数据类型的情况不多。

## 数据类型及其转换

在`JS`开发的过程中，我们不仅感觉到他的灵活易用性，但随之也会给我们带来一些猝不及防的坑。

`JS`是一种弱类型语言，或者说是一种动态语言，这就意味着我们不用提前声明变量的数据类型，在程序运行的过程中，变量的数据类型会被自动确定。

我们来看一些经典的案例：

```js
console.log(1 + '1'); // 11
console.log(1 + true); // 2
console.log(1 + false); // 1
console.log(1 + undefined); // NaN
console.log('abc' + true); // abctrue
```

根据上面的例子我们发现，不管什么类型和`string`类型的数据相加都是字符串类型。在其他情况下，都会被转为`number`类型，但是`undefined`会被转换为`NaN`

- 那么如果复杂类型进行运算呢？

```js
console.log({} + true); // [object Object]true
```

我们可以看到最终转换成了字符串的类型，那么是根据什么规则去做对应的转换的呢？

> 在转换时，会调用该对象上的`valueOf`或`toString`方法，这两个方法的返回值是转换后的结果。

那么这两个方法的优先级是怎么确定的呢？

> 从主观上说，这个对象倾向于转换成什么，就会优先调用哪个方法。如果倾向于转换为`number`类型，就会优先调用`valueOf`方法。反之就只调用`toString`方法。
> 但是在一些规范中，我们会看到的是会先调用`valueOf`方法再调用`toString`方法也是没有什么问题的。

```js
const obj = {
  valueOf() {
    return 1;
  },
  toString() {
    return 'sasa';
  },
};
alert(obj); // 弹出sasa
console.log(obj + 1); // 2
```

## 函数参数传递

我们知道 JS 中引用赋值和基本数据类型赋值的区别，并了解由此引出的相关话题：深拷贝和浅拷贝。那么函数的参数传递有什么讲究呢？接下来我们研究一下。

```js
let foo = 1;
const bar = (value) => {
  value = 2;
  console.log(value);
};
bar(foo); // 2
console.log(foo); // 1
```

当形参为基本类型的时候，数据会被拷贝一份，不会影响原来的值。

```js
let foo = { bar: 1 };
const bar = (value) => {
  value.bar = 2;
  console.log(value);
};
bar(foo); // {bar:2}
console.log(foo); // {bar:2}
```

当形参为引用类型的时候，修改某个参数的值，也会对原来的参数进行修改。因为此时函数的引用地址指向了原来的参数。

但是还存在第三种情况

```js
let foo = { bar: 2 };
const bar = (value) => {
  value = 2;
  console.log(value);
};
bar(foo); // 2
console.log(foo); // {bar:2}
```

当形参的引用地址直接被改变的情况下，并不会影响外部的引用类型。

大概总结起来三点：

1. 函数形参为基本类型的时候，函数体内会复制一份参数值，任何操作不会影响原始值。
2. 函数形参为引用类型的时候，当函数体内修改这个引用类型的属性值得时候，会影响原始的值。
3. 函数形参为引用类型的时候，当函数体内直接修改这个引用类型的地址，则相当于在函数体内创建了一个新的引用，任何操作不会影响原始值。

## JS 细节问题

我们最常见的 JS 细节就是：`cannot read property of undefined`。那么我们有几种解决方式呢？

1. 通过`&&`短路运算进行可访问性嗅探

```js
let obj = {
  a: {
    b: {
      c: '1',
    },
  },
};
console.log(obj.a && obj.a.b && obj.a.b.c);
```

2. 通过`||`单元设置默认保底值

```js
let obj = {
  a: {
    b: 's',
  },
};
console.log((obj.a || {}).b);
```

3. 使用 try...catch 的方式

```js
let obj = {
  a: {
    b: {
      c: '1',
    },
  },
};
let res;
try {
  res = obj.a.b.c;
} catch (e) {
  res = null;
}
```

4. 使用`lodash`API 的 get 方法获取
