'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _events = require('events');

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _timeLimitPromise = require('time-limit-promise');

var _timeLimitPromise2 = _interopRequireDefault(_timeLimitPromise);

var _promisifyEvent = require('promisify-event');

var _promisifyEvent2 = _interopRequireDefault(_promisifyEvent);

var _lodash = require('lodash');

var _mapReverse = require('map-reverse');

var _mapReverse2 = _interopRequireDefault(_mapReverse);

var _runtime = require('../errors/runtime');

var _message = require('../errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOCAL_BROWSERS_READY_TIMEOUT = 2 * 60 * 1000;
const REMOTE_BROWSERS_READY_TIMEOUT = 6 * 60 * 1000;

class BrowserSet extends _events.EventEmitter {
    constructor(browserConnectionGroups) {
        super();

        this.RELEASE_TIMEOUT = 10000;

        this.pendingReleases = [];

        this.browserConnectionGroups = browserConnectionGroups;
        this.browserConnections = (0, _lodash.flatten)(browserConnectionGroups);

        this.connectionsReadyTimeout = null;

        this.browserErrorHandler = error => this.emit('error', error);

        this.browserConnections.forEach(bc => bc.on('error', this.browserErrorHandler));

        // NOTE: We're setting an empty error handler, because Node kills the process on an 'error' event
        // if there is no handler. See: https://nodejs.org/api/events.html#events_class_events_eventemitter
        this.on('error', _lodash.noop);
    }

    static _waitIdle(bc) {
        return (0, _asyncToGenerator3.default)(function* () {
            if (bc.idle || !bc.ready) return;

            yield (0, _promisifyEvent2.default)(bc, 'idle');
        })();
    }

    static _closeConnection(bc) {
        return (0, _asyncToGenerator3.default)(function* () {
            if (bc.closed || !bc.ready) return;

            bc.close();

            yield (0, _promisifyEvent2.default)(bc, 'closed');
        })();
    }

    _getReadyTimeout() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const isLocalBrowser = function isLocalBrowser(connection) {
                return connection.provider.isLocalBrowser(connection.id, connection.browserInfo.browserName);
            };
            const remoteBrowsersExist = (yield _pinkie2.default.all(_this.browserConnections.map(isLocalBrowser))).indexOf(false) > -1;

            return remoteBrowsersExist ? REMOTE_BROWSERS_READY_TIMEOUT : LOCAL_BROWSERS_READY_TIMEOUT;
        })();
    }

    _createPendingConnectionPromise(readyPromise, timeout, timeoutError) {
        const timeoutPromise = new _pinkie2.default((_, reject) => {
            this.connectionsReadyTimeout = setTimeout(() => reject(timeoutError), timeout);
        });

        return _pinkie2.default.race([readyPromise, timeoutPromise]).then(value => {
            this.connectionsReadyTimeout.unref();
            return value;
        }, error => {
            this.connectionsReadyTimeout.unref();
            throw error;
        });
    }

    _waitConnectionsOpened() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const connectionsReadyPromise = _pinkie2.default.all(_this2.browserConnections.filter(function (bc) {
                return !bc.opened;
            }).map(function (bc) {
                return (0, _promisifyEvent2.default)(bc, 'opened');
            }));

            const timeoutError = new _runtime.GeneralError(_message2.default.cantEstablishBrowserConnection);
            const readyTimeout = yield _this2._getReadyTimeout();

            yield _this2._createPendingConnectionPromise(connectionsReadyPromise, readyTimeout, timeoutError);
        })();
    }

    _checkForDisconnections() {
        const disconnectedUserAgents = this.browserConnections.filter(bc => bc.closed).map(bc => bc.userAgent);

        if (disconnectedUserAgents.length) throw new _runtime.GeneralError(_message2.default.cantRunAgainstDisconnectedBrowsers, disconnectedUserAgents.join(', '));
    }

    //API
    static from(browserConnections) {
        const browserSet = new BrowserSet(browserConnections);

        const prepareConnection = _pinkie2.default.resolve().then(() => {
            browserSet._checkForDisconnections();
            return browserSet._waitConnectionsOpened();
        }).then(() => browserSet);

        return _pinkie2.default.race([prepareConnection, (0, _promisifyEvent2.default)(browserSet, 'error')]).catch((() => {
            var _ref = (0, _asyncToGenerator3.default)(function* (error) {
                yield browserSet.dispose();

                throw error;
            });

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        })());
    }

    releaseConnection(bc) {
        if (this.browserConnections.indexOf(bc) < 0) return _pinkie2.default.resolve();

        (0, _lodash.pull)(this.browserConnections, bc);

        bc.removeListener('error', this.browserErrorHandler);

        const appropriateStateSwitch = !bc.permanent ? BrowserSet._closeConnection(bc) : BrowserSet._waitIdle(bc);

        const release = (0, _timeLimitPromise2.default)(appropriateStateSwitch, this.RELEASE_TIMEOUT).then(() => (0, _lodash.pull)(this.pendingReleases, release));

        this.pendingReleases.push(release);

        return release;
    }

    dispose() {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            // NOTE: When browserConnection is cancelled, it is removed from
            // the this.connections array, which leads to shifting indexes
            // towards the beginning. So, we must copy the array in order to iterate it,
            // or we can perform iteration from the end to the beginning.
            if (_this3.connectionsReadyTimeout) _this3.connectionsReadyTimeout.unref();

            (0, _mapReverse2.default)(_this3.browserConnections, function (bc) {
                return _this3.releaseConnection(bc);
            });

            yield _pinkie2.default.all(_this3.pendingReleases);
        })();
    }
}
exports.default = BrowserSet;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvYnJvd3Nlci1zZXQuanMiXSwibmFtZXMiOlsiTE9DQUxfQlJPV1NFUlNfUkVBRFlfVElNRU9VVCIsIlJFTU9URV9CUk9XU0VSU19SRUFEWV9USU1FT1VUIiwiQnJvd3NlclNldCIsIkV2ZW50RW1pdHRlciIsImNvbnN0cnVjdG9yIiwiYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMiLCJSRUxFQVNFX1RJTUVPVVQiLCJwZW5kaW5nUmVsZWFzZXMiLCJicm93c2VyQ29ubmVjdGlvbnMiLCJjb25uZWN0aW9uc1JlYWR5VGltZW91dCIsImJyb3dzZXJFcnJvckhhbmRsZXIiLCJlcnJvciIsImVtaXQiLCJmb3JFYWNoIiwiYmMiLCJvbiIsIm5vb3AiLCJfd2FpdElkbGUiLCJpZGxlIiwicmVhZHkiLCJfY2xvc2VDb25uZWN0aW9uIiwiY2xvc2VkIiwiY2xvc2UiLCJfZ2V0UmVhZHlUaW1lb3V0IiwiaXNMb2NhbEJyb3dzZXIiLCJjb25uZWN0aW9uIiwicHJvdmlkZXIiLCJpZCIsImJyb3dzZXJJbmZvIiwiYnJvd3Nlck5hbWUiLCJyZW1vdGVCcm93c2Vyc0V4aXN0IiwiUHJvbWlzZSIsImFsbCIsIm1hcCIsImluZGV4T2YiLCJfY3JlYXRlUGVuZGluZ0Nvbm5lY3Rpb25Qcm9taXNlIiwicmVhZHlQcm9taXNlIiwidGltZW91dCIsInRpbWVvdXRFcnJvciIsInRpbWVvdXRQcm9taXNlIiwiXyIsInJlamVjdCIsInNldFRpbWVvdXQiLCJyYWNlIiwidGhlbiIsInZhbHVlIiwidW5yZWYiLCJfd2FpdENvbm5lY3Rpb25zT3BlbmVkIiwiY29ubmVjdGlvbnNSZWFkeVByb21pc2UiLCJmaWx0ZXIiLCJvcGVuZWQiLCJHZW5lcmFsRXJyb3IiLCJNRVNTQUdFIiwiY2FudEVzdGFibGlzaEJyb3dzZXJDb25uZWN0aW9uIiwicmVhZHlUaW1lb3V0IiwiX2NoZWNrRm9yRGlzY29ubmVjdGlvbnMiLCJkaXNjb25uZWN0ZWRVc2VyQWdlbnRzIiwidXNlckFnZW50IiwibGVuZ3RoIiwiY2FudFJ1bkFnYWluc3REaXNjb25uZWN0ZWRCcm93c2VycyIsImpvaW4iLCJmcm9tIiwiYnJvd3NlclNldCIsInByZXBhcmVDb25uZWN0aW9uIiwicmVzb2x2ZSIsImNhdGNoIiwiZGlzcG9zZSIsInJlbGVhc2VDb25uZWN0aW9uIiwicmVtb3ZlTGlzdGVuZXIiLCJhcHByb3ByaWF0ZVN0YXRlU3dpdGNoIiwicGVybWFuZW50IiwicmVsZWFzZSIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsTUFBTUEsK0JBQWdDLElBQUksRUFBSixHQUFTLElBQS9DO0FBQ0EsTUFBTUMsZ0NBQWdDLElBQUksRUFBSixHQUFTLElBQS9DOztBQUVlLE1BQU1DLFVBQU4sU0FBeUJDLG9CQUF6QixDQUFzQztBQUNqREMsZ0JBQWFDLHVCQUFiLEVBQXNDO0FBQ2xDOztBQUVBLGFBQUtDLGVBQUwsR0FBdUIsS0FBdkI7O0FBRUEsYUFBS0MsZUFBTCxHQUF1QixFQUF2Qjs7QUFFQSxhQUFLRix1QkFBTCxHQUErQkEsdUJBQS9CO0FBQ0EsYUFBS0csa0JBQUwsR0FBK0IscUJBQVFILHVCQUFSLENBQS9COztBQUVBLGFBQUtJLHVCQUFMLEdBQStCLElBQS9COztBQUVBLGFBQUtDLG1CQUFMLEdBQTJCQyxTQUFTLEtBQUtDLElBQUwsQ0FBVSxPQUFWLEVBQW1CRCxLQUFuQixDQUFwQzs7QUFFQSxhQUFLSCxrQkFBTCxDQUF3QkssT0FBeEIsQ0FBZ0NDLE1BQU1BLEdBQUdDLEVBQUgsQ0FBTSxPQUFOLEVBQWUsS0FBS0wsbUJBQXBCLENBQXRDOztBQUVBO0FBQ0E7QUFDQSxhQUFLSyxFQUFMLENBQVEsT0FBUixFQUFpQkMsWUFBakI7QUFDSDs7QUFFRCxXQUFhQyxTQUFiLENBQXdCSCxFQUF4QixFQUE0QjtBQUFBO0FBQ3hCLGdCQUFJQSxHQUFHSSxJQUFILElBQVcsQ0FBQ0os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QkFBSSxPQUFLekQsdUJBQVQsRUFDSSxPQUFLQSx1QkFBTCxDQUE2QnFDLEtBQTdCOztBQUVKLHNDQUFXLE9BQUt0QyxrQkFBaEIsRUFBb0M7QUFBQSx1QkFBTSxPQUFLMkQsaUJBQUwsQ0FBdUJyRCxFQUF2QixDQUFOO0FBQUEsYUFBcEM7O0FBRUEsa0JBQU1pQixpQkFBUUMsR0FBUixDQUFZLE9BQUt6QixlQUFqQixDQUFOO0FBVmE7QUFXaEI7QUE1SWdEO2tCQUFoQ0wsVSIsImZpbGUiOiJydW5uZXIvYnJvd3Nlci1zZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAncGlua2llJztcbmltcG9ydCBnZXRUaW1lTGltaXRlZFByb21pc2UgZnJvbSAndGltZS1saW1pdC1wcm9taXNlJztcbmltcG9ydCBwcm9taXNpZnlFdmVudCBmcm9tICdwcm9taXNpZnktZXZlbnQnO1xuaW1wb3J0IHsgbm9vcCwgcHVsbCBhcyByZW1vdmUsIGZsYXR0ZW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IG1hcFJldmVyc2UgZnJvbSAnbWFwLXJldmVyc2UnO1xuaW1wb3J0IHsgR2VuZXJhbEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzL3J1bnRpbWUnO1xuaW1wb3J0IE1FU1NBR0UgZnJvbSAnLi4vZXJyb3JzL3J1bnRpbWUvbWVzc2FnZSc7XG5cbmNvbnN0IExPQ0FMX0JST1dTRVJTX1JFQURZX1RJTUVPVVQgID0gMiAqIDYwICogMTAwMDtcbmNvbnN0IFJFTU9URV9CUk9XU0VSU19SRUFEWV9USU1FT1VUID0gNiAqIDYwICogMTAwMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJvd3NlclNldCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IgKGJyb3dzZXJDb25uZWN0aW9uR3JvdXBzKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5SRUxFQVNFX1RJTUVPVVQgPSAxMDAwMDtcblxuICAgICAgICB0aGlzLnBlbmRpbmdSZWxlYXNlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMgPSBicm93c2VyQ29ubmVjdGlvbkdyb3VwcztcbiAgICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbnMgICAgICA9IGZsYXR0ZW4oYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnNSZWFkeVRpbWVvdXQgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuYnJvd3NlckVycm9ySGFuZGxlciA9IGVycm9yID0+IHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcik7XG5cbiAgICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbnMuZm9yRWFjaChiYyA9PiBiYy5vbignZXJyb3InLCB0aGlzLmJyb3dzZXJFcnJvckhhbmRsZXIpKTtcblxuICAgICAgICAvLyBOT1RFOiBXZSdyZSBzZXR0aW5nIGFuIGVtcHR5IGVycm9yIGhhbmRsZXIsIGJlY2F1c2UgTm9kZSBraWxscyB0aGUgcHJvY2VzcyBvbiBhbiAnZXJyb3InIGV2ZW50XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGhhbmRsZXIuIFNlZTogaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbCNldmVudHNfY2xhc3NfZXZlbnRzX2V2ZW50ZW1pdHRlclxuICAgICAgICB0aGlzLm9uKCdlcnJvcicsIG5vb3ApO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBfd2FpdElkbGUgKGJjKSB7XG4gICAgICAgIGlmIChiYy5pZGxlIHx8ICFiYy5yZWFkeSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBhd2FpdCBwcm9taXNpZnlFdmVudChiYywgJ2lkbGUnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgX2Nsb3NlQ29ubmVjdGlvbiAoYmMpIHtcbiAgICAgICAgaWYgKGJjLmNsb3NlZCB8fCAhYmMucmVhZHkpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgYmMuY2xvc2UoKTtcblxuICAgICAgICBhd2FpdCBwcm9taXNpZnlFdmVudChiYywgJ2Nsb3NlZCcpO1xuICAgIH1cblxuICAgIGFzeW5jIF9nZXRSZWFkeVRpbWVvdXQgKCkge1xuICAgICAgICBjb25zdCBpc0xvY2FsQnJvd3NlciAgICAgID0gY29ubmVjdGlvbiA9PiBjb25uZWN0aW9uLnByb3ZpZGVyLmlzTG9jYWxCcm93c2VyKGNvbm5lY3Rpb24uaWQsIGNvbm5lY3Rpb24uYnJvd3NlckluZm8uYnJvd3Nlck5hbWUpO1xuICAgICAgICBjb25zdCByZW1vdGVCcm93c2Vyc0V4aXN0ID0gKGF3YWl0IFByb21pc2UuYWxsKHRoaXMuYnJvd3NlckNvbm5lY3Rpb25zLm1hcChpc0xvY2FsQnJvd3NlcikpKS5pbmRleE9mKGZhbHNlKSA+IC0xO1xuXG4gICAgICAgIHJldHVybiByZW1vdGVCcm93c2Vyc0V4aXN0ID8gUkVNT1RFX0JST1dTRVJTX1JFQURZX1RJTUVPVVQgOiBMT0NBTF9CUk9XU0VSU19SRUFEWV9USU1FT1VUO1xuICAgIH1cblxuICAgIF9jcmVhdGVQZW5kaW5nQ29ubmVjdGlvblByb21pc2UgKHJlYWR5UHJvbWlzZSwgdGltZW91dCwgdGltZW91dEVycm9yKSB7XG4gICAgICAgIGNvbnN0IHRpbWVvdXRQcm9taXNlID0gbmV3IFByb21pc2UoKF8sIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uc1JlYWR5VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gcmVqZWN0KHRpbWVvdXRFcnJvciksIHRpbWVvdXQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZVxuICAgICAgICAgICAgLnJhY2UoW3JlYWR5UHJvbWlzZSwgdGltZW91dFByb21pc2VdKVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgdmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zUmVhZHlUaW1lb3V0LnVucmVmKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uc1JlYWR5VGltZW91dC51bnJlZigpO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIF93YWl0Q29ubmVjdGlvbnNPcGVuZWQgKCkge1xuICAgICAgICBjb25zdCBjb25uZWN0aW9uc1JlYWR5UHJvbWlzZSA9IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbnNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGJjID0+ICFiYy5vcGVuZWQpXG4gICAgICAgICAgICAgICAgLm1hcChiYyA9PiBwcm9taXNpZnlFdmVudChiYywgJ29wZW5lZCcpKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHRpbWVvdXRFcnJvciA9IG5ldyBHZW5lcmFsRXJyb3IoTUVTU0FHRS5jYW50RXN0YWJsaXNoQnJvd3NlckNvbm5lY3Rpb24pO1xuICAgICAgICBjb25zdCByZWFkeVRpbWVvdXQgPSBhd2FpdCB0aGlzLl9nZXRSZWFkeVRpbWVvdXQoKTtcblxuICAgICAgICBhd2FpdCB0aGlzLl9jcmVhdGVQZW5kaW5nQ29ubmVjdGlvblByb21pc2UoY29ubmVjdGlvbnNSZWFkeVByb21pc2UsIHJlYWR5VGltZW91dCwgdGltZW91dEVycm9yKTtcbiAgICB9XG5cbiAgICBfY2hlY2tGb3JEaXNjb25uZWN0aW9ucyAoKSB7XG4gICAgICAgIGNvbnN0IGRpc2Nvbm5lY3RlZFVzZXJBZ2VudHMgPSB0aGlzLmJyb3dzZXJDb25uZWN0aW9uc1xuICAgICAgICAgICAgLmZpbHRlcihiYyA9PiBiYy5jbG9zZWQpXG4gICAgICAgICAgICAubWFwKGJjID0+IGJjLnVzZXJBZ2VudCk7XG5cbiAgICAgICAgaWYgKGRpc2Nvbm5lY3RlZFVzZXJBZ2VudHMubGVuZ3RoKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLmNhbnRSdW5BZ2FpbnN0RGlzY29ubmVjdGVkQnJvd3NlcnMsIGRpc2Nvbm5lY3RlZFVzZXJBZ2VudHMuam9pbignLCAnKSk7XG4gICAgfVxuXG5cbiAgICAvL0FQSVxuICAgIHN0YXRpYyBmcm9tIChicm93c2VyQ29ubmVjdGlvbnMpIHtcbiAgICAgICAgY29uc3QgYnJvd3NlclNldCA9IG5ldyBCcm93c2VyU2V0KGJyb3dzZXJDb25uZWN0aW9ucyk7XG5cbiAgICAgICAgY29uc3QgcHJlcGFyZUNvbm5lY3Rpb24gPSBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGJyb3dzZXJTZXQuX2NoZWNrRm9yRGlzY29ubmVjdGlvbnMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYnJvd3NlclNldC5fd2FpdENvbm5lY3Rpb25zT3BlbmVkKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gYnJvd3NlclNldCk7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VcbiAgICAgICAgICAgIC5yYWNlKFtcbiAgICAgICAgICAgICAgICBwcmVwYXJlQ29ubmVjdGlvbixcbiAgICAgICAgICAgICAgICBwcm9taXNpZnlFdmVudChicm93c2VyU2V0LCAnZXJyb3InKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIC5jYXRjaChhc3luYyBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgYXdhaXQgYnJvd3NlclNldC5kaXNwb3NlKCk7XG5cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbGVhc2VDb25uZWN0aW9uIChiYykge1xuICAgICAgICBpZiAodGhpcy5icm93c2VyQ29ubmVjdGlvbnMuaW5kZXhPZihiYykgPCAwKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXG4gICAgICAgIHJlbW92ZSh0aGlzLmJyb3dzZXJDb25uZWN0aW9ucywgYmMpO1xuXG4gICAgICAgIGJjLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIHRoaXMuYnJvd3NlckVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgY29uc3QgYXBwcm9wcmlhdGVTdGF0ZVN3aXRjaCA9ICFiYy5wZXJtYW5lbnQgP1xuICAgICAgICAgICAgQnJvd3NlclNldC5fY2xvc2VDb25uZWN0aW9uKGJjKSA6XG4gICAgICAgICAgICBCcm93c2VyU2V0Ll93YWl0SWRsZShiYyk7XG5cbiAgICAgICAgY29uc3QgcmVsZWFzZSA9IGdldFRpbWVMaW1pdGVkUHJvbWlzZShhcHByb3ByaWF0ZVN0YXRlU3dpdGNoLCB0aGlzLlJFTEVBU0VfVElNRU9VVCkudGhlbigoKSA9PiByZW1vdmUodGhpcy5wZW5kaW5nUmVsZWFzZXMsIHJlbGVhc2UpKTtcblxuICAgICAgICB0aGlzLnBlbmRpbmdSZWxlYXNlcy5wdXNoKHJlbGVhc2UpO1xuXG4gICAgICAgIHJldHVybiByZWxlYXNlO1xuICAgIH1cblxuICAgIGFzeW5jIGRpc3Bvc2UgKCkge1xuICAgICAgICAvLyBOT1RFOiBXaGVuIGJyb3dzZXJDb25uZWN0aW9uIGlzIGNhbmNlbGxlZCwgaXQgaXMgcmVtb3ZlZCBmcm9tXG4gICAgICAgIC8vIHRoZSB0aGlzLmNvbm5lY3Rpb25zIGFycmF5LCB3aGljaCBsZWFkcyB0byBzaGlmdGluZyBpbmRleGVzXG4gICAgICAgIC8vIHRvd2FyZHMgdGhlIGJlZ2lubmluZy4gU28sIHdlIG11c3QgY29weSB0aGUgYXJyYXkgaW4gb3JkZXIgdG8gaXRlcmF0ZSBpdCxcbiAgICAgICAgLy8gb3Igd2UgY2FuIHBlcmZvcm0gaXRlcmF0aW9uIGZyb20gdGhlIGVuZCB0byB0aGUgYmVnaW5uaW5nLlxuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uc1JlYWR5VGltZW91dClcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnNSZWFkeVRpbWVvdXQudW5yZWYoKTtcblxuICAgICAgICBtYXBSZXZlcnNlKHRoaXMuYnJvd3NlckNvbm5lY3Rpb25zLCBiYyA9PiB0aGlzLnJlbGVhc2VDb25uZWN0aW9uKGJjKSk7XG5cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5wZW5kaW5nUmVsZWFzZXMpO1xuICAgIH1cbn1cbiJdfQ==
