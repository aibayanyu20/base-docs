# 进阶之 Proxy

> Proxy 的定义比较笼统：对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。这是在 MDN 上的描述，接下来我们就学习一下什么是 Proxy

<code src="../ts/demo/demo.tsx"></code>

# 在 vue3 中通过 Proxy 是如何实现`ref`和`reactive`的呢？

> 接下来我们就实现一下在`vue3`中常用的几个方法`ref`和`reactive`

<code src="./demo/demo1.tsx"></code>

这是我们实现的一个最基本的`ref`的 demo：

```ts
interface targetValue<T> {
  value: T;
}

export const ref = <T>(initValue: T): targetValue<T> => {
  const handle = {
    get(target: any, props: string) {
      return Reflect.get(target, props);
    },
    set(target: any, props: string, value: T) {
      return Reflect.set(target, props, value);
    },
  };
  const target: targetValue<T> = {
    value: initValue,
  };
  return new Proxy<targetValue<T>>(target, handle);
};
```
