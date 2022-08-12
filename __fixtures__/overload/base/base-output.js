const base__1_I = (a) => "1";

const base__2_II = (a, b) => "2";

const base__3_III = (a, b, c) => "3";

const base__1_A__sure = (special = "sure") => "yeah";

const base = function base() {
  if (arguments.length === 1 && arguments[0] === "sure") {
    return base__1_A__sure.apply(undefined, arguments);
  }

  if (arguments.length === 1) {
    return base__1_I.apply(undefined, arguments);
  }

  if (arguments.length === 2) {
    return base__2_II.apply(undefined, arguments);
  }

  if (arguments.length === 3) {
    return base__3_III.apply(undefined, arguments);
  }
};

module.exports = base;
