'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _compiler = require('../compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _connection = require('../browser/connection');

var _connection2 = _interopRequireDefault(_connection);

var _runtime = require('../errors/runtime');

var _pool = require('../browser/provider/pool');

var _pool2 = _interopRequireDefault(_pool);

var _message = require('../errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

var _browserSet = require('./browser-set');

var _browserSet2 = _interopRequireDefault(_browserSet);

var _testedApp = require('./tested-app');

var _testedApp2 = _interopRequireDefault(_testedApp);

var _parseFileList = require('../utils/parse-file-list');

var _parseFileList2 = _interopRequireDefault(_parseFileList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_APP_INIT_DELAY = 1000;

class Bootstrapper {
    constructor(browserConnectionGateway) {
        this.browserConnectionGateway = browserConnectionGateway;

        this.concurrency = 1;
        this.sources = [];
        this.browsers = [];
        this.reporters = [];
        this.filter = null;
        this.appCommand = null;
        this.appInitDelay = DEFAULT_APP_INIT_DELAY;
        this.disableTestSyntaxValidation = false;
    }

    static _splitBrowserInfo(browserInfo) {
        const remotes = [];
        const automated = [];

        browserInfo.forEach(browser => {
            if (browser instanceof _connection2.default) remotes.push(browser);else automated.push(browser);
        });

        return { remotes, automated };
    }

    _getBrowserInfo() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this.browsers.length) throw new _runtime.GeneralError(_message2.default.browserNotSet);

            const browserInfo = yield _pinkie2.default.all(_this.browsers.map(function (browser) {
                return _pool2.default.getBrowserInfo(browser);
            }));

            return (0, _lodash.flatten)(browserInfo);
        })();
    }

    _createAutomatedConnections(browserInfo) {
        if (!browserInfo) return [];

        return browserInfo.map(browser => (0, _lodash.times)(this.concurrency, () => new _connection2.default(this.browserConnectionGateway, browser)));
    }

    _getBrowserConnections(browserInfo) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var _Bootstrapper$_splitB = Bootstrapper._splitBrowserInfo(browserInfo);

            const automated = _Bootstrapper$_splitB.automated,
                  remotes = _Bootstrapper$_splitB.remotes;


            if (remotes && remotes.length % _this2.concurrency) throw new _runtime.GeneralError(_message2.default.cannotDivideRemotesCountByConcurrency);

            let browserConnections = _this2._createAutomatedConnections(automated);

            browserConnections = browserConnections.concat((0, _lodash.chunk)(remotes, _this2.concurrency));

            return yield _browserSet2.default.from(browserConnections);
        })();
    }

    _getTests() {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this3.sources.length) throw new _runtime.GeneralError(_message2.default.testSourcesNotSet);

            const parsedFileList = yield (0, _parseFileList2.default)(_this3.sources, process.cwd());
            const compiler = new _compiler2.default(parsedFileList, _this3.disableTestSyntaxValidation);
            let tests = yield compiler.getTests();

            const testsWithOnlyFlag = tests.filter(function (test) {
                return test.only;
            });

            if (testsWithOnlyFlag.length) tests = testsWithOnlyFlag;

            if (_this3.filter) tests = tests.filter(function (test) {
                return _this3.filter(test.name, test.fixture.name, test.fixture.path, test.meta, test.fixture.meta);
            });

            if (!tests.length) throw new _runtime.GeneralError(_message2.default.noTestsToRun);

            return tests;
        })();
    }

    _getReporterPlugins() {
        const stdoutReporters = (0, _lodash.filter)(this.reporters, r => (0, _lodash.isUndefined)(r.outStream) || r.outStream === process.stdout);

        if (stdoutReporters.length > 1) throw new _runtime.GeneralError(_message2.default.multipleStdoutReporters, stdoutReporters.map(r => r.name).join(', '));

        if (!this.reporters.length) {
            this.reporters.push({
                name: 'spec',
                outStream: process.stdout
            });
        }

        return this.reporters.map(({ name, outStream }) => {
            let pluginFactory = name;

            if (typeof pluginFactory !== 'function') {
                try {
                    pluginFactory = require('testcafe-reporter-' + name);
                } catch (err) {
                    throw new _runtime.GeneralError(_message2.default.cantFindReporterForAlias, name);
                }
            }

            return {
                plugin: pluginFactory(),
                outStream
            };
        });
    }

    _startTestedApp() {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this4.appCommand) {
                const testedApp = new _testedApp2.default();

                yield testedApp.start(_this4.appCommand, _this4.appInitDelay);

                return testedApp;
            }

            return null;
        })();
    }

    _canUseParallelBootstrapping(browserInfo) {
        return browserInfo.every(browser => browser.provider.isLocalBrowser(null, browserInfo.browserName));
    }

    _bootstrapSequence(browserInfo) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const tests = yield _this5._getTests();
            const testedApp = yield _this5._startTestedApp();
            const browserSet = yield _this5._getBrowserConnections(browserInfo);

            return { tests, testedApp, browserSet };
        })();
    }

    _wrapBootstrappingPromise(promise) {
        return promise.then(result => ({ error: null, result })).catch(error => ({ result: null, error }));
    }

    _handleBootstrappingError([browserSetStatus, testsStatus, testedAppStatus]) {
        return (0, _asyncToGenerator3.default)(function* () {
            if (!browserSetStatus.error) yield browserSetStatus.result.dispose();

            if (!testedAppStatus.error && testedAppStatus.result) yield testedAppStatus.result.kill();

            if (testsStatus.error) throw testsStatus.error;else if (testedAppStatus.error) throw testedAppStatus.error;else throw browserSetStatus.error;
        })();
    }

    _bootstrapParallel(browserInfo) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let bootstrappingPromises = [_this6._getBrowserConnections(browserInfo), _this6._getTests(), _this6._startTestedApp()];

            bootstrappingPromises = bootstrappingPromises.map(function (promise) {
                return _this6._wrapBootstrappingPromise(promise);
            });

            const bootstrappingStatuses = yield _pinkie2.default.all(bootstrappingPromises);

            if (bootstrappingStatuses.some(function (status) {
                return status.error;
            })) yield _this6._handleBootstrappingError(bootstrappingStatuses);

            var _bootstrappingStatuse = bootstrappingStatuses.map(function (status) {
                return status.result;
            });

            const browserSet = _bootstrappingStatuse[0],
                  tests = _bootstrappingStatuse[1],
                  testedApp = _bootstrappingStatuse[2];


            return { browserSet, tests, testedApp };
        })();
    }

    // API
    createRunnableConfiguration() {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const reporterPlugins = _this7._getReporterPlugins();

            // NOTE: If a user forgot to specify a browser, but has specified a path to tests, the specified path will be
            // considered as the browser argument, and the tests path argument will have the predefined default value.
            // It's very ambiguous for the user, who might be confused by compilation errors from an unexpected test.
            // So, we need to retrieve the browser aliases and paths before tests compilation.
            const browserInfo = yield _this7._getBrowserInfo();

            if (_this7._canUseParallelBootstrapping(browserInfo)) return (0, _extends3.default)({ reporterPlugins }, (yield _this7._bootstrapParallel(browserInfo)));

            return (0, _extends3.default)({ reporterPlugins }, (yield _this7._bootstrapSequence(browserInfo)));
        })();
    }
}
exports.default = Bootstrapper;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvYm9vdHN0cmFwcGVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfQVBQX0lOSVRfREVMQVkiLCJCb290c3RyYXBwZXIiLCJjb25zdHJ1Y3RvciIsImJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheSIsImNvbmN1cnJlbmN5Iiwic291cmNlcyIsImJyb3dzZXJzIiwicmVwb3J0ZXJzIiwiZmlsdGVyIiwiYXBwQ29tbWFuZCIsImFwcEluaXREZWxheSIsImRpc2FibGVUZXN0U3ludGF4VmFsaWRhdGlvbiIsIl9zcGxpdEJyb3dzZXJJbmZvIiwiYnJvd3NlckluZm8iLCJyZW1vdGVzIiwiYXV0b21hdGVkIiwiZm9yRWFjaCIsImJyb3dzZXIiLCJCcm93c2VyQ29ubmVjdGlvbiIsInB1c2giLCJfZ2V0QnJvd3NlckluZm8iLCJsZW5ndGgiLCJHZW5lcmFsRXJyb3IiLCJNRVNTQUdFIiwiYnJvd3Nlck5vdFNldCIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJicm93c2VyUHJvdmlkZXJQb29sIiwiZ2V0QnJvd3NlckluZm8iLCJfY3JlYXRlQXV0b21hdGVkQ29ubmVjdGlvbnMiLCJfZ2V0QnJvd3NlckNvbm5lY3Rpb25zIiwiY2Fubm90RGl2aWRlUmVtb3Rlc0NvdW50QnlDb25jdXJyZW5jeSIsImJyb3dzZXJDb25uZWN0aW9ucyIsImNvbmNhdCIsIkJyb3dzZXJTZXQiLCJmcm9tIiwiX2dldFRlc3RzIiwidGVzdFNvdXJjZXNOb3RTZXQiLCJwYXJzZWRGaWxlTGlzdCIsInByb2Nlc3MiLCJjd2QiLCJjb21waWxlciIsIkNvbXBpbGVyIiwidGVzdHMiLCJnZXRUZXN0cyIsInRlc3RzV2l0aE9ubHlGbGFnIiwidGVzdCIsIm9ubHkiLCJuYW1lIiwiZml4dHVyZSIsInBhdGgiLCJtZXRhIiwibm9UZXN0c1RvUnVuIiwiX2dldFJlcG9ydGVyUGx1Z2lucyIsInN0ZG91dFJlcG9ydGVycyIsInIiLCJvdXRTdHJlYW0iLCJzdGRvdXQiLCJtdWx0aXBsZVN0ZG91dFJlcG9ydGVycyIsImpvaW4iLCJwbHVnaW5GYWN0b3J5IiwicmVxdWlyZSIsImVyciIsImNhbnRGaW5kUmVwb3J0ZXJGb3JBbGlhcyIsInBsdWdpbiIsIl9zdGFydFRlc3RlZEFwcCIsInRlc3RlZEFwcCIsIlRlc3RlZEFwcCIsInN0YXJ0IiwiX2NhblVzZVBhcmFsbGVsQm9vdHN0cmFwcGluZyIsImV2ZXJ5IiwicHJvdmlkZXIiLCJpc0xvY2FsQnJvd3NlciIsImJyb3dzZXJOYW1lIiwiX2Jvb3RzdHJhcFNlcXVlbmNlIiwiYnJvd3NlclNldCIsIl93cmFwQm9vdHN0cmFwcGluZ1Byb21pc2UiLCJwcm9taXNlIiwidGhlbiIsInJlc3VsdCIsImVycm9yIiwiY2F0Y2giLCJfaGFuZGxlQm9vdHN0cmFwcGluZ0Vycm9yIiwiYnJvd3NlclNldFN0YXR1cyIsInRlc3RzU3RhdHVzIiwidGVzdGVkQXBwU3RhdHVzIiwiZGlzcG9zZSIsImtpbGwiLCJfYm9vdHN0cmFwUGFyYWxsZWwiLCJib290c3RyYXBwaW5nUHJvbWlzZXMiLCJib290c3RyYXBwaW5nU3RhdHVzZXMiLCJzb21lIiwic3RhdHVzIiwiY3JlYXRlUnVubmFibGVDb25maWd1cmF0aW9uIiwicmVwb3J0ZXJQbHVnaW5zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNQSx5QkFBeUIsSUFBL0I7O0FBRWUsTUFBTUMsWUFBTixDQUFtQjtBQUM5QkMsZ0JBQWFDLHdCQUFiLEVBQXVDO0FBQ25DLGFBQUtBLHdCQUFMLEdBQWdDQSx3QkFBaEM7O0FBRUEsYUFBS0MsV0FBTCxHQUFtQyxDQUFuQztBQUNBLGFBQUtDLE9BQUwsR0FBbUMsRUFBbkM7QUFDQSxhQUFLQyxRQUFMLEdBQW1DLEVBQW5DO0FBQ0EsYUFBS0MsU0FBTCxHQUFtQyxFQUFuQztBQUNBLGFBQUtDLE1BQUwsR0FBbUMs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QSxhQUExQixDQWRKOztBQUFBLGtCQWM1QkosVUFkNEI7QUFBQSxrQkFjaEJoQyxLQWRnQjtBQUFBLGtCQWNUdUIsU0FkUzs7O0FBZ0JuQyxtQkFBTyxFQUFFUyxVQUFGLEVBQWNoQyxLQUFkLEVBQXFCdUIsU0FBckIsRUFBUDtBQWhCbUM7QUFpQnRDOztBQUVEO0FBQ00yQiwrQkFBTixHQUFxQztBQUFBOztBQUFBO0FBQ2pDLGtCQUFNQyxrQkFBa0IsT0FBS3pDLG1CQUFMLEVBQXhCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQU16QyxjQUFjLE1BQU0sT0FBS08sZUFBTCxFQUExQjs7QUFFQSxnQkFBSSxPQUFLa0QsNEJBQUwsQ0FBa0N6RCxXQUFsQyxDQUFKLEVBQ0ksZ0NBQVNrRixlQUFULEtBQTZCLE1BQU0sT0FBS04sa0JBQUwsQ0FBd0I1RSxXQUF4QixDQUFuQzs7QUFFSiw0Q0FBU2tGLGVBQVQsS0FBNkIsTUFBTSxPQUFLcEIsa0JBQUwsQ0FBd0I5RCxXQUF4QixDQUFuQztBQVppQztBQWFwQztBQTlMNkI7a0JBQWJaLFkiLCJmaWxlIjoicnVubmVyL2Jvb3RzdHJhcHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzVW5kZWZpbmVkLCBmaWx0ZXIsIGZsYXR0ZW4sIGNodW5rLCB0aW1lcyB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdwaW5raWUnO1xuaW1wb3J0IENvbXBpbGVyIGZyb20gJy4uL2NvbXBpbGVyJztcbmltcG9ydCBCcm93c2VyQ29ubmVjdGlvbiBmcm9tICcuLi9icm93c2VyL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IHsgR2VuZXJhbEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzL3J1bnRpbWUnO1xuaW1wb3J0IGJyb3dzZXJQcm92aWRlclBvb2wgZnJvbSAnLi4vYnJvd3Nlci9wcm92aWRlci9wb29sJztcbmltcG9ydCBNRVNTQUdFIGZyb20gJy4uL2Vycm9ycy9ydW50aW1lL21lc3NhZ2UnO1xuaW1wb3J0IEJyb3dzZXJTZXQgZnJvbSAnLi9icm93c2VyLXNldCc7XG5pbXBvcnQgVGVzdGVkQXBwIGZyb20gJy4vdGVzdGVkLWFwcCc7XG5pbXBvcnQgcGFyc2VGaWxlTGlzdCBmcm9tICcuLi91dGlscy9wYXJzZS1maWxlLWxpc3QnO1xuXG5jb25zdCBERUZBVUxUX0FQUF9JTklUX0RFTEFZID0gMTAwMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9vdHN0cmFwcGVyIHtcbiAgICBjb25zdHJ1Y3RvciAoYnJvd3NlckNvbm5lY3Rpb25HYXRld2F5KSB7XG4gICAgICAgIHRoaXMuYnJvd3NlckNvbm5lY3Rpb25HYXRld2F5ID0gYnJvd3NlckNvbm5lY3Rpb25HYXRld2F5O1xuXG4gICAgICAgIHRoaXMuY29uY3VycmVuY3kgICAgICAgICAgICAgICAgID0gMTtcbiAgICAgICAgdGhpcy5zb3VyY2VzICAgICAgICAgICAgICAgICAgICAgPSBbXTtcbiAgICAgICAgdGhpcy5icm93c2VycyAgICAgICAgICAgICAgICAgICAgPSBbXTtcbiAgICAgICAgdGhpcy5yZXBvcnRlcnMgICAgICAgICAgICAgICAgICAgPSBbXTtcbiAgICAgICAgdGhpcy5maWx0ZXIgICAgICAgICAgICAgICAgICAgICAgPSBudWxsO1xuICAgICAgICB0aGlzLmFwcENvbW1hbmQgICAgICAgICAgICAgICAgICA9IG51bGw7XG4gICAgICAgIHRoaXMuYXBwSW5pdERlbGF5ICAgICAgICAgICAgICAgID0gREVGQVVMVF9BUFBfSU5JVF9ERUxBWTtcbiAgICAgICAgdGhpcy5kaXNhYmxlVGVzdFN5bnRheFZhbGlkYXRpb24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX3NwbGl0QnJvd3NlckluZm8gKGJyb3dzZXJJbmZvKSB7XG4gICAgICAgIGNvbnN0IHJlbW90ZXMgICA9IFtdO1xuICAgICAgICBjb25zdCBhdXRvbWF0ZWQgPSBbXTtcblxuICAgICAgICBicm93c2VySW5mby5mb3JFYWNoKGJyb3dzZXIgPT4ge1xuICAgICAgICAgICAgaWYgKGJyb3dzZXIgaW5zdGFuY2VvZiBCcm93c2VyQ29ubmVjdGlvbilcbiAgICAgICAgICAgICAgICByZW1vdGVzLnB1c2goYnJvd3Nlcik7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXV0b21hdGVkLnB1c2goYnJvd3Nlcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7IHJlbW90ZXMsIGF1dG9tYXRlZCB9O1xuICAgIH1cblxuICAgIGFzeW5jIF9nZXRCcm93c2VySW5mbyAoKSB7XG4gICAgICAgIGlmICghdGhpcy5icm93c2Vycy5sZW5ndGgpXG4gICAgICAgICAgICB0aHJvdyBuZXcgR2VuZXJhbEVycm9yKE1FU1NBR0UuYnJvd3Nlck5vdFNldCk7XG5cbiAgICAgICAgY29uc3QgYnJvd3NlckluZm8gPSBhd2FpdCBQcm9taXNlLmFsbCh0aGlzLmJyb3dzZXJzLm1hcChicm93c2VyID0+IGJyb3dzZXJQcm92aWRlclBvb2wuZ2V0QnJvd3NlckluZm8oYnJvd3NlcikpKTtcblxuICAgICAgICByZXR1cm4gZmxhdHRlbihicm93c2VySW5mbyk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUF1dG9tYXRlZENvbm5lY3Rpb25zIChicm93c2VySW5mbykge1xuICAgICAgICBpZiAoIWJyb3dzZXJJbmZvKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuXG4gICAgICAgIHJldHVybiBicm93c2VySW5mb1xuICAgICAgICAgICAgLm1hcChicm93c2VyID0+IHRpbWVzKHRoaXMuY29uY3VycmVuY3ksICgpID0+IG5ldyBCcm93c2VyQ29ubmVjdGlvbih0aGlzLmJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheSwgYnJvd3NlcikpKTtcbiAgICB9XG5cbiAgICBhc3luYyBfZ2V0QnJvd3NlckNvbm5lY3Rpb25zIChicm93c2VySW5mbykge1xuICAgICAgICBjb25zdCB7IGF1dG9tYXRlZCwgcmVtb3RlcyB9ID0gQm9vdHN0cmFwcGVyLl9zcGxpdEJyb3dzZXJJbmZvKGJyb3dzZXJJbmZvKTtcblxuICAgICAgICBpZiAocmVtb3RlcyAmJiByZW1vdGVzLmxlbmd0aCAlIHRoaXMuY29uY3VycmVuY3kpXG4gICAgICAgICAgICB0aHJvdyBuZXcgR2VuZXJhbEVycm9yKE1FU1NBR0UuY2Fubm90RGl2aWRlUmVtb3Rlc0NvdW50QnlDb25jdXJyZW5jeSk7XG5cbiAgICAgICAgbGV0IGJyb3dzZXJDb25uZWN0aW9ucyA9IHRoaXMuX2NyZWF0ZUF1dG9tYXRlZENvbm5lY3Rpb25zKGF1dG9tYXRlZCk7XG5cbiAgICAgICAgYnJvd3NlckNvbm5lY3Rpb25zID0gYnJvd3NlckNvbm5lY3Rpb25zLmNvbmNhdChjaHVuayhyZW1vdGVzLCB0aGlzLmNvbmN1cnJlbmN5KSk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IEJyb3dzZXJTZXQuZnJvbShicm93c2VyQ29ubmVjdGlvbnMpO1xuICAgIH1cblxuICAgIGFzeW5jIF9nZXRUZXN0cyAoKSB7XG4gICAgICAgIGlmICghdGhpcy5zb3VyY2VzLmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IG5ldyBHZW5lcmFsRXJyb3IoTUVTU0FHRS50ZXN0U291cmNlc05vdFNldCk7XG5cbiAgICAgICAgY29uc3QgcGFyc2VkRmlsZUxpc3QgPSBhd2FpdCBwYXJzZUZpbGVMaXN0KHRoaXMuc291cmNlcywgcHJvY2Vzcy5jd2QoKSk7XG4gICAgICAgIGNvbnN0IGNvbXBpbGVyICAgICAgID0gbmV3IENvbXBpbGVyKHBhcnNlZEZpbGVMaXN0LCB0aGlzLmRpc2FibGVUZXN0U3ludGF4VmFsaWRhdGlvbik7XG4gICAgICAgIGxldCB0ZXN0cyAgICAgICAgICAgID0gYXdhaXQgY29tcGlsZXIuZ2V0VGVzdHMoKTtcblxuICAgICAgICBjb25zdCB0ZXN0c1dpdGhPbmx5RmxhZyA9IHRlc3RzLmZpbHRlcih0ZXN0ID0+IHRlc3Qub25seSk7XG5cbiAgICAgICAgaWYgKHRlc3RzV2l0aE9ubHlGbGFnLmxlbmd0aClcbiAgICAgICAgICAgIHRlc3RzID0gdGVzdHNXaXRoT25seUZsYWc7XG5cbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyKVxuICAgICAgICAgICAgdGVzdHMgPSB0ZXN0cy5maWx0ZXIodGVzdCA9PiB0aGlzLmZpbHRlcih0ZXN0Lm5hbWUsIHRlc3QuZml4dHVyZS5uYW1lLCB0ZXN0LmZpeHR1cmUucGF0aCwgdGVzdC5tZXRhLCB0ZXN0LmZpeHR1cmUubWV0YSkpO1xuXG4gICAgICAgIGlmICghdGVzdHMubGVuZ3RoKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLm5vVGVzdHNUb1J1bik7XG5cbiAgICAgICAgcmV0dXJuIHRlc3RzO1xuICAgIH1cblxuICAgIF9nZXRSZXBvcnRlclBsdWdpbnMgKCkge1xuICAgICAgICBjb25zdCBzdGRvdXRSZXBvcnRlcnMgPSBmaWx0ZXIodGhpcy5yZXBvcnRlcnMsIHIgPT4gaXNVbmRlZmluZWQoci5vdXRTdHJlYW0pIHx8IHIub3V0U3RyZWFtID09PSBwcm9jZXNzLnN0ZG91dCk7XG5cbiAgICAgICAgaWYgKHN0ZG91dFJlcG9ydGVycy5sZW5ndGggPiAxKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLm11bHRpcGxlU3Rkb3V0UmVwb3J0ZXJzLCBzdGRvdXRSZXBvcnRlcnMubWFwKHIgPT4gci5uYW1lKS5qb2luKCcsICcpKTtcblxuICAgICAgICBpZiAoIXRoaXMucmVwb3J0ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5yZXBvcnRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogICAgICAnc3BlYycsXG4gICAgICAgICAgICAgICAgb3V0U3RyZWFtOiBwcm9jZXNzLnN0ZG91dFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yZXBvcnRlcnMubWFwKCh7IG5hbWUsIG91dFN0cmVhbSB9KSA9PiB7XG4gICAgICAgICAgICBsZXQgcGx1Z2luRmFjdG9yeSA9IG5hbWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGx1Z2luRmFjdG9yeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbkZhY3RvcnkgPSByZXF1aXJlKCd0ZXN0Y2FmZS1yZXBvcnRlci0nICsgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLmNhbnRGaW5kUmVwb3J0ZXJGb3JBbGlhcywgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHBsdWdpbjogcGx1Z2luRmFjdG9yeSgpLFxuICAgICAgICAgICAgICAgIG91dFN0cmVhbVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX3N0YXJ0VGVzdGVkQXBwICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBwQ29tbWFuZCkge1xuICAgICAgICAgICAgY29uc3QgdGVzdGVkQXBwID0gbmV3IFRlc3RlZEFwcCgpO1xuXG4gICAgICAgICAgICBhd2FpdCB0ZXN0ZWRBcHAuc3RhcnQodGhpcy5hcHBDb21tYW5kLCB0aGlzLmFwcEluaXREZWxheSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0ZXN0ZWRBcHA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBfY2FuVXNlUGFyYWxsZWxCb290c3RyYXBwaW5nIChicm93c2VySW5mbykge1xuICAgICAgICByZXR1cm4gYnJvd3NlckluZm8uZXZlcnkoYnJvd3NlciA9PiBicm93c2VyLnByb3ZpZGVyLmlzTG9jYWxCcm93c2VyKG51bGwsIGJyb3dzZXJJbmZvLmJyb3dzZXJOYW1lKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2Jvb3RzdHJhcFNlcXVlbmNlIChicm93c2VySW5mbykge1xuICAgICAgICBjb25zdCB0ZXN0cyAgICAgICA9IGF3YWl0IHRoaXMuX2dldFRlc3RzKCk7XG4gICAgICAgIGNvbnN0IHRlc3RlZEFwcCAgID0gYXdhaXQgdGhpcy5fc3RhcnRUZXN0ZWRBcHAoKTtcbiAgICAgICAgY29uc3QgYnJvd3NlclNldCAgPSBhd2FpdCB0aGlzLl9nZXRCcm93c2VyQ29ubmVjdGlvbnMoYnJvd3NlckluZm8pO1xuXG4gICAgICAgIHJldHVybiB7IHRlc3RzLCB0ZXN0ZWRBcHAsIGJyb3dzZXJTZXQgfTtcbiAgICB9XG5cbiAgICBfd3JhcEJvb3RzdHJhcHBpbmdQcm9taXNlIChwcm9taXNlKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gKHsgZXJyb3I6IG51bGwsIHJlc3VsdCB9KSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiAoeyByZXN1bHQ6IG51bGwsIGVycm9yIH0pKTtcbiAgICB9XG5cbiAgICBhc3luYyBfaGFuZGxlQm9vdHN0cmFwcGluZ0Vycm9yIChbYnJvd3NlclNldFN0YXR1cywgdGVzdHNTdGF0dXMsIHRlc3RlZEFwcFN0YXR1c10pIHtcbiAgICAgICAgaWYgKCFicm93c2VyU2V0U3RhdHVzLmVycm9yKVxuICAgICAgICAgICAgYXdhaXQgYnJvd3NlclNldFN0YXR1cy5yZXN1bHQuZGlzcG9zZSgpO1xuXG4gICAgICAgIGlmICghdGVzdGVkQXBwU3RhdHVzLmVycm9yICYmIHRlc3RlZEFwcFN0YXR1cy5yZXN1bHQpXG4gICAgICAgICAgICBhd2FpdCB0ZXN0ZWRBcHBTdGF0dXMucmVzdWx0LmtpbGwoKTtcblxuICAgICAgICBpZiAodGVzdHNTdGF0dXMuZXJyb3IpXG4gICAgICAgICAgICB0aHJvdyB0ZXN0c1N0YXR1cy5lcnJvcjtcbiAgICAgICAgZWxzZSBpZiAodGVzdGVkQXBwU3RhdHVzLmVycm9yKVxuICAgICAgICAgICAgdGhyb3cgdGVzdGVkQXBwU3RhdHVzLmVycm9yO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBicm93c2VyU2V0U3RhdHVzLmVycm9yO1xuICAgIH1cblxuICAgIGFzeW5jIF9ib290c3RyYXBQYXJhbGxlbCAoYnJvd3NlckluZm8pIHtcbiAgICAgICAgbGV0IGJvb3RzdHJhcHBpbmdQcm9taXNlcyA9IFtcbiAgICAgICAgICAgIHRoaXMuX2dldEJyb3dzZXJDb25uZWN0aW9ucyhicm93c2VySW5mbyksXG4gICAgICAgICAgICB0aGlzLl9nZXRUZXN0cygpLFxuICAgICAgICAgICAgdGhpcy5fc3RhcnRUZXN0ZWRBcHAoKVxuICAgICAgICBdO1xuXG4gICAgICAgIGJvb3RzdHJhcHBpbmdQcm9taXNlcyA9IGJvb3RzdHJhcHBpbmdQcm9taXNlcy5tYXAocHJvbWlzZSA9PiB0aGlzLl93cmFwQm9vdHN0cmFwcGluZ1Byb21pc2UocHJvbWlzZSkpO1xuXG4gICAgICAgIGNvbnN0IGJvb3RzdHJhcHBpbmdTdGF0dXNlcyA9IGF3YWl0IFByb21pc2UuYWxsKGJvb3RzdHJhcHBpbmdQcm9taXNlcyk7XG5cbiAgICAgICAgaWYgKGJvb3RzdHJhcHBpbmdTdGF0dXNlcy5zb21lKHN0YXR1cyA9PiBzdGF0dXMuZXJyb3IpKVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5faGFuZGxlQm9vdHN0cmFwcGluZ0Vycm9yKGJvb3RzdHJhcHBpbmdTdGF0dXNlcyk7XG5cbiAgICAgICAgY29uc3QgW2Jyb3dzZXJTZXQsIHRlc3RzLCB0ZXN0ZWRBcHBdID0gYm9vdHN0cmFwcGluZ1N0YXR1c2VzLm1hcChzdGF0dXMgPT4gc3RhdHVzLnJlc3VsdCk7XG5cbiAgICAgICAgcmV0dXJuIHsgYnJvd3NlclNldCwgdGVzdHMsIHRlc3RlZEFwcCB9O1xuICAgIH1cblxuICAgIC8vIEFQSVxuICAgIGFzeW5jIGNyZWF0ZVJ1bm5hYmxlQ29uZmlndXJhdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydGVyUGx1Z2lucyA9IHRoaXMuX2dldFJlcG9ydGVyUGx1Z2lucygpO1xuXG4gICAgICAgIC8vIE5PVEU6IElmIGEgdXNlciBmb3Jnb3QgdG8gc3BlY2lmeSBhIGJyb3dzZXIsIGJ1dCBoYXMgc3BlY2lmaWVkIGEgcGF0aCB0byB0ZXN0cywgdGhlIHNwZWNpZmllZCBwYXRoIHdpbGwgYmVcbiAgICAgICAgLy8gY29uc2lkZXJlZCBhcyB0aGUgYnJvd3NlciBhcmd1bWVudCwgYW5kIHRoZSB0ZXN0cyBwYXRoIGFyZ3VtZW50IHdpbGwgaGF2ZSB0aGUgcHJlZGVmaW5lZCBkZWZhdWx0IHZhbHVlLlxuICAgICAgICAvLyBJdCdzIHZlcnkgYW1iaWd1b3VzIGZvciB0aGUgdXNlciwgd2hvIG1pZ2h0IGJlIGNvbmZ1c2VkIGJ5IGNvbXBpbGF0aW9uIGVycm9ycyBmcm9tIGFuIHVuZXhwZWN0ZWQgdGVzdC5cbiAgICAgICAgLy8gU28sIHdlIG5lZWQgdG8gcmV0cmlldmUgdGhlIGJyb3dzZXIgYWxpYXNlcyBhbmQgcGF0aHMgYmVmb3JlIHRlc3RzIGNvbXBpbGF0aW9uLlxuICAgICAgICBjb25zdCBicm93c2VySW5mbyA9IGF3YWl0IHRoaXMuX2dldEJyb3dzZXJJbmZvKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2NhblVzZVBhcmFsbGVsQm9vdHN0cmFwcGluZyhicm93c2VySW5mbykpXG4gICAgICAgICAgICByZXR1cm4geyByZXBvcnRlclBsdWdpbnMsIC4uLmF3YWl0IHRoaXMuX2Jvb3RzdHJhcFBhcmFsbGVsKGJyb3dzZXJJbmZvKSB9O1xuXG4gICAgICAgIHJldHVybiB7IHJlcG9ydGVyUGx1Z2lucywgLi4uYXdhaXQgdGhpcy5fYm9vdHN0cmFwU2VxdWVuY2UoYnJvd3NlckluZm8pIH07XG4gICAgfVxufVxuIl19
