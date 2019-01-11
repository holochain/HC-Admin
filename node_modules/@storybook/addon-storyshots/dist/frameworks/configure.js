"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfigPathParts(configPath) {
  const resolvedConfigPath = _path.default.resolve(configPath);

  if (_fs.default.lstatSync(resolvedConfigPath).isDirectory()) {
    return _path.default.join(resolvedConfigPath, 'config');
  }

  return resolvedConfigPath;
}

function configure(options) {
  const {
    configPath = '.storybook',
    config,
    storybook
  } = options;

  if (config && typeof config === 'function') {
    config(storybook);
    return;
  }

  const resolvedConfigPath = getConfigPathParts(configPath);

  require.requireActual(resolvedConfigPath);
}

var _default = configure;
exports.default = _default;