const whenExample = require('./when-output');

test('First guard', () => {
  expect(whenExample(1, 2, 3)).toBe("You did");
});

test('Second guard', () => {
  expect(whenExample("cool")).toBe("Cool");
});
