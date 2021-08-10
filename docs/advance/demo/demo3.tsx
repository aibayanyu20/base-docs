import React, { useState } from 'react';

export default () => {
  const [state, setState] = useState('');
  const [state1, setState1] = useState('');
  function foo(a: any) {
    // @ts-ignore
    return this.a;
  }
  const obj1 = {
    a: 1,
    foo: foo,
  };

  const obj2 = {
    a: 2,
    foo: foo,
  };
  function clickInfo() {
    // @ts-ignore
    setState(obj1.foo.call(obj1));
    // @ts-ignore
    setState1(obj1.foo.call(obj2));
  }

  return (
    <div>
      <button onClick={() => clickInfo()}>点击执行</button>
      <p>{state}-obj1</p>
      <p>{state1}-obj2</p>
    </div>
  );
};
