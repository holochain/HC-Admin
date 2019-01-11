'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _runtimeInfo = require('./runtime-info');

var _runtimeInfo2 = _interopRequireDefault(_runtimeInfo);

var _localFirefox = require('./local-firefox');

var _marionetteClient = require('./marionette-client');

var _marionetteClient2 = _interopRequireDefault(_marionetteClient);

var _getMaximizedHeadlessWindowSize = require('../../utils/get-maximized-headless-window-size');

var _getMaximizedHeadlessWindowSize2 = _interopRequireDefault(_getMaximizedHeadlessWindowSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    openedBrowsers: {},

    isMultiBrowser: false,

    _createMarionetteClient(runtimeInfo) {
        return (0, _asyncToGenerator3.default)(function* () {
            try {
                const marionetteClient = new _marionetteClient2.default(runtimeInfo.marionettePort);

                yield marionetteClient.connect();

                return marionetteClient;
            } catch (e) {
                return null;
            }
        })();
    },

    openBrowser(browserId, pageUrl, configString) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const runtimeInfo = yield (0, _runtimeInfo2.default)(configString);
            const browserName = _this.providerName.replace(':', '');

            runtimeInfo.browserId = browserId;
            runtimeInfo.browserName = browserName;

            yield (0, _localFirefox.start)(pageUrl, runtimeInfo);

            yield _this.waitForConnectionReady(runtimeInfo.browserId);

            if (runtimeInfo.marionettePort) runtimeInfo.marionetteClient = yield _this._createMarionetteClient(runtimeInfo);

            _this.openedBrowsers[browserId] = runtimeInfo;
        })();
    },

    closeBrowser(browserId) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const runtimeInfo = _this2.openedBrowsers[browserId];
            const config = runtimeInfo.config,
                  marionetteClient = runtimeInfo.marionetteClient;


            if (config.headless) yield marionetteClient.quit();else yield _this2.closeLocalBrowser(browserId);

            if (_osFamily2.default.mac && !config.headless) yield (0, _localFirefox.stop)(runtimeInfo);

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
            const marionetteClient = _this3.openedBrowsers[browserId].marionetteClient;


            yield marionetteClient.takeScreenshot(path);
        })();
    },

    resizeWindow(browserId, width, height) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const marionetteClient = _this4.openedBrowsers[browserId].marionetteClient;


            yield marionetteClient.setWindowSize(width, height);
        })();
    },

    maximizeWindow(browserId) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const maximumSize = (0, _getMaximizedHeadlessWindowSize2.default)();

            yield _this5.resizeWindow(browserId, maximumSize.width, maximumSize.height);
        })();
    },

    hasCustomActionForBrowser(browserId) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var _openedBrowsers$brows = _this6.openedBrowsers[browserId];
            const config = _openedBrowsers$brows.config,
                  marionetteClient = _openedBrowsers$brows.marionetteClient;


            return {
                hasCloseBrowser: true,
                hasTakeScreenshot: !!marionetteClient,
                hasChromelessScreenshots: !!marionetteClient,
                hasResizeWindow: !!marionetteClient && config.headless,
                hasMaximizeWindow: !!marionetteClient && config.headless,
                hasCanResizeWindowToDimensions: false
            };
        })();
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2ZpcmVmb3gvaW5kZXguanMiXSwibmFtZXMiOlsib3BlbmVkQnJvd3NlcnMiLCJpc011bHRpQnJvd3NlciIsIl9jcmVhdGVNYXJpb25ldHRlQ2xpZW50IiwicnVudGltZUluZm8iLCJtYXJpb25ldHRlQ2xpZW50IiwiTWFyaW9uZXR0ZUNsaWVudCIsIm1hcmlvbmV0dGVQb3J0IiwiY29ubmVjdCIsImUiLCJvcGVuQnJvd3NlciIsImJyb3dzZXJJZCIsInBhZ2VVcmwiLCJjb25maWdTdHJpbmciLCJicm93c2VyTmFtZSIsInByb3ZpZGVyTmFtZSIsInJlcGxhY2UiLCJ3YWl0Rm9yQ29ubmVjdGlvblJlYWR5IiwiY2xvc2VCcm93c2VyIiwiY29uZmlnIiwiaGVhZGxlc3MiLCJxdWl0IiwiY2xvc2VMb2NhbEJyb3dzZXIiLCJPUyIsIm1hYyIsInRlbXBQcm9maWxlRGlyIiwiZGlzcG9zZSIsImlzTG9jYWxCcm93c2VyIiwiaXNIZWFkbGVzc0Jyb3dzZXIiLCJ0YWtlU2NyZWVuc2hvdCIsInBhdGgiLCJyZXNpemVXaW5kb3ciLCJ3aWR0aCIsImhlaWdodCIsInNldFdpbmRvd1NpemUiLCJtYXhpbWl6ZVdpbmRvdyIsIm1heGltdW1TaXplIiwiaGFzQ3VzdG9tQWN0aW9uRm9yQnJvd3NlciIsImhhc0Nsb3NlQnJvd3NlciIsImhhc1Rha2VTY3JlZW5zaG90IiwiaGFzQ2hyb21lbGVzc1NjcmVlbnNob3RzIiwiaGFzUmVzaXplV2luZG93IiwiaGFzTWF4aW1pemVXaW5kb3ciLCJoYXNDYW5SZXNpemVXaW5kb3dUb0RpbWVuc2lvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztrQkFHZTtBQUNYQSxvQkFBZ0IsRUFETDs7QUFHWEMsb0JBQWdCLEtBSEw7O0FBS0xDLDJCQUFOLENBQStCQyxXQUEvQixFQUE0QztBQUFB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Q0FBcEI7O0FBRUEsa0JBQU0sT0FBS0wsWUFBTCxDQUFrQnBCLFNBQWxCLEVBQTZCeUIsWUFBWUosS0FBekMsRUFBZ0RJLFlBQVlILE1BQTVELENBQU47QUFINkI7QUFJaEMsS0E3RVU7O0FBK0VMSSw2QkFBTixDQUFpQzFCLFNBQWpDLEVBQTRDO0FBQUE7O0FBQUE7QUFBQSx3Q0FDSCxPQUFLVixjQUFMLENBQW9CVSxTQUFwQixDQURHO0FBQUEsa0JBQ2hDUSxNQURnQyx5QkFDaENBLE1BRGdDO0FBQUEsa0JBQ3hCZCxnQkFEd0IseUJBQ3hCQSxnQkFEd0I7OztBQUd4QyxtQkFBTztBQUNIaUMsaUNBQWdDLElBRDdCO0FBRUhDLG1DQUFnQyxDQUFDLENBQUNsQyxnQkFGL0I7QUFHSG1DLDBDQUFnQyxDQUFDLENBQUNuQyxnQkFIL0I7QUFJSG9DLGlDQUFnQyxDQUFDLENBQUNwQyxnQkFBRixJQUFzQmMsT0FBT0MsUUFKMUQ7QUFLSHNCLG1DQUFnQyxDQUFDLENBQUNyQyxnQkFBRixJQUFzQmMsT0FBT0MsUUFMMUQ7QUFNSHVCLGdEQUFnQztBQU43QixhQUFQO0FBSHdDO0FBVzNDO0FBMUZVLEMiLCJmaWxlIjoiYnJvd3Nlci9wcm92aWRlci9idWlsdC1pbi9maXJlZm94L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9TIGZyb20gJ29zLWZhbWlseSc7XG5pbXBvcnQgZ2V0UnVudGltZUluZm8gZnJvbSAnLi9ydW50aW1lLWluZm8nO1xuaW1wb3J0IHsgc3RhcnQgYXMgc3RhcnRMb2NhbEZpcmVmb3gsIHN0b3AgYXMgc3RvcExvY2FsRmlyZWZveCB9IGZyb20gJy4vbG9jYWwtZmlyZWZveCc7XG5pbXBvcnQgTWFyaW9uZXR0ZUNsaWVudCBmcm9tICcuL21hcmlvbmV0dGUtY2xpZW50JztcbmltcG9ydCBnZXRNYXhpbWl6ZWRIZWFkbGVzc1dpbmRvd1NpemUgZnJvbSAnLi4vLi4vdXRpbHMvZ2V0LW1heGltaXplZC1oZWFkbGVzcy13aW5kb3ctc2l6ZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIG9wZW5lZEJyb3dzZXJzOiB7fSxcblxuICAgIGlzTXVsdGlCcm93c2VyOiBmYWxzZSxcblxuICAgIGFzeW5jIF9jcmVhdGVNYXJpb25ldHRlQ2xpZW50IChydW50aW1lSW5mbykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbWFyaW9uZXR0ZUNsaWVudCA9IG5ldyBNYXJpb25ldHRlQ2xpZW50KHJ1bnRpbWVJbmZvLm1hcmlvbmV0dGVQb3J0KTtcblxuICAgICAgICAgICAgYXdhaXQgbWFyaW9uZXR0ZUNsaWVudC5jb25uZWN0KCk7XG5cbiAgICAgICAgICAgIHJldHVybiBtYXJpb25ldHRlQ2xpZW50O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhc3luYyBvcGVuQnJvd3NlciAoYnJvd3NlcklkLCBwYWdlVXJsLCBjb25maWdTdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcnVudGltZUluZm8gPSBhd2FpdCBnZXRSdW50aW1lSW5mbyhjb25maWdTdHJpbmcpO1xuICAgICAgICBjb25zdCBicm93c2VyTmFtZSA9IHRoaXMucHJvdmlkZXJOYW1lLnJlcGxhY2UoJzonLCAnJyk7XG5cbiAgICAgICAgcnVudGltZUluZm8uYnJvd3NlcklkICAgPSBicm93c2VySWQ7XG4gICAgICAgIHJ1bnRpbWVJbmZvLmJyb3dzZXJOYW1lID0gYnJvd3Nlck5hbWU7XG5cbiAgICAgICAgYXdhaXQgc3RhcnRMb2NhbEZpcmVmb3gocGFnZVVybCwgcnVudGltZUluZm8pO1xuXG4gICAgICAgIGF3YWl0IHRoaXMud2FpdEZvckNvbm5lY3Rpb25SZWFkeShydW50aW1lSW5mby5icm93c2VySWQpO1xuXG4gICAgICAgIGlmIChydW50aW1lSW5mby5tYXJpb25ldHRlUG9ydClcbiAgICAgICAgICAgIHJ1bnRpbWVJbmZvLm1hcmlvbmV0dGVDbGllbnQgPSBhd2FpdCB0aGlzLl9jcmVhdGVNYXJpb25ldHRlQ2xpZW50KHJ1bnRpbWVJbmZvKTtcblxuICAgICAgICB0aGlzLm9wZW5lZEJyb3dzZXJzW2Jyb3dzZXJJZF0gPSBydW50aW1lSW5mbztcbiAgICB9LFxuXG4gICAgYXN5bmMgY2xvc2VCcm93c2VyIChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgcnVudGltZUluZm8gPSB0aGlzLm9wZW5lZEJyb3dzZXJzW2Jyb3dzZXJJZF07XG4gICAgICAgIGNvbnN0IHsgY29uZmlnLCBtYXJpb25ldHRlQ2xpZW50IH0gPSBydW50aW1lSW5mbztcblxuICAgICAgICBpZiAoY29uZmlnLmhlYWRsZXNzKVxuICAgICAgICAgICAgYXdhaXQgbWFyaW9uZXR0ZUNsaWVudC5xdWl0KCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY2xvc2VMb2NhbEJyb3dzZXIoYnJvd3NlcklkKTtcblxuICAgICAgICBpZiAoT1MubWFjICYmICFjb25maWcuaGVhZGxlc3MpXG4gICAgICAgICAgICBhd2FpdCBzdG9wTG9jYWxGaXJlZm94KHJ1bnRpbWVJbmZvKTtcblxuICAgICAgICBpZiAocnVudGltZUluZm8udGVtcFByb2ZpbGVEaXIpXG4gICAgICAgICAgICBhd2FpdCBydW50aW1lSW5mby50ZW1wUHJvZmlsZURpci5kaXNwb3NlKCk7XG5cbiAgICAgICAgZGVsZXRlIHRoaXMub3BlbmVkQnJvd3NlcnNbYnJvd3NlcklkXTtcbiAgICB9LFxuXG4gICAgYXN5bmMgaXNMb2NhbEJyb3dzZXIgKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgaXNIZWFkbGVzc0Jyb3dzZXIgKGJyb3dzZXJJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuZWRCcm93c2Vyc1ticm93c2VySWRdLmNvbmZpZy5oZWFkbGVzcztcbiAgICB9LFxuXG4gICAgYXN5bmMgdGFrZVNjcmVlbnNob3QgKGJyb3dzZXJJZCwgcGF0aCkge1xuICAgICAgICBjb25zdCB7IG1hcmlvbmV0dGVDbGllbnQgfSA9IHRoaXMub3BlbmVkQnJvd3NlcnNbYnJvd3NlcklkXTtcblxuICAgICAgICBhd2FpdCBtYXJpb25ldHRlQ2xpZW50LnRha2VTY3JlZW5zaG90KHBhdGgpO1xuICAgIH0sXG5cbiAgICBhc3luYyByZXNpemVXaW5kb3cgKGJyb3dzZXJJZCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBjb25zdCB7IG1hcmlvbmV0dGVDbGllbnQgfSA9IHRoaXMub3BlbmVkQnJvd3NlcnNbYnJvd3NlcklkXTtcblxuICAgICAgICBhd2FpdCBtYXJpb25ldHRlQ2xpZW50LnNldFdpbmRvd1NpemUod2lkdGgsIGhlaWdodCk7XG4gICAgfSxcblxuICAgIGFzeW5jIG1heGltaXplV2luZG93IChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgbWF4aW11bVNpemUgPSBnZXRNYXhpbWl6ZWRIZWFkbGVzc1dpbmRvd1NpemUoKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnJlc2l6ZVdpbmRvdyhicm93c2VySWQsIG1heGltdW1TaXplLndpZHRoLCBtYXhpbXVtU2l6ZS5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICBhc3luYyBoYXNDdXN0b21BY3Rpb25Gb3JCcm93c2VyIChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgeyBjb25maWcsIG1hcmlvbmV0dGVDbGllbnQgfSA9IHRoaXMub3BlbmVkQnJvd3NlcnNbYnJvd3NlcklkXTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGFzQ2xvc2VCcm93c2VyOiAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgaGFzVGFrZVNjcmVlbnNob3Q6ICAgICAgICAgICAgICAhIW1hcmlvbmV0dGVDbGllbnQsXG4gICAgICAgICAgICBoYXNDaHJvbWVsZXNzU2NyZWVuc2hvdHM6ICAgICAgICEhbWFyaW9uZXR0ZUNsaWVudCxcbiAgICAgICAgICAgIGhhc1Jlc2l6ZVdpbmRvdzogICAgICAgICAgICAgICAgISFtYXJpb25ldHRlQ2xpZW50ICYmIGNvbmZpZy5oZWFkbGVzcyxcbiAgICAgICAgICAgIGhhc01heGltaXplV2luZG93OiAgICAgICAgICAgICAgISFtYXJpb25ldHRlQ2xpZW50ICYmIGNvbmZpZy5oZWFkbGVzcyxcbiAgICAgICAgICAgIGhhc0NhblJlc2l6ZVdpbmRvd1RvRGltZW5zaW9uczogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG59O1xuIl19
