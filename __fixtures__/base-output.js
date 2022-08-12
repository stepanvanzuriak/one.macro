const base__1 = (a) => console.log("1");

const base__2 = (a, b) => console.log("2");

const base = function base() {
  if (arguments.length === 1) {
    return base__1.apply(undefined, arguments);
  }

  if (arguments.length === 2) {
    return base__2.apply(undefined, arguments);
  }
};

module.exports = base;
