---
title: rollup
group:
  path: /vite/rollup
  title: rollup
---

## 命令行使用

### 帮助文档

```shell
rollup --help
rollup -h
```

### 查看版本

```shell
rollup -v
```

### 输入输出文件

```shell
rollup -i index.js --file dist.js --format umd
```

- -i 输入的文件
- --file 输出的文件
- --format 输出文件的格式

```shell

rollup -i a.js -i b.js --dir dist
```

多个文件不能指定输出到一个文件中，所以我们需要指定到文件夹中即可

**`format`类型：**

1. `iife` 输出一个自调用的函数
2. `cjs` 编译为`CommonJs`
3. `es` 编译为`ESMODULE`
4. `umd` 编译为兼容多种模式的文件

### 配置文件

创建一个`rollup.config.js`

```js
export default {
  input: 'index.js',
  output: {
    file: 'dist.js',
    format: 'umd',
    name: 'Index',
  },
};
```

```shell
rollup -c rollup.config.js
```

### 指定环境变量

```shell
rollup -c rollup.config.js --enviromnet TEST:123
```

在`rollup.config.js`

```js
console.log(process.env.TEST); // 123
```

### 插件使用

[插件地址](https://github.com/rollup/plugins)

命令行使用创建，我们以 json 为例子

```shell
yarn add -D  @rollup/plugin-json

rollup -i index.js --file dist.js --plugin json
```

## 配置文件

## 自定义插件

在`rollup`中存在很多的`hook`我们可以通过这些`hook`实现一个插件。

### options

是一个比所以组件都早的钩子函数，只能操作当前钩子内部的

### startBuild

这个是在
