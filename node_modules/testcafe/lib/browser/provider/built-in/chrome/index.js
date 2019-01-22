'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _url = require('url');

var _runtimeInfo = require('./runtime-info');

var _runtimeInfo2 = _interopRequireDefault(_runtimeInfo);

var _localChrome = require('./local-chrome');

var _cdp = require('./cdp');

var cdp = _interopRequireWildcard(_cdp);

var _getMaximizedHeadlessWindowSize = require('../../utils/get-maximized-headless-window-size');

var _getMaximizedHeadlessWindowSize2 = _interopRequireDefault(_getMaximizedHeadlessWindowSize);

var _clientFunctions = require('../../utils/client-functions');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    openedBrowsers: {},

    isMultiBrowser: false,

    openBrowser(browserId, pageUrl, configString) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const runtimeInfo = yield (0, _runtimeInfo2.default)((0, _url.parse)(pageUrl).hostname, configString);
            const browserName = _this.providerName.replace(':', '');

            runtimeInfo.browserId = browserId;
            runtimeInfo.browserName = browserName;

            runtimeInfo.providerMethods = {
                resizeLocalBrowserWindow: function resizeLocalBrowserWindow(...args) {
                    return _this.resizeLocalBrowserWindow(...args);
                }
            };

            yield (0, _localChrome.start)(pageUrl, runtimeInfo);

            yield _this.waitForConnectionReady(browserId);

            runtimeInfo.viewportSize = yield _this.runInitScript(browserId, _clientFunctions.GET_WINDOW_DIMENSIONS_INFO_SCRIPT);

            yield cdp.createClient(runtimeInfo);

            _this.openedBrowsers[browserId] = runtimeInfo;
        })();
    },

    closeBrowser(browserId) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const runtimeInfo = _this2.openedBrowsers[browserId];

            if (cdp.isHeadlessTab(runtimeInfo)) yield cdp.closeTab(runtimeInfo);else yield _this2.closeLocalBrowser(browserId);

            if (_osFamily2.default.mac || runtimeInfo.config.headless) yield (0, _localChrome.stop)(runtimeInfo);

            if (runtimeInfo.tempProfileDir) yield runtimeInfo.tempProfileDir.dispose();

            delete _this2.openedBrowsers[browserId];
        })();
    },

    isLocalBrowser() {
        return (0, _asyncToGenerator3.default)(function* () {
            return true;
        })();
    },

    isHeadlessBrowser(browserId) {
        return this.openedBrowsers[browserId].config.headless;
    },

    takeScreenshot(browserId, path) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const runtimeInfo = _this3.openedBrowsers[browserId];

            yield cdp.takeScreenshot(path, runtimeInfo);
        })();
    },

    resizeWindow(browserId, width, height, currentWidth, currentHeight) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const runtimeInfo = _this4.openedBrowsers[browserId];

            if (runtimeInfo.config.mobile) yield cdp.updateMobileViewportSize(runtimeInfo);else {
                runtimeInfo.viewportSize.width = currentWidth;
                runtimeInfo.viewportSize.height = currentHeight;
            }

            yield cdp.resizeWindow({ width, height }, runtimeInfo);
        })();
    },

    maximizeWindow(browserId) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const maximumSize = (0, _getMaximizedHeadlessWindowSize2.default)();

            yield _this5.resizeWindow(browserId, maximumSize.width, maximumSize.height, maximumSize.width, maximumSize.height);
        })();
    },

    hasCustomActionForBrowser(browserId) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var _openedBrowsers$brows = _this6.openedBrowsers[browserId];
            const config = _openedBrowsers$brows.config,
                  client = _openedBrowsers$brows.client;


            return {
                hasCloseBrowser: true,
                hasResizeWindow: !!client && (config.emulation || config.headless),
                hasMaximizeWindow: !!client && config.headless,
                hasTakeScreenshot: !!client,
                hasChromelessScreenshots: !!client,
                hasCanResizeWindowToDimensions: false
            };
        })();
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2Nocm9tZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJjZHAiLCJvcGVuZWRCcm93c2VycyIsImlzTXVsdGlCcm93c2VyIiwib3BlbkJyb3dzZXIiLCJicm93c2VySWQiLCJwYWdlVXJsIiwiY29uZmlnU3RyaW5nIiwicnVudGltZUluZm8iLCJob3N0bmFtZSIsImJyb3dzZXJOYW1lIiwicHJvdmlkZXJOYW1lIiwicmVwbGFjZSIsInByb3ZpZGVyTWV0aG9kcyIsInJlc2l6ZUxvY2FsQnJvd3NlcldpbmRvdyIsImFyZ3MiLCJ3YWl0Rm9yQ29ubmVjdGlvblJlYWR5Iiwidmlld3BvcnRTaXplIiwicnVuSW5pdFNjcmlwdCIsIkdFVF9XSU5ET1dfRElNRU5TSU9OU19JTkZPX1NDUklQVCIsImNyZWF0ZUNsaWVudCIsImNsb3NlQnJvd3NlciIsImlzSGVhZGxlc3NUYWIiLCJjbG9zZVRhYiIsImNsb3NlTG9jYWxCcm93c2VyIiwiT1MiLCJtYWMiLCJjb25maWciLCJoZWFkbGVzcyIsInRlbXBQcm9maWxlRGlyIiwiZGlzcG9zZSIsImlzTG9jYWxCcm93c2VyIiwiaXNIZWFkbGVzc0Jyb3dzZXIiLCJ0YWtlU2NyZWVuc2hvdCIsInBhdGgiLCJyZXNpemVXaW5kb3ciLCJ3aWR0aCIsImhlaWdodCIsImN1cnJlbnRXaWR0aCIsImN1cnJlbnRIZWlnaHQiLCJtb2JpbGUiLCJ1cGRhdGVNb2JpbGVWaWV3cG9ydFNpemUiLCJtYXhpbWl6ZVdpbmRvdyIsIm1heGltdW1TaXplIiwiaGFzQ3VzdG9tQWN0aW9uRm9yQnJvd3NlciIsImNsaWVudCIsImhhc0Nsb3NlQnJvd3NlciIsImhhc1Jlc2l6ZVdpbmRvdyIsImVtdWxhdGlvbiIsImhhc01heGltaXplV2luZG93IiwiaGFzVGFrZVNjcmVlbnNob3QiLCJoYXNDaHJvbWVsZXNzU2NyZWVuc2hvdHMiLCJoYXNDYW5SZXNpemVXaW5kb3dUb0RpbWVu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IjpbImltcG9ydCBPUyBmcm9tICdvcy1mYW1pbHknO1xuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VVcmwgfSBmcm9tICd1cmwnO1xuaW1wb3J0IGdldFJ1bnRpbWVJbmZvIGZyb20gJy4vcnVudGltZS1pbmZvJztcbmltcG9ydCB7IHN0YXJ0IGFzIHN0YXJ0TG9jYWxDaHJvbWUsIHN0b3AgYXMgc3RvcExvY2FsQ2hyb21lIH0gZnJvbSAnLi9sb2NhbC1jaHJvbWUnO1xuaW1wb3J0ICogYXMgY2RwIGZyb20gJy4vY2RwJztcbmltcG9ydCBnZXRNYXhpbWl6ZWRIZWFkbGVzc1dpbmRvd1NpemUgZnJvbSAnLi4vLi4vdXRpbHMvZ2V0LW1heGltaXplZC1oZWFkbGVzcy13aW5kb3ctc2l6ZSc7XG5pbXBvcnQgeyBHRVRfV0lORE9XX0RJTUVOU0lPTlNfSU5GT19TQ1JJUFQgfSBmcm9tICcuLi8uLi91dGlscy9jbGllbnQtZnVuY3Rpb25zJztcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgb3BlbmVkQnJvd3NlcnM6IHt9LFxuXG4gICAgaXNNdWx0aUJyb3dzZXI6IGZhbHNlLFxuXG4gICAgYXN5bmMgb3BlbkJyb3dzZXIgKGJyb3dzZXJJZCwgcGFnZVVybCwgY29uZmlnU3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHJ1bnRpbWVJbmZvID0gYXdhaXQgZ2V0UnVudGltZUluZm8ocGFyc2VVcmwocGFnZVVybCkuaG9zdG5hbWUsIGNvbmZpZ1N0cmluZyk7XG4gICAgICAgIGNvbnN0IGJyb3dzZXJOYW1lID0gdGhpcy5wcm92aWRlck5hbWUucmVwbGFjZSgnOicsICcnKTtcblxuICAgICAgICBydW50aW1lSW5mby5icm93c2VySWQgICA9IGJyb3dzZXJJZDtcbiAgICAgICAgcnVudGltZUluZm8uYnJvd3Nlck5hbWUgPSBicm93c2VyTmFtZTtcblxuICAgICAgICBydW50aW1lSW5mby5wcm92aWRlck1ldGhvZHMgPSB7XG4gICAgICAgICAgICByZXNpemVMb2NhbEJyb3dzZXJXaW5kb3c6ICguLi5hcmdzKSA9PiB0aGlzLnJlc2l6ZUxvY2FsQnJvd3NlcldpbmRvdyguLi5hcmdzKVxuICAgICAgICB9O1xuXG4gICAgICAgIGF3YWl0IHN0YXJ0TG9jYWxDaHJvbWUocGFnZVVybCwgcnVudGltZUluZm8pO1xuXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdEZvckNvbm5lY3Rpb25SZWFkeShicm93c2VySWQpO1xuXG4gICAgICAgIHJ1bnRpbWVJbmZvLnZpZXdwb3J0U2l6ZSA9IGF3YWl0IHRoaXMucnVuSW5pdFNjcmlwdChicm93c2VySWQsIEdFVF9XSU5ET1dfRElNRU5TSU9OU19JTkZPX1NDUklQVCk7XG5cbiAgICAgICAgYXdhaXQgY2RwLmNyZWF0ZUNsaWVudChydW50aW1lSW5mbyk7XG5cbiAgICAgICAgdGhpcy5vcGVuZWRCcm93c2Vyc1ticm93c2VySWRdID0gcnVudGltZUluZm87XG4gICAgfSxcblxuICAgIGFzeW5jIGNsb3NlQnJvd3NlciAoYnJvd3NlcklkKSB7XG4gICAgICAgIGNvbnN0IHJ1bnRpbWVJbmZvID0gdGhpcy5vcGVuZWRCcm93c2Vyc1ticm93c2VySWRdO1xuXG4gICAgICAgIGlmIChjZHAuaXNIZWFkbGVzc1RhYihydW50aW1lSW5mbykpXG4gICAgICAgICAgICBhd2FpdCBjZHAuY2xvc2VUYWIocnVudGltZUluZm8pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNsb3NlTG9jYWxCcm93c2VyKGJyb3dzZXJJZCk7XG5cbiAgICAgICAgaWYgKE9TLm1hYyB8fCBydW50aW1lSW5mby5jb25maWcuaGVhZGxlc3MpXG4gICAgICAgICAgICBhd2FpdCBzdG9wTG9jYWxDaHJvbWUocnVudGltZUluZm8pO1xuXG4gICAgICAgIGlmIChydW50aW1lSW5mby50ZW1wUHJvZmlsZURpcilcbiAgICAgICAgICAgIGF3YWl0IHJ1bnRpbWVJbmZvLnRlbXBQcm9maWxlRGlyLmRpc3Bvc2UoKTtcblxuICAgICAgICBkZWxldGUgdGhpcy5vcGVuZWRCcm93c2Vyc1ticm93c2VySWRdO1xuICAgIH0sXG5cbiAgICBhc3luYyBpc0xvY2FsQnJvd3NlciAoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBpc0hlYWRsZXNzQnJvd3NlciAoYnJvd3NlcklkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5lZEJyb3dzZXJzW2Jyb3dzZXJJZF0uY29uZmlnLmhlYWRsZXNzO1xuICAgIH0sXG5cbiAgICBhc3luYyB0YWtlU2NyZWVuc2hvdCAoYnJvd3NlcklkLCBwYXRoKSB7XG4gICAgICAgIGNvbnN0IHJ1bnRpbWVJbmZvID0gdGhpcy5vcGVuZWRCcm93c2Vyc1ticm93c2VySWRdO1xuXG4gICAgICAgIGF3YWl0IGNkcC50YWtlU2NyZWVuc2hvdChwYXRoLCBydW50aW1lSW5mbyk7XG4gICAgfSxcblxuICAgIGFzeW5jIHJlc2l6ZVdpbmRvdyAoYnJvd3NlcklkLCB3aWR0aCwgaGVpZ2h0LCBjdXJyZW50V2lkdGgsIGN1cnJlbnRIZWlnaHQpIHtcbiAgICAgICAgY29uc3QgcnVudGltZUluZm8gPSB0aGlzLm9wZW5lZEJyb3dzZXJzW2Jyb3dzZXJJZF07XG5cbiAgICAgICAgaWYgKHJ1bnRpbWVJbmZvLmNvbmZpZy5tb2JpbGUpXG4gICAgICAgICAgICBhd2FpdCBjZHAudXBkYXRlTW9iaWxlVmlld3BvcnRTaXplKHJ1bnRpbWVJbmZvKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBydW50aW1lSW5mby52aWV3cG9ydFNpemUud2lkdGggID0gY3VycmVudFdpZHRoO1xuICAgICAgICAgICAgcnVudGltZUluZm8udmlld3BvcnRTaXplLmhlaWdodCA9IGN1cnJlbnRIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBjZHAucmVzaXplV2luZG93KHsgd2lkdGgsIGhlaWdodCB9LCBydW50aW1lSW5mbyk7XG4gICAgfSxcblxuICAgIGFzeW5jIG1heGltaXplV2luZG93IChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgbWF4aW11bVNpemUgPSBnZXRNYXhpbWl6ZWRIZWFkbGVzc1dpbmRvd1NpemUoKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnJlc2l6ZVdpbmRvdyhicm93c2VySWQsIG1heGltdW1TaXplLndpZHRoLCBtYXhpbXVtU2l6ZS5oZWlnaHQsIG1heGltdW1TaXplLndpZHRoLCBtYXhpbXVtU2l6ZS5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICBhc3luYyBoYXNDdXN0b21BY3Rpb25Gb3JCcm93c2VyIChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgeyBjb25maWcsIGNsaWVudCB9ID0gdGhpcy5vcGVuZWRCcm93c2Vyc1ticm93c2VySWRdO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoYXNDbG9zZUJyb3dzZXI6ICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICBoYXNSZXNpemVXaW5kb3c6ICAgICAgICAgICAgICAgICEhY2xpZW50ICYmIChjb25maWcuZW11bGF0aW9uIHx8IGNvbmZpZy5oZWFkbGVzcyksXG4gICAgICAgICAgICBoYXNNYXhpbWl6ZVdpbmRvdzogICAgICAgICAgICAgICEhY2xpZW50ICYmIGNvbmZpZy5oZWFkbGVzcyxcbiAgICAgICAgICAgIGhhc1Rha2VTY3JlZW5zaG90OiAgICAgICAgICAgICAgISFjbGllbnQsXG4gICAgICAgICAgICBoYXNDaHJvbWVsZXNzU2NyZWVuc2hvdHM6ICAgICAgICEhY2xpZW50LFxuICAgICAgICAgICAgaGFzQ2FuUmVzaXplV2luZG93VG9EaW1lbnNpb25zOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cbn07XG4iXX0=
