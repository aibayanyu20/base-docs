import React from 'react';

export default () => {
  const obj = {
    name: 'sssda',
  };

  // 定义一个Proxy拦截器
  const handle = {
    get: function (target: any, prop: string): any {
      console.log(target, prop);
      if (typeof target[prop] === 'object' && target[prop] !== null) {
        return new Proxy(target[prop], handle);
      }
      // 返回值利用反射
      return Reflect.get(obj, prop);
    },
    set: function (target: any, key: any, value: any): any {
      console.log(target, key, value);
      // 设置值的方法
      return Reflect.set(target, key, value);
    },
  };

  const proxy = new Proxy(obj, handle);

  const myClick = () => {
    console.log('dasdsa');
    proxy.name = 'sadsadsa';
  };

  return (
    <div>
      <button onClick={myClick}>按钮</button>
    </div>
  );
};
