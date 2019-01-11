'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _events = require('events');

var _delay = require('../utils/delay');

var _delay2 = _interopRequireDefault(_delay);

var _thennable = require('../utils/thennable');

var _testRun = require('../errors/test-run');

var _reExecutablePromise = require('../utils/re-executable-promise');

var _reExecutablePromise2 = _interopRequireDefault(_reExecutablePromise);

var _getFn = require('./get-fn');

var _getFn2 = _interopRequireDefault(_getFn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ASSERTION_DELAY = 200;

class AssertionExecutor extends _events.EventEmitter {
    constructor(command, timeout, callsite) {
        super();

        this.command = command;
        this.timeout = timeout;
        this.callsite = callsite;

        this.startTime = null;
        this.passed = false;
        this.inRetry = false;

        const fn = (0, _getFn2.default)(this.command);
        const actualCommand = this.command.actual;

        if (actualCommand instanceof _reExecutablePromise2.default) this.fn = this._wrapFunction(fn);else if (!this.command.options.allowUnawaitedPromise && (0, _thennable.isThennable)(actualCommand)) throw new _testRun.AssertionUnawaitedPromiseError(this.callsite);else this.fn = fn;
    }

    _getTimeLeft() {
        return this.timeout - (new Date() - this.startTime);
    }

    _onExecutionFinished() {
        if (this.inRetry) this.emit('end-assertion-retries', this.passed);
    }

    _wrapFunction(fn) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const resultPromise = _this.command.actual;

            while (!_this.passed) {
                _this.command.actual = yield resultPromise._reExecute();

                try {
                    fn();
                    _this.passed = true;
                    _this._onExecutionFinished();
                } catch (err) {
                    if (_this._getTimeLeft() <= 0) {
                        _this._onExecutionFinished();
                        throw err;
                    }

                    yield (0, _delay2.default)(ASSERTION_DELAY);

                    _this.inRetry = true;
                    _this.emit('start-assertion-retries', _this._getTimeLeft());
                }
            }
        });
    }

    run() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this2.startTime = new Date();

            try {
                yield _this2.fn();
            } catch (err) {
                if (err.name === 'AssertionError' || err.constructor.name === 'AssertionError') throw new _testRun.ExternalAssertionLibraryError(err, _this2.callsite);

                if (err.isTestCafeError) err.callsite = _this2.callsite;

                throw err;
            }
        })();
    }
}
exports.default = AssertionExecutor;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NlcnRpb25zL2V4ZWN1dG9yLmpzIl0sIm5hbWVzIjpbIkFTU0VSVElPTl9ERUxBWSIsIkFzc2VydGlvbkV4ZWN1dG9yIiwiRXZlbnRFbWl0dGVyIiwiY29uc3RydWN0b3IiLCJjb21tYW5kIiwidGltZW91dCIsImNhbGxzaXRlIiwic3RhcnRUaW1lIiwicGFzc2VkIiwiaW5SZXRyeSIsImZuIiwiYWN0dWFsQ29tbWFuZCIsImFjdHVhbCIsIlJlRXhlY3V0YWJsZVByb21pc2UiLCJfd3JhcEZ1bmN0aW9uIiwib3B0aW9ucyIsImFsbG93VW5hd2FpdGVkUHJvbWlzZSIsIkFzc2VydGlvblVuYXdhaXRlZFByb21pc2VFcnJvciIsIl9nZXRUaW1lTGVmdCIsIkRhdGUiLCJfb25FeGVjdXRpb25GaW5pc2hlZCIsImVtaXQiLCJyZXN1bHRQcm9taXNlIiwiX3JlRXhlY3V0ZSIsImVyciIsInJ1biIsIm5hbWUiLCJFeHRlcm5hbEFzc2VydGlvbkxpYnJhcnlFcnJvciIsImlzVGVzdENhZmVFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLGtCQUFrQixHQUF4Qjs7QUFFZSxNQUFNQyxpQkFBTixTQUFnQ0Msb0JBQWhDLENBQTZDO0FBQ3hEQyxnQkFBYUMsT0FBYixFQUFzQkMsT0FBdEIsRUFBK0JDLFFBQS9CLEVBQXlDO0FBQ3JDOztBQUVBLGFBQUtGLE9BQUwsR0FBZ0JBLE9BQWhCO0FBQ0EsYUFBS0MsT0FBTCxHQUFnQkEsT0FBaEI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjs7QUFFQSxhQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsYUFBS0MsTUFBTCxHQUFpQixLQUFqQjtBQUNBLGFBQUtDLE9BQUwsR0FBaUIsS0FBakI7O0FBRUEsY0FBTUMsS0FBZ0IscUJBQU0sS0FBS04sT0FBWCxDQUF0QjtBQUNBLGNBQU1PLGdCQUFnQixLQUFLUCxPQUFMLENBQWFRLE1BQW5DOztBQUVBLFlBQUlELHlCQUF5QkUsNkJBQTdCLEVBQ0ksS0FBS0gsRUFBTCxHQUFVLEtBQUtJLGFBQUwsQ0FBbUJKLEVBQW5CLENBQVYsQ0FESixLQUVLLElBQUksQ0FBQyxLQUFLTixPQUFMLENBQWFXLE9BQWIsQ0FBcUJDLHFCQUF0QixJQUErQyw0QkFBWUwsYUFBWixDQUFuRCxFQUNELE1BQU0sSUFBSU0sdUNBQUosQ0FBbUMsS0FBS1gsUUFBeEMsQ0FBTixDQURDLEtBR0QsS0FBS0ksRUFBTCxHQUFVQSxFQUFWO0FBQ1A7O0FBRURRLG1CQUFnQjtBQUNaLGVBQU8sS0FBS2IsT0FBTCxJQUFnQixJQUFJYyxJQUFKLEtBQWEsS0FBS1osU0FBbEMsQ0FBUDtBQUNIOztBQUVEYSwyQkFBd0I7QUFDcEIsWUFBSSxLQUFLWCxPQUFULEVBQ0ksS0FBS1ksSUFBTCxDQUFVLHVCQUFWLEVBQW1DLEtBQUtiLE1BQXhDO0FBQ1A7O0FBRURNLGtCQUFlSixFQUFmLEVBQW1CO0FBQUE7O0FBQ2YsK0NBQU8sYUFBWTtBQUNmLGtCQUFNWSxnQkFBZ0IsTUFBS2xCLE9BQUwsQ0FBYVEsTUFBbkM7O0FBRUEsbUJBQU8sQ0FBQyxNQUFLSixNQUFiLEVBQXFCO0FBQ2pCLHNCQUFLSixPQUFMLENBQWFRLE1BQWIsR0FBc0IsTUFBTVUsY0FBY0MsVUFBZCxFQUE1Qjs7QUFFQSxvQkFBSTtBQUNBYjtBQUNBLDBCQUFLRixNQUFMLEdBQWMsSUFBZDtBQUNBLDBCQUFLWSxvQkFBTDtBQUNILGlCQUpELENBTUEsT0FBT0ksR0FBUCxFQUFZO0FBQ1Isd0JBQUksTUFBS04sWUFBTCxNQUF1QixDQUEzQixFQUE4QjtBQUMxQiw4QkFBS0Usb0JBQUw7QUFDQSw4QkFBTUksR0FBTjtBQUNIOztBQUVELDBCQUFNLHFCQUFNeEIsZUFBTixDQUFOOztBQUVBLDBCQUFLUyxPQUFMLEdBQWUsSUFBZjtBQUNBLDBCQUFLWSxJQUFMLENBQVUseUJBQVYsRUFBcUMsTUFBS0gsWUFBTCxFQUFyQztBQUNIO0FBQ0o7QUFDSixTQXhCRDtBQXlCSDs7QUFFS08sT0FBTixHQUFhO0FBQUE7O0FBQUE7QUFDVCxtQkFBS2xCLFNBQUwsR0FBaUIsSUFBSVksSUFBSixFQUFqQjs7QUFFQSxnQkFBSTtBQUNBLHNCQUFNLE9BQUtULEVBQUwsRUFBTjtBQUNILGFBRkQsQ0FJQSxPQUFPYyxHQUFQLEVBQVk7QUFDUixvQkFBSUEsSUFBSUUsSUFBSixLQUFhLGdCQUFiLElBQWlDRixJQUFJckIsV0FBSixDQUFnQnVCLElBQWhCLEtBQXlCLGdCQUE5RCxFQUNJLE1BQU0sSUFBSUMsc0NBQUosQ0FBa0NILEdBQWxDLEVBQXVDLE9BQUtsQixRQUE1QyxDQUFOOztBQUVKLG9CQUFJa0IsSUFBSUksZUFBUixFQUNJSixJQUFJbEIsUUFBSixHQUFlLE9BQUtBLFFBQXBCOztBQUVKLHNCQUFNa0IsR0FBTjtBQUNIO0FBZlE7QUFnQlo7QUE1RXVEO2tCQUF2Q3ZCLGlCIiwiZmlsZSI6ImFzc2VydGlvbnMvZXhlY3V0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IGRlbGF5IGZyb20gJy4uL3V0aWxzL2RlbGF5JztcbmltcG9ydCB7IGlzVGhlbm5hYmxlIH0gZnJvbSAnLi4vdXRpbHMvdGhlbm5hYmxlJztcbmltcG9ydCB7IEV4dGVybmFsQXNzZXJ0aW9uTGlicmFyeUVycm9yLCBBc3NlcnRpb25VbmF3YWl0ZWRQcm9taXNlRXJyb3IgfSBmcm9tICcuLi9lcnJvcnMvdGVzdC1ydW4nO1xuaW1wb3J0IFJlRXhlY3V0YWJsZVByb21pc2UgZnJvbSAnLi4vdXRpbHMvcmUtZXhlY3V0YWJsZS1wcm9taXNlJztcbmltcG9ydCBnZXRGbiBmcm9tICcuL2dldC1mbic7XG5cbmNvbnN0IEFTU0VSVElPTl9ERUxBWSA9IDIwMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXNzZXJ0aW9uRXhlY3V0b3IgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yIChjb21tYW5kLCB0aW1lb3V0LCBjYWxsc2l0ZSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuY29tbWFuZCAgPSBjb21tYW5kO1xuICAgICAgICB0aGlzLnRpbWVvdXQgID0gdGltZW91dDtcbiAgICAgICAgdGhpcy5jYWxsc2l0ZSA9IGNhbGxzaXRlO1xuXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5wYXNzZWQgICAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pblJldHJ5ICAgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBmbiAgICAgICAgICAgID0gZ2V0Rm4odGhpcy5jb21tYW5kKTtcbiAgICAgICAgY29uc3QgYWN0dWFsQ29tbWFuZCA9IHRoaXMuY29tbWFuZC5hY3R1YWw7XG5cbiAgICAgICAgaWYgKGFjdHVhbENvbW1hbmQgaW5zdGFuY2VvZiBSZUV4ZWN1dGFibGVQcm9taXNlKVxuICAgICAgICAgICAgdGhpcy5mbiA9IHRoaXMuX3dyYXBGdW5jdGlvbihmbik7XG4gICAgICAgIGVsc2UgaWYgKCF0aGlzLmNvbW1hbmQub3B0aW9ucy5hbGxvd1VuYXdhaXRlZFByb21pc2UgJiYgaXNUaGVubmFibGUoYWN0dWFsQ29tbWFuZCkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgQXNzZXJ0aW9uVW5hd2FpdGVkUHJvbWlzZUVycm9yKHRoaXMuY2FsbHNpdGUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmZuID0gZm47XG4gICAgfVxuXG4gICAgX2dldFRpbWVMZWZ0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGltZW91dCAtIChuZXcgRGF0ZSgpIC0gdGhpcy5zdGFydFRpbWUpO1xuICAgIH1cblxuICAgIF9vbkV4ZWN1dGlvbkZpbmlzaGVkICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5SZXRyeSlcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnZW5kLWFzc2VydGlvbi1yZXRyaWVzJywgdGhpcy5wYXNzZWQpO1xuICAgIH1cblxuICAgIF93cmFwRnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHRQcm9taXNlID0gdGhpcy5jb21tYW5kLmFjdHVhbDtcblxuICAgICAgICAgICAgd2hpbGUgKCF0aGlzLnBhc3NlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZC5hY3R1YWwgPSBhd2FpdCByZXN1bHRQcm9taXNlLl9yZUV4ZWN1dGUoKTtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25FeGVjdXRpb25GaW5pc2hlZCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2dldFRpbWVMZWZ0KCkgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25FeGVjdXRpb25GaW5pc2hlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZGVsYXkoQVNTRVJUSU9OX0RFTEFZKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluUmV0cnkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3N0YXJ0LWFzc2VydGlvbi1yZXRyaWVzJywgdGhpcy5fZ2V0VGltZUxlZnQoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFzeW5jIHJ1biAoKSB7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5mbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGVyci5uYW1lID09PSAnQXNzZXJ0aW9uRXJyb3InIHx8IGVyci5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXNzZXJ0aW9uRXJyb3InKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeHRlcm5hbEFzc2VydGlvbkxpYnJhcnlFcnJvcihlcnIsIHRoaXMuY2FsbHNpdGUpO1xuXG4gICAgICAgICAgICBpZiAoZXJyLmlzVGVzdENhZmVFcnJvcilcbiAgICAgICAgICAgICAgICBlcnIuY2FsbHNpdGUgPSB0aGlzLmNhbGxzaXRlO1xuXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
