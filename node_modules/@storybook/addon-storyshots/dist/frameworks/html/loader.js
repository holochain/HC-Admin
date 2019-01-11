"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _global = _interopRequireDefault(require("global"));

var _configure = _interopRequireDefault(require("../configure"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function test(options) {
  return options.framework === 'html';
}

function load(options) {
  _global.default.STORYBOOK_ENV = 'html';
  const {
    configPath,
    config
  } = options;

  const storybook = require.requireActual('@storybook/html');

  (0, _configure.default)({
    configPath,
    config,
    storybook
  });
  return {
    framework: 'html',
    renderTree: require.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for HTML');
    },
    storybook
  };
}

var _default = {
  load,
  test
};
exports.default = _default;