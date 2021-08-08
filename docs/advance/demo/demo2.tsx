import React, { useState } from 'react';

export default () => {
  const [a, setA] = useState('点击查看值变化');
  const o1 = {
    text: 'o1',
    fn: function () {
      return this.text;
    },
  };

  const o2 = {
    text: 'o2',
    fn: o1.fn,
  };
  return (
    <div>
      <button onClick={() => setA(o2.fn())}>测试</button>
      <p>{a}</p>
    </div>
  );
};
