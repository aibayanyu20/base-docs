import React from 'react';
import { ref } from './demo1';
export default () => {
  const info = ref<string>('sss');
  return <div>{info.value}</div>;
};
