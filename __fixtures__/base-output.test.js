const base = require('./base-output');

test('When one argument passed', () => {
  expect(base("Any")).toBe("1");
});

test('When two argument passed', () => {
  expect(base("Any", "Any")).toBe("2");
});

test('When two argument passed', () => {
  expect(base("sure")).toBe("yeah");
});