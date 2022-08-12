import { overload } from '../../../one.macro';

const sumList = overload(
  (list = [], acc) => acc,
  ([head, ...tail], acc) => sumList(tail, head + acc)
);

module.exports = sumList;