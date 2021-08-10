import React, { useState } from 'react';

export default () => {
  const [state, setState] = useState('');

  function foo(a: any) {
    // @ts-ignore
    this.a = a;
  }
  const obj1 = {};
  var bar = foo.bind(obj1);
  function click() {
    bar(2);
    // @ts-ignore
    setState(obj1.a);
  }

  function clickTwo() {
    // @ts-ignore
    var baz = new bar(3);
    setState(baz.a);
  }

  return (
    <div>
      <button onClick={() => click()}>点击1</button>
      <button onClick={() => clickTwo()}>点击2</button>
      <p>{state}</p>
    </div>
  );
};
