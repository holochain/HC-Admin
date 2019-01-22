'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let getDefaultDirs = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (baseDir) {
        return yield (0, _globby2.default)(DEFAULT_TEST_LOOKUP_DIRS, {
            cwd: baseDir,
            nocase: true,
            onlyDirectories: true,
            onlyFiles: false
        });
    });

    return function getDefaultDirs(_x) {
        return _ref.apply(this, arguments);
    };
})();

let convertDirsToGlobs = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (fileList, baseDir) {
        fileList = yield _pinkie2.default.all(fileList.map((() => {
            var _ref3 = (0, _asyncToGenerator3.default)(function* (file) {
                if (!(0, _isGlob2.default)(file)) {
                    const absPath = _path2.default.resolve(baseDir, file);
                    let fileStat = null;

                    try {
                        fileStat = yield (0, _promisifiedFunctions.stat)(absPath);
                    } catch (err) {
                        return null;
                    }

                    if (fileStat.isDirectory()) return _path2.default.join(file, TEST_FILE_GLOB_PATTERN);
                }

                return file;
            });

            return function (_x4) {
                return _ref3.apply(this, arguments);
            };
        })()));

        return fileList.filter(function (file) {
            return !!file;
        });
    });

    return function convertDirsToGlobs(_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
})();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _globby = require('globby');

var _globby2 = _interopRequireDefault(_globby);

var _isGlob = require('is-glob');

var _isGlob2 = _interopRequireDefault(_isGlob);

