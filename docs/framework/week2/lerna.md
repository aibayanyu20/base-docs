---
title: lerna搭建项目
  group:
    path: /framework/week2/lerna
    title: lerna搭建项目
---

# lerna 搭建项目

## 原生脚手架开发痛点分析

- 痛点一：重复操作
  - 多 package 本地 link
  - 多 package 依赖安装
  - 多 package 单元测试
  - 多 package 代码提交
  - 多 package 代码发布
- 痛点二：版本一致性
  - 发布版本一致性
  - 发布后相互依赖版本升级

> package 越多，管理复杂度越高

## 介绍

[Lerna](https://lerna.js.org)是一个优化基于 git+npm 的多 package 项目的管理工具

### 优势

- 大幅减少重复操作
- 提升操作的标准化

> Lerna 是架构优化的产物，它揭示了一个架构的真理：项目复杂度提升后，就需要对项目进行架构优化。架构优化的主要目标往往都是以效能为核心。

### 案例

- babel
- vue-cli
- create-react-app

### 开发脚手架流程

1. 项目初始化

初始化 npm 项目 -> 安装 lerna -> lerna init 初始化项目

2. 创建 package

lerna create 创建 package -> lerna add 安装依赖 -> lerna link 链接依赖

3. 开发和测试

lerna exec 执行 shell 脚本 -> lerna run 执行 npm 命令 -> lerna clean 清空依赖 -> lerna bootstrap 重装依赖

4. 脚手架发布上线

lerna version bump version（提升版本号）->lerna changed 查看上版本以来的所有变更 -> lerna diff 查看 diff -> lerna publish 项目发布

### 搭建项目

1. 创建目录

```shell
mkdir lerna-packages

cd lerna-packages
```

2. 安装依赖

```shell
npm i -g lerna # 全局安装
# 或本地安装
npm i -D lerna
# or
yarn add -D lerna
# 初始化项目
lerna init
```

3. 创建 package

```shell
lerna create 项目名称
```

4. 安装依赖

```shell
lerna add packages中的项目的name名称 安装到指定的项目中的目录
# 例如
lerna add @ppx-ui/utils packages/core/
# 清空已经安装的依赖
lerna clean
# 安装依赖
lerna bootstrap
# 执行命令
lerna exec --scope @ppx-ui/core -- rm -rf node_modules/
# 如果默认不指定scope的话，会操作每个package
```

5. `lerna link`

这个命令是处理两个 package 相互依赖的情况下如何配置

比如我们的`core`和`utils`都互相使用了，就可以通过这种方式实现

6. `lerna run`

使用执行命令`lerna run --scope @ppx-ui/core test`

和`lerna exec`一样不指定的时候默认执行所有 package 的脚本命令

7. 发布上线

- 版本升级

```shell
# 所有的package升级
lerna version
```

- 项目发布上线

```shell
# 项目发布上线
lerna publish
```

1. 错误处理：发布的过程中如果是一个公有包在`publishConfig.access=public`。
2. 错误处理：如果出现认证错误的问题`[unauthorized] Login first` 查看一下地址`publishConfig.registry`是不是不正确。

## 源码分析
