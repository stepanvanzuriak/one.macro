import { overload } from '../one.macro';

const base = overload(
  (a) => console.log('1'),
  (a, b) => console.log('2'),
);

module.exports = base;
