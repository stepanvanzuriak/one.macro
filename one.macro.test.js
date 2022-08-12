const path = require('path');
const pluginTester = require('babel-plugin-tester').default;
const plugin = require('babel-plugin-macros');

pluginTester({
  plugin,
  snapshot: false,
  babelOptions: {filename: __filename},
  tests: [
    {
      fixture:  path.join(__dirname, '__fixtures__/base/base.js'),
      outputFixture: path.join(__dirname, '__fixtures__/base/base-output.js'),
    },
    {
      fixture:  path.join(__dirname, '__fixtures__/when/when.js'),
      outputFixture: path.join(__dirname, '__fixtures__/when/when-output.js'),
    },
  ],
})