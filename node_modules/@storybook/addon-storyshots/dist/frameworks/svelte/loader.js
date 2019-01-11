"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _global = _interopRequireDefault(require("global"));

var _hasDependency = _interopRequireDefault(require("../hasDependency"));

var _configure = _interopRequireDefault(require("../configure"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function test(options) {
  return options.framework === 'svelte' || !options.framework && (0, _hasDependency.default)('@storybook/svelte');
}

function load(options) {
  _global.default.STORYBOOK_ENV = 'svelte';
  const {
    configPath,
    config
  } = options;

  const storybook = require.requireActual('@storybook/svelte');

  (0, _configure.default)({
    configPath,
    config,
    storybook
  });
  return {
    framework: 'svelte',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for svelte');
    },
    storybook
  };
}

var _default = {
  load,
  test
};
exports.default = _default;