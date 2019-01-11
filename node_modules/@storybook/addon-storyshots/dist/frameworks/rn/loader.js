"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _hasDependency = _interopRequireDefault(require("../hasDependency"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable global-require */
function test(options) {
  return options.framework === 'react-native' || !options.framework && (0, _hasDependency.default)('@storybook/react-native');
}

function configure(options, storybook) {
  const {
    configPath = 'storybook',
    config
  } = options;

  if (config && typeof config === 'function') {
    config(storybook);
    return;
  }

  const resolvedConfigPath = _path.default.resolve(configPath);

  require.requireActual(resolvedConfigPath);
}

function load(options) {
  const storybook = require.requireActual('@storybook/react-native');

  configure(options, storybook);
  return {
    renderTree: require('../react/renderTree').default,
    renderShallowTree: require('../react/renderShallowTree').default,
    framework: 'rn',
    storybook
  };
}

var _default = {
  load,
  test
};
exports.default = _default;