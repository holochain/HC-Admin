'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _testcafeBrowserTools = require('testcafe-browser-tools');

var _testcafeBrowserTools2 = _interopRequireDefault(_testcafeBrowserTools);

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _connection = require('../connection');

var _connection2 = _interopRequireDefault(_connection);

var _delay = require('../../utils/delay');

var _delay2 = _interopRequireDefault(_delay);

var _clientFunctions = require('./utils/client-functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BROWSER_OPENING_DELAY = 2000;

const RESIZE_DIFF_SIZE = {
    width: 100,
    height: 100
};

function sumSizes(sizeA, sizeB) {
    return {
        width: sizeA.width + sizeB.width,
        height: sizeA.height + sizeB.height
    };
}

function subtractSizes(sizeA, sizeB) {
    return {
        width: sizeA.width - sizeB.width,
        height: sizeA.height - sizeB.height
    };
}

class BrowserProvider {
    constructor(plugin) {
        this.plugin = plugin;
        this.initPromise = _pinkie2.default.resolve(false);

        this.isMultiBrowser = this.plugin.isMultiBrowser;
        // HACK: The browser window has different border sizes in normal and maximized modes. So, we need to be sure that the window is
        // not maximized before resizing it in order to keep the mechanism of correcting the client area size working. When browser is started,
        // we are resizing it for the first time to switch the window to normal mode, and for the second time - to restore the client area size.
        this.localBrowsersInfo = {};
    }

    _createLocalBrowserInfo(browserId) {
        if (this.localBrowsersInfo[browserId]) return;

        this.localBrowsersInfo[browserId] = {
            windowDescriptor: null,
            maxScreenSize: null,
            resizeCorrections: null
        };
    }

    _getWindowDescriptor(browserId) {
        return this.localBrowsersInfo[browserId] && this.localBrowsersInfo[browserId].windowDescriptor;
    }

    _getMaxScreenSize(browserId) {
        return this.localBrowsersInfo[browserId] && this.localBrowsersInfo[browserId].maxScreenSize;
    }

    _getResizeCorrections(browserId) {
        return this.localBrowsersInfo[browserId] && this.localBrowsersInfo[browserId].resizeCorrections;
    }

    _isBrowserIdle(browserId) {
        const connection = _connection2.default.getById(browserId);

        return connection.idle;
    }

    _calculateResizeCorrections(browserId) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this._isBrowserIdle(browserId)) return;

            const title = yield _this.plugin.runInitScript(browserId, _clientFunctions.GET_TITLE_SCRIPT);

            if (!(yield _testcafeBrowserTools2.default.isMaximized(title))) return;

            const currentSize = yield _this.plugin.runInitScript(browserId, _clientFunctions.GET_WINDOW_DIMENSIONS_INFO_SCRIPT);
            const etalonSize = subtractSizes(currentSize, RESIZE_DIFF_SIZE);

            yield _testcafeBrowserTools2.default.resize(title, currentSize.width, currentSize.height, etalonSize.width, etalonSize.height);

            let resizedSize = yield _this.plugin.runInitScript(browserId, _clientFunctions.GET_WINDOW_DIMENSIONS_INFO_SCRIPT);
            let correctionSize = subtractSizes(resizedSize, etalonSize);

            yield _testcafeBrowserTools2.default.resize(title, resizedSize.width, resizedSize.height, etalonSize.width, etalonSize.height);

            resizedSize = yield _this.plugin.runInitScript(browserId, _clientFunctions.GET_WINDOW_DIMENSIONS_INFO_SCRIPT);

            correctionSize = sumSizes(correctionSize, subtractSizes(resizedSize, etalonSize));

            if (_this.localBrowsersInfo[browserId]) _this.localBrowsersInfo[browserId].resizeCorrections = correctionSize;

            yield _testcafeBrowserTools2.default.maximize(title);
        })();
    }

    _calculateMacSizeLimits(browserId) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this2._isBrowserIdle(browserId)) return;

            const sizeInfo = yield _this2.plugin.runInitScript(browserId, _clientFunctions.GET_WINDOW_DIMENSIONS_INFO_SCRIPT);

            if (_this2.localBrowsersInfo[browserId]) {
                _this2.localBrowsersInfo[browserId].maxScreenSize = {
                    width: sizeInfo.availableWidth - (sizeInfo.outerWidth - sizeInfo.width),
                    height: sizeInfo.availableHeight - (sizeInfo.outerHeight - sizeInfo.height)
                };
            }
        })();
    }

    _ensureBrowserWindowDescriptor(browserId) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this3._getWindowDescriptor(browserId)) return;

            yield _this3._createLocalBrowserInfo(browserId);

            // NOTE: delay to ensure the window finished the opening
            yield _this3.plugin.waitForConnectionReady(browserId);
            yield (0, _delay2.default)(BROWSER_OPENING_DELAY);

            if (_this3.localBrowsersInfo[browserId]) _this3.localBrowsersInfo[browserId].windowDescriptor = yield _testcafeBrowserTools2.default.findWindow(browserId);
        })();
    }

    _ensureBrowserWindowParameters(browserId) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4._ensureBrowserWindowDescriptor(browserId);

            if (_osFamily2.default.win && !_this4._getResizeCorrections(browserId)) yield _this4._calculateResizeCorrections(browserId);else if (_osFamily2.default.mac && !_this4._getMaxScreenSize(browserId)) yield _this4._calculateMacSizeLimits(browserId);
        })();
    }

    _closeLocalBrowser(browserId) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _testcafeBrowserTools2.default.close(_this5._getWindowDescriptor(browserId));
        })();
    }

    _resizeLocalBrowserWindow(browserId, width, height, currentWidth, currentHeight) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const resizeCorrections = _this6._getResizeCorrections(browserId);

            if (resizeCorrections && (yield _testcafeBrowserTools2.default.isMaximized(_this6._getWindowDescriptor(browserId)))) {
                width -= resizeCorrections.width;
                height -= resizeCorrections.height;
            }

            yield _testcafeBrowserTools2.default.resize(_this6._getWindowDescriptor(browserId), currentWidth, currentHeight, width, height);
        })();
    }

    _takeLocalBrowserScreenshot(browserId, screenshotPath) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _testcafeBrowserTools2.default.screenshot(_this7._getWindowDescriptor(browserId), screenshotPath);
        })();
    }

    _canResizeLocalBrowserWindowToDimensions(browserId, width, height) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_osFamily2.default.mac) return true;

            const maxScreenSize = _this8._getMaxScreenSize(browserId);

            return width <= maxScreenSize.width && height <= maxScreenSize.height;
        })();
    }

    _maximizeLocalBrowserWindow(browserId) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _testcafeBrowserTools2.default.maximize(_this9._getWindowDescriptor(browserId));
        })();
    }

    _canUseDefaultWindowActions(browserId) {
        var _this10 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const isLocalBrowser = yield _this10.plugin.isLocalBrowser(browserId);
            const isHeadlessBrowser = yield _this10.plugin.isHeadlessBrowser(browserId);

            return isLocalBrowser && !isHeadlessBrowser;
        })();
    }

    init() {
        var _this11 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const initialized = yield _this11.initPromise;

            if (initialized) return;

            _this11.initPromise = _this11.plugin.init().then(function () {
                return true;
            });

            try {
                yield _this11.initPromise;
            } catch (error) {
                _this11.initPromise = _pinkie2.default.resolve(false);

                throw error;
            }
        })();
    }

    dispose() {
        var _this12 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const initialized = yield _this12.initPromise;

            if (!initialized) return;

            _this12.initPromise = _this12.plugin.dispose().then(function () {
                return false;
            });

            try {
                yield _this12.initPromise;
            } catch (error) {
                _this12.initPromise = _pinkie2.default.resolve(false);

                throw error;
            }
        })();
    }

    isLocalBrowser(browserId, browserName) {
        var _this13 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this13.plugin.isLocalBrowser(browserId, browserName);
        })();
    }

    isHeadlessBrowser(browserId) {
        return this.plugin.isHeadlessBrowser(browserId);
    }

    openBrowser(browserId, pageUrl, browserName) {
        var _this14 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this14.plugin.openBrowser(browserId, pageUrl, browserName);

            if (yield _this14._canUseDefaultWindowActions(browserId)) yield _this14._ensureBrowserWindowParameters(browserId);
        })();
    }

    closeBrowser(browserId) {
        var _this15 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const canUseDefaultWindowActions = yield _this15._canUseDefaultWindowActions(browserId);
            const customActionsInfo = yield _this15.hasCustomActionForBrowser(browserId);
            const hasCustomCloseBrowser = customActionsInfo.hasCloseBrowser;
            const usePluginsCloseBrowser = hasCustomCloseBrowser || !canUseDefaultWindowActions;

            if (usePluginsCloseBrowser) yield _this15.plugin.closeBrowser(browserId);else yield _this15._closeLocalBrowser(browserId);

            if (canUseDefaultWindowActions) delete _this15.localBrowsersInfo[browserId];
        })();
    }

    getBrowserList() {
        var _this16 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this16.plugin.getBrowserList();
        })();
    }

    isValidBrowserName(browserName) {
        var _this17 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this17.plugin.isValidBrowserName(browserName);
        })();
    }

    resizeWindow(browserId, width, height, currentWidth, currentHeight) {
        var _this18 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const canUseDefaultWindowActions = yield _this18._canUseDefaultWindowActions(browserId);
            const customActionsInfo = yield _this18.hasCustomActionForBrowser(browserId);
            const hasCustomResizeWindow = customActionsInfo.hasResizeWindow;

            if (canUseDefaultWindowActions && !hasCustomResizeWindow) {
                yield _this18._resizeLocalBrowserWindow(browserId, width, height, currentWidth, currentHeight);
                return;
            }

            yield _this18.plugin.resizeWindow(browserId, width, height, currentWidth, currentHeight);
        })();
    }

    canResizeWindowToDimensions(browserId, width, height) {
        var _this19 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const canUseDefaultWindowActions = yield _this19._canUseDefaultWindowActions(browserId);
            const customActionsInfo = yield _this19.hasCustomActionForBrowser(browserId);
            const hasCustomCanResizeToDimensions = customActionsInfo.hasCanResizeWindowToDimensions;

            if (canUseDefaultWindowActions && !hasCustomCanResizeToDimensions) return yield _this19._canResizeLocalBrowserWindowToDimensions(browserId, width, height);

            return yield _this19.plugin.canResizeWindowToDimensions(browserId, width, height);
        })();
    }

    maximizeWindow(browserId) {
        var _this20 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const canUseDefaultWindowActions = yield _this20._canUseDefaultWindowActions(browserId);
            const customActionsInfo = yield _this20.hasCustomActionForBrowser(browserId);
            const hasCustomMaximizeWindow = customActionsInfo.hasMaximizeWindow;

            if (canUseDefaultWindowActions && !hasCustomMaximizeWindow) return yield _this20._maximizeLocalBrowserWindow(browserId);

            return yield _this20.plugin.maximizeWindow(browserId);
        })();
    }

    takeScreenshot(browserId, screenshotPath, pageWidth, pageHeight) {
        var _this21 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const canUseDefaultWindowActions = yield _this21._canUseDefaultWindowActions(browserId);
            const customActionsInfo = yield _this21.hasCustomActionForBrowser(browserId);
            const hasCustomTakeScreenshot = customActionsInfo.hasTakeScreenshot;

            if (canUseDefaultWindowActions && !hasCustomTakeScreenshot) {
                yield _this21._takeLocalBrowserScreenshot(browserId, screenshotPath, pageWidth, pageHeight);
                return;
            }

            yield _this21.plugin.takeScreenshot(browserId, screenshotPath, pageWidth, pageHeight);
        })();
    }

    hasCustomActionForBrowser(browserId) {
        var _this22 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return _this22.plugin.hasCustomActionForBrowser(browserId);
        })();
    }

    reportJobResult(browserId, status, data) {
        var _this23 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this23.plugin.reportJobResult(browserId, status, data);
        })();
    }
}
exports.default = BrowserProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbIkJST1dTRVJfT1BFTklOR19ERUxBWSIsIlJFU0laRV9ESUZGX1NJWkUiLCJ3aWR0aCIsImhlaWdodCIsInN1bVNpemVzIiwic2l6ZUEiLCJzaXplQiIsInN1YnRyYWN0U2l6ZXMiLCJCcm93c2VyUHJvdmlkZXIiLCJjb25zdHJ1Y3RvciIsInBsdWdpbiIsImluaXRQcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJpc011bHRpQnJvd3NlciIsImxvY2FsQnJvd3NlcnNJbmZvIiwiX2NyZWF0ZUxvY2FsQnJvd3NlckluZm8iLCJicm93c2VySWQiLCJ3aW5kb3dEZXNjcmlwdG9yIiwibWF4U2NyZWVuU2l6ZSIsInJlc2l6ZUNvcnJlY3Rpb25zIiwiX2dldFdpbmRvd0Rlc2NyaXB0b3IiLCJfZ2V0TWF4U2NyZWVuU2l6ZSIsIl9nZXRSZXNpemVDb3JyZWN0aW9ucyIsIl9pc0Jyb3dzZXJJZGxlIiwiY29ubmVjdGlvbiIsIkJyb3dzZXJDb25uZWN0aW9uIiwiZ2V0QnlJZCIsImlkbGUiLCJfY2FsY3VsYXRlUmVzaXplQ29ycmVjdGlvbnMiLCJ0aXRsZSIsInJ1bkluaXRTY3JpcHQiLCJHRVRfVElUTEVfU0NSSVBUIiwiYnJvd3NlclRvb2xzIiwiaXNNYXhpbWl6ZWQiLCJjdXJyZW50U2l6ZSIsIkdFVF9XSU5ET1dfRElNRU5TSU9OU19JTkZPX1NDUklQVCIsImV0YWxvblNpemUiLCJyZXNpemUiLCJyZXNpemVkU2l6ZSIsImNvcnJlY3Rpb25TaXplIiwibWF4aW1pemUiLCJfY2FsY3VsYXRlTWFjU2l6ZUxpbWl0cyIsInNpemVJbmZvIiwiYXZhaWxhYmxlV2lkdGgiLCJvdXRlcldpZHRoIiwiYXZhaWxhYmxlSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJfZW5zdXJlQnJvd3NlcldpbmRvd0Rlc2NyaXB0b3IiLCJ3YWl0Rm9yQ29ubmVjdGlvblJlYWR5IiwiZmluZFdpbmRvdyIsIl9lbnN1cmVCcm93c2VyV2luZG93UGFyYW1ldGVycyIsIk9TIiwid2luIiwibWFjIiwiX2Nsb3NlTG9jYWxCcm93c2VyIiwiY2xvc2UiLCJfcmVzaXplTG9jYWxCcm93c2VyV2luZG93IiwiY3VycmVudFdpZHRoIiwiY3VycmVudEhlaWdodCIsIl90YWtlTG9jYWxCcm93c2VyU2NyZWVuc2hvdCIsInNjcmVlbnNob3RQYXRoIiwic2NyZWVuc2hvdCIsIl9jYW5SZXNpemVMb2NhbEJyb3dzZXJXaW5kb3dUb0RpbWVuc2lvbnMiLCJfbWF4aW1pemVMb2NhbEJyb3dzZXJXaW5kb3ciLCJfY2FuVXNlRGVmYXVsdFdpbmRvd0FjdGlvbnMiLCJpc0xvY2FsQnJvd3NlciIsImlzSGVhZGxlc3NCcm93c2VyIiwiaW5pdCIsImluaXRpYWxpemVkIiwidGhlbiIsImVycm9yIiwiZGlzcG9zZSIsImJyb3dzZXJOYW1lIiwib3BlbkJyb3dzZXIiLCJwYWdlVXJsIiwiY2xvc2VCcm93c2VyIiwiY2FuVXNlRGVmYXVsdFdpbmRvd0FjdGlvbnMiLCJjdXN0b21BY3Rpb25zSW5mbyIsImhhc0N1c3RvbUFjdGlvbkZvckJyb3dzZXIiLCJoYXNDdXN0b21DbG9zZUJyb3dzZXIiLCJoYXNDbG9zZUJyb3dzZXIiLCJ1c2VQbHVnaW5zQ2xvc2VCcm93c2VyIiwiZ2V0QnJvd3Nlckxpc3QiLCJpc1ZhbGlkQnJvd3Nlck5hbWUiLCJyZXNpemVXaW5kb3ciLCJoYXNDdXN0b21SZXNpemVXaW5kb3ciLCJoYXNSZXNpemVXaW5kb3ciLCJjYW5SZXNpemVXaW5kb3dUb0RpbWVuc2lvbnMiLCJoYXNDdXN0b21DYW5SZXNpemVUb0RpbWVuc2lvbnMiLCJoYXNDYW5SZXNpemVXaW5kb3dUb0RpbWVuc2lvbnMiLCJtYXhpbWl6ZVdpbmRvdyIsImhhc0N1c3RvbU1heGltaXplV2luZG93IiwiaGFzTWF4aW1pemVXaW5kb3ciLCJ0YWtlU2NyZWVuc2hvdCIsInBhZ2VXaWR0aCIsInBhZ2VIZWlnaHQiLCJoYXNDdXN0b21UYWtlU2NyZWVu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QUFpQ2hELFNBQWpDLENBQXpDO0FBQ0Esa0JBQU02RCxvQkFBNkIsTUFBTSxRQUFLQyx5QkFBTCxDQUErQjlELFNBQS9CLENBQXpDO0FBQ0Esa0JBQU1nRiwwQkFBNkJuQixrQkFBa0JvQixpQkFBckQ7O0FBRUEsZ0JBQUlyQiw4QkFBOEIsQ0FBQ29CLHVCQUFuQyxFQUE0RDtBQUN4RCxzQkFBTSxRQUFLckMsMkJBQUwsQ0FBaUMzQyxTQUFqQyxFQUE0QzRDLGNBQTVDLEVBQTREa0MsU0FBNUQsRUFBdUVDLFVBQXZFLENBQU47QUFDQTtBQUNIOztBQUVELGtCQUFNLFFBQUt0RixNQUFMLENBQVlvRixjQUFaLENBQTJCN0UsU0FBM0IsRUFBc0M0QyxjQUF0QyxFQUFzRGtDLFNBQXRELEVBQWlFQyxVQUFqRSxDQUFOO0FBVm9FO0FBV3ZFOztBQUVLakIsNkJBQU4sQ0FBaUM5RCxTQUFqQyxFQUE0QztBQUFBOztBQUFBO0FBQ3hDLG1CQUFPLFFBQUtQLE1BQUwsQ0FBWXFFLHlCQUFaLENBQXNDOUQsU0FBdEMsQ0FBUDtBQUR3QztBQUUzQzs7QUFFS2tGLG1CQUFOLENBQXVCbEYsU0FBdkIsRUFBa0NtRixNQUFsQyxFQUEwQ0MsSUFBMUMsRUFBZ0Q7QUFBQTs7QUFBQTtBQUM1QyxrQkFBTSxRQUFLM0YsTUFBTCxDQUFZeUYsZUFBWixDQUE0QmxGLFNBQTVCLEVBQXVDbUYsTUFBdkMsRUFBK0NDLElBQS9DLENBQU47QUFENEM7QUFFL0M7QUF6UmdDO2tCQUFoQjdGLGUiLCJmaWxlIjoiYnJvd3Nlci9wcm92aWRlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5pbXBvcnQgYnJvd3NlclRvb2xzIGZyb20gJ3Rlc3RjYWZlLWJyb3dzZXItdG9vbHMnO1xuaW1wb3J0IE9TIGZyb20gJ29zLWZhbWlseSc7XG5pbXBvcnQgQnJvd3NlckNvbm5lY3Rpb24gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5pbXBvcnQgZGVsYXkgZnJvbSAnLi4vLi4vdXRpbHMvZGVsYXknO1xuaW1wb3J0IHsgR0VUX1RJVExFX1NDUklQVCwgR0VUX1dJTkRPV19ESU1FTlNJT05TX0lORk9fU0NSSVBUIH0gZnJvbSAnLi91dGlscy9jbGllbnQtZnVuY3Rpb25zJztcblxuXG5jb25zdCBCUk9XU0VSX09QRU5JTkdfREVMQVkgPSAyMDAwO1xuXG5jb25zdCBSRVNJWkVfRElGRl9TSVpFID0ge1xuICAgIHdpZHRoOiAgMTAwLFxuICAgIGhlaWdodDogMTAwXG59O1xuXG5cbmZ1bmN0aW9uIHN1bVNpemVzIChzaXplQSwgc2l6ZUIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogIHNpemVBLndpZHRoICsgc2l6ZUIud2lkdGgsXG4gICAgICAgIGhlaWdodDogc2l6ZUEuaGVpZ2h0ICsgc2l6ZUIuaGVpZ2h0XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gc3VidHJhY3RTaXplcyAoc2l6ZUEsIHNpemVCKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6ICBzaXplQS53aWR0aCAtIHNpemVCLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHNpemVBLmhlaWdodCAtIHNpemVCLmhlaWdodFxuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyb3dzZXJQcm92aWRlciB7XG4gICAgY29uc3RydWN0b3IgKHBsdWdpbikge1xuICAgICAgICB0aGlzLnBsdWdpbiAgICAgID0gcGx1Z2luO1xuICAgICAgICB0aGlzLmluaXRQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcblxuICAgICAgICB0aGlzLmlzTXVsdGlCcm93c2VyID0gdGhpcy5wbHVnaW4uaXNNdWx0aUJyb3dzZXI7XG4gICAgICAgIC8vIEhBQ0s6IFRoZSBicm93c2VyIHdpbmRvdyBoYXMgZGlmZmVyZW50IGJvcmRlciBzaXplcyBpbiBub3JtYWwgYW5kIG1heGltaXplZCBtb2Rlcy4gU28sIHdlIG5lZWQgdG8gYmUgc3VyZSB0aGF0IHRoZSB3aW5kb3cgaXNcbiAgICAgICAgLy8gbm90IG1heGltaXplZCBiZWZvcmUgcmVzaXppbmcgaXQgaW4gb3JkZXIgdG8ga2VlcCB0aGUgbWVjaGFuaXNtIG9mIGNvcnJlY3RpbmcgdGhlIGNsaWVudCBhcmVhIHNpemUgd29ya2luZy4gV2hlbiBicm93c2VyIGlzIHN0YXJ0ZWQsXG4gICAgICAgIC8vIHdlIGFyZSByZXNpemluZyBpdCBmb3IgdGhlIGZpcnN0IHRpbWUgdG8gc3dpdGNoIHRoZSB3aW5kb3cgdG8gbm9ybWFsIG1vZGUsIGFuZCBmb3IgdGhlIHNlY29uZCB0aW1lIC0gdG8gcmVzdG9yZSB0aGUgY2xpZW50IGFyZWEgc2l6ZS5cbiAgICAgICAgdGhpcy5sb2NhbEJyb3dzZXJzSW5mbyA9IHt9O1xuICAgIH1cblxuICAgIF9jcmVhdGVMb2NhbEJyb3dzZXJJbmZvIChicm93c2VySWQpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxCcm93c2Vyc0luZm9bYnJvd3NlcklkXSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLmxvY2FsQnJvd3NlcnNJbmZvW2Jyb3dzZXJJZF0gPSB7XG4gICAgICAgICAgICB3aW5kb3dEZXNjcmlwdG9yOiAgbnVsbCxcbiAgICAgICAgICAgIG1heFNjcmVlblNpemU6ICAgICBudWxsLFxuICAgICAgICAgICAgcmVzaXplQ29ycmVjdGlvbnM6IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBfZ2V0V2luZG93RGVzY3JpcHRvciAoYnJvd3NlcklkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsQnJvd3NlcnNJbmZvW2Jyb3dzZXJJZF0gJiYgdGhpcy5sb2NhbEJyb3dzZXJzSW5mb1ticm93c2VySWRdLndpbmRvd0Rlc2NyaXB0b3I7XG4gICAgfVxuXG4gICAgX2dldE1heFNjcmVlblNpemUgKGJyb3dzZXJJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbEJyb3dzZXJzSW5mb1ticm93c2VySWRdICYmIHRoaXMubG9jYWxCcm93c2Vyc0luZm9bYnJvd3NlcklkXS5tYXhTY3JlZW5TaXplO1xuICAgIH1cblxuICAgIF9nZXRSZXNpemVDb3JyZWN0aW9ucyAoYnJvd3NlcklkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsQnJvd3NlcnNJbmZvW2Jyb3dzZXJJZF0gJiYgdGhpcy5sb2NhbEJyb3dzZXJzSW5mb1ticm93c2VySWRdLnJlc2l6ZUNvcnJlY3Rpb25zO1xuICAgIH1cblxuICAgIF9pc0Jyb3dzZXJJZGxlIChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgY29ubmVjdGlvbiA9IEJyb3dzZXJDb25uZWN0aW9uLmdldEJ5SWQoYnJvd3NlcklkKTtcblxuICAgICAgICByZXR1cm4gY29ubmVjdGlvbi5pZGxlO1xuICAgIH1cblxuICAgIGFzeW5jIF9jYWxjdWxhdGVSZXNpemVDb3JyZWN0aW9ucyAoYnJvd3NlcklkKSB7XG4gICAgICAgIGlmICghdGhpcy5faXNCcm93c2VySWRsZShicm93c2VySWQpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHRpdGxlID0gYXdhaXQgdGhpcy5wbHVnaW4ucnVuSW5pdFNjcmlwdChicm93c2VySWQsIEdFVF9USVRMRV9TQ1JJUFQpO1xuXG4gICAgICAgIGlmICghYXdhaXQgYnJvd3NlclRvb2xzLmlzTWF4aW1pemVkKHRpdGxlKSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBjb25zdCBjdXJyZW50U2l6ZSA9IGF3YWl0IHRoaXMucGx1Z2luLnJ1bkluaXRTY3JpcHQoYnJvd3NlcklkLCBHRVRfV0lORE9XX0RJTUVOU0lPTlNfSU5GT19TQ1JJUFQpO1xuICAgICAgICBjb25zdCBldGFsb25TaXplICA9IHN1YnRyYWN0U2l6ZXMoY3VycmVudFNpemUsIFJFU0laRV9ESUZGX1NJWkUpO1xuXG4gICAgICAgIGF3YWl0IGJyb3dzZXJUb29scy5yZXNpemUodGl0bGUsIGN1cnJlbnRTaXplLndpZHRoLCBjdXJyZW50U2l6ZS5oZWlnaHQsIGV0YWxvblNpemUud2lkdGgsIGV0YWxvblNpemUuaGVpZ2h0KTtcblxuICAgICAgICBsZXQgcmVzaXplZFNpemUgICAgPSBhd2FpdCB0aGlzLnBsdWdpbi5ydW5Jbml0U2NyaXB0KGJyb3dzZXJJZCwgR0VUX1dJTkRPV19ESU1FTlNJT05TX0lORk9fU0NSSVBUKTtcbiAgICAgICAgbGV0IGNvcnJlY3Rpb25TaXplID0gc3VidHJhY3RTaXplcyhyZXNpemVkU2l6ZSwgZXRhbG9uU2l6ZSk7XG5cbiAgICAgICAgYXdhaXQgYnJvd3NlclRvb2xzLnJlc2l6ZSh0aXRsZSwgcmVzaXplZFNpemUud2lkdGgsIHJlc2l6ZWRTaXplLmhlaWdodCwgZXRhbG9uU2l6ZS53aWR0aCwgZXRhbG9uU2l6ZS5oZWlnaHQpO1xuXG4gICAgICAgIHJlc2l6ZWRTaXplID0gYXdhaXQgdGhpcy5wbHVnaW4ucnVuSW5pdFNjcmlwdChicm93c2VySWQsIEdFVF9XSU5ET1dfRElNRU5TSU9OU19JTkZPX1NDUklQVCk7XG5cbiAgICAgICAgY29ycmVjdGlvblNpemUgPSBzdW1TaXplcyhjb3JyZWN0aW9uU2l6ZSwgc3VidHJhY3RTaXplcyhyZXNpemVkU2l6ZSwgZXRhbG9uU2l6ZSkpO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsQnJvd3NlcnNJbmZvW2Jyb3dzZXJJZF0pXG4gICAgICAgICAgICB0aGlzLmxvY2FsQnJvd3NlcnNJbmZvW2Jyb3dzZXJJZF0ucmVzaXplQ29ycmVjdGlvbnMgPSBjb3JyZWN0aW9uU2l6ZTtcblxuICAgICAgICBhd2FpdCBicm93c2VyVG9vbHMubWF4aW1pemUodGl0bGUpO1xuICAgIH1cblxuXG4gICAgYXN5bmMgX2NhbGN1bGF0ZU1hY1NpemVMaW1pdHMgKGJyb3dzZXJJZCkge1xuICAgICAgICBpZiAoIXRoaXMuX2lzQnJvd3NlcklkbGUoYnJvd3NlcklkKSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBjb25zdCBzaXplSW5mbyA9IGF3YWl0IHRoaXMucGx1Z2luLnJ1bkluaXRTY3JpcHQoYnJvd3NlcklkLCBHRVRfV0lORE9XX0RJTUVOU0lPTlNfSU5GT19TQ1JJUFQpO1xuXG4gICAgICAgIGlmICh0aGlzLmxvY2FsQnJvd3NlcnNJbmZvW2Jyb3dzZXJJZF0pIHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxCcm93c2Vyc0luZm9bYnJvd3NlcklkXS5tYXhTY3JlZW5TaXplID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAgc2l6ZUluZm8uYXZhaWxhYmxlV2lkdGggLSAoc2l6ZUluZm8ub3V0ZXJXaWR0aCAtIHNpemVJbmZvLndpZHRoKSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHNpemVJbmZvLmF2YWlsYWJsZUhlaWdodCAtIChzaXplSW5mby5vdXRlckhlaWdodCAtIHNpemVJbmZvLmhlaWdodClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBfZW5zdXJlQnJvd3NlcldpbmRvd0Rlc2NyaXB0b3IgKGJyb3dzZXJJZCkge1xuICAgICAgICBpZiAodGhpcy5fZ2V0V2luZG93RGVzY3JpcHRvcihicm93c2VySWQpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuX2NyZWF0ZUxvY2FsQnJvd3NlckluZm8oYnJvd3NlcklkKTtcblxuICAgICAgICAvLyBOT1RFOiBkZWxheSB0byBlbnN1cmUgdGhlIHdpbmRvdyBmaW5pc2hlZCB0aGUgb3BlbmluZ1xuICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi53YWl0Rm9yQ29ubmVjdGlvblJlYWR5KGJyb3dzZXJJZCk7XG4gICAgICAgIGF3YWl0IGRlbGF5KEJST1dTRVJfT1BFTklOR19ERUxBWSk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9jYWxCcm93c2Vyc0luZm9bYnJvd3NlcklkXSlcbiAgICAgICAgICAgIHRoaXMubG9jYWxCcm93c2Vyc0luZm9bYnJvd3NlcklkXS53aW5kb3dEZXNjcmlwdG9yID0gYXdhaXQgYnJvd3NlclRvb2xzLmZpbmRXaW5kb3coYnJvd3NlcklkKTtcbiAgICB9XG5cbiAgICBhc3luYyBfZW5zdXJlQnJvd3NlcldpbmRvd1BhcmFtZXRlcnMgKGJyb3dzZXJJZCkge1xuICAgICAgICBhd2FpdCB0aGlzLl9lbnN1cmVCcm93c2VyV2luZG93RGVzY3JpcHRvcihicm93c2VySWQpO1xuXG4gICAgICAgIGlmIChPUy53aW4gJiYgIXRoaXMuX2dldFJlc2l6ZUNvcnJlY3Rpb25zKGJyb3dzZXJJZCkpXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9jYWxjdWxhdGVSZXNpemVDb3JyZWN0aW9ucyhicm93c2VySWQpO1xuICAgICAgICBlbHNlIGlmIChPUy5tYWMgJiYgIXRoaXMuX2dldE1heFNjcmVlblNpemUoYnJvd3NlcklkKSlcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2NhbGN1bGF0ZU1hY1NpemVMaW1pdHMoYnJvd3NlcklkKTtcbiAgICB9XG5cbiAgICBhc3luYyBfY2xvc2VMb2NhbEJyb3dzZXIgKGJyb3dzZXJJZCkge1xuICAgICAgICBhd2FpdCBicm93c2VyVG9vbHMuY2xvc2UodGhpcy5fZ2V0V2luZG93RGVzY3JpcHRvcihicm93c2VySWQpKTtcbiAgICB9XG5cbiAgICBhc3luYyBfcmVzaXplTG9jYWxCcm93c2VyV2luZG93IChicm93c2VySWQsIHdpZHRoLCBoZWlnaHQsIGN1cnJlbnRXaWR0aCwgY3VycmVudEhlaWdodCkge1xuICAgICAgICBjb25zdCByZXNpemVDb3JyZWN0aW9ucyA9IHRoaXMuX2dldFJlc2l6ZUNvcnJlY3Rpb25zKGJyb3dzZXJJZCk7XG5cbiAgICAgICAgaWYgKHJlc2l6ZUNvcnJlY3Rpb25zICYmIGF3YWl0IGJyb3dzZXJUb29scy5pc01heGltaXplZCh0aGlzLl9nZXRXaW5kb3dEZXNjcmlwdG9yKGJyb3dzZXJJZCkpKSB7XG4gICAgICAgICAgICB3aWR0aCAtPSByZXNpemVDb3JyZWN0aW9ucy53aWR0aDtcbiAgICAgICAgICAgIGhlaWdodCAtPSByZXNpemVDb3JyZWN0aW9ucy5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBicm93c2VyVG9vbHMucmVzaXplKHRoaXMuX2dldFdpbmRvd0Rlc2NyaXB0b3IoYnJvd3NlcklkKSwgY3VycmVudFdpZHRoLCBjdXJyZW50SGVpZ2h0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBhc3luYyBfdGFrZUxvY2FsQnJvd3NlclNjcmVlbnNob3QgKGJyb3dzZXJJZCwgc2NyZWVuc2hvdFBhdGgpIHtcbiAgICAgICAgYXdhaXQgYnJvd3NlclRvb2xzLnNjcmVlbnNob3QodGhpcy5fZ2V0V2luZG93RGVzY3JpcHRvcihicm93c2VySWQpLCBzY3JlZW5zaG90UGF0aCk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2NhblJlc2l6ZUxvY2FsQnJvd3NlcldpbmRvd1RvRGltZW5zaW9ucyAoYnJvd3NlcklkLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGlmICghT1MubWFjKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgY29uc3QgbWF4U2NyZWVuU2l6ZSA9IHRoaXMuX2dldE1heFNjcmVlblNpemUoYnJvd3NlcklkKTtcblxuICAgICAgICByZXR1cm4gd2lkdGggPD0gbWF4U2NyZWVuU2l6ZS53aWR0aCAmJiBoZWlnaHQgPD0gbWF4U2NyZWVuU2l6ZS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgX21heGltaXplTG9jYWxCcm93c2VyV2luZG93IChicm93c2VySWQpIHtcbiAgICAgICAgYXdhaXQgYnJvd3NlclRvb2xzLm1heGltaXplKHRoaXMuX2dldFdpbmRvd0Rlc2NyaXB0b3IoYnJvd3NlcklkKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX2NhblVzZURlZmF1bHRXaW5kb3dBY3Rpb25zIChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgaXNMb2NhbEJyb3dzZXIgICAgPSBhd2FpdCB0aGlzLnBsdWdpbi5pc0xvY2FsQnJvd3Nlcihicm93c2VySWQpO1xuICAgICAgICBjb25zdCBpc0hlYWRsZXNzQnJvd3NlciA9IGF3YWl0IHRoaXMucGx1Z2luLmlzSGVhZGxlc3NCcm93c2VyKGJyb3dzZXJJZCk7XG5cbiAgICAgICAgcmV0dXJuIGlzTG9jYWxCcm93c2VyICYmICFpc0hlYWRsZXNzQnJvd3NlcjtcbiAgICB9XG5cbiAgICBhc3luYyBpbml0ICgpIHtcbiAgICAgICAgY29uc3QgaW5pdGlhbGl6ZWQgPSBhd2FpdCB0aGlzLmluaXRQcm9taXNlO1xuXG4gICAgICAgIGlmIChpbml0aWFsaXplZClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLmluaXRQcm9taXNlID0gdGhpcy5wbHVnaW5cbiAgICAgICAgICAgIC5pbml0KClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRydWUpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRQcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5pbml0UHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG5cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZGlzcG9zZSAoKSB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxpemVkID0gYXdhaXQgdGhpcy5pbml0UHJvbWlzZTtcblxuICAgICAgICBpZiAoIWluaXRpYWxpemVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuaW5pdFByb21pc2UgPSB0aGlzLnBsdWdpblxuICAgICAgICAgICAgLmRpc3Bvc2UoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gZmFsc2UpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRQcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5pbml0UHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShmYWxzZSk7XG5cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgaXNMb2NhbEJyb3dzZXIgKGJyb3dzZXJJZCwgYnJvd3Nlck5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGx1Z2luLmlzTG9jYWxCcm93c2VyKGJyb3dzZXJJZCwgYnJvd3Nlck5hbWUpO1xuICAgIH1cblxuICAgIGlzSGVhZGxlc3NCcm93c2VyIChicm93c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luLmlzSGVhZGxlc3NCcm93c2VyKGJyb3dzZXJJZCk7XG4gICAgfVxuXG4gICAgYXN5bmMgb3BlbkJyb3dzZXIgKGJyb3dzZXJJZCwgcGFnZVVybCwgYnJvd3Nlck5hbWUpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ub3BlbkJyb3dzZXIoYnJvd3NlcklkLCBwYWdlVXJsLCBicm93c2VyTmFtZSk7XG5cbiAgICAgICAgaWYgKGF3YWl0IHRoaXMuX2NhblVzZURlZmF1bHRXaW5kb3dBY3Rpb25zKGJyb3dzZXJJZCkpXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9lbnN1cmVCcm93c2VyV2luZG93UGFyYW1ldGVycyhicm93c2VySWQpO1xuICAgIH1cblxuICAgIGFzeW5jIGNsb3NlQnJvd3NlciAoYnJvd3NlcklkKSB7XG4gICAgICAgIGNvbnN0IGNhblVzZURlZmF1bHRXaW5kb3dBY3Rpb25zID0gYXdhaXQgdGhpcy5fY2FuVXNlRGVmYXVsdFdpbmRvd0FjdGlvbnMoYnJvd3NlcklkKTtcbiAgICAgICAgY29uc3QgY3VzdG9tQWN0aW9uc0luZm8gICAgICAgICAgPSBhd2FpdCB0aGlzLmhhc0N1c3RvbUFjdGlvbkZvckJyb3dzZXIoYnJvd3NlcklkKTtcbiAgICAgICAgY29uc3QgaGFzQ3VzdG9tQ2xvc2VCcm93c2VyICAgICAgPSBjdXN0b21BY3Rpb25zSW5mby5oYXNDbG9zZUJyb3dzZXI7XG4gICAgICAgIGNvbnN0IHVzZVBsdWdpbnNDbG9zZUJyb3dzZXIgICAgID0gaGFzQ3VzdG9tQ2xvc2VCcm93c2VyIHx8ICFjYW5Vc2VEZWZhdWx0V2luZG93QWN0aW9ucztcblxuICAgICAgICBpZiAodXNlUGx1Z2luc0Nsb3NlQnJvd3NlcilcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLmNsb3NlQnJvd3Nlcihicm93c2VySWQpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9jbG9zZUxvY2FsQnJvd3Nlcihicm93c2VySWQpO1xuXG4gICAgICAgIGlmIChjYW5Vc2VEZWZhdWx0V2luZG93QWN0aW9ucylcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmxvY2FsQnJvd3NlcnNJbmZvW2Jyb3dzZXJJZF07XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QnJvd3Nlckxpc3QgKCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5wbHVnaW4uZ2V0QnJvd3Nlckxpc3QoKTtcbiAgICB9XG5cbiAgICBhc3luYyBpc1ZhbGlkQnJvd3Nlck5hbWUgKGJyb3dzZXJOYW1lKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBsdWdpbi5pc1ZhbGlkQnJvd3Nlck5hbWUoYnJvd3Nlck5hbWUpO1xuICAgIH1cblxuICAgIGFzeW5jIHJlc2l6ZVdpbmRvdyAoYnJvd3NlcklkLCB3aWR0aCwgaGVpZ2h0LCBjdXJyZW50V2lkdGgsIGN1cnJlbnRIZWlnaHQpIHtcbiAgICAgICAgY29uc3QgY2FuVXNlRGVmYXVsdFdpbmRvd0FjdGlvbnMgPSBhd2FpdCB0aGlzLl9jYW5Vc2VEZWZhdWx0V2luZG93QWN0aW9ucyhicm93c2VySWQpO1xuICAgICAgICBjb25zdCBjdXN0b21BY3Rpb25zSW5mbyAgICAgICAgICA9IGF3YWl0IHRoaXMuaGFzQ3VzdG9tQWN0aW9uRm9yQnJvd3Nlcihicm93c2VySWQpO1xuICAgICAgICBjb25zdCBoYXNDdXN0b21SZXNpemVXaW5kb3cgICAgICA9IGN1c3RvbUFjdGlvbnNJbmZvLmhhc1Jlc2l6ZVdpbmRvdztcblxuXG4gICAgICAgIGlmIChjYW5Vc2VEZWZhdWx0V2luZG93QWN0aW9ucyAmJiAhaGFzQ3VzdG9tUmVzaXplV2luZG93KSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9yZXNpemVMb2NhbEJyb3dzZXJXaW5kb3coYnJvd3NlcklkLCB3aWR0aCwgaGVpZ2h0LCBjdXJyZW50V2lkdGgsIGN1cnJlbnRIZWlnaHQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ucmVzaXplV2luZG93KGJyb3dzZXJJZCwgd2lkdGgsIGhlaWdodCwgY3VycmVudFdpZHRoLCBjdXJyZW50SGVpZ2h0KTtcbiAgICB9XG5cbiAgICBhc3luYyBjYW5SZXNpemVXaW5kb3dUb0RpbWVuc2lvbnMgKGJyb3dzZXJJZCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBjb25zdCBjYW5Vc2VEZWZhdWx0V2luZG93QWN0aW9ucyAgICAgPSBhd2FpdCB0aGlzLl9jYW5Vc2VEZWZhdWx0V2luZG93QWN0aW9ucyhicm93c2VySWQpO1xuICAgICAgICBjb25zdCBjdXN0b21BY3Rpb25zSW5mbyAgICAgICAgICAgICAgPSBhd2FpdCB0aGlzLmhhc0N1c3RvbUFjdGlvbkZvckJyb3dzZXIoYnJvd3NlcklkKTtcbiAgICAgICAgY29uc3QgaGFzQ3VzdG9tQ2FuUmVzaXplVG9EaW1lbnNpb25zID0gY3VzdG9tQWN0aW9uc0luZm8uaGFzQ2FuUmVzaXplV2luZG93VG9EaW1lbnNpb25zO1xuXG5cbiAgICAgICAgaWYgKGNhblVzZURlZmF1bHRXaW5kb3dBY3Rpb25zICYmICFoYXNDdXN0b21DYW5SZXNpemVUb0RpbWVuc2lvbnMpXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fY2FuUmVzaXplTG9jYWxCcm93c2VyV2luZG93VG9EaW1lbnNpb25zKGJyb3dzZXJJZCwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGx1Z2luLmNhblJlc2l6ZVdpbmRvd1RvRGltZW5zaW9ucyhicm93c2VySWQsIHdpZHRoLCBoZWlnaHQpO1xuICAgIH1cblxuICAgIGFzeW5jIG1heGltaXplV2luZG93IChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgY2FuVXNlRGVmYXVsdFdpbmRvd0FjdGlvbnMgPSBhd2FpdCB0aGlzLl9jYW5Vc2VEZWZhdWx0V2luZG93QWN0aW9ucyhicm93c2VySWQpO1xuICAgICAgICBjb25zdCBjdXN0b21BY3Rpb25zSW5mbyAgICAgICAgICA9IGF3YWl0IHRoaXMuaGFzQ3VzdG9tQWN0aW9uRm9yQnJvd3Nlcihicm93c2VySWQpO1xuICAgICAgICBjb25zdCBoYXNDdXN0b21NYXhpbWl6ZVdpbmRvdyAgICA9IGN1c3RvbUFjdGlvbnNJbmZvLmhhc01heGltaXplV2luZG93O1xuXG4gICAgICAgIGlmIChjYW5Vc2VEZWZhdWx0V2luZG93QWN0aW9ucyAmJiAhaGFzQ3VzdG9tTWF4aW1pemVXaW5kb3cpXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fbWF4aW1pemVMb2NhbEJyb3dzZXJXaW5kb3coYnJvd3NlcklkKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5wbHVnaW4ubWF4aW1pemVXaW5kb3coYnJvd3NlcklkKTtcbiAgICB9XG5cbiAgICBhc3luYyB0YWtlU2NyZWVuc2hvdCAoYnJvd3NlcklkLCBzY3JlZW5zaG90UGF0aCwgcGFnZVdpZHRoLCBwYWdlSGVpZ2h0KSB7XG4gICAgICAgIGNvbnN0IGNhblVzZURlZmF1bHRXaW5kb3dBY3Rpb25zID0gYXdhaXQgdGhpcy5fY2FuVXNlRGVmYXVsdFdpbmRvd0FjdGlvbnMoYnJvd3NlcklkKTtcbiAgICAgICAgY29uc3QgY3VzdG9tQWN0aW9uc0luZm8gICAgICAgICAgPSBhd2FpdCB0aGlzLmhhc0N1c3RvbUFjdGlvbkZvckJyb3dzZXIoYnJvd3NlcklkKTtcbiAgICAgICAgY29uc3QgaGFzQ3VzdG9tVGFrZVNjcmVlbnNob3QgICAgPSBjdXN0b21BY3Rpb25zSW5mby5oYXNUYWtlU2NyZWVuc2hvdDtcblxuICAgICAgICBpZiAoY2FuVXNlRGVmYXVsdFdpbmRvd0FjdGlvbnMgJiYgIWhhc0N1c3RvbVRha2VTY3JlZW5zaG90KSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl90YWtlTG9jYWxCcm93c2VyU2NyZWVuc2hvdChicm93c2VySWQsIHNjcmVlbnNob3RQYXRoLCBwYWdlV2lkdGgsIHBhZ2VIZWlnaHQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udGFrZVNjcmVlbnNob3QoYnJvd3NlcklkLCBzY3JlZW5zaG90UGF0aCwgcGFnZVdpZHRoLCBwYWdlSGVpZ2h0KTtcbiAgICB9XG5cbiAgICBhc3luYyBoYXNDdXN0b21BY3Rpb25Gb3JCcm93c2VyIChicm93c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luLmhhc0N1c3RvbUFjdGlvbkZvckJyb3dzZXIoYnJvd3NlcklkKTtcbiAgICB9XG5cbiAgICBhc3luYyByZXBvcnRKb2JSZXN1bHQgKGJyb3dzZXJJZCwgc3RhdHVzLCBkYXRhKSB7XG4gICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnJlcG9ydEpvYlJlc3VsdChicm93c2VySWQsIHN0YXR1cywgZGF0YSk7XG4gICAgfVxufVxuIl19
