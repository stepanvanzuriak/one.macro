import { overload } from '../one.macro';

const base = overload(
  (a) => '1',
  (a, b) => '2',
  (a, b, c) => '3',
  (special = "sure") => "yeah",
);

module.exports = base;
