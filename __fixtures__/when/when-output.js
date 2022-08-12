const doMath = (a, b, c) => a + b + c > 3;

const beCool = (a) => a === "cool";

const whenExample__with__guard__0 = () => "You did";

const whenExample__with__guard__1 = () => "Cool";

const whenExample__guard__0 = doMath;
const whenExample__guard__1 = beCool;

const whenExample = function whenExample() {
  if (whenExample__guard__0.apply(undefined, arguments)) {
    return whenExample__with__guard__0.apply(undefined, arguments);
  }

  if (whenExample__guard__1.apply(undefined, arguments)) {
    return whenExample__with__guard__1.apply(undefined, arguments);
  }
};

module.exports = whenExample;
