---
nav:
  title: Webpack
  path: /webpack
---

# 基础

webpack 作为最常用的打包工具之一，我们要详细的去研究一下整个的打包的流程和打包的方式。

## 什么是 webpack？

一套基于`NodeJS`的"模块化打包工具"。

## 为什么要分模块？

- 问题：

如果要增加代码的复用性和可维护性，就需要将不同的模块和功能分为不同的 JS 文件去书写，但是会导致资源过多，请求次数也就过多，导致性能差。

为了解决上面的问题，我们就需要引入模块化的打包工具`webpack`实现。、

1. 项目上线时将用到的所有模块都合并到一个文件中。
2. 在主要的 html 文件中引入主文件，并在主文件中导入依赖的模块。

## 安装

```shell
npm init -y
npm install --save-dev webpack
npm install --save-dev webpack-cli
```

## 使用

只需要打包主文件就可以

```shell
npx webpack index.js
```

## 配置文件

[webpack 配置文件地址](https://www.webpackjs.com/configuration/)

配置文件需要我们创建一个`webpack.config.js`文件

基础配置项

```js
const { resolve } = require('path');

module.exports = {
  /**
   * production 会对打包的文件压缩
   * development 不会对打包的文件进行压缩
   */
  mode: 'production', // 指定打包的模式 production | development
  // 指定打包的文件
  entry: './index.js',
  // 指定打包文件输出的文件和路径
  output: {
    // 指定打包之后的JS文件的名称
    filename: 'bundle.js',
    // 指定打包之后的文件存储位置,默认指定的文件夹的名称
    path: resolve(__dirname, 'dist'),
  },
};
```

- 注意点：

我们在打包的时候，如果找不到配置文件，需要我们给 webpack 指定当前要打包的配置文件的地址。

```shell
npx webpack --config webpack.config.js
```

利用`package.json`优化指令

```
{
  "scripts": {
    "test": "npx webpack --config webpack.congfig.js"
  }
}
```

这样我们使用`npm run test`即可直接执行我们的指令。

## sourcemap

1. 优化代码报错提示。
2. 打包之后的代码，会比原来的代码位置不一致。修复代码的 bug 可能会更麻烦一些。
3. 降低调试难度，提高错误代码的可阅读性。

### eval

不会生成单独的 sourcemap，会将映射关系放到打包后的文件中去。

- 优点：性能最好
- 缺点：业务逻辑比较复杂时候提示信息可能不全面

### source-map

会生成一个 source-map 文件，会将映射关系存储到单独的文件中去

- 优点：提示信息全面，可以直接定位到错误代码的位置
- 缺点：打包速度慢

### inline

不会生成 sourcemap 文件，会将映射关系以 base64 的形式存储到打包后的文件中去。

### cheap

生成的映射信息只能定位到错误行，不能定位到错误列

### module

不仅需要存储我们的代码关系，还需要存储第三方的模块的映射关系，方便我们去排查错误日志。

### 如何选用适合我们的开发模式呢

1. cheap-module-eval-source-map
   在开发阶段，我们可以选用这种取值方式，需要行信息，包含第三方模块信息，不生成 source-map 文件
2. cheap-module-source-map
   在生产阶段，我们需要行信息，包含第三方模块信息，会生成 source-map 文件，为了不影响打包上线的体积，我们需要单独生成一个 map 文件。
