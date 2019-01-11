'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = function (config, testPageUrl) {
    return (0, _mustache.render)(HOOK_TEMPLATE, {
        INJECTABLE_PATH: INJECTABLE_PATH,
        CONFIG: (0, _stringify2.default)(config),
        TEST_PAGE_URL: (0, _stringify2.default)(testPageUrl)
    });
};

var _fs = require('fs');

var _path = require('path');

var _mustache = require('mustache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HOOK_TEMPLATE = (0, _fs.readFileSync)((0, _path.join)(__dirname, '../templates/hook.js.mustache')).toString();

var INJECTABLE_PATH = (0, _stringify2.default)(require.resolve('./injectable'));

module.exports = exports['default'];