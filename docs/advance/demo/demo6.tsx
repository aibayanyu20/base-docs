import React, { useState } from 'react';
export default () => {
  const [state, setState] = useState(2);
  // 实现红黄绿灯的第一种方式，使用回调函数的方式
  function callbackInfo(timer: number, state: number, callback?: Function) {
    // 红灯为一秒
    setTimeout(() => {
      if (state === 1) {
        yellow();
      } else if (state === 2) {
        green();
      } else {
        red();
      }
      callback && callback();
    }, timer);
  }
  // 0为红灯
  function red() {
    setState(0);
  }
  // 1为黄灯
  function yellow() {
    setState(1);
  }
  // 2为绿灯
  function green() {
    setState(2);
  }
  // 第一种回调方式实现
  const task = () => {
    // 三秒变红灯
    callbackInfo(3000, 0, () => {
      callbackInfo(1000, 1, () => {
        callbackInfo(2000, 2, () => {
          callbackInfo(1000, 1, task);
        });
      });
    });
  };

  // 使用Promise实现
  function promiseInfo(timer: number, state: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (state === 1) {
          yellow();
        } else if (state === 2) {
          green();
        } else {
          red();
        }
        resolve();
      }, timer);
    });
  }
  // 调用
  const task1 = async () => {
    await promiseInfo(3000, 2);
    await promiseInfo(1000, 1);
    await promiseInfo(2000, 3);
    task1();
  };

  return (
    <div>
      当前灯的颜色{state === 0 ? '红灯' : state === 2 ? '绿灯' : '黄灯'}
      <button onClick={task}>回调方式实现</button>
      <button onClick={task1}>Promise实现</button>
    </div>
  );
};
