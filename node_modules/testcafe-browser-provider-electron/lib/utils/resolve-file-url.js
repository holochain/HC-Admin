'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (basePath, url) {
    var urlPath = decodeURIComponent(url.replace(_osFamily.win ? WIN_FILE_SCHEME : FILE_SCHEME, ''));

    if ((0, _isAbsolute2.default)(urlPath)) return wrapPathWithProtocol(_path2.default.join(urlPath));

    if (!(0, _fs.statSync)(basePath).isDirectory()) basePath = _path2.default.dirname(basePath);

    return wrapPathWithProtocol(_path2.default.join(basePath, urlPath));
};

var _osFamily = require('os-family');

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _isAbsolute = require('./is-absolute');

var _isAbsolute2 = _interopRequireDefault(_isAbsolute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WIN_FILE_SCHEME = /^file:\/\/\/?/;
var FILE_SCHEME = /^file:\/\//;

function wrapPathWithProtocol(filePath) {
    return encodeURI('file://' + (_osFamily.win ? '/' + filePath.replace(/\\/g, '/') : filePath));
}

module.exports = exports['default'];