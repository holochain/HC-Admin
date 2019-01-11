"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _configure = _interopRequireDefault(require("../configure"));

var _hasDependency = _interopRequireDefault(require("../hasDependency"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function test(options) {
  return options.framework === 'react' || !options.framework && (0, _hasDependency.default)('@storybook/react');
}

function load(options) {
  const {
    configPath,
    config
  } = options;

  const storybook = require.requireActual('@storybook/react');

  (0, _configure.default)({
    configPath,
    config,
    storybook
  });
  return {
    framework: 'react',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: require.requireActual('./renderShallowTree').default,
    storybook
  };
}

var _default = {
  load,
  test
};
exports.default = _default;