"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _global = _interopRequireDefault(require("global"));

var _hasDependency = _interopRequireDefault(require("../hasDependency"));

var _configure = _interopRequireDefault(require("../configure"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mockVueToIncludeCompiler() {
  jest.mock('vue', () => require.requireActual('vue/dist/vue.common.js'));
}

function test(options) {
  return options.framework === 'vue' || !options.framework && (0, _hasDependency.default)('@storybook/vue');
}

function load(options) {
  _global.default.STORYBOOK_ENV = 'vue';
  mockVueToIncludeCompiler();
  const {
    configPath,
    config
  } = options;

  const storybook = require.requireActual('@storybook/vue');

  (0, _configure.default)({
    configPath,
    config,
    storybook
  });
  return {
    framework: 'vue',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for vue');
    },
    storybook
  };
}

var _default = {
  load,
  test
};
exports.default = _default;