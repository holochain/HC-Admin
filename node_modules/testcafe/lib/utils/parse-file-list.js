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

                    if (_osFamily2.default.win) file = modifyFileRoot(baseDir, file);
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

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _lodash = require('lodash');

var _promisifiedFunctions = require('../utils/promisified-functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_TEST_LOOKUP_DIRS = ['test/', 'tests/'];
const TEST_FILE_GLOB_PATTERN = `./**/*@(${_compiler2.default.getSupportedTestFileExtensions().join('|')})`;

function modifyFileRoot(baseDir, file) {
    const absPath = _path2.default.resolve(baseDir, file);
    const fileIsOnOtherDrive = _path2.default.isAbsolute(_path2.default.relative(baseDir, file));

    if (!_path2.default.isAbsolute(file) || fileIsOnOtherDrive) return file;

    var _path$parse = _path2.default.parse(absPath);

    const root = _path$parse.root,
          dir = _path$parse.dir,
          base = _path$parse.base;


    return _path2.default.join(_path2.default.parse(baseDir).root, _path2.default.relative(root, dir), base);
}

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9wYXJzZS1maWxlLWxpc3QuanMiXSwibmFtZXMiOlsiYmFzZURpciIsIkRFRkFVTFRfVEVTVF9MT09LVVBfRElSUyIsImN3ZCIsIm5vY2FzZSIsIm9ubHlEaXJlY3RvcmllcyIsIm9ubHlGaWxlcyIsImdldERlZmF1bHREaXJzIiwiZmlsZUxpc3QiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwiZmlsZSIsImFic1BhdGgiLCJwYXRoIiwicmVzb2x2ZSIsImZpbGVTdGF0IiwiZXJyIiwiaXNEaXJlY3RvcnkiLCJqb2luIiwiVEVTVF9GSUxFX0dMT0JfUEFUVEVSTiIsIk9TIiwid2luIiwibW9kaWZ5RmlsZVJvb3QiLCJmaWx0ZXIiLCJjb252ZXJ0RGlyc1RvR2xvYnMiLCJDb21waWxlciIsImdldFN1cHBvcnRlZFRlc3RGaWxlRXh0ZW5zaW9ucyIsImZpbGVJc09uT3RoZXJEcml2ZSIsImlzQWJzb2x1dGUiLCJyZWxhdGl2ZSIsInBhcnNlIiwicm9vdCIsImRpciIsImJhc2UiLCJwYXJzZUZpbGVMaXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7K0NBd0JBLFdBQStCQSxPQUEvQixFQUF3QztBQUNwQyxlQUFPLE1BQU0sc0JBQU9DLHdCQUFQLEVBQWlDO0FBQzFDQyxpQkFBaUJGLE9BRHlCO0FBRTFDRyxvQkFBaUIsSUFGeUI7QUFHMUNDLDZCQUFpQixJQUh5QjtBQUkxQ0MsdUJBQWlCO0FBSnlCLFNBQWpDLENBQWI7QUFNSCxLOztvQkFQY0MsYzs7Ozs7O2dEQVNmLFdBQW1DQyxRQUFuQyxFQUE2Q1AsT0FBN0MsRUFBc0Q7QUFDbERPLG1CQUFXLE1BQU1DLGlCQUFRQyxHQUFSLENBQVlGLFNBQVNHLEdBQVQ7QUFBQSx3REFBYSxXQUFNQyxJQUFOLEVBQWM7QUFDcEQsb0JBQUksQ0FBQyxzQkFBT0EsSUFBUCxDQUFMLEVBQW1CO0FBQ2YsMEJBQU1DLFVBQVVDLGVBQUtDLE9BQUwsQ0FBYWQsT0FBYixFQUFzQlcsSUFBdEIsQ0FBaEI7QUFDQSx3QkFBSUksV0FBWSxJQUFoQjs7QUFFQSx3QkFBSTtBQUNBQSxtQ0FBVyxNQUFNLGdDQUFLSCxPQUFMLENBQWpCO0FBQ0gscUJBRkQsQ0FHQSxPQUFPSSxHQUFQLEVBQVk7QUFDUiwrQkFBTyxJQUFQO0FBQ0g7O0FBRUQsd0JBQUlELFNBQVNFLFdBQVQsRUFBSixFQUNJLE9BQU9KLGVBQUtLLElBQUwsQ0FBVVAsSUFBVixFQUFnQlEsc0JBQWhCLENBQVA7O0FBRUosd0JBQUlDLG1CQUFHQyxHQUFQLEVBQ0lWLE9BQU9XLGVBQWV0QixPQUFmLEVBQXdCVyxJQUF4QixDQUFQO0FBQ1A7O0FBRUQsdUJBQU9BLElBQVA7QUFDSCxhQXBCNEI7O0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBWixDQUFqQjs7QUFzQkEsZUFBT0osU0FBU2dCLE1BQVQsQ0FBZ0I7QUFBQSxtQkFBUSxDQUFDLENBQUNaLElBQVY7QUFBQSxTQUFoQixDQUFQO0FBQ0gsSzs7b0JBeEJjYSxrQjs7Ozs7QUFqQ2Y7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxNQUFNdkIsMkJBQTJCLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FBakM7QUFDQSxNQUFNa0IseUJBQTRCLFdBQVVNLG1CQUFTQyw4QkFBVCxHQUEwQ1IsSUFBMUMsQ0FBK0MsR0FBL0MsQ0FBb0QsR0FBaEc7O0FBRUEsU0FBU0ksY0FBVCxDQUF5QnRCLE9BQXpCLEVBQWtDVyxJQUFsQyxFQUF3QztBQUNwQyxVQUFNQyxVQUFxQkMsZUFBS0MsT0FBTCxDQUFhZCxPQUFiLEVBQXNCVyxJQUF0QixDQUEzQjtBQUNBLFVBQU1nQixxQkFBcUJkLGVBQUtlLFVBQUwsQ0FBZ0JmLGVBQUtnQixRQUFMLENBQWM3QixPQUFkLEVBQXVCVyxJQUF2QixDQUFoQixDQUEzQjs7QUFFQSxRQUFJLENBQUNFLGVBQUtlLFVBQUwsQ0FBZ0JqQixJQUFoQixDQUFELElBQTBCZ0Isa0JBQTlCLEVBQ0ksT0FBT2hCLElBQVA7O0FBTGdDLHNCQU9SRSxlQUFLaUIsS0FBTCxDQUFXbEIsT0FBWCxDQVBROztBQUFBLFVBTzVCbUIsSUFQNEIsZUFPNUJBLElBUDRCO0FBQUEsVUFPdEJDLEdBUHNCLGVBT3RCQSxHQVBzQjtBQUFBLFVBT2pCQyxJQVBpQixlQU9qQkEsSUFQaUI7OztBQVNwQyxXQUFPcEIsZUFBS0ssSUFBTCxDQUFVTCxlQUFLaUIsS0FBTCxDQUFXOUIsT0FBWCxFQUFvQitCLElBQTlCLEVBQW9DbEIsZUFBS2dCLFFBQUwsQ0FBY0UsSUFBZCxFQUFvQkMsR0FBcEIsQ0FBcEMsRUFBOERDLElBQTlELENBQVA7QUFDSDs7O2dEQXFDYyxXQUE4QjFCLFFBQTlCLEVBQXdDUCxPQUF4QyxFQUFpRDtBQUM1RCxZQUFJLHFCQUFRTyxRQUFSLENBQUosRUFDSUEsV0FBVyxNQUFNRCxlQUFlTixPQUFmLENBQWpCOztBQUVKTyxtQkFBVyxNQUFNaUIsbUJBQW1CakIsUUFBbkIsRUFBNkJQLE9BQTdCLENBQWpCO0FBQ0FPLG1CQUFXLE1BQU0sc0JBQU9BLFFBQVAsRUFBaUIsRUFBRUwsS0FBS0YsT0FBUCxFQUFqQixDQUFqQjs7QUFFQSxlQUFPTyxTQUFTRyxHQUFULENBQWE7QUFBQSxtQkFBUUcsZUFBS0MsT0FBTCxDQUFhZCxPQUFiLEVBQXNCVyxJQUF0QixDQUFSO0FBQUEsU0FBYixDQUFQO0FBQ0gsSzs7YUFSNkJ1QixhOzs7O1dBQUFBLGEiLCJmaWxlIjoidXRpbHMvcGFyc2UtZmlsZS1saXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdwaW5raWUnO1xuaW1wb3J0IGdsb2JieSBmcm9tICdnbG9iYnknO1xuaW1wb3J0IGlzR2xvYiBmcm9tICdpcy1nbG9iJztcbmltcG9ydCBDb21waWxlciBmcm9tICcuLi9jb21waWxlcic7XG5pbXBvcnQgT1MgZnJvbSAnb3MtZmFtaWx5JztcbmltcG9ydCB7IGlzRW1wdHkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgc3RhdCB9IGZyb20gJy4uL3V0aWxzL3Byb21pc2lmaWVkLWZ1bmN0aW9ucyc7XG5cbmNvbnN0IERFRkFVTFRfVEVTVF9MT09LVVBfRElSUyA9IFsndGVzdC8nLCAndGVzdHMvJ107XG5jb25zdCBURVNUX0ZJTEVfR0xPQl9QQVRURVJOICAgPSBgLi8qKi8qQCgke0NvbXBpbGVyLmdldFN1cHBvcnRlZFRlc3RGaWxlRXh0ZW5zaW9ucygpLmpvaW4oJ3wnKX0pYDtcblxuZnVuY3Rpb24gbW9kaWZ5RmlsZVJvb3QgKGJhc2VEaXIsIGZpbGUpIHtcbiAgICBjb25zdCBhYnNQYXRoICAgICAgICAgICAgPSBwYXRoLnJlc29sdmUoYmFzZURpciwgZmlsZSk7XG4gICAgY29uc3QgZmlsZUlzT25PdGhlckRyaXZlID0gcGF0aC5pc0Fic29sdXRlKHBhdGgucmVsYXRpdmUoYmFzZURpciwgZmlsZSkpO1xuXG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUoZmlsZSkgfHwgZmlsZUlzT25PdGhlckRyaXZlKVxuICAgICAgICByZXR1cm4gZmlsZTtcblxuICAgIGNvbnN0IHsgcm9vdCwgZGlyLCBiYXNlIH0gPSBwYXRoLnBhcnNlKGFic1BhdGgpO1xuXG4gICAgcmV0dXJuIHBhdGguam9pbihwYXRoLnBhcnNlKGJhc2VEaXIpLnJvb3QsIHBhdGgucmVsYXRpdmUocm9vdCwgZGlyKSwgYmFzZSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldERlZmF1bHREaXJzIChiYXNlRGlyKSB7XG4gICAgcmV0dXJuIGF3YWl0IGdsb2JieShERUZBVUxUX1RFU1RfTE9PS1VQX0RJUlMsIHtcbiAgICAgICAgY3dkOiAgICAgICAgICAgICBiYXNlRGlyLFxuICAgICAgICBub2Nhc2U6ICAgICAgICAgIHRydWUsXG4gICAgICAgIG9ubHlEaXJlY3RvcmllczogdHJ1ZSxcbiAgICAgICAgb25seUZpbGVzOiAgICAgICBmYWxzZVxuICAgIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjb252ZXJ0RGlyc1RvR2xvYnMgKGZpbGVMaXN0LCBiYXNlRGlyKSB7XG4gICAgZmlsZUxpc3QgPSBhd2FpdCBQcm9taXNlLmFsbChmaWxlTGlzdC5tYXAoYXN5bmMgZmlsZSA9PiB7XG4gICAgICAgIGlmICghaXNHbG9iKGZpbGUpKSB7XG4gICAgICAgICAgICBjb25zdCBhYnNQYXRoID0gcGF0aC5yZXNvbHZlKGJhc2VEaXIsIGZpbGUpO1xuICAgICAgICAgICAgbGV0IGZpbGVTdGF0ICA9IG51bGw7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZmlsZVN0YXQgPSBhd2FpdCBzdGF0KGFic1BhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZmlsZVN0YXQuaXNEaXJlY3RvcnkoKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aC5qb2luKGZpbGUsIFRFU1RfRklMRV9HTE9CX1BBVFRFUk4pO1xuXG4gICAgICAgICAgICBpZiAoT1Mud2luKVxuICAgICAgICAgICAgICAgIGZpbGUgPSBtb2RpZnlGaWxlUm9vdChiYXNlRGlyLCBmaWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlO1xuICAgIH0pKTtcblxuICAgIHJldHVybiBmaWxlTGlzdC5maWx0ZXIoZmlsZSA9PiAhIWZpbGUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBwYXJzZUZpbGVMaXN0IChmaWxlTGlzdCwgYmFzZURpcikge1xuICAgIGlmIChpc0VtcHR5KGZpbGVMaXN0KSlcbiAgICAgICAgZmlsZUxpc3QgPSBhd2FpdCBnZXREZWZhdWx0RGlycyhiYXNlRGlyKTtcblxuICAgIGZpbGVMaXN0ID0gYXdhaXQgY29udmVydERpcnNUb0dsb2JzKGZpbGVMaXN0LCBiYXNlRGlyKTtcbiAgICBmaWxlTGlzdCA9IGF3YWl0IGdsb2JieShmaWxlTGlzdCwgeyBjd2Q6IGJhc2VEaXIgfSk7XG5cbiAgICByZXR1cm4gZmlsZUxpc3QubWFwKGZpbGUgPT4gcGF0aC5yZXNvbHZlKGJhc2VEaXIsIGZpbGUpKTtcbn1cbiJdfQ==
