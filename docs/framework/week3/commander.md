# commander 使用

## 安装

```shell

npm i commander

```

## 使用

我们在处理参数的时候，`<command>`中的`<>`为必填参数,`[option]`中的`[]`为非必填参数

```js
const { program } = require('commander');

program
  // 自定义名称
  .name('test')
  // 自定义提示命令
  .usage('<command> [options]')
  // 自定义版本号
  .version('1.0.0')
  // 设置参数
  .option('-d,--debug', '是否开启debug模式', false)
  // 传参，这个命令必须放到最后
  .parse(process.argv);
// 直接打印
console.log(program.debug);
// 拿到接收到的全部参数
console.log(program.opts());
// 输出帮助信息
console.log(program.outputHelp());
```

## 自定义命令

### `command`注册命令

使用这个领命会有一个返回值，返回的是另一个`Command`类,返回的不是之前的对象

```js
// 自定义
const clone = program.command('clone <source> [destination]');
// 操作
clone
  .description('描述信息')
  // 自定义当前命令的参数
  .option('-f,--force', '是否强制克隆')
  .action((source, destination, cmdObj) => {
    console.log('do clone', source, destination, cmdObj);
  });
```

### `addCommand`注册命令

可以帮助我们去注册一个子命令

```js
const service = new Command('service');

// 添加一个子命令start
service
  .command('start [port]')
  .description('用来启动服务的')
  .action((port) => {
    console.log('do service port', port);
  });

// 添加一个子命令stop
service
  .command('stop')
  .description('用来停止服务的')
  .action(() => {
    console.log('do service stop');
  });

program.addCommand(service);
```

### 命令自动匹配

```js
program
  .arguments('<cmd> [options]')
  .description('监听上面没有拿到的命令', {
    cmd: '展示出来，并自定义描述',
    options: '展示出来，输入指定的参数信息',
  })
  .action((cmd, options) => {
    console.log(cmd, options);
  });
```

### 组成新命令

使用`install [name]`直接执行当前的命令如：

```shell
test install
# 转换成如下的命令
test-install 参数

```

```js
program
  .command('install [name]', 'install package', {
    executableFile: 'vue',
    isDefault: true,
    hidden: true,
  })
  .alias('i');
```

如果增加了`options`

- executableFile：通过当前的命令执行其他的脚手架命令比如设置了`vue`则会调用`vue`中的命令
- isDefault：是否设置默认的命令
- hidden：帮助我们在 help 中隐藏

## 自定义 help 信息

```js
// 第一种方式
program.helpInformation = function () {
  // 返回自己的信息
  return 'your help information';
};

// 继承,第二种方式
program.on('--help', function () {
  console.log('your help information');
});
```

## 实现 debug 模式

```js
program.on('option:debug', function () {
  console.log('监听到debug信息');
  console.log(program.debug);
  if (program.debug) {
    // 开启debug模式
  }
});
```

## 对未知命令监听

```js
// 所有进入当前command的证明没有进入其他的我们的定制命令中
program.on('command:*', function (obj) {
  console.log(obj);
  const availableCommands = program.commands.map((cmd) => cmd.name());
  console.log('可用命令为：', availableCommands.join(','));
});
```
