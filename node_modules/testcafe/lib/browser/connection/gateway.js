'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _readFileRelative = require('read-file-relative');

var _http = require('../../utils/http');

var _remotesQueue = require('./remotes-queue');

var _remotesQueue2 = _interopRequireDefault(_remotesQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Const
const IDLE_PAGE_SCRIPT = (0, _readFileRelative.readSync)('../../client/browser/idle-page/index.js');
const IDLE_PAGE_STYLE = (0, _readFileRelative.readSync)('../../client/browser/idle-page/styles.css');
const IDLE_PAGE_LOGO = (0, _readFileRelative.readSync)('../../client/browser/idle-page/logo.svg', true);

// Gateway
class BrowserConnectionGateway {
    constructor(proxy, options = {}) {
        this.connections = {};
        this.remotesQueue = new _remotesQueue2.default();
        this.domain = proxy.server1Info.domain;

        this.connectUrl = `${this.domain}/browser/connect`;

        this.retryTestPages = options.retryTestPages;

        this._registerRoutes(proxy);
    }

    _dispatch(url, proxy, handler, method = 'GET') {
        proxy[method](url, (req, res, si, params) => {
            const connection = this.connections[params.id];

            (0, _http.preventCaching)(res);

            if (connection) handler(req, res, connection);else (0, _http.respond404)(res);
        });
    }

    _registerRoutes(proxy) {
        this._dispatch('/browser/connect/{id}', proxy, BrowserConnectionGateway.onConnection);
        this._dispatch('/browser/heartbeat/{id}', proxy, BrowserConnectionGateway.onHeartbeat);
        this._dispatch('/browser/idle/{id}', proxy, BrowserConnectionGateway.onIdle);
        this._dispatch('/browser/idle-forced/{id}', proxy, BrowserConnectionGateway.onIdleForced);
        this._dispatch('/browser/status/{id}', proxy, BrowserConnectionGateway.onStatusRequest);
        this._dispatch('/browser/status-done/{id}', proxy, BrowserConnectionGateway.onStatusRequestOnTestDone);
        this._dispatch('/browser/init-script/{id}', proxy, BrowserConnectionGateway.onInitScriptRequest);
        this._dispatch('/browser/init-script/{id}', proxy, BrowserConnectionGateway.onInitScriptResponse, 'POST');

        proxy.GET('/browser/connect', (req, res) => this._connectNextRemoteBrowser(req, res));
        proxy.GET('/browser/connect/', (req, res) => this._connectNextRemoteBrowser(req, res));

        proxy.GET('/browser/assets/index.js', { content: IDLE_PAGE_SCRIPT, contentType: 'application/x-javascript' });
        proxy.GET('/browser/assets/styles.css', { content: IDLE_PAGE_STYLE, contentType: 'text/css' });
        proxy.GET('/browser/assets/logo.svg', { content: IDLE_PAGE_LOGO, contentType: 'image/svg+xml' });
    }

    // Helpers
    static ensureConnectionReady(res, connection) {
        if (!connection.ready) {
            (0, _http.respond500)(res, 'The connection is not ready yet.');
            return false;
        }

        return true;
    }

    // Route handlers
    static onConnection(req, res, connection) {
        if (connection.ready) (0, _http.respond500)(res, 'The connection is already established.');else {
            const userAgent = req.headers['user-agent'];

            connection.establish(userAgent);
            (0, _http.redirect)(res, connection.idleUrl);
        }
    }

    static onHeartbeat(req, res, connection) {
        if (BrowserConnectionGateway.ensureConnectionReady(res, connection)) {
            const status = connection.heartbeat();

            (0, _http.respondWithJSON)(res, status);
        }
    }

    static onIdle(req, res, connection) {
        if (BrowserConnectionGateway.ensureConnectionReady(res, connection)) res.end(connection.renderIdlePage());
    }

    static onIdleForced(req, res, connection) {
        return (0, _asyncToGenerator3.default)(function* () {
            if (BrowserConnectionGateway.ensureConnectionReady(res, connection)) {
                const status = yield connection.getStatus(true);

                (0, _http.redirect)(res, status.url);
            }
        })();
    }

    static onStatusRequest(req, res, connection) {
        return (0, _asyncToGenerator3.default)(function* () {
            return BrowserConnectionGateway._onStatusRequestCore(req, res, connection, false);
        })();
    }

    static onStatusRequestOnTestDone(req, res, connection) {
        return (0, _asyncToGenerator3.default)(function* () {
            return BrowserConnectionGateway._onStatusRequestCore(req, res, connection, true);
        })();
    }

    static _onStatusRequestCore(req, res, connection, isTestDone) {
        return (0, _asyncToGenerator3.default)(function* () {
            if (BrowserConnectionGateway.ensureConnectionReady(res, connection)) {
                const status = yield connection.getStatus(isTestDone);

                (0, _http.respondWithJSON)(res, status);
            }
        })();
    }

    static onInitScriptRequest(req, res, connection) {
        if (BrowserConnectionGateway.ensureConnectionReady(res, connection)) {
            const script = connection.getInitScript();

            (0, _http.respondWithJSON)(res, script);
        }
    }

    static onInitScriptResponse(req, res, connection) {
        if (BrowserConnectionGateway.ensureConnectionReady(res, connection)) {
            let data = '';

            req.on('data', chunk => {
                data += chunk;
            });

            req.on('end', () => {
                connection.handleInitScriptResult(data);

                res.end();
            });
        }
    }

    _connectNextRemoteBrowser(req, res) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            (0, _http.preventCaching)(res);

            const remoteConnection = yield _this.remotesQueue.shift();

            if (remoteConnection) (0, _http.redirect)(res, remoteConnection.url);else (0, _http.respond500)(res, 'There are no available connections to establish.');
        })();
    }

    // API
    startServingConnection(connection) {
        this.connections[connection.id] = connection;

        if (connection.browserInfo.providerName === 'remote') this.remotesQueue.add(connection);
    }

    stopServingConnection(connection) {
        delete this.connections[connection.id];

        if (connection.browserInfo.providerName === 'remote') this.remotesQueue.remove(connection);
    }

    close() {
        (0, _keys2.default)(this.connections).forEach(id => this.connections[id].close());
    }
}
exports.default = BrowserConnectionGateway;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9icm93c2VyL2Nvbm5lY3Rpb24vZ2F0ZXdheS5qcyJdLCJuYW1lcyI6WyJJRExFX1BBR0VfU0NSSVBUIiwiSURMRV9QQUdFX1NUWUxFIiwiSURMRV9QQUdFX0xPR08iLCJCcm93c2VyQ29ubmVjdGlvbkdhdGV3YXkiLCJjb25zdHJ1Y3RvciIsInByb3h5Iiwib3B0aW9ucyIsImNvbm5lY3Rpb25zIiwicmVtb3Rlc1F1ZXVlIiwiUmVtb3Rlc1F1ZXVlIiwiZG9tYWluIiwic2VydmVyMUluZm8iLCJjb25uZWN0VXJsIiwicmV0cnlUZXN0UGFnZXMiLCJfcmVnaXN0ZXJSb3V0ZXMiLCJfZGlzcGF0Y2giLCJ1cmwiLCJoYW5kbGVyIiwibWV0aG9kIiwicmVxIiwicmVzIiwic2kiLCJwYXJhbXMiLCJjb25uZWN0aW9uIiwiaWQiLCJvbkNvbm5lY3Rpb24iLCJvbkhlYXJ0YmVhdCIsIm9uSWRsZSIsIm9uSWRsZUZvcmNlZCIsIm9uU3RhdHVzUmVxdWVzdCIsIm9uU3RhdHVzUmVxdWVzdE9uVGVzdERvbmUiLCJvbkluaXRTY3JpcHRSZXF1ZXN0Iiwib25Jbml0U2NyaXB0UmVzcG9uc2UiLCJHRVQiLCJfY29ubmVjdE5leHRSZW1vdGVCcm93c2VyIiwiY29udGVudCIsImNvbnRlbnRUeXBlIiwiZW5zdXJlQ29ubmVjdGlvblJlYWR5IiwicmVhZHkiLCJ1c2VyQWdlbnQiLCJoZWFkZXJzIiwiZXN0YWJsaXNoIiwiaWRsZVVybCIsInN0YXR1cyIsImhlYXJ0YmVhdCIsImVuZCIsInJlbmRlcklkbGVQYWdlIiwiZ2V0U3RhdHVzIiwiX29uU3RhdHVzUmVxdWVzdENvcmUiLCJpc1Rlc3REb25lIiwic2NyaXB0IiwiZ2V0SW5pdFNjcmlwdCIsImRhdGEiLCJvbiIsImNodW5rIiwiaGFuZGxlSW5pdFNjcmlwdFJlc3VsdCIsInJlbW90ZUNvbm5lY3Rpb24iLCJzaGlmdCIsInN0YXJ0U2VydmluZ0Nvbm5lY3Rpb24iLCJicm93c2VySW5mbyIsInByb3ZpZGVyTmFtZSIsImFkZCIsInN0b3BTZXJ2aW5nQ29ubmVjdGlvbiIsInJlbW92ZSIsImNsb3NlIiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUdBO0FBQ0EsTUFBTUEsbUJBQW1CLGdDQUFLLHlDQUFMLENBQXpCO0FBQ0EsTUFBTUMsa0JBQW1CLGdDQUFLLDJDQUFMLENBQXpCO0FBQ0EsTUFBTUMsaUJBQW1CLGdDQUFLLHlDQUFMLEVBQWdELElBQWhELENBQXpCOztBQUVBO0FBQ2UsTUFBTUMsd0JBQU4sQ0FBK0I7QUFDMUNDLGdCQUFhQyxLQUFiLEVBQW9CQyxVQUFVLEVBQTlCLEVBQWtDO0FBQzlCLGFBQUtDLFdBQUwsR0FBb0IsRUFBcEI7QUFDQSxhQUFLQyxZQUFMLEdBQW9CLElBQUlDLHNCQUFKLEVBQXBCO0FBQ0EsYUFBS0MsTUFBTCxHQUFvQkwsTUFBTU0sV0FBTixDQUFrQkQsTUFBdEM7O0FBRUEsYUFBS0UsVUFBTCxHQUFtQixHQUFFLEtBQUtGLE1BQU8sa0JBQWpDOztBQUVBLGFBQUtHLGNBQUwsR0FBc0JQLFFBQVFPLGNBQTlCOztBQUVBLGFBQUtDLGVBQUwsQ0FBcUJULEtBQXJCO0FBQ0g7O0FBRURVLGNBQVdDLEdBQVgsRUFBZ0JYLEtBQWhCLEVBQXVCWSxPQUF2QixFQUFnQ0MsU0FBUyxLQUF6QyxFQUFnRDtBQUM1Q2IsY0FBTWEsTUFBTixFQUFjRixHQUFkLEVBQW1CLENBQUNHLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxFQUFYLEVBQWVDLE1BQWYsS0FBMEI7QUFDekMsa0JBQU1DLGFBQWEsS0FBS2hCLFdBQUwsQ0FBaUJlLE9BQU9FLEVBQXhCLENBQW5COztBQUVBLHNDQUFlSixHQUFmOztBQUVBLGdCQUFJRyxVQUFKLEVBQ0lOLFFBQVFFLEdBQVIsRUFBYUMsR0FBYixFQUFrQkcsVUFBbEIsRUFESixLQUdJLHNCQUFXSCxHQUFYO0FBQ1AsU0FURDtBQVVIOztBQUVETixvQkFBaUJULEtBQWpCLEVBQXdCO0FBQ3BCLGFB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QUF1QnZDLFVBQXZCLEVBQW1DO0FBQy9CLGVBQU8sS0FBS2hCLFdBQUwsQ0FBaUJnQixXQUFXQyxFQUE1QixDQUFQOztBQUVBLFlBQUlELFdBQVdvQyxXQUFYLENBQXVCQyxZQUF2QixLQUF3QyxRQUE1QyxFQUNJLEtBQUtwRCxZQUFMLENBQWtCdUQsTUFBbEIsQ0FBeUJ4QyxVQUF6QjtBQUNQOztBQUVEeUMsWUFBUztBQUNMLDRCQUFZLEtBQUt6RCxXQUFqQixFQUE4QjBELE9BQTlCLENBQXNDekMsTUFBTSxLQUFLakIsV0FBTCxDQUFpQmlCLEVBQWpCLEVBQXFCd0MsS0FBckIsRUFBNUM7QUFDSDtBQTdKeUM7a0JBQXpCN0Qsd0IiLCJmaWxlIjoiYnJvd3Nlci9jb25uZWN0aW9uL2dhdGV3YXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWFkU3luYyBhcyByZWFkIH0gZnJvbSAncmVhZC1maWxlLXJlbGF0aXZlJztcbmltcG9ydCB7IHJlc3BvbmQ0MDQsIHJlc3BvbmQ1MDAsIHJlc3BvbmRXaXRoSlNPTiwgcmVkaXJlY3QsIHByZXZlbnRDYWNoaW5nIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cCc7XG5pbXBvcnQgUmVtb3Rlc1F1ZXVlIGZyb20gJy4vcmVtb3Rlcy1xdWV1ZSc7XG5cblxuLy8gQ29uc3RcbmNvbnN0IElETEVfUEFHRV9TQ1JJUFQgPSByZWFkKCcuLi8uLi9jbGllbnQvYnJvd3Nlci9pZGxlLXBhZ2UvaW5kZXguanMnKTtcbmNvbnN0IElETEVfUEFHRV9TVFlMRSAgPSByZWFkKCcuLi8uLi9jbGllbnQvYnJvd3Nlci9pZGxlLXBhZ2Uvc3R5bGVzLmNzcycpO1xuY29uc3QgSURMRV9QQUdFX0xPR08gICA9IHJlYWQoJy4uLy4uL2NsaWVudC9icm93c2VyL2lkbGUtcGFnZS9sb2dvLnN2ZycsIHRydWUpO1xuXG4vLyBHYXRld2F5XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcm93c2VyQ29ubmVjdGlvbkdhdGV3YXkge1xuICAgIGNvbnN0cnVjdG9yIChwcm94eSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMgID0ge307XG4gICAgICAgIHRoaXMucmVtb3Rlc1F1ZXVlID0gbmV3IFJlbW90ZXNRdWV1ZSgpO1xuICAgICAgICB0aGlzLmRvbWFpbiAgICAgICA9IHByb3h5LnNlcnZlcjFJbmZvLmRvbWFpbjtcblxuICAgICAgICB0aGlzLmNvbm5lY3RVcmwgPSBgJHt0aGlzLmRvbWFpbn0vYnJvd3Nlci9jb25uZWN0YDtcblxuICAgICAgICB0aGlzLnJldHJ5VGVzdFBhZ2VzID0gb3B0aW9ucy5yZXRyeVRlc3RQYWdlcztcblxuICAgICAgICB0aGlzLl9yZWdpc3RlclJvdXRlcyhwcm94eSk7XG4gICAgfVxuXG4gICAgX2Rpc3BhdGNoICh1cmwsIHByb3h5LCBoYW5kbGVyLCBtZXRob2QgPSAnR0VUJykge1xuICAgICAgICBwcm94eVttZXRob2RdKHVybCwgKHJlcSwgcmVzLCBzaSwgcGFyYW1zKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb25uZWN0aW9uID0gdGhpcy5jb25uZWN0aW9uc1twYXJhbXMuaWRdO1xuXG4gICAgICAgICAgICBwcmV2ZW50Q2FjaGluZyhyZXMpO1xuXG4gICAgICAgICAgICBpZiAoY29ubmVjdGlvbilcbiAgICAgICAgICAgICAgICBoYW5kbGVyKHJlcSwgcmVzLCBjb25uZWN0aW9uKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXNwb25kNDA0KHJlcyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9yZWdpc3RlclJvdXRlcyAocHJveHkpIHtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2goJy9icm93c2VyL2Nvbm5lY3Qve2lkfScsIHByb3h5LCBCcm93c2VyQ29ubmVjdGlvbkdhdGV3YXkub25Db25uZWN0aW9uKTtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2goJy9icm93c2VyL2hlYXJ0YmVhdC97aWR9JywgcHJveHksIEJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheS5vbkhlYXJ0YmVhdCk7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoKCcvYnJvd3Nlci9pZGxlL3tpZH0nLCBwcm94eSwgQnJvd3NlckNvbm5lY3Rpb25HYXRld2F5Lm9uSWRsZSk7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoKCcvYnJvd3Nlci9pZGxlLWZvcmNlZC97aWR9JywgcHJveHksIEJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheS5vbklkbGVGb3JjZWQpO1xuICAgICAgICB0aGlzLl9kaXNwYXRjaCgnL2Jyb3dzZXIvc3RhdHVzL3tpZH0nLCBwcm94eSwgQnJvd3NlckNvbm5lY3Rpb25HYXRld2F5Lm9uU3RhdHVzUmVxdWVzdCk7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoKCcvYnJvd3Nlci9zdGF0dXMtZG9uZS97aWR9JywgcHJveHksIEJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheS5vblN0YXR1c1JlcXVlc3RPblRlc3REb25lKTtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2goJy9icm93c2VyL2luaXQtc2NyaXB0L3tpZH0nLCBwcm94eSwgQnJvd3NlckNvbm5lY3Rpb25HYXRld2F5Lm9uSW5pdFNjcmlwdFJlcXVlc3QpO1xuICAgICAgICB0aGlzLl9kaXNwYXRjaCgnL2Jyb3dzZXIvaW5pdC1zY3JpcHQve2lkfScsIHByb3h5LCBCcm93c2VyQ29ubmVjdGlvbkdhdGV3YXkub25Jbml0U2NyaXB0UmVzcG9uc2UsICdQT1NUJyk7XG5cbiAgICAgICAgcHJveHkuR0VUKCcvYnJvd3Nlci9jb25uZWN0JywgKHJlcSwgcmVzKSA9PiB0aGlzLl9jb25uZWN0TmV4dFJlbW90ZUJyb3dzZXIocmVxLCByZXMpKTtcbiAgICAgICAgcHJveHkuR0VUKCcvYnJvd3Nlci9jb25uZWN0LycsIChyZXEsIHJlcykgPT4gdGhpcy5fY29ubmVjdE5leHRSZW1vdGVCcm93c2VyKHJlcSwgcmVzKSk7XG5cbiAgICAgICAgcHJveHkuR0VUKCcvYnJvd3Nlci9hc3NldHMvaW5kZXguanMnLCB7IGNvbnRlbnQ6IElETEVfUEFHRV9TQ1JJUFQsIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0JyB9KTtcbiAgICAgICAgcHJveHkuR0VUKCcvYnJvd3Nlci9hc3NldHMvc3R5bGVzLmNzcycsIHsgY29udGVudDogSURMRV9QQUdFX1NUWUxFLCBjb250ZW50VHlwZTogJ3RleHQvY3NzJyB9KTtcbiAgICAgICAgcHJveHkuR0VUKCcvYnJvd3Nlci9hc3NldHMvbG9nby5zdmcnLCB7IGNvbnRlbnQ6IElETEVfUEFHRV9MT0dPLCBjb250ZW50VHlwZTogJ2ltYWdlL3N2Zyt4bWwnIH0pO1xuICAgIH1cblxuICAgIC8vIEhlbHBlcnNcbiAgICBzdGF0aWMgZW5zdXJlQ29ubmVjdGlvblJlYWR5IChyZXMsIGNvbm5lY3Rpb24pIHtcbiAgICAgICAgaWYgKCFjb25uZWN0aW9uLnJlYWR5KSB7XG4gICAgICAgICAgICByZXNwb25kNTAwKHJlcywgJ1RoZSBjb25uZWN0aW9uIGlzIG5vdCByZWFkeSB5ZXQuJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cblxuICAgIC8vIFJvdXRlIGhhbmRsZXJzXG4gICAgc3RhdGljIG9uQ29ubmVjdGlvbiAocmVxLCByZXMsIGNvbm5lY3Rpb24pIHtcbiAgICAgICAgaWYgKGNvbm5lY3Rpb24ucmVhZHkpXG4gICAgICAgICAgICByZXNwb25kNTAwKHJlcywgJ1RoZSBjb25uZWN0aW9uIGlzIGFscmVhZHkgZXN0YWJsaXNoZWQuJyk7XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyQWdlbnQgPSByZXEuaGVhZGVyc1sndXNlci1hZ2VudCddO1xuXG4gICAgICAgICAgICBjb25uZWN0aW9uLmVzdGFibGlzaCh1c2VyQWdlbnQpO1xuICAgICAgICAgICAgcmVkaXJlY3QocmVzLCBjb25uZWN0aW9uLmlkbGVVcmwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIG9uSGVhcnRiZWF0IChyZXEsIHJlcywgY29ubmVjdGlvbikge1xuICAgICAgICBpZiAoQnJvd3NlckNvbm5lY3Rpb25HYXRld2F5LmVuc3VyZUNvbm5lY3Rpb25SZWFkeShyZXMsIGNvbm5lY3Rpb24pKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0dXMgPSBjb25uZWN0aW9uLmhlYXJ0YmVhdCgpO1xuXG4gICAgICAgICAgICByZXNwb25kV2l0aEpTT04ocmVzLCBzdGF0dXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIG9uSWRsZSAocmVxLCByZXMsIGNvbm5lY3Rpb24pIHtcbiAgICAgICAgaWYgKEJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheS5lbnN1cmVDb25uZWN0aW9uUmVhZHkocmVzLCBjb25uZWN0aW9uKSlcbiAgICAgICAgICAgIHJlcy5lbmQoY29ubmVjdGlvbi5yZW5kZXJJZGxlUGFnZSgpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgb25JZGxlRm9yY2VkIChyZXEsIHJlcywgY29ubmVjdGlvbikge1xuICAgICAgICBpZiAoQnJvd3NlckNvbm5lY3Rpb25HYXRld2F5LmVuc3VyZUNvbm5lY3Rpb25SZWFkeShyZXMsIGNvbm5lY3Rpb24pKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBjb25uZWN0aW9uLmdldFN0YXR1cyh0cnVlKTtcblxuICAgICAgICAgICAgcmVkaXJlY3QocmVzLCBzdGF0dXMudXJsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBvblN0YXR1c1JlcXVlc3QgKHJlcSwgcmVzLCBjb25uZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBCcm93c2VyQ29ubmVjdGlvbkdhdGV3YXkuX29uU3RhdHVzUmVxdWVzdENvcmUocmVxLCByZXMsIGNvbm5lY3Rpb24sIGZhbHNlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgb25TdGF0dXNSZXF1ZXN0T25UZXN0RG9uZSAocmVxLCByZXMsIGNvbm5lY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIEJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheS5fb25TdGF0dXNSZXF1ZXN0Q29yZShyZXEsIHJlcywgY29ubmVjdGlvbiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIF9vblN0YXR1c1JlcXVlc3RDb3JlIChyZXEsIHJlcywgY29ubmVjdGlvbiwgaXNUZXN0RG9uZSkge1xuICAgICAgICBpZiAoQnJvd3NlckNvbm5lY3Rpb25HYXRld2F5LmVuc3VyZUNvbm5lY3Rpb25SZWFkeShyZXMsIGNvbm5lY3Rpb24pKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCBjb25uZWN0aW9uLmdldFN0YXR1cyhpc1Rlc3REb25lKTtcblxuICAgICAgICAgICAgcmVzcG9uZFdpdGhKU09OKHJlcywgc3RhdHVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBvbkluaXRTY3JpcHRSZXF1ZXN0IChyZXEsIHJlcywgY29ubmVjdGlvbikge1xuICAgICAgICBpZiAoQnJvd3NlckNvbm5lY3Rpb25HYXRld2F5LmVuc3VyZUNvbm5lY3Rpb25SZWFkeShyZXMsIGNvbm5lY3Rpb24pKSB7XG4gICAgICAgICAgICBjb25zdCBzY3JpcHQgPSBjb25uZWN0aW9uLmdldEluaXRTY3JpcHQoKTtcblxuICAgICAgICAgICAgcmVzcG9uZFdpdGhKU09OKHJlcywgc2NyaXB0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBvbkluaXRTY3JpcHRSZXNwb25zZSAocmVxLCByZXMsIGNvbm5lY3Rpb24pIHtcbiAgICAgICAgaWYgKEJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheS5lbnN1cmVDb25uZWN0aW9uUmVhZHkocmVzLCBjb25uZWN0aW9uKSkge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSAnJztcblxuICAgICAgICAgICAgcmVxLm9uKCdkYXRhJywgY2h1bmsgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEgKz0gY2h1bms7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVxLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbi5oYW5kbGVJbml0U2NyaXB0UmVzdWx0KGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBfY29ubmVjdE5leHRSZW1vdGVCcm93c2VyIChyZXEsIHJlcykge1xuICAgICAgICBwcmV2ZW50Q2FjaGluZyhyZXMpO1xuXG4gICAgICAgIGNvbnN0IHJlbW90ZUNvbm5lY3Rpb24gPSBhd2FpdCB0aGlzLnJlbW90ZXNRdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgIGlmIChyZW1vdGVDb25uZWN0aW9uKVxuICAgICAgICAgICAgcmVkaXJlY3QocmVzLCByZW1vdGVDb25uZWN0aW9uLnVybCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc3BvbmQ1MDAocmVzLCAnVGhlcmUgYXJlIG5vIGF2YWlsYWJsZSBjb25uZWN0aW9ucyB0byBlc3RhYmxpc2guJyk7XG4gICAgfVxuXG4gICAgLy8gQVBJXG4gICAgc3RhcnRTZXJ2aW5nQ29ubmVjdGlvbiAoY29ubmVjdGlvbikge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zW2Nvbm5lY3Rpb24uaWRdID0gY29ubmVjdGlvbjtcblxuICAgICAgICBpZiAoY29ubmVjdGlvbi5icm93c2VySW5mby5wcm92aWRlck5hbWUgPT09ICdyZW1vdGUnKVxuICAgICAgICAgICAgdGhpcy5yZW1vdGVzUXVldWUuYWRkKGNvbm5lY3Rpb24pO1xuICAgIH1cblxuICAgIHN0b3BTZXJ2aW5nQ29ubmVjdGlvbiAoY29ubmVjdGlvbikge1xuICAgICAgICBkZWxldGUgdGhpcy5jb25uZWN0aW9uc1tjb25uZWN0aW9uLmlkXTtcblxuICAgICAgICBpZiAoY29ubmVjdGlvbi5icm93c2VySW5mby5wcm92aWRlck5hbWUgPT09ICdyZW1vdGUnKVxuICAgICAgICAgICAgdGhpcy5yZW1vdGVzUXVldWUucmVtb3ZlKGNvbm5lY3Rpb24pO1xuICAgIH1cblxuICAgIGNsb3NlICgpIHtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5jb25uZWN0aW9ucykuZm9yRWFjaChpZCA9PiB0aGlzLmNvbm5lY3Rpb25zW2lkXS5jbG9zZSgpKTtcbiAgICB9XG59XG5cbiJdfQ==
