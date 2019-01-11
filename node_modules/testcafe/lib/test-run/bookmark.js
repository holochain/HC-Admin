'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _phase = require('../test-run/phase');

var _phase2 = _interopRequireDefault(_phase);

var _type = require('../errors/test-run/type');

var _type2 = _interopRequireDefault(_type);

var _actions = require('./commands/actions');

var _testRun = require('../errors/test-run');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TestRunBookmark {
    constructor(testRun, role) {
        this.testRun = testRun;
        this.role = role;

        this.url = 'about:blank';
        this.dialogHandler = testRun.activeDialogHandler;
        this.iframeSelector = testRun.activeIframeSelector;
        this.speed = testRun.speed;
        this.pageLoadTimeout = testRun.pageLoadTimeout;
        this.ctx = testRun.ctx;
        this.fixtureCtx = testRun.fixtureCtx;
        this.consoleMessages = testRun.consoleMessages;
    }

    init() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this.testRun.activeIframeSelector) yield _this.testRun.executeCommand(new _actions.SwitchToMainWindowCommand());

            if (!_this.role.opts.preserveUrl) _this.url = yield _this.testRun.getCurrentUrl();
        })();
    }

    _restoreDialogHandler() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this2.testRun.activeDialogHandler !== _this2.dialogHandler) {
                const restoreDialogCommand = new _actions.SetNativeDialogHandlerCommand({ dialogHandler: { fn: _this2.dialogHandler } });

                yield _this2.testRun.executeCommand(restoreDialogCommand);
            }
        })();
    }

    _restoreSpeed() {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this3.testRun.speed !== _this3.speed) {
                const restoreSpeedCommand = new _actions.SetTestSpeedCommand({ speed: _this3.speed });

                yield _this3.testRun.executeCommand(restoreSpeedCommand);
            }
        })();
    }

    _restorePageLoadTimeout() {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this4.testRun.pageLoadTimeout !== _this4.pageLoadTimeout) {
                const restorePageLoadTimeoutCommand = new _actions.SetPageLoadTimeoutCommand({ duration: _this4.pageLoadTimeout });

                yield _this4.testRun.executeCommand(restorePageLoadTimeoutCommand);
            }
        })();
    }

    _restoreWorkingFrame() {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this5.testRun.activeIframeSelector !== _this5.iframeSelector) {
                const switchWorkingFrameCommand = _this5.iframeSelector ? new _actions.SwitchToIframeCommand({ selector: _this5.iframeSelector }) : new _actions.SwitchToMainWindowCommand();

                try {
                    yield _this5.testRun.executeCommand(switchWorkingFrameCommand);
                } catch (err) {
                    if (err.type === _type2.default.actionElementNotFoundError) throw new _testRun.CurrentIframeNotFoundError();

                    if (err.type === _type2.default.actionIframeIsNotLoadedError) throw new _testRun.CurrentIframeIsNotLoadedError();

                    throw err;
                }
            }
        })();
    }

    _restorePage(url, stateSnapshot) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const navigateCommand = new _actions.NavigateToCommand({ url, stateSnapshot });

            yield _this6.testRun.executeCommand(navigateCommand);
        })();
    }

    restore(callsite, stateSnapshot) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const prevPhase = _this7.testRun.phase;

            _this7.testRun.phase = _phase2.default.inBookmarkRestore;

            _this7.testRun.ctx = _this7.ctx;
            _this7.testRun.fixtureCtx = _this7.fixtureCtx;
            _this7.testRun.consoleMessages = _this7.consoleMessages;

            try {
                yield _this7._restoreSpeed();
                yield _this7._restorePageLoadTimeout();
                yield _this7._restoreDialogHandler();

                const preserveUrl = _this7.role.opts.preserveUrl;
                const url = preserveUrl ? _this7.role.url : _this7.url;

                yield _this7._restorePage(url, (0, _stringify2.default)(stateSnapshot));

                if (!preserveUrl) yield _this7._restoreWorkingFrame();
            } catch (err) {
                err.callsite = callsite;

                throw err;
            }

            _this7.testRun.phase = prevPhase;
        })();
    }
}
exports.default = TestRunBookmark;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LXJ1bi9ib29rbWFyay5qcyJdLCJuYW1lcyI6WyJUZXN0UnVuQm9va21hcmsiLCJjb25zdHJ1Y3RvciIsInRlc3RSdW4iLCJyb2xlIiwidXJsIiwiZGlhbG9nSGFuZGxlciIsImFjdGl2ZURpYWxvZ0hhbmRsZXIiLCJpZnJhbWVTZWxlY3RvciIsImFjdGl2ZUlmcmFtZVNlbGVjdG9yIiwic3BlZWQiLCJwYWdlTG9hZFRpbWVvdXQiLCJjdHgiLCJmaXh0dXJlQ3R4IiwiY29uc29sZU1lc3NhZ2VzIiwiaW5pdCIsImV4ZWN1dGVDb21tYW5kIiwiU3dpdGNoVG9NYWluV2luZG93Q29tbWFuZCIsIm9wdHMiLCJwcmVzZXJ2ZVVybCIsImdldEN1cnJlbnRVcmwiLCJfcmVzdG9yZURpYWxvZ0hhbmRsZXIiLCJyZXN0b3JlRGlhbG9nQ29tbWFuZCIsIlNldE5hdGl2ZURpYWxvZ0hhbmRsZXJDb21tYW5kIiwiZm4iLCJfcmVzdG9yZVNwZWVkIiwicmVzdG9yZVNwZWVkQ29tbWFuZCIsIlNldFRlc3RTcGVlZENvbW1hbmQiLCJfcmVzdG9yZVBhZ2VMb2FkVGltZW91dCIsInJlc3RvcmVQYWdlTG9hZFRpbWVvdXRDb21tYW5kIiwiU2V0UGFnZUxvYWRUaW1lb3V0Q29tbWFuZCIsImR1cmF0aW9uIiwiX3Jlc3RvcmVXb3JraW5nRnJhbWUiLCJzd2l0Y2hXb3JraW5nRnJhbWVDb21tYW5kIiwiU3dpdGNoVG9JZnJhbWVDb21tYW5kIiwic2VsZWN0b3IiLCJlcnIiLCJ0eXBlIiwiRVJSX1RZUEUiLCJhY3Rpb25FbGVtZW50Tm90Rm91bmRFcnJvciIsIkN1cnJlbnRJZnJhbWVOb3RGb3VuZEVycm9yIiwiYWN0aW9uSWZyYW1lSXNOb3RMb2FkZWRFcnJvciIsIkN1cnJlbnRJZnJhbWVJc05vdExvYWRlZEVycm9yIiwiX3Jlc3RvcmVQYWdlIiwic3RhdGVTbmFwc2hvdCIsIm5hdmlnYXRlQ29tbWFuZCIsIk5hdmlnYXRlVG9Db21tYW5kIiwicmVzdG9yZSIsImNhbGxzaXRlIiwicHJldlBoYXNlIiwicGhhc2UiLCJURVNUX1JVTl9QSEFTRSIsImluQm9va21hcmtSZXN0b3JlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7O0FBU0E7Ozs7QUFNZSxNQUFNQSxlQUFOLENBQXNCO0FBQ2pDQyxnQkFBYUMsT0FBYixFQUFzQkMsSUFBdEIsRUFBNEI7QUFDeEIsYUFBS0QsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsYUFBS0MsSUFBTCxHQUFlQSxJQUFmOztBQUVBLGFBQUtDLEdBQUwsR0FBdUIsYUFBdkI7QUFDQSxhQUFLQyxhQUFMLEdBQXVCSCxRQUFRSSxtQkFBL0I7QUFDQSxhQUFLQyxjQUFMLEdBQXVCTCxRQUFRTSxvQkFBL0I7QUFDQSxhQUFLQyxLQUFMLEdBQXVCUCxRQUFRTyxLQUEvQjtBQUNBLGFBQUtDLGVBQUwsR0FBdUJSLFFBQVFRLGVBQS9CO0FBQ0EsYUFBS0MsR0FBTCxHQUF1QlQsUUFBUVMsR0FBL0I7QUFDQSxhQUFLQyxVQUFMLEdBQXVCVixRQUFRVSxVQUEvQjtBQUNBLGFBQUtDLGVBQUwsR0FBdUJYLFFBQVFXLGVBQS9CO0FBQ0g7O0FBRUtDLFFBQU4sR0FBYztBQUFBOztBQUFBO0FBQ1YsZ0JBQUksTUFBS1osT0FBTCxDQUFhTSxvQkFBakIsRUFDSSxNQUFNLE1BQUtOLE9BQUwsQ0FBYWEsY0FBYixDQUE0QixJQUFJQyxrQ0FBSixFQUE1QixDQUFOOztBQUVKLGdCQUFJLENBQUMsTUFBS2IsSUFBTCxDQUFVYyxJQUFWLENBQWVDLFdBQXBCLEVBQ0ksTUFBS2QsR0FBTCxHQUFXLE1BQU0sTUFBS0YsT0FBTCxDQUFhaUIsYUFBYixFQUFqQjtBQUxNO0FBTWI7O0FBRUtDLHlCQUFOLEdBQStCO0FBQUE7O0FBQUE7QUFDM0IsZ0JBQUksT0FBS2xCLE9BQUwsQ0FBYUksbUJBQWIsS0FBcUMsT0FBS0QsYUFBOUMsRUFBNkQ7QUFDekQsc0JBQU1nQix1QkFBdUIsSUFBSUMsc0NBQUosQ0FBa0MsRUFBRWpCLGVB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QixFQUF1Qix5QkFBZXVDLGFBQWYsQ0FBdkIsQ0FBTjs7QUFFQSxvQkFBSSxDQUFDekIsV0FBTCxFQUNJLE1BQU0sT0FBS2Esb0JBQUwsRUFBTjtBQUNQLGFBWkQsQ0FhQSxPQUFPSSxHQUFQLEVBQVk7QUFDUkEsb0JBQUlZLFFBQUosR0FBZUEsUUFBZjs7QUFFQSxzQkFBTVosR0FBTjtBQUNIOztBQUVELG1CQUFLakMsT0FBTCxDQUFhK0MsS0FBYixHQUFxQkQsU0FBckI7QUE1Qm9DO0FBNkJ2QztBQXZHZ0M7a0JBQWhCaEQsZSIsImZpbGUiOiJ0ZXN0LXJ1bi9ib29rbWFyay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBURVNUX1JVTl9QSEFTRSBmcm9tICcuLi90ZXN0LXJ1bi9waGFzZSc7XG5pbXBvcnQgRVJSX1RZUEUgZnJvbSAnLi4vZXJyb3JzL3Rlc3QtcnVuL3R5cGUnO1xuXG5pbXBvcnQge1xuICAgIFN3aXRjaFRvTWFpbldpbmRvd0NvbW1hbmQsXG4gICAgU3dpdGNoVG9JZnJhbWVDb21tYW5kLFxuICAgIFNldE5hdGl2ZURpYWxvZ0hhbmRsZXJDb21tYW5kLFxuICAgIFNldFRlc3RTcGVlZENvbW1hbmQsXG4gICAgU2V0UGFnZUxvYWRUaW1lb3V0Q29tbWFuZCxcbiAgICBOYXZpZ2F0ZVRvQ29tbWFuZFxufSBmcm9tICcuL2NvbW1hbmRzL2FjdGlvbnMnO1xuXG5pbXBvcnQge1xuICAgIEN1cnJlbnRJZnJhbWVOb3RGb3VuZEVycm9yLFxuICAgIEN1cnJlbnRJZnJhbWVJc05vdExvYWRlZEVycm9yXG59IGZyb20gJy4uL2Vycm9ycy90ZXN0LXJ1bic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVzdFJ1bkJvb2ttYXJrIHtcbiAgICBjb25zdHJ1Y3RvciAodGVzdFJ1biwgcm9sZSkge1xuICAgICAgICB0aGlzLnRlc3RSdW4gPSB0ZXN0UnVuO1xuICAgICAgICB0aGlzLnJvbGUgICAgPSByb2xlO1xuXG4gICAgICAgIHRoaXMudXJsICAgICAgICAgICAgID0gJ2Fib3V0OmJsYW5rJztcbiAgICAgICAgdGhpcy5kaWFsb2dIYW5kbGVyICAgPSB0ZXN0UnVuLmFjdGl2ZURpYWxvZ0hhbmRsZXI7XG4gICAgICAgIHRoaXMuaWZyYW1lU2VsZWN0b3IgID0gdGVzdFJ1bi5hY3RpdmVJZnJhbWVTZWxlY3RvcjtcbiAgICAgICAgdGhpcy5zcGVlZCAgICAgICAgICAgPSB0ZXN0UnVuLnNwZWVkO1xuICAgICAgICB0aGlzLnBhZ2VMb2FkVGltZW91dCA9IHRlc3RSdW4ucGFnZUxvYWRUaW1lb3V0O1xuICAgICAgICB0aGlzLmN0eCAgICAgICAgICAgICA9IHRlc3RSdW4uY3R4O1xuICAgICAgICB0aGlzLmZpeHR1cmVDdHggICAgICA9IHRlc3RSdW4uZml4dHVyZUN0eDtcbiAgICAgICAgdGhpcy5jb25zb2xlTWVzc2FnZXMgPSB0ZXN0UnVuLmNvbnNvbGVNZXNzYWdlcztcbiAgICB9XG5cbiAgICBhc3luYyBpbml0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMudGVzdFJ1bi5hY3RpdmVJZnJhbWVTZWxlY3RvcilcbiAgICAgICAgICAgIGF3YWl0IHRoaXMudGVzdFJ1bi5leGVjdXRlQ29tbWFuZChuZXcgU3dpdGNoVG9NYWluV2luZG93Q29tbWFuZCgpKTtcblxuICAgICAgICBpZiAoIXRoaXMucm9sZS5vcHRzLnByZXNlcnZlVXJsKVxuICAgICAgICAgICAgdGhpcy51cmwgPSBhd2FpdCB0aGlzLnRlc3RSdW4uZ2V0Q3VycmVudFVybCgpO1xuICAgIH1cblxuICAgIGFzeW5jIF9yZXN0b3JlRGlhbG9nSGFuZGxlciAoKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3RSdW4uYWN0aXZlRGlhbG9nSGFuZGxlciAhPT0gdGhpcy5kaWFsb2dIYW5kbGVyKSB7XG4gICAgICAgICAgICBjb25zdCByZXN0b3JlRGlhbG9nQ29tbWFuZCA9IG5ldyBTZXROYXRpdmVEaWFsb2dIYW5kbGVyQ29tbWFuZCh7IGRpYWxvZ0hhbmRsZXI6IHsgZm46IHRoaXMuZGlhbG9nSGFuZGxlciB9IH0pO1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnRlc3RSdW4uZXhlY3V0ZUNvbW1hbmQocmVzdG9yZURpYWxvZ0NvbW1hbmQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgX3Jlc3RvcmVTcGVlZCAoKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3RSdW4uc3BlZWQgIT09IHRoaXMuc3BlZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3RvcmVTcGVlZENvbW1hbmQgPSBuZXcgU2V0VGVzdFNwZWVkQ29tbWFuZCh7IHNwZWVkOiB0aGlzLnNwZWVkIH0pO1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnRlc3RSdW4uZXhlY3V0ZUNvbW1hbmQocmVzdG9yZVNwZWVkQ29tbWFuZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBfcmVzdG9yZVBhZ2VMb2FkVGltZW91dCAoKSB7XG4gICAgICAgIGlmICh0aGlzLnRlc3RSdW4ucGFnZUxvYWRUaW1lb3V0ICE9PSB0aGlzLnBhZ2VMb2FkVGltZW91dCkge1xuICAgICAgICAgICAgY29uc3QgcmVzdG9yZVBhZ2VMb2FkVGltZW91dENvbW1hbmQgPSBuZXcgU2V0UGFnZUxvYWRUaW1lb3V0Q29tbWFuZCh7IGR1cmF0aW9uOiB0aGlzLnBhZ2VMb2FkVGltZW91dCB9KTtcblxuICAgICAgICAgICAgYXdhaXQgdGhpcy50ZXN0UnVuLmV4ZWN1dGVDb21tYW5kKHJlc3RvcmVQYWdlTG9hZFRpbWVvdXRDb21tYW5kKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIF9yZXN0b3JlV29ya2luZ0ZyYW1lICgpIHtcbiAgICAgICAgaWYgKHRoaXMudGVzdFJ1bi5hY3RpdmVJZnJhbWVTZWxlY3RvciAhPT0gdGhpcy5pZnJhbWVTZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc3Qgc3dpdGNoV29ya2luZ0ZyYW1lQ29tbWFuZCA9IHRoaXMuaWZyYW1lU2VsZWN0b3IgP1xuICAgICAgICAgICAgICAgIG5ldyBTd2l0Y2hUb0lmcmFtZUNvbW1hbmQoeyBzZWxlY3RvcjogdGhpcy5pZnJhbWVTZWxlY3RvciB9KSA6XG4gICAgICAgICAgICAgICAgbmV3IFN3aXRjaFRvTWFpbldpbmRvd0NvbW1hbmQoKTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnRlc3RSdW4uZXhlY3V0ZUNvbW1hbmQoc3dpdGNoV29ya2luZ0ZyYW1lQ29tbWFuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci50eXBlID09PSBFUlJfVFlQRS5hY3Rpb25FbGVtZW50Tm90Rm91bmRFcnJvcilcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEN1cnJlbnRJZnJhbWVOb3RGb3VuZEVycm9yKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyLnR5cGUgPT09IEVSUl9UWVBFLmFjdGlvbklmcmFtZUlzTm90TG9hZGVkRXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBDdXJyZW50SWZyYW1lSXNOb3RMb2FkZWRFcnJvcigpO1xuXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgX3Jlc3RvcmVQYWdlICh1cmwsIHN0YXRlU25hcHNob3QpIHtcbiAgICAgICAgY29uc3QgbmF2aWdhdGVDb21tYW5kID0gbmV3IE5hdmlnYXRlVG9Db21tYW5kKHsgdXJsLCBzdGF0ZVNuYXBzaG90IH0pO1xuXG4gICAgICAgIGF3YWl0IHRoaXMudGVzdFJ1bi5leGVjdXRlQ29tbWFuZChuYXZpZ2F0ZUNvbW1hbmQpO1xuICAgIH1cblxuICAgIGFzeW5jIHJlc3RvcmUgKGNhbGxzaXRlLCBzdGF0ZVNuYXBzaG90KSB7XG4gICAgICAgIGNvbnN0IHByZXZQaGFzZSA9IHRoaXMudGVzdFJ1bi5waGFzZTtcblxuICAgICAgICB0aGlzLnRlc3RSdW4ucGhhc2UgPSBURVNUX1JVTl9QSEFTRS5pbkJvb2ttYXJrUmVzdG9yZTtcblxuICAgICAgICB0aGlzLnRlc3RSdW4uY3R4ICAgICAgICAgICAgID0gdGhpcy5jdHg7XG4gICAgICAgIHRoaXMudGVzdFJ1bi5maXh0dXJlQ3R4ICAgICAgPSB0aGlzLmZpeHR1cmVDdHg7XG4gICAgICAgIHRoaXMudGVzdFJ1bi5jb25zb2xlTWVzc2FnZXMgPSB0aGlzLmNvbnNvbGVNZXNzYWdlcztcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVzdG9yZVNwZWVkKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9yZXN0b3JlUGFnZUxvYWRUaW1lb3V0KCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9yZXN0b3JlRGlhbG9nSGFuZGxlcigpO1xuXG4gICAgICAgICAgICBjb25zdCBwcmVzZXJ2ZVVybCA9IHRoaXMucm9sZS5vcHRzLnByZXNlcnZlVXJsO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gcHJlc2VydmVVcmwgPyB0aGlzLnJvbGUudXJsIDogdGhpcy51cmw7XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3Jlc3RvcmVQYWdlKHVybCwgSlNPTi5zdHJpbmdpZnkoc3RhdGVTbmFwc2hvdCkpO1xuXG4gICAgICAgICAgICBpZiAoIXByZXNlcnZlVXJsKVxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3Jlc3RvcmVXb3JraW5nRnJhbWUoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnIuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcblxuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50ZXN0UnVuLnBoYXNlID0gcHJldlBoYXNlO1xuICAgIH1cbn1cbiJdfQ==
