const base__1 = (a) => "1";

const base__2 = (a, b) => "2";

const base__3 = (a, b, c) => "3";

const base__1__sure = (special = "sure") => "yeah";

const base = function base() {
  if (arguments.length === 1 && arguments[0] === "sure") {
    return base__1__sure.apply(undefined, arguments);
  }

  if (arguments.length === 1) {
    return base__1.apply(undefined, arguments);
  }

  if (arguments.length === 2) {
    return base__2.apply(undefined, arguments);
  }

  if (arguments.length === 3) {
    return base__3.apply(undefined, arguments);
  }
};

module.exports = base;
