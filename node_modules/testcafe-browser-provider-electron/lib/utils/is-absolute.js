'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (testPath) {
    return _osFamily2.default.win && WINDOWS_ABSOLUTE_REGEXP.test(testPath) || UNIX_ABSOLUTE_REGEXP.test(testPath);
};

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WINDOWS_ABSOLUTE_REGEXP = /^[A-Za-z]:/;
var UNIX_ABSOLUTE_REGEXP = /^\//;

module.exports = exports['default'];