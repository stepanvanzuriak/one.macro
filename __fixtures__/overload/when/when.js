import { overload, when } from '../../../one.macro';

const doMath = (a, b, c) => a + b + c > 3 
const beCool = (a) => a === "cool"

const whenExample = overload(
  when(
    doMath,
    () => "You did"
  ),
  when(
    beCool,
    () => "Cool"
  )
);

module.exports = whenExample;
