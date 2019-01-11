'use strict';

var _resolveCwd = require('resolve-cwd');

var _resolveCwd2 = _interopRequireDefault(_resolveCwd);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLocalInstallation() {
    const local = (0, _resolveCwd2.default)('testcafe/lib/cli');

    if (local && local !== __filename) {
        _log2.default.write('Using locally installed version of TestCafe.');
        return local;
    }

    return '';
}

(function loader() {
    const cliPath = getLocalInstallation() || require.resolve('./cli');

    require(cliPath);
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5kZXguanMiXSwibmFtZXMiOlsiZ2V0TG9jYWxJbnN0YWxsYXRpb24iLCJsb2NhbCIsIl9fZmlsZW5hbWUiLCJsb2ciLCJ3cml0ZSIsImxvYWRlciIsImNsaVBhdGgiLCJyZXF1aXJlIiwicmVzb2x2ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQSxTQUFTQSxvQkFBVCxHQUFpQztBQUM3QixVQUFNQyxRQUFRLDBCQUFXLGtCQUFYLENBQWQ7O0FBRUEsUUFBSUEsU0FBU0EsVUFBVUMsVUFBdkIsRUFBbUM7QUFDL0JDLHNCQUFJQyxLQUFKLENBQVUsOENBQVY7QUFDQSxlQUFPSCxLQUFQO0FBQ0g7O0FBRUQsV0FBTyxFQUFQO0FBQ0g7O0FBRUQsQ0FBQyxTQUFTSSxNQUFULEdBQW1CO0FBQ2hCLFVBQU1DLFVBQVVOLDBCQUEwQk8sUUFBUUMsT0FBUixDQUFnQixPQUFoQixDQUExQzs7QUFFQUQsWUFBUUQsT0FBUjtBQUNILENBSkQiLCJmaWxlIjoiY2xpL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlc29sdmVDd2QgZnJvbSAncmVzb2x2ZS1jd2QnO1xuaW1wb3J0IGxvZyBmcm9tICcuL2xvZyc7XG5cblxuZnVuY3Rpb24gZ2V0TG9jYWxJbnN0YWxsYXRpb24gKCkge1xuICAgIGNvbnN0IGxvY2FsID0gcmVzb2x2ZUN3ZCgndGVzdGNhZmUvbGliL2NsaScpO1xuXG4gICAgaWYgKGxvY2FsICYmIGxvY2FsICE9PSBfX2ZpbGVuYW1lKSB7XG4gICAgICAgIGxvZy53cml0ZSgnVXNpbmcgbG9jYWxseSBpbnN0YWxsZWQgdmVyc2lvbiBvZiBUZXN0Q2FmZS4nKTtcbiAgICAgICAgcmV0dXJuIGxvY2FsO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbn1cblxuKGZ1bmN0aW9uIGxvYWRlciAoKSB7XG4gICAgY29uc3QgY2xpUGF0aCA9IGdldExvY2FsSW5zdGFsbGF0aW9uKCkgfHwgcmVxdWlyZS5yZXNvbHZlKCcuL2NsaScpO1xuXG4gICAgcmVxdWlyZShjbGlQYXRoKTtcbn0pKCk7XG4iXX0=
