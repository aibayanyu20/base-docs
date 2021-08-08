import React from 'react';

export default () => {
  const o1 = {
    text: 'o1',
    fn: function () {
      return this.text;
    },
  };

  const o2 = {
    text: 'o2',
    fn: function () {
      return o1.fn();
    },
  };

  const o3 = {
    text: 'o3',
    fn: function () {
      const fn = o1.fn;
      return fn();
    },
  };
  function myClick() {
    console.log(o1.fn()); // o1
    console.log(o2.fn()); // o1
    try {
      console.log(o3.fn()); // undefined
    } catch (e) {
      // o3报错
      console.log(e.message);
    }
  }
  return <button onClick={() => myClick()}>点击</button>;
};
