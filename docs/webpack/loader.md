# Loader

## 定义

我们在打包一个项目的时候，除了`js`文件以外还会有一些其他的文件，例如`css`和`png`等，所以为了让我们的`webpack`能够对其他类型的文件类型进行打包，在打包之前，需要将其他类型的文件
转换为`webpack`能够识别处理的模块，所以用于将其他类型文件转换为`webpack`能够识别处理模块的工具我们称之为 loader。

## 使用

`webpack`中的 loader 都是用`NodeJs`写的，但是在企业开发中我们完全没有必要自己编写，因为目前的库已经比较完善了，常用的 loader 都已经实现了。

## file-loader

### 安装

```shell
# 添加loader
yarn add file-loader -D
```

### 使用

```js
const jpg = require('./1.jpg');
// 真实拿到的是图片的路径。
function AddContent() {
  const oImg = document.createElement('img');
  oImg.src = jpg.default;
  const oDiv = document.createElement('div');
  oDiv.innerText = '我是内容';
  document.body.appendChild(oDiv);
  document.body.appendChild(oImg);
}

module.exports = AddContent;
```

### 配置项

[file-loader 配置项地址](https://www.webpackjs.com/loaders/file-loader/#%E9%80%89%E9%A1%B9)

```js
let options = {
  name: '[name].[ext]', // 指定打包文件的名称
  outputPath: 'images', // 图片输出的路径地址
  publicPath: 'https://www.28yanyu.cn/images', // 公共的请求地址，可以是本地，也可以是线上
};
```