var _compiler = require('../compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _lodash = require('lodash');

var _promisifiedFunctions = require('../utils/promisified-functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_TEST_LOOKUP_DIRS = ['test/', 'tests/'];
const TEST_FILE_GLOB_PATTERN = `./**/*@(${_compiler2.default.getSupportedTestFileExtensions().join('|')})`;

exports.default = (() => {
    var _ref4 = (0, _asyncToGenerator3.default)(function* (fileList, baseDir) {
        if ((0, _lodash.isEmpty)(fileList)) fileList = yield getDefaultDirs(baseDir);

        fileList = yield convertDirsToGlobs(fileList, baseDir);
        fileList = yield (0, _globby2.default)(fileList, { cwd: baseDir });

        return fileList.map(function (file) {
            return _path2.default.resolve(baseDir, file);
        });
    });

    function parseFileList(_x5, _x6) {
        return _ref4.apply(this, arguments);
    }

    return parseFileList;
})();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9wYXJzZS1maWxlLWxpc3QuanMiXSwibmFtZXMiOlsiYmFzZURpciIsIkRFRkFVTFRfVEVTVF9MT09LVVBfRElSUyIsImN3ZCIsIm5vY2FzZSIsIm9ubHlEaXJlY3RvcmllcyIsIm9ubHlGaWxlcyIsImdldERlZmF1bHREaXJzIiwiZmlsZUxpc3QiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwiZmlsZSIsImFic1BhdGgiLCJwYXRoIiwicmVzb2x2ZSIsImZpbGVTdGF0IiwiZXJyIiwiaXNEaXJlY3RvcnkiLCJqb2luIiwiVEVTVF9GSUxFX0dMT0JfUEFUVEVSTiIsImZpbHRlciIsImNvbnZlcnREaXJzVG9HbG9icyIsIkNvbXBpbGVyIiwiZ2V0U3VwcG9ydGVkVGVzdEZpbGVFeHRlbnNpb25zIiwicGFyc2VGaWxlTGlzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OytDQVdBLFdBQStCQSxPQUEvQixFQUF3QztBQUNwQyxlQUFPLE1BQU0sc0JBQU9DLHdCQUFQLEVBQWlDO0FBQzFDQyxpQkFBaUJGLE9BRHlCO0FBRTFDRyxvQkFBaUIsSUFGeUI7QUFHMUNDLDZCQUFpQixJQUh5QjtBQUkxQ0MsdUJBQWlCO0FBSnlCLFNBQWpDLENBQWI7QUFNSCxLOztvQkFQY0MsYzs7Ozs7O2dEQVNmLFdBQW1DQyxRQUFuQyxFQUE2Q1AsT0FBN0MsRUFBc0Q7QUFDbERPLG1CQUFXLE1BQU1DLGlCQUFRQyxHQUFSLENBQVlGLFNBQVNHLEdBQVQ7QUFBQSx3REFBYSxXQUFNQyxJQUFOLEVBQWM7QUFDcEQsb0JBQUksQ0FBQyxzQkFBT0EsSUFBUCxDQUFMLEVBQW1CO0FBQ2YsMEJBQU1DLFVBQVVDLGVBQUtDLE9BQUwsQ0FBYWQsT0FBYixFQUFzQlcsSUFBdEIsQ0FBaEI7QUFDQSx3QkFBSUksV0FBWSxJQUFoQjs7QUFFQSx3QkFBSTtBQUNBQSxtQ0FBVyxNQUFNLGdDQUFLSCxPQUFMLENBQWpCO0FBQ0gscUJBRkQsQ0FHQSxPQUFPSSxHQUFQLEVBQVk7QUFDUiwrQkFBTyxJQUFQO0FBQ0g7O0FBRUQsd0JBQUlELFNBQVNFLFdBQVQsRUFBSixFQUNJLE9BQU9KLGVBQUtLLElBQUwsQ0FBVVAsSUFBVixFQUFnQlEsc0JBQWhCLENBQVA7QUFDUDs7QUFFRCx1QkFBT1IsSUFBUDtBQUNILGFBakI0Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFaLENBQWpCOztBQW1CQSxlQUFPSixTQUFTYSxNQUFULENBQWdCO0FBQUEsbUJBQVEsQ0FBQyxDQUFDVCxJQUFWO0FBQUEsU0FBaEIsQ0FBUDtBQUNILEs7O29CQXJCY1Usa0I7Ozs7O0FBcEJmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUVBLE1BQU1wQiwyQkFBMkIsQ0FBQyxPQUFELEVBQVUsUUFBVixDQUFqQztBQUNBLE1BQU1rQix5QkFBNEIsV0FBVUcsbUJBQVNDLDhCQUFULEdBQTBDTCxJQUExQyxDQUErQyxHQUEvQyxDQUFvRCxHQUFoRzs7O2dEQWtDZSxXQUE4QlgsUUFBOUIsRUFBd0NQLE9BQXhDLEVBQWlEO0FBQzVELFlBQUkscUJBQVFPLFFBQVIsQ0FBSixFQUNJQSxXQUFXLE1BQU1ELGVBQWVOLE9BQWYsQ0FBakI7O0FBRUpPLG1CQUFXLE1BQU1jLG1CQUFtQmQsUUFBbkIsRUFBNkJQLE9BQTdCLENBQWpCO0FBQ0FPLG1CQUFXLE1BQU0sc0JBQU9BLFFBQVAsRUFBaUIsRUFBRUwsS0FBS0YsT0FBUCxFQUFqQixDQUFqQjs7QUFFQSxlQUFPTyxTQUFTRyxHQUFULENBQWE7QUFBQSxtQkFBUUcsZUFBS0MsT0FBTCxDQUFhZCxPQUFiLEVBQXNCVyxJQUF0QixDQUFSO0FBQUEsU0FBYixDQUFQO0FBQ0gsSzs7YUFSNkJhLGE7Ozs7V0FBQUEsYSIsImZpbGUiOiJ1dGlscy9wYXJzZS1maWxlLWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5pbXBvcnQgZ2xvYmJ5IGZyb20gJ2dsb2JieSc7XG5pbXBvcnQgaXNHbG9iIGZyb20gJ2lzLWdsb2InO1xuaW1wb3J0IENvbXBpbGVyIGZyb20gJy4uL2NvbXBpbGVyJztcbmltcG9ydCB7IGlzRW1wdHkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgc3RhdCB9IGZyb20gJy4uL3V0aWxzL3Byb21pc2lmaWVkLWZ1bmN0aW9ucyc7XG5cbmNvbnN0IERFRkFVTFRfVEVTVF9MT09LVVBfRElSUyA9IFsndGVzdC8nLCAndGVzdHMvJ107XG5jb25zdCBURVNUX0ZJTEVfR0xPQl9QQVRURVJOICAgPSBgLi8qKi8qQCgke0NvbXBpbGVyLmdldFN1cHBvcnRlZFRlc3RGaWxlRXh0ZW5zaW9ucygpLmpvaW4oJ3wnKX0pYDtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0RGVmYXVsdERpcnMgKGJhc2VEaXIpIHtcbiAgICByZXR1cm4gYXdhaXQgZ2xvYmJ5KERFRkFVTFRfVEVTVF9MT09LVVBfRElSUywge1xuICAgICAgICBjd2Q6ICAgICAgICAgICAgIGJhc2VEaXIsXG4gICAgICAgIG5vY2FzZTogICAgICAgICAgdHJ1ZSxcbiAgICAgICAgb25seURpcmVjdG9yaWVzOiB0cnVlLFxuICAgICAgICBvbmx5RmlsZXM6ICAgICAgIGZhbHNlXG4gICAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbnZlcnREaXJzVG9HbG9icyAoZmlsZUxpc3QsIGJhc2VEaXIpIHtcbiAgICBmaWxlTGlzdCA9IGF3YWl0IFByb21pc2UuYWxsKGZpbGVMaXN0Lm1hcChhc3luYyBmaWxlID0+IHtcbiAgICAgICAgaWYgKCFpc0dsb2IoZmlsZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGFic1BhdGggPSBwYXRoLnJlc29sdmUoYmFzZURpciwgZmlsZSk7XG4gICAgICAgICAgICBsZXQgZmlsZVN0YXQgID0gbnVsbDtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmaWxlU3RhdCA9IGF3YWl0IHN0YXQoYWJzUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmaWxlU3RhdC5pc0RpcmVjdG9yeSgpKVxuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoLmpvaW4oZmlsZSwgVEVTVF9GSUxFX0dMT0JfUEFUVEVSTik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZTtcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gZmlsZUxpc3QuZmlsdGVyKGZpbGUgPT4gISFmaWxlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcGFyc2VGaWxlTGlzdCAoZmlsZUxpc3QsIGJhc2VEaXIpIHtcbiAgICBpZiAoaXNFbXB0eShmaWxlTGlzdCkpXG4gICAgICAgIGZpbGVMaXN0ID0gYXdhaXQgZ2V0RGVmYXVsdERpcnMoYmFzZURpcik7XG5cbiAgICBmaWxlTGlzdCA9IGF3YWl0IGNvbnZlcnREaXJzVG9HbG9icyhmaWxlTGlzdCwgYmFzZURpcik7XG4gICAgZmlsZUxpc3QgPSBhd2FpdCBnbG9iYnkoZmlsZUxpc3QsIHsgY3dkOiBiYXNlRGlyIH0pO1xuXG4gICAgcmV0dXJuIGZpbGVMaXN0Lm1hcChmaWxlID0+IHBhdGgucmVzb2x2ZShiYXNlRGlyLCBmaWxlKSk7XG59XG4iXX0=
