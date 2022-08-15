const path = require('path');
const pluginTester = require('babel-plugin-tester').default;
const plugin = require('babel-plugin-macros');

pluginTester({
  plugin,
  snapshot: false,
  babelOptions: {filename: __filename},
  tests: [
    {
      fixture:  path.join(__dirname, '__fixtures__/overload/base/base.js'),
      outputFixture: path.join(__dirname, '__fixtures__/overload/base/base-output.js'),
    },
    {
      fixture:  path.join(__dirname, '__fixtures__/overload/when/when.js'),
      outputFixture: path.join(__dirname, '__fixtures__/overload/when/when-output.js'),
    },
    {
      fixture:  path.join(__dirname, '__fixtures__/overload/reduce/reduce.js'),
      outputFixture: path.join(__dirname, '__fixtures__/overload/reduce/reduce-output.js'),
    },
    {
      fixture:  path.join(__dirname, '__fixtures__/guard/base/base.js'),
      outputFixture: path.join(__dirname, '__fixtures__/guard/base/base-output.js'),
    },
  ],
})