'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _lodash = require('lodash');

var _isStream = require('is-stream');

var _pluginHost = require('./plugin-host');

var _pluginHost2 = _interopRequireDefault(_pluginHost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Reporter {
    constructor(plugin, task, outStream) {
        this.plugin = new _pluginHost2.default(plugin, outStream);

        this.disposed = false;
        this.passed = 0;
        this.skipped = task.tests.filter(test => test.skip).length;
        this.testCount = task.tests.length - this.skipped;
        this.reportQueue = Reporter._createReportQueue(task);
        this.stopOnFirstFail = task.opts.stopOnFirstFail;
        this.outStream = outStream;

        this._assignTaskEventHandlers(task);
    }

    static _createReportQueue(task) {
        const runsPerTest = task.browserConnectionGroups.length;

        return task.tests.map(test => Reporter._createReportItem(test, runsPerTest));
    }

    static _createReportItem(test, runsPerTest) {
        return {
            fixture: test.fixture,
            test: test,
            screenshotPath: null,
            screenshots: [],
            quarantine: null,
            pendingRuns: runsPerTest,
            errs: [],
            unstable: false,
            startTime: null,
            testRunInfo: null
        };
    }

    static _createTestRunInfo(reportItem) {
        return {
            errs: (0, _lodash.sortBy)(reportItem.errs, ['userAgent', 'type']),
            durationMs: new Date() - reportItem.startTime,
            unstable: reportItem.unstable,
            screenshotPath: reportItem.screenshotPath,
            screenshots: reportItem.screenshots,
            quarantine: reportItem.quarantine,
            skipped: reportItem.test.skip
        };
    }

    _getReportItemForTestRun(testRun) {
        return (0, _lodash.find)(this.reportQueue, i => i.test === testRun.test);
    }

    _shiftReportQueue(reportItem) {
        let currentFixture = null;
        let nextReportItem = null;

        while (this.reportQueue.length && this.reportQueue[0].testRunInfo) {
            reportItem = this.reportQueue.shift();
            currentFixture = reportItem.fixture;

            this.plugin.reportTestDone(reportItem.test.name, reportItem.testRunInfo, reportItem.test.meta);

            // NOTE: here we assume that tests are sorted by fixture.
            // Therefore, if the next report item has a different
            // fixture, we can report this fixture start.
            nextReportItem = this.reportQueue[0];

            if (nextReportItem && nextReportItem.fixture !== currentFixture) this.plugin.reportFixtureStart(nextReportItem.fixture.name, nextReportItem.fixture.path, nextReportItem.fixture.meta);
        }
    }

    _assignTaskEventHandlers(task) {
        task.once('start', () => {
            const startTime = new Date();
            const userAgents = task.browserConnectionGroups.map(group => group[0].userAgent);
            const first = this.reportQueue[0];

            this.plugin.reportTaskStart(startTime, userAgents, this.testCount);
            this.plugin.reportFixtureStart(first.fixture.name, first.fixture.path, first.fixture.meta);
        });

        task.on('test-run-start', testRun => {
            const reportItem = this._getReportItemForTestRun(testRun);

            if (!reportItem.startTime) reportItem.startTime = new Date();
        });

        task.on('test-run-done', testRun => {
            const reportItem = this._getReportItemForTestRun(testRun);
            const isTestRunStoppedTaskExecution = !!testRun.errs.length && this.stopOnFirstFail;

            reportItem.pendingRuns = isTestRunStoppedTaskExecution ? 0 : reportItem.pendingRuns - 1;
            reportItem.unstable = reportItem.unstable || testRun.unstable;
            reportItem.errs = reportItem.errs.concat(testRun.errs);

            if (!reportItem.pendingRuns) {
                if (task.screenshots.hasCapturedFor(testRun.test)) {
                    reportItem.screenshotPath = task.screenshots.getPathFor(testRun.test);
                    reportItem.screenshots = task.screenshots.getScreenshotsInfo(testRun.test);
                }

                if (testRun.quarantine) {
                    reportItem.quarantine = testRun.quarantine.attempts.reduce((result, errors, index) => {
                        const passed = !errors.length;
                        const quarantineAttempt = index + 1;

                        result[quarantineAttempt] = { passed };

                        return result;
                    }, {});
                }

                if (!reportItem.testRunInfo) {
                    reportItem.testRunInfo = Reporter._createTestRunInfo(reportItem);

                    if (!reportItem.errs.length && !reportItem.test.skip) this.passed++;
                }

                this._shiftReportQueue(reportItem);
            }
        });

        task.once('done', () => {
            const endTime = new Date();

            this.plugin.reportTaskDone(endTime, this.passed, task.warningLog.messages);
        });
    }

    dispose() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this.disposed) return;

            _this.disposed = true;

            if (!(0, _isStream.writable)(_this.outStream)) return;

            _this.outStream.end();

            yield new _pinkie2.default(function (resolve) {
                _this.outStream.once('finish', resolve);
                _this.outStream.once('error', resolve);
            });
        })();
    }
}
exports.default = Reporter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvcnRlci9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZXBvcnRlciIsImNvbnN0cnVjdG9yIiwicGx1Z2luIiwidGFzayIsIm91dFN0cmVhbSIsIlJlcG9ydGVyUGx1Z2luSG9zdCIsImRpc3Bvc2VkIiwicGFzc2VkIiwic2tpcHBlZCIsInRlc3RzIiwiZmlsdGVyIiwidGVzdCIsInNraXAiLCJsZW5ndGgiLCJ0ZXN0Q291bnQiLCJyZXBvcnRRdWV1ZSIsIl9jcmVhdGVSZXBvcnRRdWV1ZSIsInN0b3BPbkZpcnN0RmFpbCIsIm9wdHMiLCJfYXNzaWduVGFza0V2ZW50SGFuZGxlcnMiLCJydW5zUGVyVGVzdCIsImJyb3dzZXJDb25uZWN0aW9uR3JvdXBzIiwibWFwIiwiX2NyZWF0ZVJlcG9ydEl0ZW0iLCJmaXh0dXJlIiwic2NyZWVuc2hvdFBhdGgiLCJzY3JlZW5zaG90cyIsInF1YXJhbnRpbmUiLCJwZW5kaW5nUnVucyIsImVycnMiLCJ1bnN0YWJsZSIsInN0YXJ0VGltZSIsInRlc3RSdW5JbmZvIiwiX2NyZWF0ZVRlc3RSdW5JbmZvIiwicmVwb3J0SXRlbSIsImR1cmF0aW9uTXMiLCJEYXRlIiwiX2dldFJlcG9ydEl0ZW1Gb3JUZXN0UnVuIiwidGVzdFJ1biIsImkiLCJfc2hpZnRSZXBvcnRRdWV1ZSIsImN1cnJlbnRGaXh0dXJlIiwibmV4dFJlcG9ydEl0ZW0iLCJzaGlmdCIsInJlcG9ydFRlc3REb25lIiwibmFtZSIsIm1ldGEiLCJyZXBvcnRGaXh0dXJlU3RhcnQiLCJwYXRoIiwib25jZSIsInVzZXJBZ2VudHMiLCJncm91cCIsInVzZXJBZ2VudCIsImZpcnN0IiwicmVwb3J0VGFza1N0YXJ0Iiwib24iLCJpc1Rlc3RSdW5TdG9wcGVkVGFza0V4ZWN1dGlvbiIsImNvbmNhdCIsImhhc0NhcHR1cmVkRm9yIiwiZ2V0UGF0aEZvciIsImdldFNjcmVlbnNob3RzSW5mbyIsImF0dGVtcHRzIiwicmVkdWNlIiwicmVzdWx0IiwiZXJyb3JzIiwiaW5kZXgiLCJxdWFyYW50aW5lQXR0ZW1wdCIsImVuZFRpbWUiLCJyZXBvcnRUYXNrRG9uZSIsIndhcm5pbmdMb2ciLCJtZXNzYWdlcyIsImRpc3Bvc2UiLCJlbmQiLCJQcm9taXNlIiwicmVzb2x2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxRQUFOLENBQWU7QUFDMUJDLGdCQUFhQyxNQUFiLEVBQXFCQyxJQUFyQixFQUEyQkMsU0FBM0IsRUFBc0M7QUFDbEMsYUFBS0YsTUFBTCxHQUFjLElBQUlHLG9CQUFKLENBQXVCSCxNQUF2QixFQUErQkUsU0FBL0IsQ0FBZDs7QUFFQSxhQUFLRSxRQUFMLEdBQXVCLEtBQXZCO0FBQ0EsYUFBS0MsTUFBTCxHQUF1QixDQUF2QjtBQUNBLGFBQUtDLE9BQUwsR0FBdUJMLEtBQUtNLEtBQUwsQ0FBV0MsTUFBWCxDQUFrQkMsUUFBUUEsS0FBS0MsSUFBL0IsRUFBcUNDLE1BQTVEO0FBQ0EsYUFBS0MsU0FBTCxHQUF1QlgsS0FBS00sS0FBTCxDQUFXSSxNQUFYLEdBQW9CLEtBQUtMLE9BQWhEO0FBQ0EsYUFBS08sV0FBTCxHQUF1QmYsU0FBU2dCLGtCQUFULENBQTRCYixJQUE1QixDQUF2QjtBQUNBLGFBQUtjLGVBQUwsR0FBdUJkLEtBQUtlLElBQUwsQ0FBVUQsZUFBakM7QUFDQSxhQUFLYixTQUFMLEdBQXVCQSxTQUF2Qjs7QUFFQSxhQUFLZSx3QkFBTCxDQUE4QmhCLElBQTlCO0FBQ0g7O0FBRUQsV0FBT2Esa0JBQVAsQ0FBMkJiLElBQTNCLEVBQWlDO0FBQzdCLGNBQU1pQixjQUFjakIsS0FBS2tCLHVCQUFMLENBQTZCUixNQUFqRDs7QUFFQSxlQUFPVixLQUFLTSxLQUFMLENBQVdhLEdBQVgsQ0FBZVgsUUFBUVgsU0FBU3VCLGlCQUFULENBQTJCWixJQUEzQixFQUFpQ1MsV0FBakMsQ0FBdkIsQ0FBUDtBQUNIOztBQUVELFdBQU9HLGlCQUFQLENBQTBCWixJQUExQixFQUFnQ1MsV0FB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SnlCO2tCQUFUMUUsUSIsImZpbGUiOiJyZXBvcnRlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5pbXBvcnQgeyBmaW5kLCBzb3J0QnkgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgd3JpdGFibGUgYXMgaXNXcml0YWJsZVN0cmVhbSB9IGZyb20gJ2lzLXN0cmVhbSc7XG5pbXBvcnQgUmVwb3J0ZXJQbHVnaW5Ib3N0IGZyb20gJy4vcGx1Z2luLWhvc3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXBvcnRlciB7XG4gICAgY29uc3RydWN0b3IgKHBsdWdpbiwgdGFzaywgb3V0U3RyZWFtKSB7XG4gICAgICAgIHRoaXMucGx1Z2luID0gbmV3IFJlcG9ydGVyUGx1Z2luSG9zdChwbHVnaW4sIG91dFN0cmVhbSk7XG5cbiAgICAgICAgdGhpcy5kaXNwb3NlZCAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wYXNzZWQgICAgICAgICAgPSAwO1xuICAgICAgICB0aGlzLnNraXBwZWQgICAgICAgICA9IHRhc2sudGVzdHMuZmlsdGVyKHRlc3QgPT4gdGVzdC5za2lwKS5sZW5ndGg7XG4gICAgICAgIHRoaXMudGVzdENvdW50ICAgICAgID0gdGFzay50ZXN0cy5sZW5ndGggLSB0aGlzLnNraXBwZWQ7XG4gICAgICAgIHRoaXMucmVwb3J0UXVldWUgICAgID0gUmVwb3J0ZXIuX2NyZWF0ZVJlcG9ydFF1ZXVlKHRhc2spO1xuICAgICAgICB0aGlzLnN0b3BPbkZpcnN0RmFpbCA9IHRhc2sub3B0cy5zdG9wT25GaXJzdEZhaWw7XG4gICAgICAgIHRoaXMub3V0U3RyZWFtICAgICAgID0gb3V0U3RyZWFtO1xuXG4gICAgICAgIHRoaXMuX2Fzc2lnblRhc2tFdmVudEhhbmRsZXJzKHRhc2spO1xuICAgIH1cblxuICAgIHN0YXRpYyBfY3JlYXRlUmVwb3J0UXVldWUgKHRhc2spIHtcbiAgICAgICAgY29uc3QgcnVuc1BlclRlc3QgPSB0YXNrLmJyb3dzZXJDb25uZWN0aW9uR3JvdXBzLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gdGFzay50ZXN0cy5tYXAodGVzdCA9PiBSZXBvcnRlci5fY3JlYXRlUmVwb3J0SXRlbSh0ZXN0LCBydW5zUGVyVGVzdCkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfY3JlYXRlUmVwb3J0SXRlbSAodGVzdCwgcnVuc1BlclRlc3QpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpeHR1cmU6ICAgICAgICB0ZXN0LmZpeHR1cmUsXG4gICAgICAgICAgICB0ZXN0OiAgICAgICAgICAgdGVzdCxcbiAgICAgICAgICAgIHNjcmVlbnNob3RQYXRoOiBudWxsLFxuICAgICAgICAgICAgc2NyZWVuc2hvdHM6ICAgIFtdLFxuICAgICAgICAgICAgcXVhcmFudGluZTogICAgIG51bGwsXG4gICAgICAgICAgICBwZW5kaW5nUnVuczogICAgcnVuc1BlclRlc3QsXG4gICAgICAgICAgICBlcnJzOiAgICAgICAgICAgW10sXG4gICAgICAgICAgICB1bnN0YWJsZTogICAgICAgZmFsc2UsXG4gICAgICAgICAgICBzdGFydFRpbWU6ICAgICAgbnVsbCxcbiAgICAgICAgICAgIHRlc3RSdW5JbmZvOiAgICBudWxsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIF9jcmVhdGVUZXN0UnVuSW5mbyAocmVwb3J0SXRlbSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyczogICAgICAgICAgIHNvcnRCeShyZXBvcnRJdGVtLmVycnMsIFsndXNlckFnZW50JywgJ3R5cGUnXSksXG4gICAgICAgICAgICBkdXJhdGlvbk1zOiAgICAgbmV3IERhdGUoKSAtIHJlcG9ydEl0ZW0uc3RhcnRUaW1lLFxuICAgICAgICAgICAgdW5zdGFibGU6ICAgICAgIHJlcG9ydEl0ZW0udW5zdGFibGUsXG4gICAgICAgICAgICBzY3JlZW5zaG90UGF0aDogcmVwb3J0SXRlbS5zY3JlZW5zaG90UGF0aCxcbiAgICAgICAgICAgIHNjcmVlbnNob3RzOiAgICByZXBvcnRJdGVtLnNjcmVlbnNob3RzLFxuICAgICAgICAgICAgcXVhcmFudGluZTogICAgIHJlcG9ydEl0ZW0ucXVhcmFudGluZSxcbiAgICAgICAgICAgIHNraXBwZWQ6ICAgICAgICByZXBvcnRJdGVtLnRlc3Quc2tpcFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9nZXRSZXBvcnRJdGVtRm9yVGVzdFJ1biAodGVzdFJ1bikge1xuICAgICAgICByZXR1cm4gZmluZCh0aGlzLnJlcG9ydFF1ZXVlLCBpID0+IGkudGVzdCA9PT0gdGVzdFJ1bi50ZXN0KTtcbiAgICB9XG5cbiAgICBfc2hpZnRSZXBvcnRRdWV1ZSAocmVwb3J0SXRlbSkge1xuICAgICAgICBsZXQgY3VycmVudEZpeHR1cmUgPSBudWxsO1xuICAgICAgICBsZXQgbmV4dFJlcG9ydEl0ZW0gPSBudWxsO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLnJlcG9ydFF1ZXVlLmxlbmd0aCAmJiB0aGlzLnJlcG9ydFF1ZXVlWzBdLnRlc3RSdW5JbmZvKSB7XG4gICAgICAgICAgICByZXBvcnRJdGVtICAgICA9IHRoaXMucmVwb3J0UXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgIGN1cnJlbnRGaXh0dXJlID0gcmVwb3J0SXRlbS5maXh0dXJlO1xuXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZXBvcnRUZXN0RG9uZShyZXBvcnRJdGVtLnRlc3QubmFtZSwgcmVwb3J0SXRlbS50ZXN0UnVuSW5mbywgcmVwb3J0SXRlbS50ZXN0Lm1ldGEpO1xuXG4gICAgICAgICAgICAvLyBOT1RFOiBoZXJlIHdlIGFzc3VtZSB0aGF0IHRlc3RzIGFyZSBzb3J0ZWQgYnkgZml4dHVyZS5cbiAgICAgICAgICAgIC8vIFRoZXJlZm9yZSwgaWYgdGhlIG5leHQgcmVwb3J0IGl0ZW0gaGFzIGEgZGlmZmVyZW50XG4gICAgICAgICAgICAvLyBmaXh0dXJlLCB3ZSBjYW4gcmVwb3J0IHRoaXMgZml4dHVyZSBzdGFydC5cbiAgICAgICAgICAgIG5leHRSZXBvcnRJdGVtID0gdGhpcy5yZXBvcnRRdWV1ZVswXTtcblxuICAgICAgICAgICAgaWYgKG5leHRSZXBvcnRJdGVtICYmIG5leHRSZXBvcnRJdGVtLmZpeHR1cmUgIT09IGN1cnJlbnRGaXh0dXJlKVxuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlcG9ydEZpeHR1cmVTdGFydChuZXh0UmVwb3J0SXRlbS5maXh0dXJlLm5hbWUsIG5leHRSZXBvcnRJdGVtLmZpeHR1cmUucGF0aCwgbmV4dFJlcG9ydEl0ZW0uZml4dHVyZS5tZXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9hc3NpZ25UYXNrRXZlbnRIYW5kbGVycyAodGFzaykge1xuICAgICAgICB0YXNrLm9uY2UoJ3N0YXJ0JywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRUaW1lICA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBjb25zdCB1c2VyQWdlbnRzID0gdGFzay5icm93c2VyQ29ubmVjdGlvbkdyb3Vwcy5tYXAoZ3JvdXAgPT4gZ3JvdXBbMF0udXNlckFnZW50KTtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0ICAgICAgPSB0aGlzLnJlcG9ydFF1ZXVlWzBdO1xuXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZXBvcnRUYXNrU3RhcnQoc3RhcnRUaW1lLCB1c2VyQWdlbnRzLCB0aGlzLnRlc3RDb3VudCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZXBvcnRGaXh0dXJlU3RhcnQoZmlyc3QuZml4dHVyZS5uYW1lLCBmaXJzdC5maXh0dXJlLnBhdGgsIGZpcnN0LmZpeHR1cmUubWV0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRhc2sub24oJ3Rlc3QtcnVuLXN0YXJ0JywgdGVzdFJ1biA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXBvcnRJdGVtID0gdGhpcy5fZ2V0UmVwb3J0SXRlbUZvclRlc3RSdW4odGVzdFJ1bik7XG5cbiAgICAgICAgICAgIGlmICghcmVwb3J0SXRlbS5zdGFydFRpbWUpXG4gICAgICAgICAgICAgICAgcmVwb3J0SXRlbS5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0YXNrLm9uKCd0ZXN0LXJ1bi1kb25lJywgdGVzdFJ1biA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXBvcnRJdGVtICAgICAgICAgICAgICAgICAgICA9IHRoaXMuX2dldFJlcG9ydEl0ZW1Gb3JUZXN0UnVuKHRlc3RSdW4pO1xuICAgICAgICAgICAgY29uc3QgaXNUZXN0UnVuU3RvcHBlZFRhc2tFeGVjdXRpb24gPSAhIXRlc3RSdW4uZXJycy5sZW5ndGggJiYgdGhpcy5zdG9wT25GaXJzdEZhaWw7XG5cbiAgICAgICAgICAgIHJlcG9ydEl0ZW0ucGVuZGluZ1J1bnMgPSBpc1Rlc3RSdW5TdG9wcGVkVGFza0V4ZWN1dGlvbiA/IDAgOiByZXBvcnRJdGVtLnBlbmRpbmdSdW5zIC0gMTtcbiAgICAgICAgICAgIHJlcG9ydEl0ZW0udW5zdGFibGUgICAgPSByZXBvcnRJdGVtLnVuc3RhYmxlIHx8IHRlc3RSdW4udW5zdGFibGU7XG4gICAgICAgICAgICByZXBvcnRJdGVtLmVycnMgICAgICAgID0gcmVwb3J0SXRlbS5lcnJzLmNvbmNhdCh0ZXN0UnVuLmVycnMpO1xuXG4gICAgICAgICAgICBpZiAoIXJlcG9ydEl0ZW0ucGVuZGluZ1J1bnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFzay5zY3JlZW5zaG90cy5oYXNDYXB0dXJlZEZvcih0ZXN0UnVuLnRlc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydEl0ZW0uc2NyZWVuc2hvdFBhdGggPSB0YXNrLnNjcmVlbnNob3RzLmdldFBhdGhGb3IodGVzdFJ1bi50ZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVwb3J0SXRlbS5zY3JlZW5zaG90cyAgICA9IHRhc2suc2NyZWVuc2hvdHMuZ2V0U2NyZWVuc2hvdHNJbmZvKHRlc3RSdW4udGVzdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRlc3RSdW4ucXVhcmFudGluZSkge1xuICAgICAgICAgICAgICAgICAgICByZXBvcnRJdGVtLnF1YXJhbnRpbmUgPSB0ZXN0UnVuLnF1YXJhbnRpbmUuYXR0ZW1wdHMucmVkdWNlKChyZXN1bHQsIGVycm9ycywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhc3NlZCAgICAgICAgICAgICAgPSAhZXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1YXJhbnRpbmVBdHRlbXB0ID0gaW5kZXggKyAxO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbcXVhcmFudGluZUF0dGVtcHRdID0geyBwYXNzZWQgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfSwge30pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghcmVwb3J0SXRlbS50ZXN0UnVuSW5mbykge1xuICAgICAgICAgICAgICAgICAgICByZXBvcnRJdGVtLnRlc3RSdW5JbmZvID0gUmVwb3J0ZXIuX2NyZWF0ZVRlc3RSdW5JbmZvKHJlcG9ydEl0ZW0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVwb3J0SXRlbS5lcnJzLmxlbmd0aCAmJiAhcmVwb3J0SXRlbS50ZXN0LnNraXApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhc3NlZCsrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX3NoaWZ0UmVwb3J0UXVldWUocmVwb3J0SXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRhc2sub25jZSgnZG9uZScsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVuZFRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZXBvcnRUYXNrRG9uZShlbmRUaW1lLCB0aGlzLnBhc3NlZCwgdGFzay53YXJuaW5nTG9nLm1lc3NhZ2VzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZGlzcG9zZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc3Bvc2VkKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuZGlzcG9zZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmICghaXNXcml0YWJsZVN0cmVhbSh0aGlzLm91dFN0cmVhbSkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdGhpcy5vdXRTdHJlYW0uZW5kKCk7XG5cbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLm91dFN0cmVhbS5vbmNlKCdmaW5pc2gnLCByZXNvbHZlKTtcbiAgICAgICAgICAgIHRoaXMub3V0U3RyZWFtLm9uY2UoJ2Vycm9yJywgcmVzb2x2ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
