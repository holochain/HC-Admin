'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (testPath) {
    return (0, _fs.statSync)(testPath).isDirectory();
};

var _fs = require('fs');

module.exports = exports['default'];