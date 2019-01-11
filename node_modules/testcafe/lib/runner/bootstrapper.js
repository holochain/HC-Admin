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
        return (0, _asyncToGenerator3.default)(function* () {
            const isLocalPromises = browserInfo.map(function (browser) {
                return browser.provider.isLocalBrowser(null, browserInfo.browserName);
            });
            const isLocalBrowsers = yield _pinkie2.default.all(isLocalPromises);

            return isLocalBrowsers.every(function (result) {
                return result;
            });
        })();
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

            if (yield _this7._canUseParallelBootstrapping(browserInfo)) return (0, _extends3.default)({ reporterPlugins }, (yield _this7._bootstrapParallel(browserInfo)));

            return (0, _extends3.default)({ reporterPlugins }, (yield _this7._bootstrapSequence(browserInfo)));
        })();
    }
}
exports.default = Bootstrapper;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvYm9vdHN0cmFwcGVyLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfQVBQX0lOSVRfREVMQVkiLCJCb290c3RyYXBwZXIiLCJjb25zdHJ1Y3RvciIsImJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheSIsImNvbmN1cnJlbmN5Iiwic291cmNlcyIsImJyb3dzZXJzIiwicmVwb3J0ZXJzIiwiZmlsdGVyIiwiYXBwQ29tbWFuZCIsImFwcEluaXREZWxheSIsImRpc2FibGVUZXN0U3ludGF4VmFsaWRhdGlvbiIsIl9zcGxpdEJyb3dzZXJJbmZvIiwiYnJvd3NlckluZm8iLCJyZW1vdGVzIiwiYXV0b21hdGVkIiwiZm9yRWFjaCIsImJyb3dzZXIiLCJCcm93c2VyQ29ubmVjdGlvbiIsInB1c2giLCJfZ2V0QnJvd3NlckluZm8iLCJsZW5ndGgiLCJHZW5lcmFsRXJyb3IiLCJNRVNTQUdFIiwiYnJvd3Nlck5vdFNldCIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJicm93c2VyUHJvdmlkZXJQb29sIiwiZ2V0QnJvd3NlckluZm8iLCJfY3JlYXRlQXV0b21hdGVkQ29ubmVjdGlvbnMiLCJfZ2V0QnJvd3NlckNvbm5lY3Rpb25zIiwiY2Fubm90RGl2aWRlUmVtb3Rlc0NvdW50QnlDb25jdXJyZW5jeSIsImJyb3dzZXJDb25uZWN0aW9ucyIsImNvbmNhdCIsIkJyb3dzZXJTZXQiLCJmcm9tIiwiX2dldFRlc3RzIiwidGVzdFNvdXJjZXNOb3RTZXQiLCJwYXJzZWRGaWxlTGlzdCIsInByb2Nlc3MiLCJjd2QiLCJjb21waWxlciIsIkNvbXBpbGVyIiwidGVzdHMiLCJnZXRUZXN0cyIsInRlc3RzV2l0aE9ubHlGbGFnIiwidGVzdCIsIm9ubHkiLCJuYW1lIiwiZml4dHVyZSIsInBhdGgiLCJtZXRhIiwibm9UZXN0c1RvUnVuIiwiX2dldFJlcG9ydGVyUGx1Z2lucyIsInN0ZG91dFJlcG9ydGVycyIsInIiLCJvdXRTdHJlYW0iLCJzdGRvdXQiLCJtdWx0aXBsZVN0ZG91dFJlcG9ydGVycyIsImpvaW4iLCJwbHVnaW5GYWN0b3J5IiwicmVxdWlyZSIsImVyciIsImNhbnRGaW5kUmVwb3J0ZXJGb3JBbGlhcyIsInBsdWdpbiIsIl9zdGFydFRlc3RlZEFwcCIsInRlc3RlZEFwcCIsIlRlc3RlZEFwcCIsInN0YXJ0IiwiX2NhblVzZVBhcmFsbGVsQm9vdHN0cmFwcGluZyIsImlzTG9jYWxQcm9taXNlcyIsInByb3ZpZGVyIiwiaXNMb2NhbEJyb3dzZXIiLCJicm93c2VyTmFtZSIsImlzTG9jYWxCcm93c2VycyIsImV2ZXJ5IiwicmVzdWx0IiwiX2Jvb3RzdHJhcFNlcXVlbmNlIiwiYnJvd3NlclNldCIsIl93cmFwQm9vdHN0cmFwcGluZ1Byb21pc2UiLCJwcm9taXNlIiwidGhlbiIsImVycm9yIiwiY2F0Y2giLCJfaGFuZGxlQm9vdHN0cmFwcGluZ0Vycm9yIiwiYnJvd3NlclNldFN0YXR1cyIsInRlc3RzU3RhdHVzIiwidGVzdGVkQXBwU3RhdHVzIiwiZGlzcG9zZSIsImtpbGwiLCJfYm9vdHN0cmFwUGFyYWxsZWwiLCJib290c3RyYXBwaW5nUHJvbWlzZXMiLCJib290c3RyYXBwaW5nU3RhdHVzZXMiLCJzb21lIiwic3RhdHVzIiwiY3JlYXRlUnVubmFibGVDb25maWd1cmF0aW9uIiwicmVwb3J0ZXJQbHVnaW5zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNQSx5QkFBeUIsSUFBL0I7O0FBRWUsTUFBTUMsWUFBTixDQUFtQjtBQUM5QkMsZ0JBQWFDLHdCQUFiLEVBQXVDO0FBQ25DLGFBQUtBLHdCQUFMLEdBQWdDQSx3QkFBaEM7O0FBRUEsYUFBS0MsV0FBTCxHQUFtQyxDQUFuQztBQUNBLGFBQUtDLE9BQUwsR0FBbUMsRUFBbkM7QUFDQSxhQUFLQyxRQUFMLEdBQW1DLEVBQW5DO0FBQ0EsYUFBS0MsU0FB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QUFSLENBQVlrRSxxQkFBWixDQUFwQzs7QUFFQSxnQkFBSUMsc0JBQXNCQyxJQUF0QixDQUEyQjtBQUFBLHVCQUFVQyxPQUFPWixLQUFqQjtBQUFBLGFBQTNCLENBQUosRUFDSSxNQUFNLE9BQUtFLHlCQUFMLENBQStCUSxxQkFBL0IsQ0FBTjs7QUFaK0Isd0NBY0lBLHNCQUFzQmxFLEdBQXRCLENBQTBCO0FBQUEsdUJBQVVvRSxPQUFPbEIsTUFBakI7QUFBQSxhQUExQixDQWRKOztBQUFBLGtCQWM1QkUsVUFkNEI7QUFBQSxrQkFjaEJuQyxLQWRnQjtBQUFBLGtCQWNUdUIsU0FkUzs7O0FBZ0JuQyxtQkFBTyxFQUFFWSxVQUFGLEVBQWNuQyxLQUFkLEVBQXFCdUIsU0FBckIsRUFBUDtBQWhCbUM7QUFpQnRDOztBQUVEO0FBQ002QiwrQkFBTixHQUFxQztBQUFBOztBQUFBO0FBQ2pDLGtCQUFNQyxrQkFBa0IsT0FBSzNDLG1CQUFMLEVBQXhCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQU16QyxjQUFjLE1BQU0sT0FBS08sZUFBTCxFQUExQjs7QUFFQSxnQkFBSSxNQUFNLE9BQUtrRCw0QkFBTCxDQUFrQ3pELFdBQWxDLENBQVYsRUFDSSxnQ0FBU29GLGVBQVQsS0FBNkIsTUFBTSxPQUFLTixrQkFBTCxDQUF3QjlFLFdBQXhCLENBQW5DOztBQUVKLDRDQUFTb0YsZUFBVCxLQUE2QixNQUFNLE9BQUtuQixrQkFBTCxDQUF3QmpFLFdBQXhCLENBQW5DO0FBWmlDO0FBYXBDO0FBak02QjtrQkFBYlosWSIsImZpbGUiOiJydW5uZXIvYm9vdHN0cmFwcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNVbmRlZmluZWQsIGZpbHRlciwgZmxhdHRlbiwgY2h1bmssIHRpbWVzIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5pbXBvcnQgQ29tcGlsZXIgZnJvbSAnLi4vY29tcGlsZXInO1xuaW1wb3J0IEJyb3dzZXJDb25uZWN0aW9uIGZyb20gJy4uL2Jyb3dzZXIvY29ubmVjdGlvbic7XG5pbXBvcnQgeyBHZW5lcmFsRXJyb3IgfSBmcm9tICcuLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQgYnJvd3NlclByb3ZpZGVyUG9vbCBmcm9tICcuLi9icm93c2VyL3Byb3ZpZGVyL3Bvb2wnO1xuaW1wb3J0IE1FU1NBR0UgZnJvbSAnLi4vZXJyb3JzL3J1bnRpbWUvbWVzc2FnZSc7XG5pbXBvcnQgQnJvd3NlclNldCBmcm9tICcuL2Jyb3dzZXItc2V0JztcbmltcG9ydCBUZXN0ZWRBcHAgZnJvbSAnLi90ZXN0ZWQtYXBwJztcbmltcG9ydCBwYXJzZUZpbGVMaXN0IGZyb20gJy4uL3V0aWxzL3BhcnNlLWZpbGUtbGlzdCc7XG5cbmNvbnN0IERFRkFVTFRfQVBQX0lOSVRfREVMQVkgPSAxMDAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb290c3RyYXBwZXIge1xuICAgIGNvbnN0cnVjdG9yIChicm93c2VyQ29ubmVjdGlvbkdhdGV3YXkpIHtcbiAgICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbkdhdGV3YXkgPSBicm93c2VyQ29ubmVjdGlvbkdhdGV3YXk7XG5cbiAgICAgICAgdGhpcy5jb25jdXJyZW5jeSAgICAgICAgICAgICAgICAgPSAxO1xuICAgICAgICB0aGlzLnNvdXJjZXMgICAgICAgICAgICAgICAgICAgICA9IFtdO1xuICAgICAgICB0aGlzLmJyb3dzZXJzICAgICAgICAgICAgICAgICAgICA9IFtdO1xuICAgICAgICB0aGlzLnJlcG9ydGVycyAgICAgICAgICAgICAgICAgICA9IFtdO1xuICAgICAgICB0aGlzLmZpbHRlciAgICAgICAgICAgICAgICAgICAgICA9IG51bGw7XG4gICAgICAgIHRoaXMuYXBwQ29tbWFuZCAgICAgICAgICAgICAgICAgID0gbnVsbDtcbiAgICAgICAgdGhpcy5hcHBJbml0RGVsYXkgICAgICAgICAgICAgICAgPSBERUZBVUxUX0FQUF9JTklUX0RFTEFZO1xuICAgICAgICB0aGlzLmRpc2FibGVUZXN0U3ludGF4VmFsaWRhdGlvbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBfc3BsaXRCcm93c2VySW5mbyAoYnJvd3NlckluZm8pIHtcbiAgICAgICAgY29uc3QgcmVtb3RlcyAgID0gW107XG4gICAgICAgIGNvbnN0IGF1dG9tYXRlZCA9IFtdO1xuXG4gICAgICAgIGJyb3dzZXJJbmZvLmZvckVhY2goYnJvd3NlciA9PiB7XG4gICAgICAgICAgICBpZiAoYnJvd3NlciBpbnN0YW5jZW9mIEJyb3dzZXJDb25uZWN0aW9uKVxuICAgICAgICAgICAgICAgIHJlbW90ZXMucHVzaChicm93c2VyKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhdXRvbWF0ZWQucHVzaChicm93c2VyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHsgcmVtb3RlcywgYXV0b21hdGVkIH07XG4gICAgfVxuXG4gICAgYXN5bmMgX2dldEJyb3dzZXJJbmZvICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmJyb3dzZXJzLmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IG5ldyBHZW5lcmFsRXJyb3IoTUVTU0FHRS5icm93c2VyTm90U2V0KTtcblxuICAgICAgICBjb25zdCBicm93c2VySW5mbyA9IGF3YWl0IFByb21pc2UuYWxsKHRoaXMuYnJvd3NlcnMubWFwKGJyb3dzZXIgPT4gYnJvd3NlclByb3ZpZGVyUG9vbC5nZXRCcm93c2VySW5mbyhicm93c2VyKSkpO1xuXG4gICAgICAgIHJldHVybiBmbGF0dGVuKGJyb3dzZXJJbmZvKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQXV0b21hdGVkQ29ubmVjdGlvbnMgKGJyb3dzZXJJbmZvKSB7XG4gICAgICAgIGlmICghYnJvd3NlckluZm8pXG4gICAgICAgICAgICByZXR1cm4gW107XG5cbiAgICAgICAgcmV0dXJuIGJyb3dzZXJJbmZvXG4gICAgICAgICAgICAubWFwKGJyb3dzZXIgPT4gdGltZXModGhpcy5jb25jdXJyZW5jeSwgKCkgPT4gbmV3IEJyb3dzZXJDb25uZWN0aW9uKHRoaXMuYnJvd3NlckNvbm5lY3Rpb25HYXRld2F5LCBicm93c2VyKSkpO1xuICAgIH1cblxuICAgIGFzeW5jIF9nZXRCcm93c2VyQ29ubmVjdGlvbnMgKGJyb3dzZXJJbmZvKSB7XG4gICAgICAgIGNvbnN0IHsgYXV0b21hdGVkLCByZW1vdGVzIH0gPSBCb290c3RyYXBwZXIuX3NwbGl0QnJvd3NlckluZm8oYnJvd3NlckluZm8pO1xuXG4gICAgICAgIGlmIChyZW1vdGVzICYmIHJlbW90ZXMubGVuZ3RoICUgdGhpcy5jb25jdXJyZW5jeSlcbiAgICAgICAgICAgIHRocm93IG5ldyBHZW5lcmFsRXJyb3IoTUVTU0FHRS5jYW5ub3REaXZpZGVSZW1vdGVzQ291bnRCeUNvbmN1cnJlbmN5KTtcblxuICAgICAgICBsZXQgYnJvd3NlckNvbm5lY3Rpb25zID0gdGhpcy5fY3JlYXRlQXV0b21hdGVkQ29ubmVjdGlvbnMoYXV0b21hdGVkKTtcblxuICAgICAgICBicm93c2VyQ29ubmVjdGlvbnMgPSBicm93c2VyQ29ubmVjdGlvbnMuY29uY2F0KGNodW5rKHJlbW90ZXMsIHRoaXMuY29uY3VycmVuY3kpKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgQnJvd3NlclNldC5mcm9tKGJyb3dzZXJDb25uZWN0aW9ucyk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2dldFRlc3RzICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNvdXJjZXMubGVuZ3RoKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLnRlc3RTb3VyY2VzTm90U2V0KTtcblxuICAgICAgICBjb25zdCBwYXJzZWRGaWxlTGlzdCA9IGF3YWl0IHBhcnNlRmlsZUxpc3QodGhpcy5zb3VyY2VzLCBwcm9jZXNzLmN3ZCgpKTtcbiAgICAgICAgY29uc3QgY29tcGlsZXIgICAgICAgPSBuZXcgQ29tcGlsZXIocGFyc2VkRmlsZUxpc3QsIHRoaXMuZGlzYWJsZVRlc3RTeW50YXhWYWxpZGF0aW9uKTtcbiAgICAgICAgbGV0IHRlc3RzICAgICAgICAgICAgPSBhd2FpdCBjb21waWxlci5nZXRUZXN0cygpO1xuXG4gICAgICAgIGNvbnN0IHRlc3RzV2l0aE9ubHlGbGFnID0gdGVzdHMuZmlsdGVyKHRlc3QgPT4gdGVzdC5vbmx5KTtcblxuICAgICAgICBpZiAodGVzdHNXaXRoT25seUZsYWcubGVuZ3RoKVxuICAgICAgICAgICAgdGVzdHMgPSB0ZXN0c1dpdGhPbmx5RmxhZztcblxuICAgICAgICBpZiAodGhpcy5maWx0ZXIpXG4gICAgICAgICAgICB0ZXN0cyA9IHRlc3RzLmZpbHRlcih0ZXN0ID0+IHRoaXMuZmlsdGVyKHRlc3QubmFtZSwgdGVzdC5maXh0dXJlLm5hbWUsIHRlc3QuZml4dHVyZS5wYXRoLCB0ZXN0Lm1ldGEsIHRlc3QuZml4dHVyZS5tZXRhKSk7XG5cbiAgICAgICAgaWYgKCF0ZXN0cy5sZW5ndGgpXG4gICAgICAgICAgICB0aHJvdyBuZXcgR2VuZXJhbEVycm9yKE1FU1NBR0Uubm9UZXN0c1RvUnVuKTtcblxuICAgICAgICByZXR1cm4gdGVzdHM7XG4gICAgfVxuXG4gICAgX2dldFJlcG9ydGVyUGx1Z2lucyAoKSB7XG4gICAgICAgIGNvbnN0IHN0ZG91dFJlcG9ydGVycyA9IGZpbHRlcih0aGlzLnJlcG9ydGVycywgciA9PiBpc1VuZGVmaW5lZChyLm91dFN0cmVhbSkgfHwgci5vdXRTdHJlYW0gPT09IHByb2Nlc3Muc3Rkb3V0KTtcblxuICAgICAgICBpZiAoc3Rkb3V0UmVwb3J0ZXJzLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICB0aHJvdyBuZXcgR2VuZXJhbEVycm9yKE1FU1NBR0UubXVsdGlwbGVTdGRvdXRSZXBvcnRlcnMsIHN0ZG91dFJlcG9ydGVycy5tYXAociA9PiByLm5hbWUpLmpvaW4oJywgJykpO1xuXG4gICAgICAgIGlmICghdGhpcy5yZXBvcnRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lOiAgICAgICdzcGVjJyxcbiAgICAgICAgICAgICAgICBvdXRTdHJlYW06IHByb2Nlc3Muc3Rkb3V0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlcG9ydGVycy5tYXAoKHsgbmFtZSwgb3V0U3RyZWFtIH0pID0+IHtcbiAgICAgICAgICAgIGxldCBwbHVnaW5GYWN0b3J5ID0gbmFtZTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwbHVnaW5GYWN0b3J5ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luRmFjdG9yeSA9IHJlcXVpcmUoJ3Rlc3RjYWZlLXJlcG9ydGVyLScgKyBuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgR2VuZXJhbEVycm9yKE1FU1NBR0UuY2FudEZpbmRSZXBvcnRlckZvckFsaWFzLCBuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcGx1Z2luOiBwbHVnaW5GYWN0b3J5KCksXG4gICAgICAgICAgICAgICAgb3V0U3RyZWFtXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBfc3RhcnRUZXN0ZWRBcHAgKCkge1xuICAgICAgICBpZiAodGhpcy5hcHBDb21tYW5kKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXN0ZWRBcHAgPSBuZXcgVGVzdGVkQXBwKCk7XG5cbiAgICAgICAgICAgIGF3YWl0IHRlc3RlZEFwcC5zdGFydCh0aGlzLmFwcENvbW1hbmQsIHRoaXMuYXBwSW5pdERlbGF5KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRlc3RlZEFwcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGFzeW5jIF9jYW5Vc2VQYXJhbGxlbEJvb3RzdHJhcHBpbmcgKGJyb3dzZXJJbmZvKSB7XG4gICAgICAgIGNvbnN0IGlzTG9jYWxQcm9taXNlcyA9IGJyb3dzZXJJbmZvLm1hcChicm93c2VyID0+IGJyb3dzZXIucHJvdmlkZXIuaXNMb2NhbEJyb3dzZXIobnVsbCwgYnJvd3NlckluZm8uYnJvd3Nlck5hbWUpKTtcbiAgICAgICAgY29uc3QgaXNMb2NhbEJyb3dzZXJzID0gYXdhaXQgUHJvbWlzZS5hbGwoaXNMb2NhbFByb21pc2VzKTtcblxuICAgICAgICByZXR1cm4gaXNMb2NhbEJyb3dzZXJzLmV2ZXJ5KHJlc3VsdCA9PiByZXN1bHQpO1xuICAgIH1cblxuICAgIGFzeW5jIF9ib290c3RyYXBTZXF1ZW5jZSAoYnJvd3NlckluZm8pIHtcbiAgICAgICAgY29uc3QgdGVzdHMgICAgICAgPSBhd2FpdCB0aGlzLl9nZXRUZXN0cygpO1xuICAgICAgICBjb25zdCB0ZXN0ZWRBcHAgICA9IGF3YWl0IHRoaXMuX3N0YXJ0VGVzdGVkQXBwKCk7XG4gICAgICAgIGNvbnN0IGJyb3dzZXJTZXQgID0gYXdhaXQgdGhpcy5fZ2V0QnJvd3NlckNvbm5lY3Rpb25zKGJyb3dzZXJJbmZvKTtcblxuICAgICAgICByZXR1cm4geyB0ZXN0cywgdGVzdGVkQXBwLCBicm93c2VyU2V0IH07XG4gICAgfVxuXG4gICAgX3dyYXBCb290c3RyYXBwaW5nUHJvbWlzZSAocHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+ICh7IGVycm9yOiBudWxsLCByZXN1bHQgfSkpXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gKHsgcmVzdWx0OiBudWxsLCBlcnJvciB9KSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2hhbmRsZUJvb3RzdHJhcHBpbmdFcnJvciAoW2Jyb3dzZXJTZXRTdGF0dXMsIHRlc3RzU3RhdHVzLCB0ZXN0ZWRBcHBTdGF0dXNdKSB7XG4gICAgICAgIGlmICghYnJvd3NlclNldFN0YXR1cy5lcnJvcilcbiAgICAgICAgICAgIGF3YWl0IGJyb3dzZXJTZXRTdGF0dXMucmVzdWx0LmRpc3Bvc2UoKTtcblxuICAgICAgICBpZiAoIXRlc3RlZEFwcFN0YXR1cy5lcnJvciAmJiB0ZXN0ZWRBcHBTdGF0dXMucmVzdWx0KVxuICAgICAgICAgICAgYXdhaXQgdGVzdGVkQXBwU3RhdHVzLnJlc3VsdC5raWxsKCk7XG5cbiAgICAgICAgaWYgKHRlc3RzU3RhdHVzLmVycm9yKVxuICAgICAgICAgICAgdGhyb3cgdGVzdHNTdGF0dXMuZXJyb3I7XG4gICAgICAgIGVsc2UgaWYgKHRlc3RlZEFwcFN0YXR1cy5lcnJvcilcbiAgICAgICAgICAgIHRocm93IHRlc3RlZEFwcFN0YXR1cy5lcnJvcjtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgYnJvd3NlclNldFN0YXR1cy5lcnJvcjtcbiAgICB9XG5cbiAgICBhc3luYyBfYm9vdHN0cmFwUGFyYWxsZWwgKGJyb3dzZXJJbmZvKSB7XG4gICAgICAgIGxldCBib290c3RyYXBwaW5nUHJvbWlzZXMgPSBbXG4gICAgICAgICAgICB0aGlzLl9nZXRCcm93c2VyQ29ubmVjdGlvbnMoYnJvd3NlckluZm8pLFxuICAgICAgICAgICAgdGhpcy5fZ2V0VGVzdHMoKSxcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0VGVzdGVkQXBwKClcbiAgICAgICAgXTtcblxuICAgICAgICBib290c3RyYXBwaW5nUHJvbWlzZXMgPSBib290c3RyYXBwaW5nUHJvbWlzZXMubWFwKHByb21pc2UgPT4gdGhpcy5fd3JhcEJvb3RzdHJhcHBpbmdQcm9taXNlKHByb21pc2UpKTtcblxuICAgICAgICBjb25zdCBib290c3RyYXBwaW5nU3RhdHVzZXMgPSBhd2FpdCBQcm9taXNlLmFsbChib290c3RyYXBwaW5nUHJvbWlzZXMpO1xuXG4gICAgICAgIGlmIChib290c3RyYXBwaW5nU3RhdHVzZXMuc29tZShzdGF0dXMgPT4gc3RhdHVzLmVycm9yKSlcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZUJvb3RzdHJhcHBpbmdFcnJvcihib290c3RyYXBwaW5nU3RhdHVzZXMpO1xuXG4gICAgICAgIGNvbnN0IFticm93c2VyU2V0LCB0ZXN0cywgdGVzdGVkQXBwXSA9IGJvb3RzdHJhcHBpbmdTdGF0dXNlcy5tYXAoc3RhdHVzID0+IHN0YXR1cy5yZXN1bHQpO1xuXG4gICAgICAgIHJldHVybiB7IGJyb3dzZXJTZXQsIHRlc3RzLCB0ZXN0ZWRBcHAgfTtcbiAgICB9XG5cbiAgICAvLyBBUElcbiAgICBhc3luYyBjcmVhdGVSdW5uYWJsZUNvbmZpZ3VyYXRpb24gKCkge1xuICAgICAgICBjb25zdCByZXBvcnRlclBsdWdpbnMgPSB0aGlzLl9nZXRSZXBvcnRlclBsdWdpbnMoKTtcblxuICAgICAgICAvLyBOT1RFOiBJZiBhIHVzZXIgZm9yZ290IHRvIHNwZWNpZnkgYSBicm93c2VyLCBidXQgaGFzIHNwZWNpZmllZCBhIHBhdGggdG8gdGVzdHMsIHRoZSBzcGVjaWZpZWQgcGF0aCB3aWxsIGJlXG4gICAgICAgIC8vIGNvbnNpZGVyZWQgYXMgdGhlIGJyb3dzZXIgYXJndW1lbnQsIGFuZCB0aGUgdGVzdHMgcGF0aCBhcmd1bWVudCB3aWxsIGhhdmUgdGhlIHByZWRlZmluZWQgZGVmYXVsdCB2YWx1ZS5cbiAgICAgICAgLy8gSXQncyB2ZXJ5IGFtYmlndW91cyBmb3IgdGhlIHVzZXIsIHdobyBtaWdodCBiZSBjb25mdXNlZCBieSBjb21waWxhdGlvbiBlcnJvcnMgZnJvbSBhbiB1bmV4cGVjdGVkIHRlc3QuXG4gICAgICAgIC8vIFNvLCB3ZSBuZWVkIHRvIHJldHJpZXZlIHRoZSBicm93c2VyIGFsaWFzZXMgYW5kIHBhdGhzIGJlZm9yZSB0ZXN0cyBjb21waWxhdGlvbi5cbiAgICAgICAgY29uc3QgYnJvd3NlckluZm8gPSBhd2FpdCB0aGlzLl9nZXRCcm93c2VySW5mbygpO1xuXG4gICAgICAgIGlmIChhd2FpdCB0aGlzLl9jYW5Vc2VQYXJhbGxlbEJvb3RzdHJhcHBpbmcoYnJvd3NlckluZm8pKVxuICAgICAgICAgICAgcmV0dXJuIHsgcmVwb3J0ZXJQbHVnaW5zLCAuLi5hd2FpdCB0aGlzLl9ib290c3RyYXBQYXJhbGxlbChicm93c2VySW5mbykgfTtcblxuICAgICAgICByZXR1cm4geyByZXBvcnRlclBsdWdpbnMsIC4uLmF3YWl0IHRoaXMuX2Jvb3RzdHJhcFNlcXVlbmNlKGJyb3dzZXJJbmZvKSB9O1xuICAgIH1cbn1cbiJdfQ==
