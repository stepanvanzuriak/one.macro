import { guard } from '../../../one.macro';

function base(first, second) {
  guard(first, "Error");
  guard(first > 100);
  guard(second !== "No way");

  return "All fine";
} 

module.exports = base;
