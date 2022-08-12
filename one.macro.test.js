const path = require('path');
const pluginTester = require('babel-plugin-tester').default;
const plugin = require('babel-plugin-macros');

pluginTester({
  plugin,
  snapshot: false,
  babelOptions: {filename: __filename},
  tests: [
    {
      fixture:  path.join(__dirname, '__fixtures__/base.js'),
      outputFixture: path.join(__dirname, '__fixtures__/base-output.js'),
    },
  ],
})