'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _lodash = require('lodash');

var _asyncEventEmitter = require('../utils/async-event-emitter');

var _asyncEventEmitter2 = _interopRequireDefault(_asyncEventEmitter);

var _testRunController = require('./test-run-controller');

var _testRunController2 = _interopRequireDefault(_testRunController);

var _sessionController = require('../test-run/session-controller');

var _sessionController2 = _interopRequireDefault(_sessionController);

var _browserJobResult = require('./browser-job-result');

var _browserJobResult2 = _interopRequireDefault(_browserJobResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Browser job
class BrowserJob extends _asyncEventEmitter2.default {
    constructor(tests, browserConnections, proxy, screenshots, warningLog, fixtureHookController, opts) {
        super();

        this.started = false;

        this.total = 0;
        this.passed = 0;
        this.opts = opts;
        this.proxy = proxy;
        this.browserConnections = browserConnections;
        this.screenshots = screenshots;
        this.warningLog = warningLog;
        this.fixtureHookController = fixtureHookController;
        this.result = null;

        this.testRunControllerQueue = tests.map((test, index) => this._createTestRunController(test, index));

        this.completionQueue = [];

        this.connectionErrorListener = error => this._setResult(_browserJobResult2.default.errored, error);

        this.browserConnections.map(bc => bc.once('error', this.connectionErrorListener));
    }

    _createTestRunController(test, index) {
        const testRunController = new _testRunController2.default(test, index + 1, this.proxy, this.screenshots, this.warningLog, this.fixtureHookController, this.opts);

        testRunController.on('test-run-start', () => this.emit('test-run-start', testRunController.testRun));
        testRunController.on('test-run-restart', () => this._onTestRunRestart(testRunController));
        testRunController.on('test-run-done', () => this._onTestRunDone(testRunController));

        return testRunController;
    }

    _setResult(status, data) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this.result) return;

            _this.result = { status, data };

            _this.browserConnections.forEach(function (bc) {
                return bc.removeListener('error', _this.connectionErrorListener);
            });

            yield _pinkie2.default.all(_this.browserConnections.map(function (bc) {
                return bc.reportJobResult(_this.result.status, _this.result.data);
            }));
        })();
    }

    _addToCompletionQueue(testRunInfo) {
        this.completionQueue.push(testRunInfo);
    }

    _removeFromCompletionQueue(testRunInfo) {
        (0, _lodash.remove)(this.completionQueue, testRunInfo);
    }

    _onTestRunRestart(testRunController) {
        this._removeFromCompletionQueue(testRunController);
        this.testRunControllerQueue.unshift(testRunController);
    }

    _onTestRunDone(testRunController) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this2.total++;

            if (!testRunController.testRun.errs.length) _this2.passed++;

            while (_this2.completionQueue.length && _this2.completionQueue[0].done) {
                testRunController = _this2.completionQueue.shift();

                yield _this2.emit('test-run-done', testRunController.testRun);
            }

            if (!_this2.completionQueue.length && !_this2.hasQueuedTestRuns) {
                _sessionController2.default.closeSession(testRunController.testRun);

                _this2._setResult(_browserJobResult2.default.done, { total: _this2.total, passed: _this2.passed }).then(function () {
                    return _this2.emit('done');
                });
            }
        })();
    }

    // API
    get hasQueuedTestRuns() {
        return !!this.testRunControllerQueue.length;
    }

    popNextTestRunUrl(connection) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            while (_this3.testRunControllerQueue.length) {
                // NOTE: before hook for test run fixture is currently
                // executing, so test run is temporary blocked
                if (_this3.testRunControllerQueue[0].blocked) break;

                const testRunController = _this3.testRunControllerQueue.shift();

                _this3._addToCompletionQueue(testRunController);

                if (!_this3.started) {
                    _this3.started = true;
                    yield _this3.emit('start');
                }

                const testRunUrl = yield testRunController.start(connection);

                if (testRunUrl) return testRunUrl;
            }

            return null;
        })();
    }

    abort() {
        this.clearListeners();
        this._setResult(_browserJobResult2.default.aborted);
        this.browserConnections.map(bc => bc.removeJob(this));
    }
}
exports.default = BrowserJob;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvYnJvd3Nlci1qb2IuanMiXSwibmFtZXMiOlsiQnJvd3NlckpvYiIsIkFzeW5jRXZlbnRFbWl0dGVyIiwiY29uc3RydWN0b3IiLCJ0ZXN0cyIsImJyb3dzZXJDb25uZWN0aW9ucyIsInByb3h5Iiwic2NyZWVuc2hvdHMiLCJ3YXJuaW5nTG9nIiwiZml4dHVyZUhvb2tDb250cm9sbGVyIiwib3B0cyIsInN0YXJ0ZWQiLCJ0b3RhbCIsInBhc3NlZCIsInJlc3VsdCIsInRlc3RSdW5Db250cm9sbGVyUXVldWUiLCJtYXAiLCJ0ZXN0IiwiaW5kZXgiLCJfY3JlYXRlVGVzdFJ1bkNvbnRyb2xsZXIiLCJjb21wbGV0aW9uUXVldWUiLCJjb25uZWN0aW9uRXJyb3JMaXN0ZW5lciIsImVycm9yIiwiX3NldFJlc3VsdCIsIlJFU1VMVCIsImVycm9yZWQiLCJiYyIsIm9uY2UiLCJ0ZXN0UnVuQ29udHJvbGxlciIsIlRlc3RSdW5Db250cm9sbGVyIiwib24iLCJlbWl0IiwidGVzdFJ1biIsIl9vblRlc3RSdW5SZXN0YXJ0IiwiX29uVGVzdFJ1bkRvbmUiLCJzdGF0dXMiLCJkYXRhIiwiZm9yRWFjaCIsInJlbW92ZUxpc3RlbmVyIiwiUHJvbWlzZSIsImFsbCIsInJlcG9ydEpvYlJlc3VsdCIsIl9hZGRUb0NvbXBsZXRpb25RdWV1ZSIsInRlc3RSdW5JbmZvIiwicHVzaCIsIl9yZW1vdmVGcm9tQ29tcGxldGlvblF1ZXVlIiwidW5zaGlmdCIsImVycnMiLCJsZW5ndGgiLCJkb25lIiwic2hpZnQiLCJoYXNRdWV1ZWRUZXN0UnVucyIsIlNlc3Npb25Db250cm9sbGVyIiwiY2xvc2VTZXNzaW9uIiwidGhlbiIsInBvcE5leHRUZXN0UnVuVXJsIiwiY29ubmVjdGlvbiIsImJsb2NrZWQiLCJ0ZXN0UnVuVXJsIiwic3RhcnQiLCJhYm9ydCIsImNsZWFyTGlzdGVuZXJzIiwiYWJvcnRlZCIsInJlbW92ZUpvYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7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TixDQUF5QkMsVUFBekIsRUFBcUM7QUFBQTs7QUFBQTtBQUNqQyxtQkFBTyxPQUFLekMsc0JBQUwsQ0FBNEJpQyxNQUFuQyxFQUEyQztBQUN2QztBQUNBO0FBQ0Esb0JBQUksT0FBS2pDLHNCQUFMLENBQTRCLENBQTVCLEVBQStCMEMsT0FBbkMsRUFDSTs7QUFFSixzQkFBTTdCLG9CQUFvQixPQUFLYixzQkFBTCxDQUE0Qm1DLEtBQTVCLEVBQTFCOztBQUVBLHVCQUFLUixxQkFBTCxDQUEyQmQsaUJBQTNCOztBQUVBLG9CQUFJLENBQUMsT0FBS2pCLE9BQVYsRUFBbUI7QUFDZiwyQkFBS0EsT0FBTCxHQUFlLElBQWY7QUFDQSwwQkFBTSxPQUFLb0IsSUFBTCxDQUFVLE9BQVYsQ0FBTjtBQUNIOztBQUVELHNCQUFNMkIsYUFBYSxNQUFNOUIsa0JBQWtCK0IsS0FBbEIsQ0FBd0JILFVBQXhCLENBQXpCOztBQUVBLG9CQUFJRSxVQUFKLEVBQ0ksT0FBT0EsVUFBUDtBQUNQOztBQUVELG1CQUFPLElBQVA7QUF0QmlDO0FBdUJwQzs7QUFFREUsWUFBUztBQUNMLGFBQUtDLGNBQUw7QUFDQSxhQUFLdEMsVUFBTCxDQUFnQkMsMkJBQU9zQyxPQUF2QjtBQUNBLGFBQUt6RCxrQkFBTCxDQUF3QlcsR0FBeEIsQ0FBNEJVLE1BQU1BLEdBQUdxQyxTQUFILENBQWEsSUFBYixDQUFsQztBQUNIO0FBbkhxRDtrQkFBckM5RCxVIiwiZmlsZSI6InJ1bm5lci9icm93c2VyLWpvYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5pbXBvcnQgeyByZW1vdmUgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IEFzeW5jRXZlbnRFbWl0dGVyIGZyb20gJy4uL3V0aWxzL2FzeW5jLWV2ZW50LWVtaXR0ZXInO1xuaW1wb3J0IFRlc3RSdW5Db250cm9sbGVyIGZyb20gJy4vdGVzdC1ydW4tY29udHJvbGxlcic7XG5pbXBvcnQgU2Vzc2lvbkNvbnRyb2xsZXIgZnJvbSAnLi4vdGVzdC1ydW4vc2Vzc2lvbi1jb250cm9sbGVyJztcbmltcG9ydCBSRVNVTFQgZnJvbSAnLi9icm93c2VyLWpvYi1yZXN1bHQnO1xuXG5cbi8vIEJyb3dzZXIgam9iXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcm93c2VySm9iIGV4dGVuZHMgQXN5bmNFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yICh0ZXN0cywgYnJvd3NlckNvbm5lY3Rpb25zLCBwcm94eSwgc2NyZWVuc2hvdHMsIHdhcm5pbmdMb2csIGZpeHR1cmVIb29rQ29udHJvbGxlciwgb3B0cykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMudG90YWwgICAgICAgICAgICAgICAgID0gMDtcbiAgICAgICAgdGhpcy5wYXNzZWQgICAgICAgICAgICAgICAgPSAwO1xuICAgICAgICB0aGlzLm9wdHMgICAgICAgICAgICAgICAgICA9IG9wdHM7XG4gICAgICAgIHRoaXMucHJveHkgICAgICAgICAgICAgICAgID0gcHJveHk7XG4gICAgICAgIHRoaXMuYnJvd3NlckNvbm5lY3Rpb25zICAgID0gYnJvd3NlckNvbm5lY3Rpb25zO1xuICAgICAgICB0aGlzLnNjcmVlbnNob3RzICAgICAgICAgICA9IHNjcmVlbnNob3RzO1xuICAgICAgICB0aGlzLndhcm5pbmdMb2cgICAgICAgICAgICA9IHdhcm5pbmdMb2c7XG4gICAgICAgIHRoaXMuZml4dHVyZUhvb2tDb250cm9sbGVyID0gZml4dHVyZUhvb2tDb250cm9sbGVyO1xuICAgICAgICB0aGlzLnJlc3VsdCAgICAgICAgICAgICAgICA9IG51bGw7XG5cbiAgICAgICAgdGhpcy50ZXN0UnVuQ29udHJvbGxlclF1ZXVlID0gdGVzdHMubWFwKCh0ZXN0LCBpbmRleCkgPT4gdGhpcy5fY3JlYXRlVGVzdFJ1bkNvbnRyb2xsZXIodGVzdCwgaW5kZXgpKTtcblxuICAgICAgICB0aGlzLmNvbXBsZXRpb25RdWV1ZSA9IFtdO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbkVycm9yTGlzdGVuZXIgPSBlcnJvciA9PiB0aGlzLl9zZXRSZXN1bHQoUkVTVUxULmVycm9yZWQsIGVycm9yKTtcblxuICAgICAgICB0aGlzLmJyb3dzZXJDb25uZWN0aW9ucy5tYXAoYmMgPT4gYmMub25jZSgnZXJyb3InLCB0aGlzLmNvbm5lY3Rpb25FcnJvckxpc3RlbmVyKSk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZVRlc3RSdW5Db250cm9sbGVyICh0ZXN0LCBpbmRleCkge1xuICAgICAgICBjb25zdCB0ZXN0UnVuQ29udHJvbGxlciA9IG5ldyBUZXN0UnVuQ29udHJvbGxlcih0ZXN0LCBpbmRleCArIDEsIHRoaXMucHJveHksIHRoaXMuc2NyZWVuc2hvdHMsIHRoaXMud2FybmluZ0xvZyxcbiAgICAgICAgICAgIHRoaXMuZml4dHVyZUhvb2tDb250cm9sbGVyLCB0aGlzLm9wdHMpO1xuXG4gICAgICAgIHRlc3RSdW5Db250cm9sbGVyLm9uKCd0ZXN0LXJ1bi1zdGFydCcsICgpID0+IHRoaXMuZW1pdCgndGVzdC1ydW4tc3RhcnQnLCB0ZXN0UnVuQ29udHJvbGxlci50ZXN0UnVuKSk7XG4gICAgICAgIHRlc3RSdW5Db250cm9sbGVyLm9uKCd0ZXN0LXJ1bi1yZXN0YXJ0JywgKCkgPT4gdGhpcy5fb25UZXN0UnVuUmVzdGFydCh0ZXN0UnVuQ29udHJvbGxlcikpO1xuICAgICAgICB0ZXN0UnVuQ29udHJvbGxlci5vbigndGVzdC1ydW4tZG9uZScsICgpID0+IHRoaXMuX29uVGVzdFJ1bkRvbmUodGVzdFJ1bkNvbnRyb2xsZXIpKTtcblxuICAgICAgICByZXR1cm4gdGVzdFJ1bkNvbnRyb2xsZXI7XG4gICAgfVxuXG4gICAgYXN5bmMgX3NldFJlc3VsdCAoc3RhdHVzLCBkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc3VsdClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLnJlc3VsdCA9IHsgc3RhdHVzLCBkYXRhIH07XG5cbiAgICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbnMuZm9yRWFjaChiYyA9PiBiYy5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCB0aGlzLmNvbm5lY3Rpb25FcnJvckxpc3RlbmVyKSk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5icm93c2VyQ29ubmVjdGlvbnMubWFwKGJjID0+IGJjLnJlcG9ydEpvYlJlc3VsdCh0aGlzLnJlc3VsdC5zdGF0dXMsIHRoaXMucmVzdWx0LmRhdGEpKSk7XG4gICAgfVxuXG4gICAgX2FkZFRvQ29tcGxldGlvblF1ZXVlICh0ZXN0UnVuSW5mbykge1xuICAgICAgICB0aGlzLmNvbXBsZXRpb25RdWV1ZS5wdXNoKHRlc3RSdW5JbmZvKTtcbiAgICB9XG5cbiAgICBfcmVtb3ZlRnJvbUNvbXBsZXRpb25RdWV1ZSAodGVzdFJ1bkluZm8pIHtcbiAgICAgICAgcmVtb3ZlKHRoaXMuY29tcGxldGlvblF1ZXVlLCB0ZXN0UnVuSW5mbyk7XG4gICAgfVxuXG4gICAgX29uVGVzdFJ1blJlc3RhcnQgKHRlc3RSdW5Db250cm9sbGVyKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUZyb21Db21wbGV0aW9uUXVldWUodGVzdFJ1bkNvbnRyb2xsZXIpO1xuICAgICAgICB0aGlzLnRlc3RSdW5Db250cm9sbGVyUXVldWUudW5zaGlmdCh0ZXN0UnVuQ29udHJvbGxlcik7XG4gICAgfVxuXG4gICAgYXN5bmMgX29uVGVzdFJ1bkRvbmUgKHRlc3RSdW5Db250cm9sbGVyKSB7XG4gICAgICAgIHRoaXMudG90YWwrKztcblxuICAgICAgICBpZiAoIXRlc3RSdW5Db250cm9sbGVyLnRlc3RSdW4uZXJycy5sZW5ndGgpXG4gICAgICAgICAgICB0aGlzLnBhc3NlZCsrO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLmNvbXBsZXRpb25RdWV1ZS5sZW5ndGggJiYgdGhpcy5jb21wbGV0aW9uUXVldWVbMF0uZG9uZSkge1xuICAgICAgICAgICAgdGVzdFJ1bkNvbnRyb2xsZXIgPSB0aGlzLmNvbXBsZXRpb25RdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmVtaXQoJ3Rlc3QtcnVuLWRvbmUnLCB0ZXN0UnVuQ29udHJvbGxlci50ZXN0UnVuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5jb21wbGV0aW9uUXVldWUubGVuZ3RoICYmICF0aGlzLmhhc1F1ZXVlZFRlc3RSdW5zKSB7XG4gICAgICAgICAgICBTZXNzaW9uQ29udHJvbGxlci5jbG9zZVNlc3Npb24odGVzdFJ1bkNvbnRyb2xsZXIudGVzdFJ1bik7XG5cbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAuX3NldFJlc3VsdChSRVNVTFQuZG9uZSwgeyB0b3RhbDogdGhpcy50b3RhbCwgcGFzc2VkOiB0aGlzLnBhc3NlZCB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuZW1pdCgnZG9uZScpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFQSVxuICAgIGdldCBoYXNRdWV1ZWRUZXN0UnVucyAoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMudGVzdFJ1bkNvbnRyb2xsZXJRdWV1ZS5sZW5ndGg7XG4gICAgfVxuXG4gICAgYXN5bmMgcG9wTmV4dFRlc3RSdW5VcmwgKGNvbm5lY3Rpb24pIHtcbiAgICAgICAgd2hpbGUgKHRoaXMudGVzdFJ1bkNvbnRyb2xsZXJRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IGJlZm9yZSBob29rIGZvciB0ZXN0IHJ1biBmaXh0dXJlIGlzIGN1cnJlbnRseVxuICAgICAgICAgICAgLy8gZXhlY3V0aW5nLCBzbyB0ZXN0IHJ1biBpcyB0ZW1wb3JhcnkgYmxvY2tlZFxuICAgICAgICAgICAgaWYgKHRoaXMudGVzdFJ1bkNvbnRyb2xsZXJRdWV1ZVswXS5ibG9ja2VkKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjb25zdCB0ZXN0UnVuQ29udHJvbGxlciA9IHRoaXMudGVzdFJ1bkNvbnRyb2xsZXJRdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgICAgICB0aGlzLl9hZGRUb0NvbXBsZXRpb25RdWV1ZSh0ZXN0UnVuQ29udHJvbGxlcik7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVtaXQoJ3N0YXJ0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRlc3RSdW5VcmwgPSBhd2FpdCB0ZXN0UnVuQ29udHJvbGxlci5zdGFydChjb25uZWN0aW9uKTtcblxuICAgICAgICAgICAgaWYgKHRlc3RSdW5VcmwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRlc3RSdW5Vcmw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBhYm9ydCAoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5fc2V0UmVzdWx0KFJFU1VMVC5hYm9ydGVkKTtcbiAgICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbnMubWFwKGJjID0+IGJjLnJlbW92ZUpvYih0aGlzKSk7XG4gICAgfVxufVxuIl19
