const sumList__2_AI__arrayExpression = (list = [], acc) => acc;

const sumList__2_AI = ([head, ...tail], acc) => sumList(tail, head + acc);

const sumList = function sumList() {
  if (
    arguments.length === 2 &&
    JSON.stringify(arguments[0]) === JSON.stringify([])
  ) {
    return sumList__2_AI__arrayExpression.apply(undefined, arguments);
  }

  if (arguments.length === 2) {
    return sumList__2_AI.apply(undefined, arguments);
  }
};

module.exports = sumList;
