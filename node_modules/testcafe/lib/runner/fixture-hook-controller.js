'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _phase = require('../test-run/phase');

var _phase2 = _interopRequireDefault(_phase);

var _processTestFnError = require('../errors/process-test-fn-error');

var _processTestFnError2 = _interopRequireDefault(_processTestFnError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FixtureHookController {
    constructor(tests, browserConnectionCount) {
        this.fixtureMap = FixtureHookController._createFixtureMap(tests, browserConnectionCount);
    }

    static _ensureFixtureMapItem(fixtureMap, fixture) {
        if (!fixtureMap.has(fixture)) {
            const item = {
                started: false,
                runningFixtureBeforeHook: false,
                fixtureBeforeHookErr: null,
                pendingTestRunCount: 0,
                fixtureCtx: (0, _create2.default)(null)
            };

            fixtureMap.set(fixture, item);
        }
    }

    static _createFixtureMap(tests, browserConnectionCount) {
        return tests.reduce((fixtureMap, test) => {
            const fixture = test.fixture;

            if (!test.skip) {
                FixtureHookController._ensureFixtureMapItem(fixtureMap, fixture);

                const item = fixtureMap.get(fixture);

                item.pendingTestRunCount += browserConnectionCount;
            }

            return fixtureMap;
        }, new _map2.default());
    }

    _getFixtureMapItem(test) {
        return test.skip ? null : this.fixtureMap.get(test.fixture);
    }

    isTestBlocked(test) {
        const item = this._getFixtureMapItem(test);

        return item && item.runningFixtureBeforeHook;
    }

    runFixtureBeforeHookIfNecessary(testRun) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const fixture = testRun.test.fixture;
            const item = _this._getFixtureMapItem(testRun.test);

            if (item) {
                const shouldRunBeforeHook = !item.started && fixture.beforeFn;

                item.started = true;

                if (shouldRunBeforeHook) {
                    item.runningFixtureBeforeHook = true;

                    try {
                        yield fixture.beforeFn(item.fixtureCtx);
                    } catch (err) {
                        item.fixtureBeforeHookErr = (0, _processTestFnError2.default)(err);
                    }

                    item.runningFixtureBeforeHook = false;
                }

                // NOTE: fail all tests in fixture if fixture.before hook has error
                if (item.fixtureBeforeHookErr) {
                    testRun.phase = _phase2.default.inFixtureBeforeHook;

                    testRun.addError(item.fixtureBeforeHookErr);

                    return false;
                }

                testRun.fixtureCtx = item.fixtureCtx;
            }

            return true;
        })();
    }

    runFixtureAfterHookIfNecessary(testRun) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const fixture = testRun.test.fixture;
            const item = _this2._getFixtureMapItem(testRun.test);

            if (item) {
                item.pendingTestRunCount--;

                if (item.pendingTestRunCount === 0 && fixture.afterFn) {
                    testRun.phase = _phase2.default.inFixtureAfterHook;

                    try {
                        yield fixture.afterFn(item.fixtureCtx);
                    } catch (err) {
                        testRun.addError((0, _processTestFnError2.default)(err));
                    }
                }
            }
        })();
    }
}
exports.default = FixtureHookController;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvZml4dHVyZS1ob29rLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiRml4dHVyZUhvb2tDb250cm9sbGVyIiwiY29uc3RydWN0b3IiLCJ0ZXN0cyIsImJyb3dzZXJDb25uZWN0aW9uQ291bnQiLCJmaXh0dXJlTWFwIiwiX2NyZWF0ZUZpeHR1cmVNYXAiLCJfZW5zdXJlRml4dHVyZU1hcEl0ZW0iLCJmaXh0dXJlIiwiaGFzIiwiaXRlbSIsInN0YXJ0ZWQiLCJydW5uaW5nRml4dHVyZUJlZm9yZUhvb2siLCJmaXh0dXJlQmVmb3JlSG9va0VyciIsInBlbmRpbmdUZXN0UnVuQ291bnQiLCJmaXh0dXJlQ3R4Iiwic2V0IiwicmVkdWNlIiwidGVzdCIsInNraXAiLCJnZXQiLCJfZ2V0Rml4dHVyZU1hcEl0ZW0iLCJpc1Rlc3RCbG9ja2VkIiwicnVuRml4dHVyZUJlZm9yZUhvb2tJZk5lY2Vzc2FyeSIsInRlc3RSdW4iLCJzaG91bGRSdW5CZWZvcmVIb29rIiwiYmVmb3JlRm4iLCJlcnIiLCJwaGFzZSIsIlRFU1RfUlVOX1BIQVNFIiwiaW5GaXh0dXJlQmVmb3JlSG9vayIsImFkZEVycm9yIiwicnVuRml4dHVyZUFmdGVySG9va0lmTmVjZXNzYXJ5IiwiYWZ0ZXJGbiIsImluRml4dHVyZUFmdGVySG9vayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLHFCQUFOLENBQTRCO0FBQ3ZDQyxnQkFBYUMsS0FBYixFQUFvQkMsc0JBQXBCLEVBQTRDO0FBQ3hDLGFBQUtDLFVBQUwsR0FBa0JKLHNCQUFzQkssaUJBQXRCLENBQXdDSCxLQUF4QyxFQUErQ0Msc0JBQS9DLENBQWxCO0FBQ0g7O0FBRUQsV0FBT0cscUJBQVAsQ0FBOEJGLFVBQTlCLEVBQTBDRyxPQUExQyxFQUFtRDtBQUMvQyxZQUFJLENBQUNILFdBQVdJLEdBQVgsQ0FBZUQsT0FBZixDQUFMLEVBQThCO0FBQzFCLGtCQUFN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Q0FBTjtBQUNILHFCQUZELENBR0EsT0FBT1ksR0FBUCxFQUFZO0FBQ1JILGdDQUFRTyxRQUFSLENBQWlCLGtDQUFtQkosR0FBbkIsQ0FBakI7QUFDSDtBQUNKO0FBQ0o7QUFqQjBDO0FBa0I5QztBQXBHc0M7a0JBQXRCMUIscUIiLCJmaWxlIjoicnVubmVyL2ZpeHR1cmUtaG9vay1jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRFU1RfUlVOX1BIQVNFIGZyb20gJy4uL3Rlc3QtcnVuL3BoYXNlJztcbmltcG9ydCBwcm9jZXNzVGVzdEZuRXJyb3IgZnJvbSAnLi4vZXJyb3JzL3Byb2Nlc3MtdGVzdC1mbi1lcnJvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpeHR1cmVIb29rQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IgKHRlc3RzLCBicm93c2VyQ29ubmVjdGlvbkNvdW50KSB7XG4gICAgICAgIHRoaXMuZml4dHVyZU1hcCA9IEZpeHR1cmVIb29rQ29udHJvbGxlci5fY3JlYXRlRml4dHVyZU1hcCh0ZXN0cywgYnJvd3NlckNvbm5lY3Rpb25Db3VudCk7XG4gICAgfVxuXG4gICAgc3RhdGljIF9lbnN1cmVGaXh0dXJlTWFwSXRlbSAoZml4dHVyZU1hcCwgZml4dHVyZSkge1xuICAgICAgICBpZiAoIWZpeHR1cmVNYXAuaGFzKGZpeHR1cmUpKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0ge1xuICAgICAgICAgICAgICAgIHN0YXJ0ZWQ6ICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgcnVubmluZ0ZpeHR1cmVCZWZvcmVIb29rOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBmaXh0dXJlQmVmb3JlSG9va0VycjogICAgIG51bGwsXG4gICAgICAgICAgICAgICAgcGVuZGluZ1Rlc3RSdW5Db3VudDogICAgICAwLFxuICAgICAgICAgICAgICAgIGZpeHR1cmVDdHg6ICAgICAgICAgICAgICAgT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZml4dHVyZU1hcC5zZXQoZml4dHVyZSwgaXRlbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgX2NyZWF0ZUZpeHR1cmVNYXAgKHRlc3RzLCBicm93c2VyQ29ubmVjdGlvbkNvdW50KSB7XG4gICAgICAgIHJldHVybiB0ZXN0cy5yZWR1Y2UoKGZpeHR1cmVNYXAsIHRlc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpeHR1cmUgPSB0ZXN0LmZpeHR1cmU7XG5cbiAgICAgICAgICAgIGlmICghdGVzdC5za2lwKSB7XG4gICAgICAgICAgICAgICAgRml4dHVyZUhvb2tDb250cm9sbGVyLl9lbnN1cmVGaXh0dXJlTWFwSXRlbShmaXh0dXJlTWFwLCBmaXh0dXJlKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBmaXh0dXJlTWFwLmdldChmaXh0dXJlKTtcblxuICAgICAgICAgICAgICAgIGl0ZW0ucGVuZGluZ1Rlc3RSdW5Db3VudCArPSBicm93c2VyQ29ubmVjdGlvbkNvdW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZml4dHVyZU1hcDtcbiAgICAgICAgfSwgbmV3IE1hcCgpKTtcbiAgICB9XG5cbiAgICBfZ2V0Rml4dHVyZU1hcEl0ZW0gKHRlc3QpIHtcbiAgICAgICAgcmV0dXJuIHRlc3Quc2tpcCA/IG51bGwgOiB0aGlzLmZpeHR1cmVNYXAuZ2V0KHRlc3QuZml4dHVyZSk7XG4gICAgfVxuXG4gICAgaXNUZXN0QmxvY2tlZCAodGVzdCkge1xuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5fZ2V0Rml4dHVyZU1hcEl0ZW0odGVzdCk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW0gJiYgaXRlbS5ydW5uaW5nRml4dHVyZUJlZm9yZUhvb2s7XG4gICAgfVxuXG4gICAgYXN5bmMgcnVuRml4dHVyZUJlZm9yZUhvb2tJZk5lY2Vzc2FyeSAodGVzdFJ1bikge1xuICAgICAgICBjb25zdCBmaXh0dXJlID0gdGVzdFJ1bi50ZXN0LmZpeHR1cmU7XG4gICAgICAgIGNvbnN0IGl0ZW0gICAgPSB0aGlzLl9nZXRGaXh0dXJlTWFwSXRlbSh0ZXN0UnVuLnRlc3QpO1xuXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBjb25zdCBzaG91bGRSdW5CZWZvcmVIb29rID0gIWl0ZW0uc3RhcnRlZCAmJiBmaXh0dXJlLmJlZm9yZUZuO1xuXG4gICAgICAgICAgICBpdGVtLnN0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAoc2hvdWxkUnVuQmVmb3JlSG9vaykge1xuICAgICAgICAgICAgICAgIGl0ZW0ucnVubmluZ0ZpeHR1cmVCZWZvcmVIb29rID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpeHR1cmUuYmVmb3JlRm4oaXRlbS5maXh0dXJlQ3R4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmZpeHR1cmVCZWZvcmVIb29rRXJyID0gcHJvY2Vzc1Rlc3RGbkVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXRlbS5ydW5uaW5nRml4dHVyZUJlZm9yZUhvb2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTk9URTogZmFpbCBhbGwgdGVzdHMgaW4gZml4dHVyZSBpZiBmaXh0dXJlLmJlZm9yZSBob29rIGhhcyBlcnJvclxuICAgICAgICAgICAgaWYgKGl0ZW0uZml4dHVyZUJlZm9yZUhvb2tFcnIpIHtcbiAgICAgICAgICAgICAgICB0ZXN0UnVuLnBoYXNlID0gVEVTVF9SVU5fUEhBU0UuaW5GaXh0dXJlQmVmb3JlSG9vaztcblxuICAgICAgICAgICAgICAgIHRlc3RSdW4uYWRkRXJyb3IoaXRlbS5maXh0dXJlQmVmb3JlSG9va0Vycik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRlc3RSdW4uZml4dHVyZUN0eCA9IGl0ZW0uZml4dHVyZUN0eDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jIHJ1bkZpeHR1cmVBZnRlckhvb2tJZk5lY2Vzc2FyeSAodGVzdFJ1bikge1xuICAgICAgICBjb25zdCBmaXh0dXJlID0gdGVzdFJ1bi50ZXN0LmZpeHR1cmU7XG4gICAgICAgIGNvbnN0IGl0ZW0gICAgPSB0aGlzLl9nZXRGaXh0dXJlTWFwSXRlbSh0ZXN0UnVuLnRlc3QpO1xuXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBpdGVtLnBlbmRpbmdUZXN0UnVuQ291bnQtLTtcblxuICAgICAgICAgICAgaWYgKGl0ZW0ucGVuZGluZ1Rlc3RSdW5Db3VudCA9PT0gMCAmJiBmaXh0dXJlLmFmdGVyRm4pIHtcbiAgICAgICAgICAgICAgICB0ZXN0UnVuLnBoYXNlID0gVEVTVF9SVU5fUEhBU0UuaW5GaXh0dXJlQWZ0ZXJIb29rO1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgZml4dHVyZS5hZnRlckZuKGl0ZW0uZml4dHVyZUN0eCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVzdFJ1bi5hZGRFcnJvcihwcm9jZXNzVGVzdEZuRXJyb3IoZXJyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19
