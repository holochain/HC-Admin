'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _events = require('events');

var _lodash = require('lodash');

var _testRunController = require('./test-run-controller');

var _testRunController2 = _interopRequireDefault(_testRunController);

var _sessionController = require('../test-run/session-controller');

var _sessionController2 = _interopRequireDefault(_sessionController);

var _browserJobResult = require('./browser-job-result');

var _browserJobResult2 = _interopRequireDefault(_browserJobResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Browser job
class BrowserJob extends _events.EventEmitter {
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

                _this2.emit('test-run-done', testRunController.testRun);
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
                    _this3.emit('start');
                }

                const testRunUrl = yield testRunController.start(connection);

                if (testRunUrl) return testRunUrl;
            }

            return null;
        })();
    }

    abort() {
        this.removeAllListeners();
        this._setResult(_browserJobResult2.default.aborted);
        this.browserConnections.map(bc => bc.removeJob(this));
    }
}
exports.default = BrowserJob;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvYnJvd3Nlci1qb2IuanMiXSwibmFtZXMiOlsiQnJvd3NlckpvYiIsIkV2ZW50RW1pdHRlciIsImNvbnN0cnVjdG9yIiwidGVzdHMiLCJicm93c2VyQ29ubmVjdGlvbnMiLCJwcm94eSIsInNjcmVlbnNob3RzIiwid2FybmluZ0xvZyIsImZpeHR1cmVIb29rQ29udHJvbGxlciIsIm9wdHMiLCJzdGFydGVkIiwidG90YWwiLCJwYXNzZWQiLCJyZXN1bHQiLCJ0ZXN0UnVuQ29udHJvbGxlclF1ZXVlIiwibWFwIiwidGVzdCIsImluZGV4IiwiX2NyZWF0ZVRlc3RSdW5Db250cm9sbGVyIiwiY29tcGxldGlvblF1ZXVlIiwiY29ubmVjdGlvbkVycm9yTGlzdGVuZXIiLCJlcnJvciIsIl9zZXRSZXN1bHQiLCJSRVNVTFQiLCJlcnJvcmVkIiwiYmMiLCJvbmNlIiwidGVzdFJ1bkNvbnRyb2xsZXIiLCJUZXN0UnVuQ29udHJvbGxlciIsIm9uIiwiZW1pdCIsInRlc3RSdW4iLCJfb25UZXN0UnVuUmVzdGFydCIsIl9vblRlc3RSdW5Eb25lIiwic3RhdHVzIiwiZGF0YSIsImZvckVhY2giLCJyZW1vdmVMaXN0ZW5lciIsIlByb21pc2UiLCJhbGwiLCJyZXBvcnRKb2JSZXN1bHQiLCJfYWRkVG9Db21wbGV0aW9uUXVldWUiLCJ0ZXN0UnVuSW5mbyIsInB1c2giLCJfcmVtb3ZlRnJvbUNvbXBsZXRpb25RdWV1ZSIsInVuc2hpZnQiLCJlcnJzIiwibGVuZ3RoIiwiZG9uZSIsInNoaWZ0IiwiaGFzUXVldWVkVGVzdFJ1bnMiLCJTZXNzaW9uQ29udHJvbGxlciIsImNsb3NlU2Vzc2lvbiIsInRoZW4iLCJwb3BOZXh0VGVzdFJ1blVybCIsImNvbm5lY3Rpb24iLCJibG9ja2VkIiwidGVzdFJ1blVybCIsInN0YXJ0IiwiYWJvcnQiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJhYm9ydGVkIiwicmVtb3ZlSm9iIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztB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QixFQUFxQztBQUFBOztBQUFBO0FBQ2pDLG1CQUFPLE9BQUt6QyxzQkFBTCxDQUE0QmlDLE1BQW5DLEVBQTJDO0FBQ3ZDO0FBQ0E7QUFDQSxvQkFBSSxPQUFLakMsc0JBQUwsQ0FBNEIsQ0FBNUIsRUFBK0IwQyxPQUFuQyxFQUNJOztBQUVKLHNCQUFNN0Isb0JBQW9CLE9BQUtiLHNCQUFMLENBQTRCbUMsS0FBNUIsRUFBMUI7O0FBRUEsdUJBQUtSLHFCQUFMLENBQTJCZCxpQkFBM0I7O0FBRUEsb0JBQUksQ0FBQyxPQUFLakIsT0FBVixFQUFtQjtBQUNmLDJCQUFLQSxPQUFMLEdBQWUsSUFBZjtBQUNBLDJCQUFLb0IsSUFBTCxDQUFVLE9BQVY7QUFDSDs7QUFFRCxzQkFBTTJCLGFBQWEsTUFBTTlCLGtCQUFrQitCLEtBQWxCLENBQXdCSCxVQUF4QixDQUF6Qjs7QUFFQSxvQkFBSUUsVUFBSixFQUNJLE9BQU9BLFVBQVA7QUFDUDs7QUFFRCxtQkFBTyxJQUFQO0FBdEJpQztBQXVCcEM7O0FBRURFLFlBQVM7QUFDTCxhQUFLQyxrQkFBTDtBQUNBLGFBQUt0QyxVQUFMLENBQWdCQywyQkFBT3NDLE9BQXZCO0FBQ0EsYUFBS3pELGtCQUFMLENBQXdCVyxHQUF4QixDQUE0QlUsTUFBTUEsR0FBR3FDLFNBQUgsQ0FBYSxJQUFiLENBQWxDO0FBQ0g7QUFuSGdEO2tCQUFoQzlELFUiLCJmaWxlIjoicnVubmVyL2Jyb3dzZXItam9iLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb21pc2UgZnJvbSAncGlua2llJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyByZW1vdmUgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFRlc3RSdW5Db250cm9sbGVyIGZyb20gJy4vdGVzdC1ydW4tY29udHJvbGxlcic7XG5pbXBvcnQgU2Vzc2lvbkNvbnRyb2xsZXIgZnJvbSAnLi4vdGVzdC1ydW4vc2Vzc2lvbi1jb250cm9sbGVyJztcbmltcG9ydCBSRVNVTFQgZnJvbSAnLi9icm93c2VyLWpvYi1yZXN1bHQnO1xuXG5cbi8vIEJyb3dzZXIgam9iXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcm93c2VySm9iIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvciAodGVzdHMsIGJyb3dzZXJDb25uZWN0aW9ucywgcHJveHksIHNjcmVlbnNob3RzLCB3YXJuaW5nTG9nLCBmaXh0dXJlSG9va0NvbnRyb2xsZXIsIG9wdHMpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLnRvdGFsICAgICAgICAgICAgICAgICA9IDA7XG4gICAgICAgIHRoaXMucGFzc2VkICAgICAgICAgICAgICAgID0gMDtcbiAgICAgICAgdGhpcy5vcHRzICAgICAgICAgICAgICAgICAgPSBvcHRzO1xuICAgICAgICB0aGlzLnByb3h5ICAgICAgICAgICAgICAgICA9IHByb3h5O1xuICAgICAgICB0aGlzLmJyb3dzZXJDb25uZWN0aW9ucyAgICA9IGJyb3dzZXJDb25uZWN0aW9ucztcbiAgICAgICAgdGhpcy5zY3JlZW5zaG90cyAgICAgICAgICAgPSBzY3JlZW5zaG90cztcbiAgICAgICAgdGhpcy53YXJuaW5nTG9nICAgICAgICAgICAgPSB3YXJuaW5nTG9nO1xuICAgICAgICB0aGlzLmZpeHR1cmVIb29rQ29udHJvbGxlciA9IGZpeHR1cmVIb29rQ29udHJvbGxlcjtcbiAgICAgICAgdGhpcy5yZXN1bHQgICAgICAgICAgICAgICAgPSBudWxsO1xuXG4gICAgICAgIHRoaXMudGVzdFJ1bkNvbnRyb2xsZXJRdWV1ZSA9IHRlc3RzLm1hcCgodGVzdCwgaW5kZXgpID0+IHRoaXMuX2NyZWF0ZVRlc3RSdW5Db250cm9sbGVyKHRlc3QsIGluZGV4KSk7XG5cbiAgICAgICAgdGhpcy5jb21wbGV0aW9uUXVldWUgPSBbXTtcblxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25FcnJvckxpc3RlbmVyID0gZXJyb3IgPT4gdGhpcy5fc2V0UmVzdWx0KFJFU1VMVC5lcnJvcmVkLCBlcnJvcik7XG5cbiAgICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbnMubWFwKGJjID0+IGJjLm9uY2UoJ2Vycm9yJywgdGhpcy5jb25uZWN0aW9uRXJyb3JMaXN0ZW5lcikpO1xuICAgIH1cblxuICAgIF9jcmVhdGVUZXN0UnVuQ29udHJvbGxlciAodGVzdCwgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgdGVzdFJ1bkNvbnRyb2xsZXIgPSBuZXcgVGVzdFJ1bkNvbnRyb2xsZXIodGVzdCwgaW5kZXggKyAxLCB0aGlzLnByb3h5LCB0aGlzLnNjcmVlbnNob3RzLCB0aGlzLndhcm5pbmdMb2csXG4gICAgICAgICAgICB0aGlzLmZpeHR1cmVIb29rQ29udHJvbGxlciwgdGhpcy5vcHRzKTtcblxuICAgICAgICB0ZXN0UnVuQ29udHJvbGxlci5vbigndGVzdC1ydW4tc3RhcnQnLCAoKSA9PiB0aGlzLmVtaXQoJ3Rlc3QtcnVuLXN0YXJ0JywgdGVzdFJ1bkNvbnRyb2xsZXIudGVzdFJ1bikpO1xuICAgICAgICB0ZXN0UnVuQ29udHJvbGxlci5vbigndGVzdC1ydW4tcmVzdGFydCcsICgpID0+IHRoaXMuX29uVGVzdFJ1blJlc3RhcnQodGVzdFJ1bkNvbnRyb2xsZXIpKTtcbiAgICAgICAgdGVzdFJ1bkNvbnRyb2xsZXIub24oJ3Rlc3QtcnVuLWRvbmUnLCAoKSA9PiB0aGlzLl9vblRlc3RSdW5Eb25lKHRlc3RSdW5Db250cm9sbGVyKSk7XG5cbiAgICAgICAgcmV0dXJuIHRlc3RSdW5Db250cm9sbGVyO1xuICAgIH1cblxuICAgIGFzeW5jIF9zZXRSZXN1bHQgKHN0YXR1cywgZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5yZXN1bHQpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGhpcy5yZXN1bHQgPSB7IHN0YXR1cywgZGF0YSB9O1xuXG4gICAgICAgIHRoaXMuYnJvd3NlckNvbm5lY3Rpb25zLmZvckVhY2goYmMgPT4gYmMucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgdGhpcy5jb25uZWN0aW9uRXJyb3JMaXN0ZW5lcikpO1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHRoaXMuYnJvd3NlckNvbm5lY3Rpb25zLm1hcChiYyA9PiBiYy5yZXBvcnRKb2JSZXN1bHQodGhpcy5yZXN1bHQuc3RhdHVzLCB0aGlzLnJlc3VsdC5kYXRhKSkpO1xuICAgIH1cblxuICAgIF9hZGRUb0NvbXBsZXRpb25RdWV1ZSAodGVzdFJ1bkluZm8pIHtcbiAgICAgICAgdGhpcy5jb21wbGV0aW9uUXVldWUucHVzaCh0ZXN0UnVuSW5mbyk7XG4gICAgfVxuXG4gICAgX3JlbW92ZUZyb21Db21wbGV0aW9uUXVldWUgKHRlc3RSdW5JbmZvKSB7XG4gICAgICAgIHJlbW92ZSh0aGlzLmNvbXBsZXRpb25RdWV1ZSwgdGVzdFJ1bkluZm8pO1xuICAgIH1cblxuICAgIF9vblRlc3RSdW5SZXN0YXJ0ICh0ZXN0UnVuQ29udHJvbGxlcikge1xuICAgICAgICB0aGlzLl9yZW1vdmVGcm9tQ29tcGxldGlvblF1ZXVlKHRlc3RSdW5Db250cm9sbGVyKTtcbiAgICAgICAgdGhpcy50ZXN0UnVuQ29udHJvbGxlclF1ZXVlLnVuc2hpZnQodGVzdFJ1bkNvbnRyb2xsZXIpO1xuICAgIH1cblxuICAgIGFzeW5jIF9vblRlc3RSdW5Eb25lICh0ZXN0UnVuQ29udHJvbGxlcikge1xuICAgICAgICB0aGlzLnRvdGFsKys7XG5cbiAgICAgICAgaWYgKCF0ZXN0UnVuQ29udHJvbGxlci50ZXN0UnVuLmVycnMubGVuZ3RoKVxuICAgICAgICAgICAgdGhpcy5wYXNzZWQrKztcblxuICAgICAgICB3aGlsZSAodGhpcy5jb21wbGV0aW9uUXVldWUubGVuZ3RoICYmIHRoaXMuY29tcGxldGlvblF1ZXVlWzBdLmRvbmUpIHtcbiAgICAgICAgICAgIHRlc3RSdW5Db250cm9sbGVyID0gdGhpcy5jb21wbGV0aW9uUXVldWUuc2hpZnQoKTtcblxuICAgICAgICAgICAgdGhpcy5lbWl0KCd0ZXN0LXJ1bi1kb25lJywgdGVzdFJ1bkNvbnRyb2xsZXIudGVzdFJ1bik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY29tcGxldGlvblF1ZXVlLmxlbmd0aCAmJiAhdGhpcy5oYXNRdWV1ZWRUZXN0UnVucykge1xuICAgICAgICAgICAgU2Vzc2lvbkNvbnRyb2xsZXIuY2xvc2VTZXNzaW9uKHRlc3RSdW5Db250cm9sbGVyLnRlc3RSdW4pO1xuXG4gICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgLl9zZXRSZXN1bHQoUkVTVUxULmRvbmUsIHsgdG90YWw6IHRoaXMudG90YWwsIHBhc3NlZDogdGhpcy5wYXNzZWQgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLmVtaXQoJ2RvbmUnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBUElcbiAgICBnZXQgaGFzUXVldWVkVGVzdFJ1bnMgKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLnRlc3RSdW5Db250cm9sbGVyUXVldWUubGVuZ3RoO1xuICAgIH1cblxuICAgIGFzeW5jIHBvcE5leHRUZXN0UnVuVXJsIChjb25uZWN0aW9uKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLnRlc3RSdW5Db250cm9sbGVyUXVldWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBOT1RFOiBiZWZvcmUgaG9vayBmb3IgdGVzdCBydW4gZml4dHVyZSBpcyBjdXJyZW50bHlcbiAgICAgICAgICAgIC8vIGV4ZWN1dGluZywgc28gdGVzdCBydW4gaXMgdGVtcG9yYXJ5IGJsb2NrZWRcbiAgICAgICAgICAgIGlmICh0aGlzLnRlc3RSdW5Db250cm9sbGVyUXVldWVbMF0uYmxvY2tlZClcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY29uc3QgdGVzdFJ1bkNvbnRyb2xsZXIgPSB0aGlzLnRlc3RSdW5Db250cm9sbGVyUXVldWUuc2hpZnQoKTtcblxuICAgICAgICAgICAgdGhpcy5fYWRkVG9Db21wbGV0aW9uUXVldWUodGVzdFJ1bkNvbnRyb2xsZXIpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdzdGFydCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0ZXN0UnVuVXJsID0gYXdhaXQgdGVzdFJ1bkNvbnRyb2xsZXIuc3RhcnQoY29ubmVjdGlvbik7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0UnVuVXJsKVxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXN0UnVuVXJsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgYWJvcnQgKCkge1xuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLl9zZXRSZXN1bHQoUkVTVUxULmFib3J0ZWQpO1xuICAgICAgICB0aGlzLmJyb3dzZXJDb25uZWN0aW9ucy5tYXAoYmMgPT4gYmMucmVtb3ZlSm9iKHRoaXMpKTtcbiAgICB9XG59XG4iXX0=
