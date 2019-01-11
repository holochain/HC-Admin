'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _asyncEventEmitter = require('../utils/async-event-emitter');

var _asyncEventEmitter2 = _interopRequireDefault(_asyncEventEmitter);

var _testcafeLegacyApi = require('testcafe-legacy-api');

var _testRun = require('../test-run');

var _testRun2 = _interopRequireDefault(_testRun);

var _sessionController = require('../test-run/session-controller');

var _sessionController2 = _interopRequireDefault(_sessionController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const QUARANTINE_THRESHOLD = 3;
const DISCONNECT_THRESHOLD = 3;

class Quarantine {
    constructor() {
        this.attempts = [];
    }

    getFailedAttempts() {
        return this.attempts.filter(errors => !!errors.length);
    }

    getPassedAttempts() {
        return this.attempts.filter(errors => errors.length === 0);
    }

    getNextAttemptNumber() {
        return this.attempts.length + 1;
    }
}

class TestRunController extends _asyncEventEmitter2.default {
    constructor(test, index, proxy, screenshots, warningLog, fixtureHookController, opts) {
        super();

        this.test = test;
        this.index = index;
        this.opts = opts;

        this.proxy = proxy;
        this.screenshots = screenshots;
        this.warningLog = warningLog;
        this.fixtureHookController = fixtureHookController;

        this.TestRunCtor = TestRunController._getTestRunCtor(test, opts);

        this.testRun = null;
        this.done = false;
        this.quarantine = null;
        this.disconnectionCount = 0;

        if (this.opts.quarantineMode) this.quarantine = new Quarantine();
    }

    static _getTestRunCtor(test, opts) {
        if (opts.TestRunCtor) return opts.TestRunCtor;

        return test.isLegacy ? _testcafeLegacyApi.TestRun : _testRun2.default;
    }

    _createTestRun(connection) {
        const screenshotCapturer = this.screenshots.createCapturerFor(this.test, this.index, this.quarantine, connection, this.warningLog);
        const TestRunCtor = this.TestRunCtor;

        this.testRun = new TestRunCtor(this.test, connection, screenshotCapturer, this.warningLog, this.opts);

        if (this.testRun.addQuarantineInfo) this.testRun.addQuarantineInfo(this.quarantine);

        return this.testRun;
    }

    _endQuarantine() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this.quarantine.attempts.length > 1) _this.testRun.unstable = _this.quarantine.getPassedAttempts().length > 0;

            yield _this._emitTestRunDone();
        })();
    }

    _shouldKeepInQuarantine() {
        const errors = this.testRun.errs;
        const attempts = this.quarantine.attempts;

        attempts.push(errors);

        const failedTimes = this.quarantine.getFailedAttempts().length;
        const passedTimes = this.quarantine.getPassedAttempts().length;
        const hasErrors = !!errors.length;
        const isFirstAttempt = attempts.length === 1;
        const failedThresholdReached = failedTimes >= QUARANTINE_THRESHOLD;
        const passedThresholdReached = passedTimes >= QUARANTINE_THRESHOLD;

        return isFirstAttempt ? hasErrors : !failedThresholdReached && !passedThresholdReached;
    }

    _keepInQuarantine() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this2._restartTest();
        })();
    }

    _restartTest() {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.emit('test-run-restart');
        })();
    }

    _testRunDoneInQuarantineMode() {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this4._shouldKeepInQuarantine()) yield _this4._keepInQuarantine();else yield _this4._endQuarantine();
        })();
    }

    _testRunDone() {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this5.quarantine) yield _this5._testRunDoneInQuarantineMode();else yield _this5._emitTestRunDone();
        })();
    }

    _emitTestRunDone() {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            // NOTE: we should report test run completion in order they were completed in browser.
            // To keep a sequence after fixture hook execution we use completion queue.
            yield _this6.fixtureHookController.runFixtureAfterHookIfNecessary(_this6.testRun);

            _this6.done = true;

            yield _this6.emit('test-run-done');
        })();
    }

    _testRunDisconnected(connection) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this7.disconnectionCount++;

            if (_this7.disconnectionCount < DISCONNECT_THRESHOLD) {
                connection.suppressError();

                yield connection.restartBrowser();

                yield _this7._restartTest();
            }
        })();
    }

    get blocked() {
        return this.fixtureHookController.isTestBlocked(this.test);
    }

    start(connection) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const testRun = _this8._createTestRun(connection);

            const hookOk = yield _this8.fixtureHookController.runFixtureBeforeHookIfNecessary(testRun);

            if (_this8.test.skip || !hookOk) {
                yield _this8.emit('test-run-start');
                yield _this8._emitTestRunDone();
                return null;
            }

            testRun.once('start', function () {
                return _this8.emit('test-run-start');
            });
            testRun.once('done', function () {
                return _this8._testRunDone();
            });
            testRun.once('disconnected', function () {
                return _this8._testRunDisconnected(connection);
            });

            testRun.start();

            return _sessionController2.default.getSessionUrl(testRun, _this8.proxy);
        })();
    }
}
exports.default = TestRunController;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvdGVzdC1ydW4tY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJRVUFSQU5USU5FX1RIUkVTSE9MRCIsIkRJU0NPTk5FQ1RfVEhSRVNIT0xEIiwiUXVhcmFudGluZSIsImNvbnN0cnVjdG9yIiwiYXR0ZW1wdHMiLCJnZXRGYWlsZWRBdHRlbXB0cyIsImZpbHRlciIsImVycm9ycyIsImxlbmd0aCIsImdldFBhc3NlZEF0dGVtcHRzIiwiZ2V0TmV4dEF0dGVtcHROdW1iZXIiLCJUZXN0UnVuQ29udHJvbGxlciIsIkFzeW5jRXZlbnRFbWl0dGVyIiwidGVzdCIsImluZGV4IiwicHJveHkiLCJzY3JlZW5zaG90cyIsIndhcm5pbmdMb2ciLCJmaXh0dXJlSG9va0NvbnRyb2xsZXIiLCJvcHRzIiwiVGVzdFJ1bkN0b3IiLCJfZ2V0VGVzdFJ1bkN0b3IiLCJ0ZXN0UnVuIiwiZG9uZSIsInF1YXJhbnRpbmUiLCJkaXNjb25uZWN0aW9uQ291bnQiLCJxdWFyYW50aW5lTW9kZSIsImlzTGVnYWN5IiwiTGVnYWN5VGVzdFJ1biIsIlRlc3RSdW4iLCJfY3JlYXRlVGVzdFJ1biIsImNvbm5lY3Rpb24iLCJzY3JlZW5zaG90Q2FwdHVyZXIiLCJjcmVhdGVDYXB0dXJlckZvciIsImFkZFF1YXJhbnRpbmVJbmZvIiwiX2VuZFF1YXJhbnRpbmUiLCJ1bnN0YWJsZSIsIl9lbWl0VGVzdFJ1bkRvbmUiLCJfc2hvdWxkS2VlcEluUXVhcmFudGluZSIsImVycnMiLCJwdXNoIiwiZmFpbGVkVGltZXMiLCJwYXNzZWRUaW1lcyIsImhhc0Vycm9ycyIsImlzRmlyc3RBdHRlbXB0IiwiZmFpbGVkVGhyZXNob2xkUmVhY2hlZCIsInBhc3NlZFRocmVzaG9sZFJlYWNoZWQiLCJfa2VlcEluUXVhcmFudGluZSIsIl9yZXN0YXJ0VGVzdCIsImVtaXQiLCJfdGVzdFJ1bkRvbmVJblF1YXJhbnRpbmVNb2RlIiwiX3Rlc3RSdW5Eb25lIiwicnVuRml4dHVyZUFmdGVySG9va0lmTmVjZXNzYXJ5IiwiX3Rlc3RSdW5EaXNjb25uZWN0ZWQiLCJzdXBwcmVzc0Vycm9yIiwicmVzdGFydEJyb3dzZXIiLCJibG9ja2VkIiwiaXNUZXN0QmxvY2tlZCIsInN0YXJ0IiwiaG9va09rIiwicnVuRml4dHVyZUJlZm9yZUhvb2tJZk5lY2Vzc2FyeSIsInNraXAiLCJvbmNlIiwiU2Vzc2lvbkNvbnRyb2xsZXIiLCJnZXRTZXNzaW9uVXJsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTUEsdUJBQXVCLENBQTdCO0FBQ0EsTUFBTUMsdUJBQXVCLENBQTdCOztBQUVBLE1BQU1DLFVBQU4sQ0FBaUI7QUFDYkMsa0JBQWU7QUFDWCxhQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0g7O0FBRURDLHdCQUFxQjtBQUNqQixlQUFPLEtBQUtELFFBQUwsQ0FBY0UsTUFBZCxDQUFxQkMsVUFBVSxDQUFDLENBQUNBLE9BQU9DLE1BQXhDLENBQVA7QUFDSDs7QUFFREMsd0JBQXFCO0FBQ2pCLGVBQU8sS0FBS0wsUUFBTCxDQUFjRSxNQUFkLENBQXFCQyxVQUFVQSxPQUFPQyxNQUFQLEtBQWtCLENBQWpELENBQVA7QUFDSDs7QUFFREUsMkJBQXdCO0FBQ3BCLGVBQU8sS0FBS04sUUFBTCxDQUFjSSxNQUFkLEdBQXVCLENBQTlCO0FBQ0g7QUFmWTs7QUFrQkYsTUFBTUcsaUJBQU4sU0FBZ0NDLDJCQUFoQyxDQUFrRDtBQUM3RFQsZ0JBQWFVLElBQWIsRUFBbUJDLEtBQW5CLEVBQTBCQyxLQUExQixFQUFpQ0MsV0FBakMsRUFBOENDLFVBQTlDLEVBQTBEQyxxQkFBMUQsRUFBaUZDLElBQWpGLEVBQXVGO0FBQ25GOztBQUVBLGFBQUtOLElBQUwsR0FBYUEsSUFBYjtBQUNBLGFBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLGFBQUtLLElBQUwsR0FBYUEsSUFBYjs7QUFFQSxhQUFLSixLQUFMLEdBQTZCQSxLQUE3QjtBQUNBLGFBQUtDLFdBQUwsR0FB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LHNCQUFNLE9BQUtWLElBQUwsQ0FBVSxnQkFBVixDQUFOO0FBQ0Esc0JBQU0sT0FBS1osZ0JBQUwsRUFBTjtBQUNBLHVCQUFPLElBQVA7QUFDSDs7QUFFRGYsb0JBQVF3QyxJQUFSLENBQWEsT0FBYixFQUFzQjtBQUFBLHVCQUFNLE9BQUtiLElBQUwsQ0FBVSxnQkFBVixDQUFOO0FBQUEsYUFBdEI7QUFDQTNCLG9CQUFRd0MsSUFBUixDQUFhLE1BQWIsRUFBcUI7QUFBQSx1QkFBTSxPQUFLWCxZQUFMLEVBQU47QUFBQSxhQUFyQjtBQUNBN0Isb0JBQVF3QyxJQUFSLENBQWEsY0FBYixFQUE2QjtBQUFBLHVCQUFNLE9BQUtULG9CQUFMLENBQTBCdEIsVUFBMUIsQ0FBTjtBQUFBLGFBQTdCOztBQUVBVCxvQkFBUW9DLEtBQVI7O0FBRUEsbUJBQU9LLDRCQUFrQkMsYUFBbEIsQ0FBZ0MxQyxPQUFoQyxFQUF5QyxPQUFLUCxLQUE5QyxDQUFQO0FBakJxQjtBQWtCeEI7QUFwSTREO2tCQUE1Q0osaUIiLCJmaWxlIjoicnVubmVyL3Rlc3QtcnVuLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXN5bmNFdmVudEVtaXR0ZXIgZnJvbSAnLi4vdXRpbHMvYXN5bmMtZXZlbnQtZW1pdHRlcic7XG5pbXBvcnQgeyBUZXN0UnVuIGFzIExlZ2FjeVRlc3RSdW4gfSBmcm9tICd0ZXN0Y2FmZS1sZWdhY3ktYXBpJztcbmltcG9ydCBUZXN0UnVuIGZyb20gJy4uL3Rlc3QtcnVuJztcbmltcG9ydCBTZXNzaW9uQ29udHJvbGxlciBmcm9tICcuLi90ZXN0LXJ1bi9zZXNzaW9uLWNvbnRyb2xsZXInO1xuXG5jb25zdCBRVUFSQU5USU5FX1RIUkVTSE9MRCA9IDM7XG5jb25zdCBESVNDT05ORUNUX1RIUkVTSE9MRCA9IDM7XG5cbmNsYXNzIFF1YXJhbnRpbmUge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5hdHRlbXB0cyA9IFtdO1xuICAgIH1cblxuICAgIGdldEZhaWxlZEF0dGVtcHRzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0ZW1wdHMuZmlsdGVyKGVycm9ycyA9PiAhIWVycm9ycy5sZW5ndGgpO1xuICAgIH1cblxuICAgIGdldFBhc3NlZEF0dGVtcHRzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0ZW1wdHMuZmlsdGVyKGVycm9ycyA9PiBlcnJvcnMubGVuZ3RoID09PSAwKTtcbiAgICB9XG5cbiAgICBnZXROZXh0QXR0ZW1wdE51bWJlciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dGVtcHRzLmxlbmd0aCArIDE7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0UnVuQ29udHJvbGxlciBleHRlbmRzIEFzeW5jRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvciAodGVzdCwgaW5kZXgsIHByb3h5LCBzY3JlZW5zaG90cywgd2FybmluZ0xvZywgZml4dHVyZUhvb2tDb250cm9sbGVyLCBvcHRzKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy50ZXN0ICA9IHRlc3Q7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5vcHRzICA9IG9wdHM7XG5cbiAgICAgICAgdGhpcy5wcm94eSAgICAgICAgICAgICAgICAgPSBwcm94eTtcbiAgICAgICAgdGhpcy5zY3JlZW5zaG90cyAgICAgICAgICAgPSBzY3JlZW5zaG90cztcbiAgICAgICAgdGhpcy53YXJuaW5nTG9nICAgICAgICAgICAgPSB3YXJuaW5nTG9nO1xuICAgICAgICB0aGlzLmZpeHR1cmVIb29rQ29udHJvbGxlciA9IGZpeHR1cmVIb29rQ29udHJvbGxlcjtcblxuICAgICAgICB0aGlzLlRlc3RSdW5DdG9yID0gVGVzdFJ1bkNvbnRyb2xsZXIuX2dldFRlc3RSdW5DdG9yKHRlc3QsIG9wdHMpO1xuXG4gICAgICAgIHRoaXMudGVzdFJ1biAgICAgICAgICAgID0gbnVsbDtcbiAgICAgICAgdGhpcy5kb25lICAgICAgICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5xdWFyYW50aW5lICAgICAgICAgPSBudWxsO1xuICAgICAgICB0aGlzLmRpc2Nvbm5lY3Rpb25Db3VudCA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0cy5xdWFyYW50aW5lTW9kZSlcbiAgICAgICAgICAgIHRoaXMucXVhcmFudGluZSA9IG5ldyBRdWFyYW50aW5lKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIF9nZXRUZXN0UnVuQ3RvciAodGVzdCwgb3B0cykge1xuICAgICAgICBpZiAob3B0cy5UZXN0UnVuQ3RvcilcbiAgICAgICAgICAgIHJldHVybiBvcHRzLlRlc3RSdW5DdG9yO1xuXG4gICAgICAgIHJldHVybiB0ZXN0LmlzTGVnYWN5ID8gTGVnYWN5VGVzdFJ1biA6IFRlc3RSdW47XG4gICAgfVxuXG4gICAgX2NyZWF0ZVRlc3RSdW4gKGNvbm5lY3Rpb24pIHtcbiAgICAgICAgY29uc3Qgc2NyZWVuc2hvdENhcHR1cmVyID0gdGhpcy5zY3JlZW5zaG90cy5jcmVhdGVDYXB0dXJlckZvcih0aGlzLnRlc3QsIHRoaXMuaW5kZXgsIHRoaXMucXVhcmFudGluZSwgY29ubmVjdGlvbiwgdGhpcy53YXJuaW5nTG9nKTtcbiAgICAgICAgY29uc3QgVGVzdFJ1bkN0b3IgICAgICAgID0gdGhpcy5UZXN0UnVuQ3RvcjtcblxuICAgICAgICB0aGlzLnRlc3RSdW4gPSBuZXcgVGVzdFJ1bkN0b3IodGhpcy50ZXN0LCBjb25uZWN0aW9uLCBzY3JlZW5zaG90Q2FwdHVyZXIsIHRoaXMud2FybmluZ0xvZywgdGhpcy5vcHRzKTtcblxuICAgICAgICBpZiAodGhpcy50ZXN0UnVuLmFkZFF1YXJhbnRpbmVJbmZvKVxuICAgICAgICAgICAgdGhpcy50ZXN0UnVuLmFkZFF1YXJhbnRpbmVJbmZvKHRoaXMucXVhcmFudGluZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudGVzdFJ1bjtcbiAgICB9XG5cbiAgICBhc3luYyBfZW5kUXVhcmFudGluZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLnF1YXJhbnRpbmUuYXR0ZW1wdHMubGVuZ3RoID4gMSlcbiAgICAgICAgICAgIHRoaXMudGVzdFJ1bi51bnN0YWJsZSA9IHRoaXMucXVhcmFudGluZS5nZXRQYXNzZWRBdHRlbXB0cygpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5fZW1pdFRlc3RSdW5Eb25lKCk7XG4gICAgfVxuXG4gICAgX3Nob3VsZEtlZXBJblF1YXJhbnRpbmUgKCkge1xuICAgICAgICBjb25zdCBlcnJvcnMgICA9IHRoaXMudGVzdFJ1bi5lcnJzO1xuICAgICAgICBjb25zdCBhdHRlbXB0cyA9IHRoaXMucXVhcmFudGluZS5hdHRlbXB0cztcblxuICAgICAgICBhdHRlbXB0cy5wdXNoKGVycm9ycyk7XG5cbiAgICAgICAgY29uc3QgZmFpbGVkVGltZXMgICAgICAgICAgICA9IHRoaXMucXVhcmFudGluZS5nZXRGYWlsZWRBdHRlbXB0cygpLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcGFzc2VkVGltZXMgICAgICAgICAgICA9IHRoaXMucXVhcmFudGluZS5nZXRQYXNzZWRBdHRlbXB0cygpLmxlbmd0aDtcbiAgICAgICAgY29uc3QgaGFzRXJyb3JzICAgICAgICAgICAgICA9ICEhZXJyb3JzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgaXNGaXJzdEF0dGVtcHQgICAgICAgICA9IGF0dGVtcHRzLmxlbmd0aCA9PT0gMTtcbiAgICAgICAgY29uc3QgZmFpbGVkVGhyZXNob2xkUmVhY2hlZCA9IGZhaWxlZFRpbWVzID49IFFVQVJBTlRJTkVfVEhSRVNIT0xEO1xuICAgICAgICBjb25zdCBwYXNzZWRUaHJlc2hvbGRSZWFjaGVkID0gcGFzc2VkVGltZXMgPj0gUVVBUkFOVElORV9USFJFU0hPTEQ7XG5cbiAgICAgICAgcmV0dXJuIGlzRmlyc3RBdHRlbXB0ID8gaGFzRXJyb3JzIDogIWZhaWxlZFRocmVzaG9sZFJlYWNoZWQgJiYgIXBhc3NlZFRocmVzaG9sZFJlYWNoZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgX2tlZXBJblF1YXJhbnRpbmUgKCkge1xuICAgICAgICBhd2FpdCB0aGlzLl9yZXN0YXJ0VGVzdCgpO1xuICAgIH1cblxuICAgIGFzeW5jIF9yZXN0YXJ0VGVzdCAoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZW1pdCgndGVzdC1ydW4tcmVzdGFydCcpO1xuICAgIH1cblxuICAgIGFzeW5jIF90ZXN0UnVuRG9uZUluUXVhcmFudGluZU1vZGUgKCkge1xuICAgICAgICBpZiAodGhpcy5fc2hvdWxkS2VlcEluUXVhcmFudGluZSgpKVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fa2VlcEluUXVhcmFudGluZSgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9lbmRRdWFyYW50aW5lKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgX3Rlc3RSdW5Eb25lICgpIHtcbiAgICAgICAgaWYgKHRoaXMucXVhcmFudGluZSlcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3Rlc3RSdW5Eb25lSW5RdWFyYW50aW5lTW9kZSgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9lbWl0VGVzdFJ1bkRvbmUoKTtcbiAgICB9XG5cbiAgICBhc3luYyBfZW1pdFRlc3RSdW5Eb25lICgpIHtcbiAgICAgICAgLy8gTk9URTogd2Ugc2hvdWxkIHJlcG9ydCB0ZXN0IHJ1biBjb21wbGV0aW9uIGluIG9yZGVyIHRoZXkgd2VyZSBjb21wbGV0ZWQgaW4gYnJvd3Nlci5cbiAgICAgICAgLy8gVG8ga2VlcCBhIHNlcXVlbmNlIGFmdGVyIGZpeHR1cmUgaG9vayBleGVjdXRpb24gd2UgdXNlIGNvbXBsZXRpb24gcXVldWUuXG4gICAgICAgIGF3YWl0IHRoaXMuZml4dHVyZUhvb2tDb250cm9sbGVyLnJ1bkZpeHR1cmVBZnRlckhvb2tJZk5lY2Vzc2FyeSh0aGlzLnRlc3RSdW4pO1xuXG4gICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCd0ZXN0LXJ1bi1kb25lJyk7XG4gICAgfVxuXG4gICAgYXN5bmMgX3Rlc3RSdW5EaXNjb25uZWN0ZWQgKGNvbm5lY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0aW9uQ291bnQrKztcblxuICAgICAgICBpZiAodGhpcy5kaXNjb25uZWN0aW9uQ291bnQgPCBESVNDT05ORUNUX1RIUkVTSE9MRCkge1xuICAgICAgICAgICAgY29ubmVjdGlvbi5zdXBwcmVzc0Vycm9yKCk7XG5cbiAgICAgICAgICAgIGF3YWl0IGNvbm5lY3Rpb24ucmVzdGFydEJyb3dzZXIoKTtcblxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fcmVzdGFydFRlc3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBibG9ja2VkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZml4dHVyZUhvb2tDb250cm9sbGVyLmlzVGVzdEJsb2NrZWQodGhpcy50ZXN0KTtcbiAgICB9XG5cbiAgICBhc3luYyBzdGFydCAoY29ubmVjdGlvbikge1xuICAgICAgICBjb25zdCB0ZXN0UnVuID0gdGhpcy5fY3JlYXRlVGVzdFJ1bihjb25uZWN0aW9uKTtcblxuICAgICAgICBjb25zdCBob29rT2sgPSBhd2FpdCB0aGlzLmZpeHR1cmVIb29rQ29udHJvbGxlci5ydW5GaXh0dXJlQmVmb3JlSG9va0lmTmVjZXNzYXJ5KHRlc3RSdW4pO1xuXG4gICAgICAgIGlmICh0aGlzLnRlc3Quc2tpcCB8fCAhaG9va09rKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmVtaXQoJ3Rlc3QtcnVuLXN0YXJ0Jyk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9lbWl0VGVzdFJ1bkRvbmUoKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGVzdFJ1bi5vbmNlKCdzdGFydCcsICgpID0+IHRoaXMuZW1pdCgndGVzdC1ydW4tc3RhcnQnKSk7XG4gICAgICAgIHRlc3RSdW4ub25jZSgnZG9uZScsICgpID0+IHRoaXMuX3Rlc3RSdW5Eb25lKCkpO1xuICAgICAgICB0ZXN0UnVuLm9uY2UoJ2Rpc2Nvbm5lY3RlZCcsICgpID0+IHRoaXMuX3Rlc3RSdW5EaXNjb25uZWN0ZWQoY29ubmVjdGlvbikpO1xuXG4gICAgICAgIHRlc3RSdW4uc3RhcnQoKTtcblxuICAgICAgICByZXR1cm4gU2Vzc2lvbkNvbnRyb2xsZXIuZ2V0U2Vzc2lvblVybCh0ZXN0UnVuLCB0aGlzLnByb3h5KTtcbiAgICB9XG59XG4iXX0=
