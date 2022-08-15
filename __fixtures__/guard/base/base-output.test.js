const base = require('./base-output');

test('First guard', () => {
  expect(base(1)).toBe(undefined);
  expect(base(1000)).toBe("All fine");
});

test('Second guard', () => {
  expect(base(1000, "No way")).toBe(undefined);
  expect(base(1000, "any")).toBe("All fine");
});

test('Third guard', () => {
  expect(base()).toBe("Error");
  expect(base(1000, "any")).toBe("All fine");
});

