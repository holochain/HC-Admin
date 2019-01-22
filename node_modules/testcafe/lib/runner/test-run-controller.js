'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

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

class TestRunController extends _events2.default {
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
        this._restartTest();
    }

    _restartTest() {
        this.emit('test-run-restart');
    }

    _testRunDoneInQuarantineMode() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this2._shouldKeepInQuarantine()) _this2._keepInQuarantine();else yield _this2._endQuarantine();
        })();
    }

    _testRunDone() {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this3.quarantine) yield _this3._testRunDoneInQuarantineMode();else yield _this3._emitTestRunDone();
        })();
    }

    _emitTestRunDone() {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            // NOTE: we should report test run completion in order they were completed in browser.
            // To keep a sequence after fixture hook execution we use completion queue.
            yield _this4.fixtureHookController.runFixtureAfterHookIfNecessary(_this4.testRun);

            _this4.done = true;

            _this4.emit('test-run-done');
        })();
    }

    _testRunDisconnected(connection) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this5.disconnectionCount++;

            if (_this5.disconnectionCount < DISCONNECT_THRESHOLD) {
                connection.suppressError();

                yield connection.restartBrowser();

                _this5._restartTest();
            }
        })();
    }

    get blocked() {
        return this.fixtureHookController.isTestBlocked(this.test);
    }

    start(connection) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const testRun = _this6._createTestRun(connection);

            const hookOk = yield _this6.fixtureHookController.runFixtureBeforeHookIfNecessary(testRun);

            if (_this6.test.skip || !hookOk) {
                _this6.emit('test-run-start');
                yield _this6._emitTestRunDone();
                return null;
            }

            testRun.once('start', function () {
                return _this6.emit('test-run-start');
            });
            testRun.once('done', function () {
                return _this6._testRunDone();
            });
            testRun.once('disconnected', function () {
                return _this6._testRunDisconnected(connection);
            });

            testRun.start();

            return _sessionController2.default.getSessionUrl(testRun, _this6.proxy);
        })();
    }
}
exports.default = TestRunController;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvdGVzdC1ydW4tY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJRVUFSQU5USU5FX1RIUkVTSE9MRCIsIkRJU0NPTk5FQ1RfVEhSRVNIT0xEIiwiUXVhcmFudGluZSIsImNvbnN0cnVjdG9yIiwiYXR0ZW1wdHMiLCJnZXRGYWlsZWRBdHRlbXB0cyIsImZpbHRlciIsImVycm9ycyIsImxlbmd0aCIsImdldFBhc3NlZEF0dGVtcHRzIiwiZ2V0TmV4dEF0dGVtcHROdW1iZXIiLCJUZXN0UnVuQ29udHJvbGxlciIsIkV2ZW50RW1pdHRlciIsInRlc3QiLCJpbmRleCIsInByb3h5Iiwic2NyZWVuc2hvdHMiLCJ3YXJuaW5nTG9nIiwiZml4dHVyZUhvb2tDb250cm9sbGVyIiwib3B0cyIsIlRlc3RSdW5DdG9yIiwiX2dldFRlc3RSdW5DdG9yIiwidGVzdFJ1biIsImRvbmUiLCJxdWFyYW50aW5lIiwiZGlzY29ubmVjdGlvbkNvdW50IiwicXVhcmFudGluZU1vZGUiLCJpc0xlZ2FjeSIsIkxlZ2FjeVRlc3RSdW4iLCJUZXN0UnVuIiwiX2NyZWF0ZVRlc3RSdW4iLCJjb25uZWN0aW9uIiwic2NyZWVuc2hvdENhcHR1cmVyIiwiY3JlYXRlQ2FwdHVyZXJGb3IiLCJhZGRRdWFyYW50aW5lSW5mbyIsIl9lbmRRdWFyYW50aW5lIiwidW5zdGFibGUiLCJfZW1pdFRlc3RSdW5Eb25lIiwiX3Nob3VsZEtlZXBJblF1YXJhbnRpbmUiLCJlcnJzIiwicHVzaCIsImZhaWxlZFRpbWVzIiwicGFzc2VkVGltZXMiLCJoYXNFcnJvcnMiLCJpc0ZpcnN0QXR0ZW1wdCIsImZhaWxlZFRocmVzaG9sZFJlYWNoZWQiLCJwYXNzZWRUaHJlc2hvbGRSZWFjaGVkIiwiX2tlZXBJblF1YXJhbnRpbmUiLCJfcmVzdGFydFRlc3QiLCJlbWl0IiwiX3Rlc3RSdW5Eb25lSW5RdWFyYW50aW5lTW9kZSIsIl90ZXN0UnVuRG9uZSIsInJ1bkZpeHR1cmVBZnRlckhvb2tJZk5lY2Vzc2FyeSIsIl90ZXN0UnVuRGlzY29ubmVjdGVkIiwic3VwcHJlc3NFcnJvciIsInJlc3RhcnRCcm93c2VyIiwiYmxvY2tlZCIsImlzVGVzdEJsb2NrZWQiLCJzdGFydCIsImhvb2tPayIsInJ1bkZpeHR1cmVCZWZvcmVIb29rSWZOZWNlc3NhcnkiLCJza2lwIiwib25jZSIsIlNlc3Npb25Db250cm9sbGVyIiwiZ2V0U2Vzc2lvblVybCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLHVCQUF1QixDQUE3QjtBQUNBLE1BQU1DLHVCQUF1QixDQUE3Qjs7QUFFQSxNQUFNQyxVQUFOLENBQWlCO0FBQ2JDLGtCQUFlO0FBQ1gsYUFBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNIOztBQUVEQyx3QkFBcUI7QUFDakIsZUFBTyxLQUFLRCxRQUFMLENBQWNFLE1BQWQsQ0FBcUJDLFVBQVUsQ0FBQyxDQUFDQSxPQUFPQyxNQUF4QyxDQUFQO0FBQ0g7O0FBRURDLHdCQUFxQjtBQUNqQixlQUFPLEtBQUtMLFFBQUwsQ0FBY0UsTUFBZCxDQUFxQkMsVUFBVUEsT0FBT0MsTUFBUCxLQUFrQixDQUFqRCxDQUFQO0FBQ0g7O0FBRURFLDJCQUF3QjtBQUNwQixlQUFPLEtBQUtOLFFBQUwsQ0FBY0ksTUFBZCxHQUF1QixDQUE5QjtBQUNIO0FBZlk7O0FBa0JGLE1BQU1HLGlCQUFOLFNBQWdDQyxnQkFBaEMsQ0FBNkM7QUFDeERULGdCQUFhVSxJQUFiLEVBQW1CQyxLQUFuQixFQUEwQkMsS0FBMUIsRUFBaUNDLFdBQWpDLEVBQThDQyxVQUE5QyxFQUEwREMscUJBQTFELEVBQWlGQyxJQUFqRixFQUF1RjtBQUNuRjs7QUFFQSxhQUFLTixJQUFMLEdBQWFBLElBQWI7QUFDQSxhQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxhQUFLSyxJQUFMLEdBQWFBLElBQWI7O0FBRUEsYUFBS0osS0FBTCxHQUE2QkEsS0FBN0I7QUFDQSxhQUFLQyxXQUFMLEdBQTZCQSxX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QUFzQjtBQUFBLHVCQUFNLE9BQUtiLElBQUwsQ0FBVSxnQkFBVixDQUFOO0FBQUEsYUFBdEI7QUFDQTNCLG9CQUFRd0MsSUFBUixDQUFhLE1BQWIsRUFBcUI7QUFBQSx1QkFBTSxPQUFLWCxZQUFMLEVBQU47QUFBQSxhQUFyQjtBQUNBN0Isb0JBQVF3QyxJQUFSLENBQWEsY0FBYixFQUE2QjtBQUFBLHVCQUFNLE9BQUtULG9CQUFMLENBQTBCdEIsVUFBMUIsQ0FBTjtBQUFBLGFBQTdCOztBQUVBVCxvQkFBUW9DLEtBQVI7O0FBRUEsbUJBQU9LLDRCQUFrQkMsYUFBbEIsQ0FBZ0MxQyxPQUFoQyxFQUF5QyxPQUFLUCxLQUE5QyxDQUFQO0FBakJxQjtBQWtCeEI7QUFwSXVEO2tCQUF2Q0osaUIiLCJmaWxlIjoicnVubmVyL3Rlc3QtcnVuLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBUZXN0UnVuIGFzIExlZ2FjeVRlc3RSdW4gfSBmcm9tICd0ZXN0Y2FmZS1sZWdhY3ktYXBpJztcbmltcG9ydCBUZXN0UnVuIGZyb20gJy4uL3Rlc3QtcnVuJztcbmltcG9ydCBTZXNzaW9uQ29udHJvbGxlciBmcm9tICcuLi90ZXN0LXJ1bi9zZXNzaW9uLWNvbnRyb2xsZXInO1xuXG5jb25zdCBRVUFSQU5USU5FX1RIUkVTSE9MRCA9IDM7XG5jb25zdCBESVNDT05ORUNUX1RIUkVTSE9MRCA9IDM7XG5cbmNsYXNzIFF1YXJhbnRpbmUge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5hdHRlbXB0cyA9IFtdO1xuICAgIH1cblxuICAgIGdldEZhaWxlZEF0dGVtcHRzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0ZW1wdHMuZmlsdGVyKGVycm9ycyA9PiAhIWVycm9ycy5sZW5ndGgpO1xuICAgIH1cblxuICAgIGdldFBhc3NlZEF0dGVtcHRzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0ZW1wdHMuZmlsdGVyKGVycm9ycyA9PiBlcnJvcnMubGVuZ3RoID09PSAwKTtcbiAgICB9XG5cbiAgICBnZXROZXh0QXR0ZW1wdE51bWJlciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dGVtcHRzLmxlbmd0aCArIDE7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0UnVuQ29udHJvbGxlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IgKHRlc3QsIGluZGV4LCBwcm94eSwgc2NyZWVuc2hvdHMsIHdhcm5pbmdMb2csIGZpeHR1cmVIb29rQ29udHJvbGxlciwgb3B0cykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMudGVzdCAgPSB0ZXN0O1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMub3B0cyAgPSBvcHRzO1xuXG4gICAgICAgIHRoaXMucHJveHkgICAgICAgICAgICAgICAgID0gcHJveHk7XG4gICAgICAgIHRoaXMuc2NyZWVuc2hvdHMgICAgICAgICAgID0gc2NyZWVuc2hvdHM7XG4gICAgICAgIHRoaXMud2FybmluZ0xvZyAgICAgICAgICAgID0gd2FybmluZ0xvZztcbiAgICAgICAgdGhpcy5maXh0dXJlSG9va0NvbnRyb2xsZXIgPSBmaXh0dXJlSG9va0NvbnRyb2xsZXI7XG5cbiAgICAgICAgdGhpcy5UZXN0UnVuQ3RvciA9IFRlc3RSdW5Db250cm9sbGVyLl9nZXRUZXN0UnVuQ3Rvcih0ZXN0LCBvcHRzKTtcblxuICAgICAgICB0aGlzLnRlc3RSdW4gICAgICAgICAgICA9IG51bGw7XG4gICAgICAgIHRoaXMuZG9uZSAgICAgICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgIHRoaXMucXVhcmFudGluZSAgICAgICAgID0gbnVsbDtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0aW9uQ291bnQgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdHMucXVhcmFudGluZU1vZGUpXG4gICAgICAgICAgICB0aGlzLnF1YXJhbnRpbmUgPSBuZXcgUXVhcmFudGluZSgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZ2V0VGVzdFJ1bkN0b3IgKHRlc3QsIG9wdHMpIHtcbiAgICAgICAgaWYgKG9wdHMuVGVzdFJ1bkN0b3IpXG4gICAgICAgICAgICByZXR1cm4gb3B0cy5UZXN0UnVuQ3RvcjtcblxuICAgICAgICByZXR1cm4gdGVzdC5pc0xlZ2FjeSA/IExlZ2FjeVRlc3RSdW4gOiBUZXN0UnVuO1xuICAgIH1cblxuICAgIF9jcmVhdGVUZXN0UnVuIChjb25uZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNjcmVlbnNob3RDYXB0dXJlciA9IHRoaXMuc2NyZWVuc2hvdHMuY3JlYXRlQ2FwdHVyZXJGb3IodGhpcy50ZXN0LCB0aGlzLmluZGV4LCB0aGlzLnF1YXJhbnRpbmUsIGNvbm5lY3Rpb24sIHRoaXMud2FybmluZ0xvZyk7XG4gICAgICAgIGNvbnN0IFRlc3RSdW5DdG9yICAgICAgICA9IHRoaXMuVGVzdFJ1bkN0b3I7XG5cbiAgICAgICAgdGhpcy50ZXN0UnVuID0gbmV3IFRlc3RSdW5DdG9yKHRoaXMudGVzdCwgY29ubmVjdGlvbiwgc2NyZWVuc2hvdENhcHR1cmVyLCB0aGlzLndhcm5pbmdMb2csIHRoaXMub3B0cyk7XG5cbiAgICAgICAgaWYgKHRoaXMudGVzdFJ1bi5hZGRRdWFyYW50aW5lSW5mbylcbiAgICAgICAgICAgIHRoaXMudGVzdFJ1bi5hZGRRdWFyYW50aW5lSW5mbyh0aGlzLnF1YXJhbnRpbmUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRlc3RSdW47XG4gICAgfVxuXG4gICAgYXN5bmMgX2VuZFF1YXJhbnRpbmUgKCkge1xuICAgICAgICBpZiAodGhpcy5xdWFyYW50aW5lLmF0dGVtcHRzLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICB0aGlzLnRlc3RSdW4udW5zdGFibGUgPSB0aGlzLnF1YXJhbnRpbmUuZ2V0UGFzc2VkQXR0ZW1wdHMoKS5sZW5ndGggPiAwO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuX2VtaXRUZXN0UnVuRG9uZSgpO1xuICAgIH1cblxuICAgIF9zaG91bGRLZWVwSW5RdWFyYW50aW5lICgpIHtcbiAgICAgICAgY29uc3QgZXJyb3JzICAgPSB0aGlzLnRlc3RSdW4uZXJycztcbiAgICAgICAgY29uc3QgYXR0ZW1wdHMgPSB0aGlzLnF1YXJhbnRpbmUuYXR0ZW1wdHM7XG5cbiAgICAgICAgYXR0ZW1wdHMucHVzaChlcnJvcnMpO1xuXG4gICAgICAgIGNvbnN0IGZhaWxlZFRpbWVzICAgICAgICAgICAgPSB0aGlzLnF1YXJhbnRpbmUuZ2V0RmFpbGVkQXR0ZW1wdHMoKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHBhc3NlZFRpbWVzICAgICAgICAgICAgPSB0aGlzLnF1YXJhbnRpbmUuZ2V0UGFzc2VkQXR0ZW1wdHMoKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGhhc0Vycm9ycyAgICAgICAgICAgICAgPSAhIWVycm9ycy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGlzRmlyc3RBdHRlbXB0ICAgICAgICAgPSBhdHRlbXB0cy5sZW5ndGggPT09IDE7XG4gICAgICAgIGNvbnN0IGZhaWxlZFRocmVzaG9sZFJlYWNoZWQgPSBmYWlsZWRUaW1lcyA+PSBRVUFSQU5USU5FX1RIUkVTSE9MRDtcbiAgICAgICAgY29uc3QgcGFzc2VkVGhyZXNob2xkUmVhY2hlZCA9IHBhc3NlZFRpbWVzID49IFFVQVJBTlRJTkVfVEhSRVNIT0xEO1xuXG4gICAgICAgIHJldHVybiBpc0ZpcnN0QXR0ZW1wdCA/IGhhc0Vycm9ycyA6ICFmYWlsZWRUaHJlc2hvbGRSZWFjaGVkICYmICFwYXNzZWRUaHJlc2hvbGRSZWFjaGVkO1xuICAgIH1cblxuICAgIF9rZWVwSW5RdWFyYW50aW5lICgpIHtcbiAgICAgICAgdGhpcy5fcmVzdGFydFRlc3QoKTtcbiAgICB9XG5cbiAgICBfcmVzdGFydFRlc3QgKCkge1xuICAgICAgICB0aGlzLmVtaXQoJ3Rlc3QtcnVuLXJlc3RhcnQnKTtcbiAgICB9XG5cbiAgICBhc3luYyBfdGVzdFJ1bkRvbmVJblF1YXJhbnRpbmVNb2RlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Nob3VsZEtlZXBJblF1YXJhbnRpbmUoKSlcbiAgICAgICAgICAgIHRoaXMuX2tlZXBJblF1YXJhbnRpbmUoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fZW5kUXVhcmFudGluZSgpO1xuICAgIH1cblxuICAgIGFzeW5jIF90ZXN0UnVuRG9uZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLnF1YXJhbnRpbmUpXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl90ZXN0UnVuRG9uZUluUXVhcmFudGluZU1vZGUoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fZW1pdFRlc3RSdW5Eb25lKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2VtaXRUZXN0UnVuRG9uZSAoKSB7XG4gICAgICAgIC8vIE5PVEU6IHdlIHNob3VsZCByZXBvcnQgdGVzdCBydW4gY29tcGxldGlvbiBpbiBvcmRlciB0aGV5IHdlcmUgY29tcGxldGVkIGluIGJyb3dzZXIuXG4gICAgICAgIC8vIFRvIGtlZXAgYSBzZXF1ZW5jZSBhZnRlciBmaXh0dXJlIGhvb2sgZXhlY3V0aW9uIHdlIHVzZSBjb21wbGV0aW9uIHF1ZXVlLlxuICAgICAgICBhd2FpdCB0aGlzLmZpeHR1cmVIb29rQ29udHJvbGxlci5ydW5GaXh0dXJlQWZ0ZXJIb29rSWZOZWNlc3NhcnkodGhpcy50ZXN0UnVuKTtcblxuICAgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuZW1pdCgndGVzdC1ydW4tZG9uZScpO1xuICAgIH1cblxuICAgIGFzeW5jIF90ZXN0UnVuRGlzY29ubmVjdGVkIChjb25uZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGlvbkNvdW50Kys7XG5cbiAgICAgICAgaWYgKHRoaXMuZGlzY29ubmVjdGlvbkNvdW50IDwgRElTQ09OTkVDVF9USFJFU0hPTEQpIHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb24uc3VwcHJlc3NFcnJvcigpO1xuXG4gICAgICAgICAgICBhd2FpdCBjb25uZWN0aW9uLnJlc3RhcnRCcm93c2VyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jlc3RhcnRUZXN0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgYmxvY2tlZCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpeHR1cmVIb29rQ29udHJvbGxlci5pc1Rlc3RCbG9ja2VkKHRoaXMudGVzdCk7XG4gICAgfVxuXG4gICAgYXN5bmMgc3RhcnQgKGNvbm5lY3Rpb24pIHtcbiAgICAgICAgY29uc3QgdGVzdFJ1biA9IHRoaXMuX2NyZWF0ZVRlc3RSdW4oY29ubmVjdGlvbik7XG5cbiAgICAgICAgY29uc3QgaG9va09rID0gYXdhaXQgdGhpcy5maXh0dXJlSG9va0NvbnRyb2xsZXIucnVuRml4dHVyZUJlZm9yZUhvb2tJZk5lY2Vzc2FyeSh0ZXN0UnVuKTtcblxuICAgICAgICBpZiAodGhpcy50ZXN0LnNraXAgfHwgIWhvb2tPaykge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCd0ZXN0LXJ1bi1zdGFydCcpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fZW1pdFRlc3RSdW5Eb25lKCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRlc3RSdW4ub25jZSgnc3RhcnQnLCAoKSA9PiB0aGlzLmVtaXQoJ3Rlc3QtcnVuLXN0YXJ0JykpO1xuICAgICAgICB0ZXN0UnVuLm9uY2UoJ2RvbmUnLCAoKSA9PiB0aGlzLl90ZXN0UnVuRG9uZSgpKTtcbiAgICAgICAgdGVzdFJ1bi5vbmNlKCdkaXNjb25uZWN0ZWQnLCAoKSA9PiB0aGlzLl90ZXN0UnVuRGlzY29ubmVjdGVkKGNvbm5lY3Rpb24pKTtcblxuICAgICAgICB0ZXN0UnVuLnN0YXJ0KCk7XG5cbiAgICAgICAgcmV0dXJuIFNlc3Npb25Db250cm9sbGVyLmdldFNlc3Npb25VcmwodGVzdFJ1biwgdGhpcy5wcm94eSk7XG4gICAgfVxufVxuIl19
