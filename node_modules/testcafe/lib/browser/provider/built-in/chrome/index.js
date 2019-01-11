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

const MIN_AVAILABLE_DIMENSION = 50;

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

            yield _this._ensureWindowIsExpanded(browserId, runtimeInfo.viewportSize);
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
    },

    _ensureWindowIsExpanded(browserId, { height, width, availableHeight, availableWidth, outerWidth, outerHeight }) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (height < MIN_AVAILABLE_DIMENSION || width < MIN_AVAILABLE_DIMENSION) {
                const newHeight = availableHeight;
                const newWidth = Math.floor(availableWidth / 2);

                yield _this7.resizeWindow(browserId, newWidth, newHeight, outerWidth, outerHeight);
            }
        })();
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2Nocm9tZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJjZHAiLCJNSU5fQVZBSUxBQkxFX0RJTUVOU0lPTiIsIm9wZW5lZEJyb3dzZXJzIiwiaXNNdWx0aUJyb3dzZXIiLCJvcGVuQnJvd3NlciIsImJyb3dzZXJJZCIsInBhZ2VVcmwiLCJjb25maWdTdHJpbmciLCJydW50aW1lSW5mbyIsImhvc3RuYW1lIiwiYnJvd3Nlck5hbWUiLCJwcm92aWRlck5hbWUiLCJyZXBsYWNlIiwicHJvdmlkZXJNZXRob2RzIiwicmVzaXplTG9jYWxCcm93c2VyV2luZG93IiwiYXJncyIsIndhaXRGb3JDb25uZWN0aW9uUmVhZHkiLCJ2aWV3cG9ydFNpemUiLCJydW5Jbml0U2NyaXB0IiwiR0VUX1dJTkRPV19ESU1FTlNJT05TX0lORk9fU0NSSVBUIiwiY3JlYXRlQ2xpZW50IiwiX2Vuc3VyZVdpbmRvd0lzRXhwYW5kZWQiLCJjbG9zZUJyb3dzZXIiLCJpc0hlYWRsZXNzVGFiIiwiY2xvc2VUYWIiLCJjbG9zZUxvY2FsQnJvd3NlciIsIk9TIiwibWFjIiwiY29uZmlnIiwiaGVhZGxlc3MiLCJ0ZW1wUHJvZmlsZURpciIsImRpc3Bvc2UiLCJpc0xvY2FsQnJvd3NlciIsImlzSGVhZGxlc3NCcm93c2VyIiwidGFrZVNjcmVlbnNob3QiLCJwYXRoIiwicmVzaXplV2luZG93Iiwid2lkdGgiLCJoZWlnaHQiLCJjdXJyZW50V2lkdGgiLCJjdXJyZW50SGVpZ2h0IiwibW9iaWxlIiwidXBkYXRlTW9iaWxlVmlld3BvcnRTaXplIiwibWF4aW1pemVXaW5kb3ciLCJtYXhpbXVtU2l6ZSIsImhhc0N1c3RvbUFjdGlvbkZvckJyb3dzZXIiLCJjbGllbnQiLCJoYXNDbG9zZUJyb3dzZXIiLCJoYXNSZXNpemVXaW5kb3ciLCJlbXVsYXRpb24iLCJoYXNNYXhpbWl6ZVdpbmRvdyIsImhhc1Rha2VTY3JlZW5zaG90IiwiaGFzQ2hyb21lbGVzc1NjcmVlbnNob3RzIiwiaGFzQ2FuUmVzaXplV2luZG93VG9EaW1lbnNpb25zIiwiYXZhaWxhYmxlSGVpZ2h0IiwiYXZhaWxhYmxlV2lkdGgiLCJvdXRlcldpZHRoIiwib3V0ZXJIZWlnaHQiLCJuZXdIZWlnaHQiLCJuZXdXaWR0aCIsIk1hdGgiLCJmbG9vciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0lBQVlBLEc7O0FBQ1o7Ozs7QUFDQTs7Ozs7O0FBR0EsTUFBTUMsMEJBQTBCLEVBQWhDOztrQkFFZTtBQUNYQyxvQkFBZ0IsRUFETDs7QUFHWEMsb0JBQWdCLEtBSEw7O0FBS0xDLGVBQU4sQ0FBbUJDLFNBQW5CLEVBQThCQyxPQUE5QixFQUF1Q0MsWUFBdkMsRUFBcUQ7QUFBQTs7QUFBQTtBQUNqRCxrQkFBTUMsY0FBYyxNQUFNLDJCQUFlLGdCQUFTRixPQUFULEVBQWtCRyxRQUFqQyxFQUEyQ0YsWUFBM0MsQ0FBMUI7QUFDQSxrQkFBTUcsY0FBYyxNQUFLQyxZQUFMLENBQWtCQyxPQUFsQixDQUEwQixHQUExQixFQUErQixFQUEvQixDQUFwQjs7QUFFQUosd0JBQVlILFNBQVosR0FBMEJBLFNBQTFCO0FBQ0FHLHdCQUFZRSxXQUFaLEdBQTBCQSxXQUExQjs7QUFFQUYsd0JBQVlLLGVBQVosR0FBOEI7QUFDMUJDLDBDQUEwQixrQ0FBQyxHQUFHQyxJQUFKO0FBQUEsMkJBQWEsTUFBS0Qsd0JBQUwsQ0FBOEIsR0FBR0MsSUFBakMsQ0FBYjtBQUFBO0FBREEsYUFBOUI7O0FBSUEsa0JBQU0sd0JBQWlCVCxPQUFqQixFQUEwQkUsV0FBMUIsQ0FBTjs7QUFFQSxrQkFBTSxNQUFLUSxzQkFBTCxDQUE0QlgsU0FBNUIsQ0FBTjs7QUFFQUcsd0JBQVlTLFlBQVosR0FBMkIsTUFBTSxNQUFLQyxhQUFMLENBQW1CYixTQUFuQixFQUE4QmMsa0RBQTlCLENBQWpDOztBQUVBLGtCQUFNbkIsSUFBSW9CLFlBQUosQ0FBaUJaLFdBQWpC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LE9BQU9DLFFBQXhDLENBRjdCO0FBR0hxQixtQ0FBZ0MsQ0FBQyxDQUFDSixNQUFGLElBQVlsQixPQUFPQyxRQUhoRDtBQUlIc0IsbUNBQWdDLENBQUMsQ0FBQ0wsTUFKL0I7QUFLSE0sMENBQWdDLENBQUMsQ0FBQ04sTUFML0I7QUFNSE8sZ0RBQWdDO0FBTjdCLGFBQVA7QUFId0M7QUFXM0MsS0ExRlU7O0FBNEZMaEMsMkJBQU4sQ0FBK0JoQixTQUEvQixFQUEwQyxFQUFFaUMsTUFBRixFQUFVRCxLQUFWLEVBQWlCaUIsZUFBakIsRUFBa0NDLGNBQWxDLEVBQWtEQyxVQUFsRCxFQUE4REMsV0FBOUQsRUFBMUMsRUFBdUg7QUFBQTs7QUFBQTtBQUNuSCxnQkFBSW5CLFNBQVNyQyx1QkFBVCxJQUFvQ29DLFFBQVFwQyx1QkFBaEQsRUFBeUU7QUFDckUsc0JBQU15RCxZQUFZSixlQUFsQjtBQUNBLHNCQUFNSyxXQUFZQyxLQUFLQyxLQUFMLENBQVdOLGlCQUFpQixDQUE1QixDQUFsQjs7QUFFQSxzQkFBTSxPQUFLbkIsWUFBTCxDQUFrQi9CLFNBQWxCLEVBQTZCc0QsUUFBN0IsRUFBdUNELFNBQXZDLEVBQWtERixVQUFsRCxFQUE4REMsV0FBOUQsQ0FBTjtBQUNIO0FBTmtIO0FBT3RIO0FBbkdVLEMiLCJmaWxlIjoiYnJvd3Nlci9wcm92aWRlci9idWlsdC1pbi9jaHJvbWUvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgT1MgZnJvbSAnb3MtZmFtaWx5JztcbmltcG9ydCB7IHBhcnNlIGFzIHBhcnNlVXJsIH0gZnJvbSAndXJsJztcbmltcG9ydCBnZXRSdW50aW1lSW5mbyBmcm9tICcuL3J1bnRpbWUtaW5mbyc7XG5pbXBvcnQgeyBzdGFydCBhcyBzdGFydExvY2FsQ2hyb21lLCBzdG9wIGFzIHN0b3BMb2NhbENocm9tZSB9IGZyb20gJy4vbG9jYWwtY2hyb21lJztcbmltcG9ydCAqIGFzIGNkcCBmcm9tICcuL2NkcCc7XG5pbXBvcnQgZ2V0TWF4aW1pemVkSGVhZGxlc3NXaW5kb3dTaXplIGZyb20gJy4uLy4uL3V0aWxzL2dldC1tYXhpbWl6ZWQtaGVhZGxlc3Mtd2luZG93LXNpemUnO1xuaW1wb3J0IHsgR0VUX1dJTkRPV19ESU1FTlNJT05TX0lORk9fU0NSSVBUIH0gZnJvbSAnLi4vLi4vdXRpbHMvY2xpZW50LWZ1bmN0aW9ucyc7XG5cblxuY29uc3QgTUlOX0FWQUlMQUJMRV9ESU1FTlNJT04gPSA1MDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIG9wZW5lZEJyb3dzZXJzOiB7fSxcblxuICAgIGlzTXVsdGlCcm93c2VyOiBmYWxzZSxcblxuICAgIGFzeW5jIG9wZW5Ccm93c2VyIChicm93c2VySWQsIHBhZ2VVcmwsIGNvbmZpZ1N0cmluZykge1xuICAgICAgICBjb25zdCBydW50aW1lSW5mbyA9IGF3YWl0IGdldFJ1bnRpbWVJbmZvKHBhcnNlVXJsKHBhZ2VVcmwpLmhvc3RuYW1lLCBjb25maWdTdHJpbmcpO1xuICAgICAgICBjb25zdCBicm93c2VyTmFtZSA9IHRoaXMucHJvdmlkZXJOYW1lLnJlcGxhY2UoJzonLCAnJyk7XG5cbiAgICAgICAgcnVudGltZUluZm8uYnJvd3NlcklkICAgPSBicm93c2VySWQ7XG4gICAgICAgIHJ1bnRpbWVJbmZvLmJyb3dzZXJOYW1lID0gYnJvd3Nlck5hbWU7XG5cbiAgICAgICAgcnVudGltZUluZm8ucHJvdmlkZXJNZXRob2RzID0ge1xuICAgICAgICAgICAgcmVzaXplTG9jYWxCcm93c2VyV2luZG93OiAoLi4uYXJncykgPT4gdGhpcy5yZXNpemVMb2NhbEJyb3dzZXJXaW5kb3coLi4uYXJncylcbiAgICAgICAgfTtcblxuICAgICAgICBhd2FpdCBzdGFydExvY2FsQ2hyb21lKHBhZ2VVcmwsIHJ1bnRpbWVJbmZvKTtcblxuICAgICAgICBhd2FpdCB0aGlzLndhaXRGb3JDb25uZWN0aW9uUmVhZHkoYnJvd3NlcklkKTtcblxuICAgICAgICBydW50aW1lSW5mby52aWV3cG9ydFNpemUgPSBhd2FpdCB0aGlzLnJ1bkluaXRTY3JpcHQoYnJvd3NlcklkLCBHRVRfV0lORE9XX0RJTUVOU0lPTlNfSU5GT19TQ1JJUFQpO1xuXG4gICAgICAgIGF3YWl0IGNkcC5jcmVhdGVDbGllbnQocnVudGltZUluZm8pO1xuXG4gICAgICAgIHRoaXMub3BlbmVkQnJvd3NlcnNbYnJvd3NlcklkXSA9IHJ1bnRpbWVJbmZvO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuX2Vuc3VyZVdpbmRvd0lzRXhwYW5kZWQoYnJvd3NlcklkLCBydW50aW1lSW5mby52aWV3cG9ydFNpemUpO1xuICAgIH0sXG5cbiAgICBhc3luYyBjbG9zZUJyb3dzZXIgKGJyb3dzZXJJZCkge1xuICAgICAgICBjb25zdCBydW50aW1lSW5mbyA9IHRoaXMub3BlbmVkQnJvd3NlcnNbYnJvd3NlcklkXTtcblxuICAgICAgICBpZiAoY2RwLmlzSGVhZGxlc3NUYWIocnVudGltZUluZm8pKVxuICAgICAgICAgICAgYXdhaXQgY2RwLmNsb3NlVGFiKHJ1bnRpbWVJbmZvKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5jbG9zZUxvY2FsQnJvd3Nlcihicm93c2VySWQpO1xuXG4gICAgICAgIGlmIChPUy5tYWMgfHwgcnVudGltZUluZm8uY29uZmlnLmhlYWRsZXNzKVxuICAgICAgICAgICAgYXdhaXQgc3RvcExvY2FsQ2hyb21lKHJ1bnRpbWVJbmZvKTtcblxuICAgICAgICBpZiAocnVudGltZUluZm8udGVtcFByb2ZpbGVEaXIpXG4gICAgICAgICAgICBhd2FpdCBydW50aW1lSW5mby50ZW1wUHJvZmlsZURpci5kaXNwb3NlKCk7XG5cbiAgICAgICAgZGVsZXRlIHRoaXMub3BlbmVkQnJvd3NlcnNbYnJvd3NlcklkXTtcbiAgICB9LFxuXG4gICAgYXN5bmMgaXNMb2NhbEJyb3dzZXIgKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgaXNIZWFkbGVzc0Jyb3dzZXIgKGJyb3dzZXJJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuZWRCcm93c2Vyc1ticm93c2VySWRdLmNvbmZpZy5oZWFkbGVzcztcbiAgICB9LFxuXG4gICAgYXN5bmMgdGFrZVNjcmVlbnNob3QgKGJyb3dzZXJJZCwgcGF0aCkge1xuICAgICAgICBjb25zdCBydW50aW1lSW5mbyA9IHRoaXMub3BlbmVkQnJvd3NlcnNbYnJvd3NlcklkXTtcblxuICAgICAgICBhd2FpdCBjZHAudGFrZVNjcmVlbnNob3QocGF0aCwgcnVudGltZUluZm8pO1xuICAgIH0sXG5cbiAgICBhc3luYyByZXNpemVXaW5kb3cgKGJyb3dzZXJJZCwgd2lkdGgsIGhlaWdodCwgY3VycmVudFdpZHRoLCBjdXJyZW50SGVpZ2h0KSB7XG4gICAgICAgIGNvbnN0IHJ1bnRpbWVJbmZvID0gdGhpcy5vcGVuZWRCcm93c2Vyc1ticm93c2VySWRdO1xuXG4gICAgICAgIGlmIChydW50aW1lSW5mby5jb25maWcubW9iaWxlKVxuICAgICAgICAgICAgYXdhaXQgY2RwLnVwZGF0ZU1vYmlsZVZpZXdwb3J0U2l6ZShydW50aW1lSW5mbyk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcnVudGltZUluZm8udmlld3BvcnRTaXplLndpZHRoICA9IGN1cnJlbnRXaWR0aDtcbiAgICAgICAgICAgIHJ1bnRpbWVJbmZvLnZpZXdwb3J0U2l6ZS5oZWlnaHQgPSBjdXJyZW50SGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgY2RwLnJlc2l6ZVdpbmRvdyh7IHdpZHRoLCBoZWlnaHQgfSwgcnVudGltZUluZm8pO1xuICAgIH0sXG5cbiAgICBhc3luYyBtYXhpbWl6ZVdpbmRvdyAoYnJvd3NlcklkKSB7XG4gICAgICAgIGNvbnN0IG1heGltdW1TaXplID0gZ2V0TWF4aW1pemVkSGVhZGxlc3NXaW5kb3dTaXplKCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5yZXNpemVXaW5kb3coYnJvd3NlcklkLCBtYXhpbXVtU2l6ZS53aWR0aCwgbWF4aW11bVNpemUuaGVpZ2h0LCBtYXhpbXVtU2l6ZS53aWR0aCwgbWF4aW11bVNpemUuaGVpZ2h0KTtcbiAgICB9LFxuXG4gICAgYXN5bmMgaGFzQ3VzdG9tQWN0aW9uRm9yQnJvd3NlciAoYnJvd3NlcklkKSB7XG4gICAgICAgIGNvbnN0IHsgY29uZmlnLCBjbGllbnQgfSA9IHRoaXMub3BlbmVkQnJvd3NlcnNbYnJvd3NlcklkXTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGFzQ2xvc2VCcm93c2VyOiAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgaGFzUmVzaXplV2luZG93OiAgICAgICAgICAgICAgICAhIWNsaWVudCAmJiAoY29uZmlnLmVtdWxhdGlvbiB8fCBjb25maWcuaGVhZGxlc3MpLFxuICAgICAgICAgICAgaGFzTWF4aW1pemVXaW5kb3c6ICAgICAgICAgICAgICAhIWNsaWVudCAmJiBjb25maWcuaGVhZGxlc3MsXG4gICAgICAgICAgICBoYXNUYWtlU2NyZWVuc2hvdDogICAgICAgICAgICAgICEhY2xpZW50LFxuICAgICAgICAgICAgaGFzQ2hyb21lbGVzc1NjcmVlbnNob3RzOiAgICAgICAhIWNsaWVudCxcbiAgICAgICAgICAgIGhhc0NhblJlc2l6ZVdpbmRvd1RvRGltZW5zaW9uczogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgYXN5bmMgX2Vuc3VyZVdpbmRvd0lzRXhwYW5kZWQgKGJyb3dzZXJJZCwgeyBoZWlnaHQsIHdpZHRoLCBhdmFpbGFibGVIZWlnaHQsIGF2YWlsYWJsZVdpZHRoLCBvdXRlcldpZHRoLCBvdXRlckhlaWdodCB9KSB7XG4gICAgICAgIGlmIChoZWlnaHQgPCBNSU5fQVZBSUxBQkxFX0RJTUVOU0lPTiB8fCB3aWR0aCA8IE1JTl9BVkFJTEFCTEVfRElNRU5TSU9OKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdIZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBuZXdXaWR0aCAgPSBNYXRoLmZsb29yKGF2YWlsYWJsZVdpZHRoIC8gMik7XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVzaXplV2luZG93KGJyb3dzZXJJZCwgbmV3V2lkdGgsIG5ld0hlaWdodCwgb3V0ZXJXaWR0aCwgb3V0ZXJIZWlnaHQpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiJdfQ==
