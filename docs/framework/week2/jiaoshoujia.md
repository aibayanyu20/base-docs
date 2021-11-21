---
title: 脚手架架构设计
  group:
    path: /framework/week2/jiaoshoujia
    title: 脚手架架构设计
---

# 脚手架开发入门

## 脚手架实现原理

### 分析`@vue/cli`的实现

- 为什么全局安装`@vue/cli`后会添加命令为`vue`？
  在`package.json`的文件下，配置了`bin`
- 全局安装`@vue/cli`时发生了什么
  依赖会下载到指定的
- 执行`vue`命令式发生了什么？

我们在目录下直接执行`vue`命令和我们使用`which vue`其实是一样的，目的就是查询当前的命令是否存在，如果存在就调用命令。

- 为什么`vue`指向一个`js`文件，我们可以直接通过`vue`命令去执行它?

我们可以发现我们在使用`vue`命令的时候，最终指向的是一个`vue.js`文件，我们并没有使用`node vue.js`的命令去执行，那么我们为什么可以执行这个命令呢？

当我们去看`vue.js`的源码的时候，发现在第一行的代码中使用了`#!/usr/bin/env node`，这行代码的意思就是在环境变量中查找`node`，我们在配置`node`的时候，一般会把`node`配置到环境变量中，所以这样就可以找到`node`了，如果我们没有配置，我们可以使用`#!node环境的绝对路径地址`但是这种方式可能只适合自己的电脑，别人的`node`环境不一定在这个目录下，所以我们还是建议使用`#!/usr/bin/env node`这样的方式去定义。

### 执行原理

1. 在终端输入了`vue create vue-test-app`
2. 终端解析出`vue`命令
3. 终端在环境变量中找打`vue`命令
4. 终端会根据`vue`命令链接到实际的文件`vue.js`
5. 终端利用`node`执行`vue.js`
6. `vue.js`解析`command/options`
7. `vue.js`执行`command`
8. 执行完毕，退出执行

### 从应用的角度看如何开发一个脚手架

> 这里以`vue/cli`为例子

- 开发`npm`项目，该项目中应包含一个`bin/vue.js`文件，并将这个项目发布到`npm`
- 将`npm`项目安装到`node`的`lib/node_modules`
- 在`node`的`bin`目录下配置`vue`软连接指向`lib/node_modules/@vue/cli/bin/vue.js`

这样我们在执行`vue`命令的时候就可以找到`vue.js`进行执行

### 脚手架原理进阶

- 为什么脚手架本质上是操作系统的客户端？它和我们在 PC 上安装的软件有什么区别？

> 脚手架是操作系统的客户端的本质其实`node`为客户端，在 Win 电脑下，我们可以看到`node.exe`，其实我们所执行的`js`文件都是`node`中的一个参数而已，我们还可以通过`node -e 'console.log("test client")'`来执行命令。

> 它和我们安装在 PC 上的软件的区别在于，软件存在 GUI 界面，我们的`node`为代表的环境并没有`GUI`界面，是通过`unix`去执行的。

- 如何为`node`脚手架命令创建别名

> 我们需要通过软连接的方式进行创建，如下：

```shell
which vue # 找到环境目录
cd 环境目录

ln -s ./vue vue2 # 创建新的软连接

vue2 # 执行测试

```

- 脚手架命令执行的全过程

## 脚手架核心价值

- 提升前端研发效能
- 自动化：项目重复代码拷贝/git 操作/发布上线操作
- 标准化：项目创建/git flow/发布流程/回滚流程
- 数据化：研发过程系统化、数据化、使得研发过程可量化

**和自动化构建工具的区别：**

jenkins、travis 等自动化构建工具已经比较成熟了，为什么还需要自研脚手架

- 不满足需求：jenkins、travis 通常在 git hooks 中触发，需要服务端执行，无法覆盖研发人员本地的功能，如：创建项目自动化、本地 git 操作自动化等
- 定制复杂：jenkins、travis 定制像一些命令的监控比较复杂

## 从使用脚手架的角度理解什么是脚手架？

### 脚手架简介

脚手架本质是一个操作系统的客户端，它通过命令行执行，比如：

```shell
vue create vue-test-app
```

上面的命令由 3 个部分组成：

- 主命令：`vue`
- command:`create`
- command 的 param:`vue-test-app`

当我们需要覆盖项目的时候可以加入`--force`，这个命令叫做 option，我们在安装依赖的时候，我们使用淘宝镜像去下载的时候，我们需要加入`-r https://taobao镜像` `-r`是`--register`的简写

## 脚手架开发流程

### 开发流程

- 创建`npm`项目
- 创建脚手架入口文件，在最上方添加：
  `#!/usr/bin/env node`
- 配置`package.json`，添加`bin`属性
- 编写脚手架代码
- 将脚手架发布到`npm`

### 使用流程

- 安装脚手架
  `npm i -g your-cli`
- 使用脚手架
  `your-cli`

### 难点分析

- 分包：将复杂的系统拆分成若干个模块
- 命令注册

```shell
vue create
vue add
vue invoke
```

- 参数解析

```shell
vue command [options] <params>
```

- options 全称 `--version`、`--help`
- options 简称 `-V、`-h`
- 带 params 的 options `--path /use/地址`
- 帮助文档
  - global help
    - usage
    - options
    - commands
- 命令行交互
- 日志打印
- 命令行文字变色
- 网络通信 HTTP/WEBSOCKET
- 文件处理
- ...

### 脚手架本地`link`标准流程

- 链接本地脚手架

```shell
cd your-cli-dir
npm link
```

- 链接本地库文件

```shell
cd your-lib-dir
npm link
cd your-cli-dir
npm link your-lib
```

- 取消链接本地库文件

```shell
cd your-lib-dir
npm unlink
cd your-cli-dir
# link存在
npm unlink your-dir
# link不存在
rm -rf node_modules
npm i
```

**`npm link`理解：**

`npm link your-lib`：将当前项目中`node_modules`下指定的库文件链接到`node`全局`node_modules`下的库文件

`npm link`：将当前项目链接到`node`全局`node_modules`中作为一个库文件，并解析`bin`配置创建可执行文件。

**`npm unlink`理解：**

`npm unlink`：将全局`node_modules`中的一个文件移除，并删除配置的可执行文件。
