const sumList = require('./reduce-output');

test('Correct array sum', () => {
  expect(sumList([1, 2, 3], 0)).toBe(6);
});

test('Empty array', () => {
  expect(sumList([], 100)).toBe(100);
});