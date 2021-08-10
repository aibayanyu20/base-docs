import React, { useState } from 'react';

export default () => {
  const [state, setState] = useState('');
  const [state1, setState1] = useState('');

  function foo() {
    // @ts-ignore
    return (a) => {
      // @ts-ignore
      return this.a;
    };
  }
  const obj1 = {
    a: 2,
  };

  const obj2 = {
    a: 3,
  };
  const bar = foo.call(obj1);

  function run() {
    // @ts-ignore
    setState('输出值' + bar.call(obj2));
  }

  var c = 123;
  // @ts-ignore
  const foo1 = () => (c) => {
    try {
      // @ts-ignore
      return this.c;
    } catch (e) {
      return e.message;
    }
  };
  var bar1 = foo1.call(obj1);
  function run1() {
    // @ts-ignore
    setState1(bar1.call(obj2));
  }

  return (
    <div>
      <button onClick={() => run()}>操作一</button>
      <p>{state}</p>
      <button onClick={run1}>操作二</button>
      <p>{state1}</p>
    </div>
  );
};
