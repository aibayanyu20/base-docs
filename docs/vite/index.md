---
nav:
  title: vite学习
  path: /vite
---

## 什么是 vite?

是一个构建工具的高阶封装，是随着 vue3 正式版发布的第一个版本。在第一个版本主要是为 vue 服务的，第二个版本可以服务于很多框架。

## vite 的目标

1. 使用简单；
2. 继承了`dev-server`不需要我们再去配置；
3. 启动速度快；
4. 便于扩展基于`rollup`在`vite`上都可以使用`rollup`的插件；
5. 在`vite`中不需要配置 loader，基本上都已经内置了；
6. 内置了一个`build`命令。

## 和传统构建工具的区别

1. High Level API
2. 不包含自己的编译能力，集成了`rollup`的功能，底层来自于`ES6`和`rollup`

### webpack VS rollup

1. webpack 更全面
2. rollup 更专一

## 优势

- 上手简单
- 开发效率高
- 社区低成本（兼容`rollup`插件）
- 有自己的插件系统
- 使用了`esbuild`,编译的性能会更好

## 项目构建 vue3

1. 初始化命令

```shell
npm init @vitejs/app
yarn create @vitejs/app
```

2. 选择`vue`
3. 后面选择语言的版本`vue`或`vue-ts`
4. 最后创建成功，安装依赖即可启动。

## 构建 vue2 的项目

### vitejs 初始化工具

1. 调用初始化命令

```shell
npm init @vitejs/app
yarn create @vitejs/app
```

2. 因为官方并没有提供`vue2`的包的方式，所以需要我们自行配置插件[vue 配置文档](https://vitejs.dev/guide/features.html#vue)，所以我们需要选择`vanilla`空白项目。
3. 后面我们也是选择非`ts`版本的即可。
4. 项目创建完成后，我们先安装依赖，追加的依赖如下：

```shell
yarn add -D vite-plugin-vue2 vue-template-compiler
```

5. 手动创建一个`vite.config.js`文件，将我们的 vue2 的插件引入

```js
import { createVuePlugin } from 'vite-plugin-vue2';
export default {
  plugins: [createVuePlugin()],
};
```

6. 创建文件夹和文件
   - 创建`src`文件夹，以及`src/main.js`和`App.vue`。
     `main.js`

```js
import Vue from 'vue';
import App from './App.vue';
new Vue({
  el: '#app',
  render: (h) => h(App),
}).$mount();
```

`App.vue`

```vue
<template>
  <div>测试</div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped></style>
```

- 修改`index.html`的`main.js`的引入改为`src/main.js`即可。
- 启动项目查看即可

### 使用第三方的`template`

所有的第三方的 vite 的模板项目都在[awesome-vite](https://github.com/vitejs/awesome-vite)里面，大家可以自行查阅

## 构建`react`项目

1. 调用初始化命令

```shell
npm init @vitejs/app
yarn create @vitejs/app
```

2. 选择`react`
3. 选择创建的是`js`还是`ts`版本
4. 项目创建成功使用`yarn`安装一下即可

## 各种 css 的使用

### 原生的`css variable`

使用的`css3`的语法，可以兼容比较老的语法。

```css
:root {
  --main-bg-color: #fff;
}
```

### vite 已经继承了`postcss`我们可以直接使用即可

### @import alisa

```js
export default {
  resovle: {
    alisa: {
      '@styles': '/src/styles',
    },
  },
};
```

### css-modules

`test.module.css`

### css 预编译器

安装我们需要用到的工具,只需要安装，不需要做其他的操作

```shell

yarn add -D less

yarn add -D scss

```

### vite 中继承`ts`

在 vite 中只支持`ts`但是不对文件进行校验，需要我们配置。

### 静态资源处理

1. url

```ts
import test from 'src/test?url';
// 返回的是：src/test.ts
```

2. raw

```ts
import test from 'src/test?raw';
// 返回的是字符串代码
```

4. web worker

### 集成 eslint 和 pritter

- git 提交代码检查

```
yarn add husky -D
npx husky install
npm husky add .husky/pre-commit "npm run lint"
```

### 环境变量

- MODE
- BASE_URL
- PROD
- DEV

## 插件实现
