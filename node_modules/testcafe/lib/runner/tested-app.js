'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _child_process = require('child_process');

var _path = require('path');

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _treeKill = require('tree-kill');

var _treeKill2 = _interopRequireDefault(_treeKill);

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _delay = require('../utils/delay');

var _delay2 = _interopRequireDefault(_delay);

var _runtime = require('../errors/runtime');

var _message = require('../errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MODULES_BIN_DIR = (0, _path.join)(process.cwd(), './node_modules/.bin');

const ENV_PATH_KEY = function () {
    if (_osFamily2.default.win) {
        let pathKey = 'Path';

        (0, _keys2.default)(process.env).forEach(key => {
            if (key.toLowerCase() === 'path') pathKey = key;
        });

        return pathKey;
    }

    return 'PATH';
}();

class TestedApp {
    constructor() {
        this.process = null;
        this.errorPromise = null;
        this.killed = false;
    }

    start(command, initDelay) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this.errorPromise = new _pinkie2.default(function (resolve, reject) {
                const env = (0, _assign2.default)({}, process.env);
                const path = env[ENV_PATH_KEY] || '';
                const pathParts = path.split(_path.delimiter);

                pathParts.unshift(MODULES_BIN_DIR);

                env[ENV_PATH_KEY] = pathParts.join(_path.delimiter);

                _this.process = (0, _child_process.exec)(command, { env }, function (err) {
                    if (!_this.killed && err) {
                        const message = err.stack || String(err);

                        reject(new _runtime.GeneralError(_message2.default.testedAppFailedWithError, message));
                    }
                });
            });

            yield _pinkie2.default.race([(0, _delay2.default)(initDelay), _this.errorPromise]);
        })();
    }

    kill() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this2.killed = true;

            const killPromise = new _pinkie2.default(function (resolve) {
                return (0, _treeKill2.default)(_this2.process.pid, 'SIGTERM', resolve);
            });

            yield killPromise;
        })();
    }
}
exports.default = TestedApp;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvdGVzdGVkLWFwcC5qcyJdLCJuYW1lcyI6WyJNT0RVTEVTX0JJTl9ESVIiLCJwcm9jZXNzIiwiY3dkIiwiRU5WX1BBVEhfS0VZIiwiT1MiLCJ3aW4iLCJwYXRoS2V5IiwiZW52IiwiZm9yRWFjaCIsImtleSIsInRvTG93ZXJDYXNlIiwiVGVzdGVkQXBwIiwiY29uc3RydWN0b3IiLCJlcnJvclByb21pc2UiLCJraWxsZWQiLCJzdGFydCIsImNvbW1hbmQiLCJpbml0RGVsYXkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInBhdGgiLCJwYXRoUGFydHMiLCJzcGxpdCIsInBhdGhEZWxpbWl0ZXIiLCJ1bnNoaWZ0Iiwiam9pbiIsImVyciIsIm1lc3NhZ2UiLCJzdGFjayIsIlN0cmluZyIsIkdlbmVyYWxFcnJvciIsIk1FU1NBR0UiLCJ0ZXN0ZWRBcHBGYWlsZWRXaXRoRXJyb3IiLCJyYWNlIiwia2lsbCIsImtpbGxQcm9taXNlIiwicGlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBR0EsTUFBTUEsa0JBQWtCLGdCQUFTQyxRQUFRQyxHQUFSLEVBQVQsRUFBd0IscUJBQXhCLENBQXhCOztBQUVBLE1BQU1DLGVBQWdCLFlBQVk7QUFDOUIsUUFBSUMsbUJBQUdDLEdBQVAsRUFBWTtBQUNSLFlBQUlDLFVBQVUsTUFBZDs7QUFFQSw0QkFBWUwsUUFBUU0sR0FBcEIsRUFBeUJDLE9BQXpCLENBQWlDQyxPQUFPO0FBQ3BDLGdCQUFJQSxJQUFJQyxXQUFKLE9BQXNCLE1BQTFCLEVBQ0lKLFVBQVVHLEdBQVY7QUFDUCxTQUhEOztBQUtBLGVBQU9ILE9BQVA7QUFDSDs7QUFFRCxXQUFPLE1BQVA7QUFDSCxDQWJvQixFQUFyQjs7QUFnQmUsTUFBTUssU0FBTixDQUFnQjtBQUMzQkMsa0JBQWU7QUFDWCxhQUFLWCxPQUFMLEdBQW9CLElBQXBCO0FBQ0EsYUFBS1ksWUFBTCxHQUFvQixJQUFwQjtBQUNBLGFBQUtDLE1BQUwsR0FBb0IsS0FBcEI7QUFDSDs7QUFFS0MsU0FBTixDQUFhQyxPQUFiLEVBQXNCQyxTQUF0QixFQUFpQztBQUFBOztBQUFBO0FBQzdCLGtCQUFLSixZQUFMLEdBQW9CLElBQUlLLGdCQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ2pELHNCQUFNYixNQUFZLHNCQUFjLEVBQWQsRUFBa0JOLFFBQVFNLEdBQTFCLENBQWxCO0FBQ0Esc0JBQU1jLE9BQVlkLElBQUlKLFlBQUosS0FBcUIsRUFBdkM7QUFDQSxzQkFBTW1CLFlBQVlELEtBQUtFLEtBQUwsQ0FBV0MsZUFBWCxDQUFsQjs7QUFFQUYsMEJBQVVHLE9BQVYsQ0FBa0J6QixlQUFsQjs7QUFFQU8sb0JBQUlKLFlBQUosSUFBb0JtQixVQUFVSSxJQUFWLENBQWVGLGVBQWYsQ0FBcEI7O0FBRUEsc0JBQUt2QixPQUFMLEdBQWUseUJBQUtlLE9BQUwsRUFBYyxFQUFFVCxHQUFGLEVBQWQsRUFBdUIsZUFBTztBQUN6Qyx3QkFBSSxDQUFDLE1BQUtPLE1BQU4sSUFBZ0JhLEdBQXBCLEVBQXlCO0FBQ3JCLDhCQUFNQyxVQUFVRCxJQUFJRSxLQUFKLElBQWFDLE9BQU9ILEdBQVAsQ0FBN0I7O0FBRUFQLCtCQUFPLElBQUlXLHFCQUFKLENBQWlCQyxrQkFBUUMsd0JBQXpCLEVBQW1ETCxPQUFuRCxDQUFQO0FBQ0g7QUFDSixpQkFOYyxDQUFmO0FBT0gsYUFoQm1CLENBQXBCOztBQWtCQSxrQkFBTVYsaUJBQVFnQixJQUFSLENBQWEsQ0FDZixxQkFBTWpCLFNBQU4sQ0FEZSxFQUVmLE1BQUtKLFlBRlUsQ0FBYixDQUFOO0FBbkI2QjtBQXVCaEM7O0FBRUtzQixRQUFOLEdBQWM7QUFBQTs7QUFBQTtBQUNWLG1CQUFLckIsTUFBTCxHQUFjLElBQWQ7O0FBRUEsa0JBQU1zQixjQUFjLElBQUlsQixnQkFBSixDQUFZO0FBQUEsdUJBQVcsd0JBQUssT0FBS2pCLE9BQUwsQ0FBYW9DLEdBQWxCLEVBQXVCLFNBQXZCLEVBQWtDbEIsT0FBbEMsQ0FBWDtBQUFBLGFBQVosQ0FBcEI7O0FBRUEsa0JBQU1pQixXQUFOO0FBTFU7QUFNYjtBQXRDMEI7a0JBQVZ6QixTIiwiZmlsZSI6InJ1bm5lci90ZXN0ZWQtYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHsgam9pbiBhcyBwYXRoSm9pbiwgZGVsaW1pdGVyIGFzIHBhdGhEZWxpbWl0ZXIgfSBmcm9tICdwYXRoJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5pbXBvcnQga2lsbCBmcm9tICd0cmVlLWtpbGwnO1xuaW1wb3J0IE9TIGZyb20gJ29zLWZhbWlseSc7XG5pbXBvcnQgZGVsYXkgZnJvbSAnLi4vdXRpbHMvZGVsYXknO1xuaW1wb3J0IHsgR2VuZXJhbEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzL3J1bnRpbWUnO1xuaW1wb3J0IE1FU1NBR0UgZnJvbSAnLi4vZXJyb3JzL3J1bnRpbWUvbWVzc2FnZSc7XG5cblxuY29uc3QgTU9EVUxFU19CSU5fRElSID0gcGF0aEpvaW4ocHJvY2Vzcy5jd2QoKSwgJy4vbm9kZV9tb2R1bGVzLy5iaW4nKTtcblxuY29uc3QgRU5WX1BBVEhfS0VZID0gKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoT1Mud2luKSB7XG4gICAgICAgIGxldCBwYXRoS2V5ID0gJ1BhdGgnO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHByb2Nlc3MuZW52KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBpZiAoa2V5LnRvTG93ZXJDYXNlKCkgPT09ICdwYXRoJylcbiAgICAgICAgICAgICAgICBwYXRoS2V5ID0ga2V5O1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcGF0aEtleTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ1BBVEgnO1xufSkoKTtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0ZWRBcHAge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzICAgICAgPSBudWxsO1xuICAgICAgICB0aGlzLmVycm9yUHJvbWlzZSA9IG51bGw7XG4gICAgICAgIHRoaXMua2lsbGVkICAgICAgID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYXN5bmMgc3RhcnQgKGNvbW1hbmQsIGluaXREZWxheSkge1xuICAgICAgICB0aGlzLmVycm9yUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudiAgICAgICA9IE9iamVjdC5hc3NpZ24oe30sIHByb2Nlc3MuZW52KTtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggICAgICA9IGVudltFTlZfUEFUSF9LRVldIHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgcGF0aFBhcnRzID0gcGF0aC5zcGxpdChwYXRoRGVsaW1pdGVyKTtcblxuICAgICAgICAgICAgcGF0aFBhcnRzLnVuc2hpZnQoTU9EVUxFU19CSU5fRElSKTtcblxuICAgICAgICAgICAgZW52W0VOVl9QQVRIX0tFWV0gPSBwYXRoUGFydHMuam9pbihwYXRoRGVsaW1pdGVyKTtcblxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzID0gZXhlYyhjb21tYW5kLCB7IGVudiB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5raWxsZWQgJiYgZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnIuc3RhY2sgfHwgU3RyaW5nKGVycik7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBHZW5lcmFsRXJyb3IoTUVTU0FHRS50ZXN0ZWRBcHBGYWlsZWRXaXRoRXJyb3IsIG1lc3NhZ2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICAgIGRlbGF5KGluaXREZWxheSksXG4gICAgICAgICAgICB0aGlzLmVycm9yUHJvbWlzZVxuICAgICAgICBdKTtcbiAgICB9XG5cbiAgICBhc3luYyBraWxsICgpIHtcbiAgICAgICAgdGhpcy5raWxsZWQgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IGtpbGxQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBraWxsKHRoaXMucHJvY2Vzcy5waWQsICdTSUdURVJNJywgcmVzb2x2ZSkpO1xuXG4gICAgICAgIGF3YWl0IGtpbGxQcm9taXNlO1xuICAgIH1cbn1cbiJdfQ==
