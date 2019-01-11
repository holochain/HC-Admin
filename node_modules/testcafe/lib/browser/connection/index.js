'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _events = require('events');

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _lodash = require('lodash');

var _useragent = require('useragent');

var _readFileRelative = require('read-file-relative');

var _promisifyEvent = require('promisify-event');

var _promisifyEvent2 = _interopRequireDefault(_promisifyEvent);

var _nanoid = require('nanoid');

var _nanoid2 = _interopRequireDefault(_nanoid);

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

var _runtime = require('../../errors/runtime');

var _message = require('../../errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const IDLE_PAGE_TEMPLATE = (0, _readFileRelative.readSync)('../../client/browser/idle-page/index.html.mustache');
const connections = {};

class BrowserConnection extends _events.EventEmitter {
    constructor(gateway, browserInfo, permanent) {
        super();

        this.HEARTBEAT_TIMEOUT = 2 * 60 * 1000;
        this.BROWSER_RESTART_TIMEOUT = 60 * 1000;

        this.id = BrowserConnection._generateId();
        this.jobQueue = [];
        this.initScriptsQueue = [];
        this.browserConnectionGateway = gateway;
        this.errorSuppressed = false;
        this.testRunAborted = false;

        this.browserInfo = browserInfo;
        this.browserInfo.userAgent = '';
        this.browserInfo.userAgentProviderMetaInfo = '';

        this.provider = browserInfo.provider;

        this.permanent = permanent;
        this.closing = false;
        this.closed = false;
        this.ready = false;
        this.opened = false;
        this.idle = true;
        this.heartbeatTimeout = null;
        this.pendingTestRunUrl = null;

        this.url = `${gateway.domain}/browser/connect/${this.id}`;
        this.idleUrl = `${gateway.domain}/browser/idle/${this.id}`;
        this.forcedIdleUrl = `${gateway.domain}/browser/idle-forced/${this.id}`;
        this.initScriptUrl = `${gateway.domain}/browser/init-script/${this.id}`;

        this.heartbeatRelativeUrl = `/browser/heartbeat/${this.id}`;
        this.statusRelativeUrl = `/browser/status/${this.id}`;
        this.statusDoneRelativeUrl = `/browser/status-done/${this.id}`;

        this.heartbeatUrl = `${gateway.domain}${this.heartbeatRelativeUrl}`;
        this.statusUrl = `${gateway.domain}${this.statusRelativeUrl}`;
        this.statusDoneUrl = `${gateway.domain}${this.statusDoneRelativeUrl}`;

        this.on('error', () => {
            this._forceIdle();
            this.close();
        });

        connections[this.id] = this;

        this.browserConnectionGateway.startServingConnection(this);

        process.nextTick(() => this._runBrowser());
    }

    static _generateId() {
        return (0, _nanoid2.default)(7);
    }

    _runBrowser() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            try {
                yield _this.provider.openBrowser(_this.id, _this.url, _this.browserInfo.browserName);

                if (!_this.ready) yield (0, _promisifyEvent2.default)(_this, 'ready');

                _this.opened = true;
                _this.emit('opened');
            } catch (err) {
                _this.emit('error', new _runtime.GeneralError(_message2.default.unableToOpenBrowser, _this.browserInfo.providerName + ':' + _this.browserInfo.browserName, err.stack));
            }
        })();
    }

    _closeBrowser() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this2.idle) yield (0, _promisifyEvent2.default)(_this2, 'idle');

            try {
                yield _this2.provider.closeBrowser(_this2.id);
            } catch (err) {
                // NOTE: A warning would be really nice here, but it can't be done while log is stored in a task.
            }
        })();
    }

    _forceIdle() {
        if (!this.idle) {
            this.switchingToIdle = false;
            this.idle = true;
            this.emit('idle');
        }
    }

    _createBrowserDisconnectedError() {
        return new _runtime.GeneralError(_message2.default.browserDisconnected, this.userAgent);
    }

    _waitForHeartbeat() {
        this.heartbeatTimeout = setTimeout(() => {
            const err = this._createBrowserDisconnectedError();

            this.opened = false;
            this.errorSuppressed = false;
            this.testRunAborted = true;

            this.emit('disconnected', err);

            if (!this.errorSuppressed) this.emit('error', err);
        }, this.HEARTBEAT_TIMEOUT);
    }

    _getTestRunUrl(needPopNext) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (needPopNext || !_this3.pendingTestRunUrl) _this3.pendingTestRunUrl = yield _this3._popNextTestRunUrl();

            return _this3.pendingTestRunUrl;
        })();
    }

    _popNextTestRunUrl() {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            while (_this4.hasQueuedJobs && !_this4.currentJob.hasQueuedTestRuns) _this4.jobQueue.shift();

            return _this4.hasQueuedJobs ? yield _this4.currentJob.popNextTestRunUrl(_this4) : null;
        })();
    }

    static getById(id) {
        return connections[id] || null;
    }

    restartBrowser() {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this5.ready = false;

            _this5._forceIdle();

            let resolveTimeout = null;
            let isTimeoutExpired = false;
            let timeout = null;

            const restartPromise = _this5._closeBrowser().then(function () {
                return _this5._runBrowser();
            });

            const timeoutPromise = new _pinkie2.default(function (resolve) {
                resolveTimeout = resolve;

                timeout = setTimeout(function () {
                    isTimeoutExpired = true;

                    resolve();
                }, _this5.BROWSER_RESTART_TIMEOUT);
            });

            _pinkie2.default.race([restartPromise, timeoutPromise]).then(function () {
                clearTimeout(timeout);

                if (isTimeoutExpired) _this5.emit('error', _this5._createBrowserDisconnectedError());else resolveTimeout();
            });
        })();
    }

    suppressError() {
        this.errorSuppressed = true;
    }

    addWarning(...args) {
        if (this.currentJob) this.currentJob.warningLog.addWarning(...args);
    }

    setProviderMetaInfo(str) {
        this.browserInfo.userAgentProviderMetaInfo = str;
    }

    get userAgent() {
        let userAgent = this.browserInfo.userAgent;

        if (this.browserInfo.userAgentProviderMetaInfo) userAgent += ` (${this.browserInfo.userAgentProviderMetaInfo})`;

        return userAgent;
    }

    get hasQueuedJobs() {
        return !!this.jobQueue.length;
    }

    get currentJob() {
        return this.jobQueue[0];
    }

    // API
    runInitScript(code) {
        return new _pinkie2.default(resolve => this.initScriptsQueue.push({ code, resolve }));
    }

    addJob(job) {
        this.jobQueue.push(job);
    }

    removeJob(job) {
        (0, _lodash.pull)(this.jobQueue, job);
    }

    close() {
        if (this.closed || this.closing) return;

        this.closing = true;

        this._closeBrowser().then(() => {
            this.browserConnectionGateway.stopServingConnection(this);
            clearTimeout(this.heartbeatTimeout);

            delete connections[this.id];

            this.ready = false;
            this.closed = true;

            this.emit('closed');
        });
    }

    establish(userAgent) {
        this.ready = true;

        const parsedUserAgent = (0, _useragent.parse)(userAgent);

        this.browserInfo.userAgent = parsedUserAgent.toString();
        this.browserInfo.fullUserAgent = userAgent;
        this.browserInfo.parsedUserAgent = parsedUserAgent;

        this._waitForHeartbeat();
        this.emit('ready');
    }

    heartbeat() {
        clearTimeout(this.heartbeatTimeout);
        this._waitForHeartbeat();

        return {
            code: this.closing ? _status2.default.closing : _status2.default.ok,
            url: this.closing ? this.idleUrl : ''
        };
    }

    renderIdlePage() {
        return _mustache2.default.render(IDLE_PAGE_TEMPLATE, {
            userAgent: this.userAgent,
            statusUrl: this.statusUrl,
            heartbeatUrl: this.heartbeatUrl,
            initScriptUrl: this.initScriptUrl,
            retryTestPages: !!this.browserConnectionGateway.retryTestPages
        });
    }

    getInitScript() {
        const initScriptPromise = this.initScriptsQueue[0];

        return { code: initScriptPromise ? initScriptPromise.code : null };
    }

    handleInitScriptResult(data) {
        const initScriptPromise = this.initScriptsQueue.shift();

        if (initScriptPromise) initScriptPromise.resolve(JSON.parse(data));
    }

    isHeadlessBrowser() {
        return this.provider.isHeadlessBrowser(this.id);
    }

    reportJobResult(status, data) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.provider.reportJobResult(_this6.id, status, data);
        })();
    }

    getStatus(isTestDone) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this7.idle && !isTestDone) {
                _this7.idle = true;
                _this7.emit('idle');
            }

            if (_this7.opened) {
                const testRunUrl = yield _this7._getTestRunUrl(isTestDone || _this7.testRunAborted);

                _this7.testRunAborted = false;

                if (testRunUrl) {
                    _this7.idle = false;
                    return { cmd: _command2.default.run, url: testRunUrl };
                }
            }

            return { cmd: _command2.default.idle, url: _this7.idleUrl };
        })();
    }
}
exports.default = BrowserConnection;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9icm93c2VyL2Nvbm5lY3Rpb24vaW5kZXguanMiXSwibmFtZXMiOlsiSURMRV9QQUdFX1RFTVBMQVRFIiwiY29ubmVjdGlvbnMiLCJCcm93c2VyQ29ubmVjdGlvbiIsIkV2ZW50RW1pdHRlciIsImNvbnN0cnVjdG9yIiwiZ2F0ZXdheSIsImJyb3dzZXJJbmZvIiwicGVybWFuZW50IiwiSEVBUlRCRUFUX1RJTUVPVVQiLCJCUk9XU0VSX1JFU1RBUlRfVElNRU9VVCIsImlkIiwiX2dlbmVyYXRlSWQiLCJqb2JRdWV1ZSIsImluaXRTY3JpcHRzUXVldWUiLCJicm93c2VyQ29ubmVjdGlvbkdhdGV3YXkiLCJlcnJvclN1cHByZXNzZWQiLCJ0ZXN0UnVuQWJvcnRlZCIsInVzZXJBZ2VudCIsInVzZXJBZ2VudFByb3ZpZGVyTWV0YUluZm8iLCJwcm92aWRlciIsImNsb3NpbmciLCJjbG9zZWQiLCJyZWFkeSIsIm9wZW5lZCIsImlkbGUiLCJoZWFydGJlYXRUaW1lb3V0IiwicGVuZGluZ1Rlc3RSdW5VcmwiLCJ1cmwiLCJkb21haW4iLCJpZGxlVXJsIiwiZm9yY2VkSWRsZVVybCIsImluaXRTY3JpcHRVcmwiLCJoZWFydGJlYXRSZWxhdGl2ZVVybCIsInN0YXR1c1JlbGF0aXZlVXJsIiwic3RhdHVzRG9uZVJlbGF0aXZlVXJsIiwiaGVhcnRiZWF0VXJsIiwic3RhdHVzVXJsIiwic3RhdHVzRG9uZVVybCIsIm9uIiwiX2ZvcmNlSWRsZSIsImNsb3NlIiwic3RhcnRTZXJ2aW5nQ29ubmVjdGlvbiIsInByb2Nlc3MiLCJuZXh0VGljayIsIl9ydW5Ccm93c2VyIiwib3BlbkJyb3dzZXIiLCJicm93c2VyTmFtZSIsImVtaXQiLCJlcnIiLCJHZW5lcmFsRXJyb3IiLCJNRVNTQUdFIiwidW5hYmxlVG9PcGVuQnJvd3NlciIsInByb3ZpZGVyTmFtZSIsInN0YWNrIiwiX2Nsb3NlQnJvd3NlciIsImNsb3NlQnJvd3NlciIsInN3aXRjaGluZ1RvSWRsZSIsIl9jcmVhdGVCcm93c2VyRGlzY29ubmVjdGVkRXJyb3IiLCJicm93c2VyRGlzY29ubmVjdGVkIiwiX3dhaXRGb3JIZWFydGJlYXQiLCJzZXRUaW1lb3V0IiwiX2dldFRlc3RSdW5VcmwiLCJuZWVkUG9wTmV4dCIsIl9wb3BOZXh0VGVzdFJ1blVybCIsImhhc1F1ZXVlZEpvYnMiLCJjdXJyZW50Sm9iIiwiaGFzUXVldWVkVGVzdFJ1bnMiLCJzaGlmdCIsInBvcE5leHRUZXN0UnVuVXJsIiwiZ2V0QnlJZCIsInJlc3RhcnRCcm93c2VyIiwicmVzb2x2ZVRpbWVvdXQiLCJpc1RpbWVvdXRFeHBpcmVkIiwidGltZW91dCIsInJlc3RhcnRQcm9taXNlIiwidGhlbiIsInRpbWVvdXRQcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyYWNlIiwiY2xlYXJUaW1lb3V0Iiwic3VwcHJlc3NFcnJvciIsImFkZFdhcm5pbmciLCJhcmdzIiwid2FybmluZ0xvZyIsInNldFByb3ZpZGVyTWV0YUluZm8iLCJzdHIiLCJsZW5ndGgiLCJydW5Jbml0U2NyaXB0IiwiY29kZSIsInB1c2giLCJhZGRKb2IiLCJqb2IiLCJyZW1vdmVKb2IiLCJzdG9wU2VydmluZ0Nvbm5lY3Rpb24iLCJlc3RhYmxpc2giLCJwYXJzZWRVc2VyQWdlbnQiLCJ0b1N0cmluZyIsImZ1bGxVc2VyQWdlbnQiLCJoZWFydGJlYXQiLCJTVEFUVVMiLCJvayIsInJlbmRlcklkbGVQYWdlIiwiTXVzdGFjaGUiLCJyZW5kZXIiLCJyZXRyeVRlc3RQYWdlcyIsImdldEluaXRTY3JpcHQiLCJpbml0U2NyaXB0UHJvbWlzZSIsImhhbmRsZUluaXRTY3JpcHRSZXN1bHQiLCJkYXRhIiwiSlNPTiIsInBhcnNlIiwiaXNIZWFkbGVzc0Jyb3dzZXIiLCJyZXBvcnRKb2JSZXN1bHQiLCJzdGF0dXMiLCJnZXRTdGF0dXMiLCJpc1Rlc3REb25lIiwidGVzdFJ1blVybCIsImNtZCIsIkNPTU1BTkQiLCJydW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7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akIsZUFBTyxLQUFLN0YsUUFBTCxDQUFjNkYsaUJBQWQsQ0FBZ0MsS0FBS3RHLEVBQXJDLENBQVA7QUFDSDs7QUFFS3VHLG1CQUFOLENBQXVCQyxNQUF2QixFQUErQkwsSUFBL0IsRUFBcUM7QUFBQTs7QUFBQTtBQUNqQyxrQkFBTSxPQUFLMUYsUUFBTCxDQUFjOEYsZUFBZCxDQUE4QixPQUFLdkcsRUFBbkMsRUFBdUN3RyxNQUF2QyxFQUErQ0wsSUFBL0MsQ0FBTjtBQURpQztBQUVwQzs7QUFFS00sYUFBTixDQUFpQkMsVUFBakIsRUFBNkI7QUFBQTs7QUFBQTtBQUN6QixnQkFBSSxDQUFDLE9BQUs1RixJQUFOLElBQWMsQ0FBQzRGLFVBQW5CLEVBQStCO0FBQzNCLHVCQUFLNUYsSUFBTCxHQUFZLElBQVo7QUFDQSx1QkFBS3VCLElBQUwsQ0FBVSxNQUFWO0FBQ0g7O0FBRUQsZ0JBQUksT0FBS3hCLE1BQVQsRUFBaUI7QUFDYixzQkFBTThGLGFBQWEsTUFBTSxPQUFLeEQsY0FBTCxDQUFvQnVELGNBQWMsT0FBS3BHLGNBQXZDLENBQXpCOztBQUVBLHVCQUFLQSxjQUFMLEdBQXNCLEtBQXRCOztBQUVBLG9CQUFJcUcsVUFBSixFQUFnQjtBQUNaLDJCQUFLN0YsSUFBTCxHQUFZLEtBQVo7QUFDQSwyQkFBTyxFQUFFOEYsS0FBS0Msa0JBQVFDLEdBQWYsRUFBb0I3RixLQUFLMEYsVUFBekIsRUFBUDtBQUNIO0FBQ0o7O0FBRUQsbUJBQU8sRUFBRUMsS0FBS0Msa0JBQVEvRixJQUFmLEVBQXFCRyxLQUFLLE9BQUtFLE9BQS9CLEVBQVA7QUFqQnlCO0FBa0I1QjtBQS9TdUQ7a0JBQXZDM0IsaUIiLCJmaWxlIjoiYnJvd3Nlci9jb25uZWN0aW9uL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5pbXBvcnQgTXVzdGFjaGUgZnJvbSAnbXVzdGFjaGUnO1xuaW1wb3J0IHsgcHVsbCBhcyByZW1vdmUgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VVc2VyQWdlbnQgfSBmcm9tICd1c2VyYWdlbnQnO1xuaW1wb3J0IHsgcmVhZFN5bmMgYXMgcmVhZCB9IGZyb20gJ3JlYWQtZmlsZS1yZWxhdGl2ZSc7XG5pbXBvcnQgcHJvbWlzaWZ5RXZlbnQgZnJvbSAncHJvbWlzaWZ5LWV2ZW50JztcbmltcG9ydCBuYW5vaWQgZnJvbSAnbmFub2lkJztcbmltcG9ydCBDT01NQU5EIGZyb20gJy4vY29tbWFuZCc7XG5pbXBvcnQgU1RBVFVTIGZyb20gJy4vc3RhdHVzJztcbmltcG9ydCB7IEdlbmVyYWxFcnJvciB9IGZyb20gJy4uLy4uL2Vycm9ycy9ydW50aW1lJztcbmltcG9ydCBNRVNTQUdFIGZyb20gJy4uLy4uL2Vycm9ycy9ydW50aW1lL21lc3NhZ2UnO1xuXG5jb25zdCBJRExFX1BBR0VfVEVNUExBVEUgPSByZWFkKCcuLi8uLi9jbGllbnQvYnJvd3Nlci9pZGxlLXBhZ2UvaW5kZXguaHRtbC5tdXN0YWNoZScpO1xuY29uc3QgY29ubmVjdGlvbnMgICAgICAgID0ge307XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJvd3NlckNvbm5lY3Rpb24gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yIChnYXRld2F5LCBicm93c2VySW5mbywgcGVybWFuZW50KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5IRUFSVEJFQVRfVElNRU9VVCAgICAgICA9IDIgKiA2MCAqIDEwMDA7XG4gICAgICAgIHRoaXMuQlJPV1NFUl9SRVNUQVJUX1RJTUVPVVQgPSA2MCAqIDEwMDA7XG5cbiAgICAgICAgdGhpcy5pZCAgICAgICAgICAgICAgICAgICAgICAgPSBCcm93c2VyQ29ubmVjdGlvbi5fZ2VuZXJhdGVJZCgpO1xuICAgICAgICB0aGlzLmpvYlF1ZXVlICAgICAgICAgICAgICAgICA9IFtdO1xuICAgICAgICB0aGlzLmluaXRTY3JpcHRzUXVldWUgICAgICAgICA9IFtdO1xuICAgICAgICB0aGlzLmJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheSA9IGdhdGV3YXk7XG4gICAgICAgIHRoaXMuZXJyb3JTdXBwcmVzc2VkICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgIHRoaXMudGVzdFJ1bkFib3J0ZWQgICAgICAgICAgID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5icm93c2VySW5mbyAgICAgICAgICAgICAgICAgICAgICAgICAgID0gYnJvd3NlckluZm87XG4gICAgICAgIHRoaXMuYnJvd3NlckluZm8udXNlckFnZW50ICAgICAgICAgICAgICAgICA9ICcnO1xuICAgICAgICB0aGlzLmJyb3dzZXJJbmZvLnVzZXJBZ2VudFByb3ZpZGVyTWV0YUluZm8gPSAnJztcblxuICAgICAgICB0aGlzLnByb3ZpZGVyID0gYnJvd3NlckluZm8ucHJvdmlkZXI7XG5cbiAgICAgICAgdGhpcy5wZXJtYW5lbnQgICAgICAgICA9IHBlcm1hbmVudDtcbiAgICAgICAgdGhpcy5jbG9zaW5nICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsb3NlZCAgICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVhZHkgICAgICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vcGVuZWQgICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlkbGUgICAgICAgICAgICAgID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oZWFydGJlYXRUaW1lb3V0ICA9IG51bGw7XG4gICAgICAgIHRoaXMucGVuZGluZ1Rlc3RSdW5VcmwgPSBudWxsO1xuXG4gICAgICAgIHRoaXMudXJsICAgICAgICAgICA9IGAke2dhdGV3YXkuZG9tYWlufS9icm93c2VyL2Nvbm5lY3QvJHt0aGlzLmlkfWA7XG4gICAgICAgIHRoaXMuaWRsZVVybCAgICAgICA9IGAke2dhdGV3YXkuZG9tYWlufS9icm93c2VyL2lkbGUvJHt0aGlzLmlkfWA7XG4gICAgICAgIHRoaXMuZm9yY2VkSWRsZVVybCA9IGAke2dhdGV3YXkuZG9tYWlufS9icm93c2VyL2lkbGUtZm9yY2VkLyR7dGhpcy5pZH1gO1xuICAgICAgICB0aGlzLmluaXRTY3JpcHRVcmwgPSBgJHtnYXRld2F5LmRvbWFpbn0vYnJvd3Nlci9pbml0LXNjcmlwdC8ke3RoaXMuaWR9YDtcblxuICAgICAgICB0aGlzLmhlYXJ0YmVhdFJlbGF0aXZlVXJsICA9IGAvYnJvd3Nlci9oZWFydGJlYXQvJHt0aGlzLmlkfWA7XG4gICAgICAgIHRoaXMuc3RhdHVzUmVsYXRpdmVVcmwgICAgID0gYC9icm93c2VyL3N0YXR1cy8ke3RoaXMuaWR9YDtcbiAgICAgICAgdGhpcy5zdGF0dXNEb25lUmVsYXRpdmVVcmwgPSBgL2Jyb3dzZXIvc3RhdHVzLWRvbmUvJHt0aGlzLmlkfWA7XG5cbiAgICAgICAgdGhpcy5oZWFydGJlYXRVcmwgID0gYCR7Z2F0ZXdheS5kb21haW59JHt0aGlzLmhlYXJ0YmVhdFJlbGF0aXZlVXJsfWA7XG4gICAgICAgIHRoaXMuc3RhdHVzVXJsICAgICA9IGAke2dhdGV3YXkuZG9tYWlufSR7dGhpcy5zdGF0dXNSZWxhdGl2ZVVybH1gO1xuICAgICAgICB0aGlzLnN0YXR1c0RvbmVVcmwgPSBgJHtnYXRld2F5LmRvbWFpbn0ke3RoaXMuc3RhdHVzRG9uZVJlbGF0aXZlVXJsfWA7XG5cbiAgICAgICAgdGhpcy5vbignZXJyb3InLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9mb3JjZUlkbGUoKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29ubmVjdGlvbnNbdGhpcy5pZF0gPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuYnJvd3NlckNvbm5lY3Rpb25HYXRld2F5LnN0YXJ0U2VydmluZ0Nvbm5lY3Rpb24odGhpcyk7XG5cbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB0aGlzLl9ydW5Ccm93c2VyKCkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZ2VuZXJhdGVJZCAoKSB7XG4gICAgICAgIHJldHVybiBuYW5vaWQoNyk7XG4gICAgfVxuXG4gICAgYXN5bmMgX3J1bkJyb3dzZXIgKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wcm92aWRlci5vcGVuQnJvd3Nlcih0aGlzLmlkLCB0aGlzLnVybCwgdGhpcy5icm93c2VySW5mby5icm93c2VyTmFtZSk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5yZWFkeSlcbiAgICAgICAgICAgICAgICBhd2FpdCBwcm9taXNpZnlFdmVudCh0aGlzLCAncmVhZHknKTtcblxuICAgICAgICAgICAgdGhpcy5vcGVuZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdvcGVuZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEdlbmVyYWxFcnJvcihcbiAgICAgICAgICAgICAgICBNRVNTQUdFLnVuYWJsZVRvT3BlbkJyb3dzZXIsXG4gICAgICAgICAgICAgICAgdGhpcy5icm93c2VySW5mby5wcm92aWRlck5hbWUgKyAnOicgKyB0aGlzLmJyb3dzZXJJbmZvLmJyb3dzZXJOYW1lLFxuICAgICAgICAgICAgICAgIGVyci5zdGFja1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBfY2xvc2VCcm93c2VyICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlkbGUpXG4gICAgICAgICAgICBhd2FpdCBwcm9taXNpZnlFdmVudCh0aGlzLCAnaWRsZScpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnByb3ZpZGVyLmNsb3NlQnJvd3Nlcih0aGlzLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBOT1RFOiBBIHdhcm5pbmcgd291bGQgYmUgcmVhbGx5IG5pY2UgaGVyZSwgYnV0IGl0IGNhbid0IGJlIGRvbmUgd2hpbGUgbG9nIGlzIHN0b3JlZCBpbiBhIHRhc2suXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZm9yY2VJZGxlICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlkbGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoaW5nVG9JZGxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlkbGUgICAgICAgICAgICA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2lkbGUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9jcmVhdGVCcm93c2VyRGlzY29ubmVjdGVkRXJyb3IgKCkge1xuICAgICAgICByZXR1cm4gbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLmJyb3dzZXJEaXNjb25uZWN0ZWQsIHRoaXMudXNlckFnZW50KTtcbiAgICB9XG5cbiAgICBfd2FpdEZvckhlYXJ0YmVhdCAoKSB7XG4gICAgICAgIHRoaXMuaGVhcnRiZWF0VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXJyID0gdGhpcy5fY3JlYXRlQnJvd3NlckRpc2Nvbm5lY3RlZEVycm9yKCk7XG5cbiAgICAgICAgICAgIHRoaXMub3BlbmVkICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmVycm9yU3VwcHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy50ZXN0UnVuQWJvcnRlZCAgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2Rpc2Nvbm5lY3RlZCcsIGVycik7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5lcnJvclN1cHByZXNzZWQpXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG5cbiAgICAgICAgfSwgdGhpcy5IRUFSVEJFQVRfVElNRU9VVCk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2dldFRlc3RSdW5VcmwgKG5lZWRQb3BOZXh0KSB7XG4gICAgICAgIGlmIChuZWVkUG9wTmV4dCB8fCAhdGhpcy5wZW5kaW5nVGVzdFJ1blVybClcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1Rlc3RSdW5VcmwgPSBhd2FpdCB0aGlzLl9wb3BOZXh0VGVzdFJ1blVybCgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBlbmRpbmdUZXN0UnVuVXJsO1xuICAgIH1cblxuICAgIGFzeW5jIF9wb3BOZXh0VGVzdFJ1blVybCAoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLmhhc1F1ZXVlZEpvYnMgJiYgIXRoaXMuY3VycmVudEpvYi5oYXNRdWV1ZWRUZXN0UnVucylcbiAgICAgICAgICAgIHRoaXMuam9iUXVldWUuc2hpZnQoKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5oYXNRdWV1ZWRKb2JzID8gYXdhaXQgdGhpcy5jdXJyZW50Sm9iLnBvcE5leHRUZXN0UnVuVXJsKHRoaXMpIDogbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QnlJZCAoaWQpIHtcbiAgICAgICAgcmV0dXJuIGNvbm5lY3Rpb25zW2lkXSB8fCBudWxsO1xuICAgIH1cblxuICAgIGFzeW5jIHJlc3RhcnRCcm93c2VyICgpIHtcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2ZvcmNlSWRsZSgpO1xuXG4gICAgICAgIGxldCByZXNvbHZlVGltZW91dCAgID0gbnVsbDtcbiAgICAgICAgbGV0IGlzVGltZW91dEV4cGlyZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHRpbWVvdXQgICAgICAgICAgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJlc3RhcnRQcm9taXNlID0gdGhpcy5fY2xvc2VCcm93c2VyKClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuX3J1bkJyb3dzZXIoKSk7XG5cbiAgICAgICAgY29uc3QgdGltZW91dFByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHJlc29sdmVUaW1lb3V0ID0gcmVzb2x2ZTtcblxuICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlzVGltZW91dEV4cGlyZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSwgdGhpcy5CUk9XU0VSX1JFU1RBUlRfVElNRU9VVCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIFByb21pc2UucmFjZShbIHJlc3RhcnRQcm9taXNlLCB0aW1lb3V0UHJvbWlzZSBdKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblxuICAgICAgICAgICAgICAgIGlmIChpc1RpbWVvdXRFeHBpcmVkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgdGhpcy5fY3JlYXRlQnJvd3NlckRpc2Nvbm5lY3RlZEVycm9yKCkpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZVRpbWVvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN1cHByZXNzRXJyb3IgKCkge1xuICAgICAgICB0aGlzLmVycm9yU3VwcHJlc3NlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgYWRkV2FybmluZyAoLi4uYXJncykge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50Sm9iKVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Sm9iLndhcm5pbmdMb2cuYWRkV2FybmluZyguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBzZXRQcm92aWRlck1ldGFJbmZvIChzdHIpIHtcbiAgICAgICAgdGhpcy5icm93c2VySW5mby51c2VyQWdlbnRQcm92aWRlck1ldGFJbmZvID0gc3RyO1xuICAgIH1cblxuICAgIGdldCB1c2VyQWdlbnQgKCkge1xuICAgICAgICBsZXQgdXNlckFnZW50ID0gdGhpcy5icm93c2VySW5mby51c2VyQWdlbnQ7XG5cbiAgICAgICAgaWYgKHRoaXMuYnJvd3NlckluZm8udXNlckFnZW50UHJvdmlkZXJNZXRhSW5mbylcbiAgICAgICAgICAgIHVzZXJBZ2VudCArPSBgICgke3RoaXMuYnJvd3NlckluZm8udXNlckFnZW50UHJvdmlkZXJNZXRhSW5mb30pYDtcblxuICAgICAgICByZXR1cm4gdXNlckFnZW50O1xuICAgIH1cblxuICAgIGdldCBoYXNRdWV1ZWRKb2JzICgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5qb2JRdWV1ZS5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRKb2IgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5qb2JRdWV1ZVswXTtcbiAgICB9XG5cbiAgICAvLyBBUElcbiAgICBydW5Jbml0U2NyaXB0IChjb2RlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHRoaXMuaW5pdFNjcmlwdHNRdWV1ZS5wdXNoKHsgY29kZSwgcmVzb2x2ZSB9KSk7XG4gICAgfVxuXG4gICAgYWRkSm9iIChqb2IpIHtcbiAgICAgICAgdGhpcy5qb2JRdWV1ZS5wdXNoKGpvYik7XG4gICAgfVxuXG4gICAgcmVtb3ZlSm9iIChqb2IpIHtcbiAgICAgICAgcmVtb3ZlKHRoaXMuam9iUXVldWUsIGpvYik7XG4gICAgfVxuXG4gICAgY2xvc2UgKCkge1xuICAgICAgICBpZiAodGhpcy5jbG9zZWQgfHwgdGhpcy5jbG9zaW5nKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuY2xvc2luZyA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fY2xvc2VCcm93c2VyKClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheS5zdG9wU2VydmluZ0Nvbm5lY3Rpb24odGhpcyk7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGVhcnRiZWF0VGltZW91dCk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgY29ubmVjdGlvbnNbdGhpcy5pZF07XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ICA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnY2xvc2VkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBlc3RhYmxpc2ggKHVzZXJBZ2VudCkge1xuICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBwYXJzZWRVc2VyQWdlbnQgPSBwYXJzZVVzZXJBZ2VudCh1c2VyQWdlbnQpO1xuXG4gICAgICAgIHRoaXMuYnJvd3NlckluZm8udXNlckFnZW50ICAgICAgID0gcGFyc2VkVXNlckFnZW50LnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuYnJvd3NlckluZm8uZnVsbFVzZXJBZ2VudCAgID0gdXNlckFnZW50O1xuICAgICAgICB0aGlzLmJyb3dzZXJJbmZvLnBhcnNlZFVzZXJBZ2VudCA9IHBhcnNlZFVzZXJBZ2VudDtcblxuICAgICAgICB0aGlzLl93YWl0Rm9ySGVhcnRiZWF0KCk7XG4gICAgICAgIHRoaXMuZW1pdCgncmVhZHknKTtcbiAgICB9XG5cbiAgICBoZWFydGJlYXQgKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lb3V0KTtcbiAgICAgICAgdGhpcy5fd2FpdEZvckhlYXJ0YmVhdCgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiB0aGlzLmNsb3NpbmcgPyBTVEFUVVMuY2xvc2luZyA6IFNUQVRVUy5vayxcbiAgICAgICAgICAgIHVybDogIHRoaXMuY2xvc2luZyA/IHRoaXMuaWRsZVVybCA6ICcnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmVuZGVySWRsZVBhZ2UgKCkge1xuICAgICAgICByZXR1cm4gTXVzdGFjaGUucmVuZGVyKElETEVfUEFHRV9URU1QTEFURSwge1xuICAgICAgICAgICAgdXNlckFnZW50OiAgICAgIHRoaXMudXNlckFnZW50LFxuICAgICAgICAgICAgc3RhdHVzVXJsOiAgICAgIHRoaXMuc3RhdHVzVXJsLFxuICAgICAgICAgICAgaGVhcnRiZWF0VXJsOiAgIHRoaXMuaGVhcnRiZWF0VXJsLFxuICAgICAgICAgICAgaW5pdFNjcmlwdFVybDogIHRoaXMuaW5pdFNjcmlwdFVybCxcbiAgICAgICAgICAgIHJldHJ5VGVzdFBhZ2VzOiAhIXRoaXMuYnJvd3NlckNvbm5lY3Rpb25HYXRld2F5LnJldHJ5VGVzdFBhZ2VzXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEluaXRTY3JpcHQgKCkge1xuICAgICAgICBjb25zdCBpbml0U2NyaXB0UHJvbWlzZSA9IHRoaXMuaW5pdFNjcmlwdHNRdWV1ZVswXTtcblxuICAgICAgICByZXR1cm4geyBjb2RlOiBpbml0U2NyaXB0UHJvbWlzZSA/IGluaXRTY3JpcHRQcm9taXNlLmNvZGUgOiBudWxsIH07XG4gICAgfVxuXG4gICAgaGFuZGxlSW5pdFNjcmlwdFJlc3VsdCAoZGF0YSkge1xuICAgICAgICBjb25zdCBpbml0U2NyaXB0UHJvbWlzZSA9IHRoaXMuaW5pdFNjcmlwdHNRdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChpbml0U2NyaXB0UHJvbWlzZSlcbiAgICAgICAgICAgIGluaXRTY3JpcHRQcm9taXNlLnJlc29sdmUoSlNPTi5wYXJzZShkYXRhKSk7XG4gICAgfVxuXG4gICAgaXNIZWFkbGVzc0Jyb3dzZXIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm92aWRlci5pc0hlYWRsZXNzQnJvd3Nlcih0aGlzLmlkKTtcbiAgICB9XG5cbiAgICBhc3luYyByZXBvcnRKb2JSZXN1bHQgKHN0YXR1cywgZGF0YSkge1xuICAgICAgICBhd2FpdCB0aGlzLnByb3ZpZGVyLnJlcG9ydEpvYlJlc3VsdCh0aGlzLmlkLCBzdGF0dXMsIGRhdGEpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFN0YXR1cyAoaXNUZXN0RG9uZSkge1xuICAgICAgICBpZiAoIXRoaXMuaWRsZSAmJiAhaXNUZXN0RG9uZSkge1xuICAgICAgICAgICAgdGhpcy5pZGxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnaWRsZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3BlbmVkKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXN0UnVuVXJsID0gYXdhaXQgdGhpcy5fZ2V0VGVzdFJ1blVybChpc1Rlc3REb25lIHx8IHRoaXMudGVzdFJ1bkFib3J0ZWQpO1xuXG4gICAgICAgICAgICB0aGlzLnRlc3RSdW5BYm9ydGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0UnVuVXJsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pZGxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY21kOiBDT01NQU5ELnJ1biwgdXJsOiB0ZXN0UnVuVXJsIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBjbWQ6IENPTU1BTkQuaWRsZSwgdXJsOiB0aGlzLmlkbGVVcmwgfTtcbiAgICB9XG59XG4iXX0=
