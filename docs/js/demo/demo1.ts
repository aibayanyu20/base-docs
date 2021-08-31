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
