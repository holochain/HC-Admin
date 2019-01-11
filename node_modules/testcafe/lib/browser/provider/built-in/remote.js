'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _testcafeBrowserTools = require('testcafe-browser-tools');

var _warningMessage = require('../../../notifications/warning-message');

var _warningMessage2 = _interopRequireDefault(_warningMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    localBrowsersFlags: {},

    openBrowser(browserId) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this.waitForConnectionReady(browserId);

            const localBrowserWindow = yield (0, _testcafeBrowserTools.findWindow)(browserId);

            _this.localBrowsersFlags[browserId] = localBrowserWindow !== null;
        })();
    },

    closeBrowser(browserId) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            delete _this2.localBrowsersFlags[browserId];
        })();
    },

    isLocalBrowser(browserId) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return _this3.localBrowsersFlags[browserId];
        })();
    },

    // NOTE: we must try to do a local screenshot or resize, if browser is accessible, and emit warning otherwise
    hasCustomActionForBrowser(browserId) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const isLocalBrowser = _this4.localBrowsersFlags[browserId];

            return {
                hasCloseBrowser: true,
                hasResizeWindow: !isLocalBrowser,
                hasMaximizeWindow: !isLocalBrowser,
                hasTakeScreenshot: !isLocalBrowser,
                hasCanResizeWindowToDimensions: !isLocalBrowser
            };
        })();
    },

    takeScreenshot(browserId) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this5.reportWarning(browserId, _warningMessage2.default.browserManipulationsOnRemoteBrowser);
        })();
    },

    resizeWindow(browserId) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this6.reportWarning(browserId, _warningMessage2.default.browserManipulationsOnRemoteBrowser);
        })();
    },

    maximizeWindow(browserId) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this7.reportWarning(browserId, _warningMessage2.default.browserManipulationsOnRemoteBrowser);
        })();
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL3JlbW90ZS5qcyJdLCJuYW1lcyI6WyJsb2NhbEJyb3dzZXJzRmxhZ3MiLCJvcGVuQnJvd3NlciIsImJyb3dzZXJJZCIsIndhaXRGb3JDb25uZWN0aW9uUmVhZHkiLCJsb2NhbEJyb3dzZXJXaW5kb3ciLCJjbG9zZUJyb3dzZXIiLCJpc0xvY2FsQnJvd3NlciIsImhhc0N1c3RvbUFjdGlvbkZvckJyb3dzZXIiLCJoYXNDbG9zZUJyb3dzZXIiLCJoYXNSZXNpemVXaW5kb3ciLCJoYXNNYXhpbWl6ZVdpbmRvdyIsImhhc1Rha2VTY3JlZW5zaG90IiwiaGFzQ2FuUmVzaXplV2luZG93VG9EaW1lbnNpb25zIiwidGFrZVNjcmVlbnNob3QiLCJyZXBvcnRXYXJuaW5nIiwiV0FSTklOR19NRVNTQUdFIiwiYnJvd3Nlck1hbmlwdWxhdGlvbnNPblJlbW90ZUJyb3dzZXIiLCJyZXNpemVXaW5kb3ciLCJtYXhpbWl6ZVdpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O2tCQUdlO0FBQ1hBLHdCQUFvQixFQURUOztBQUdMQyxlQUFOLENBQW1CQyxTQUFuQixFQUE4QjtBQUFBOztBQUFBO0FBQzFCLGtCQUFNLE1BQUtDLHNCQUFMLENBQTRCRCxTQUE1QixDQUFOOztBQUVBLGtCQUFNRSxxQkFBcUIsTUFBTSxzQ0FBV0YsU0FBWCxDQUFqQzs7QUFFQSxrQkFBS0Ysa0JBQUwsQ0FBd0JFLFNBQXhCLElBQXFDRSx1QkFBdUIsSUFBNUQ7QUFMMEI7QUFNN0IsS0FUVTs7QUFXTEMsZ0JBQU4sQ0FBb0JILFNBQXBCLEVBQStCO0FBQUE7O0FBQUE7QUFDM0IsbUJBQU8sT0FBS0Ysa0JBQUwsQ0FBd0JFLFNBQXhCLENBQVA7QUFEMkI7QUFFOUIsS0FiVTs7QUFlTEksa0JBQU4sQ0FBc0JKLFNBQXRCLEVBQWlDO0FBQUE7O0FBQUE7QUFDN0IsbUJBQU8sT0FBS0Ysa0JBQUwsQ0FBd0JFLFNBQXhCLENBQVA7QUFENkI7QUFFaEMsS0FqQlU7O0FBbUJYO0FBQ01LLDZCQUFOLENBQWlDTCxTQUFqQyxFQUE0QztBQUFBOztBQUFBO0FBQ3hDLGtCQUFNSSxpQkFBaUIsT0FBS04sa0JBQUwsQ0FBd0JFLFNBQXhCLENBQXZCOztBQUVBLG1CQUFPO0FBQ0hNLGlDQUFnQyxJQUQ3QjtBQUVIQyxpQ0FBZ0MsQ0FBQ0gsY0FGOUI7QUFHSEksbUNBQWdDLENBQUNKLGNBSDlCO0FBSUhLLG1DQUFnQyxDQUFDTCxjQUo5QjtBQUtITSxnREFBZ0MsQ0FBQ047QUFMOUIsYUFBUDtBQUh3QztBQVUzQyxLQTlCVTs7QUFnQ0xPLGtCQUFOLENBQXNCWCxTQUF0QixFQUFpQztBQUFBOztBQUFBO0FBQzdCLG1CQUFLWSxhQUFMLENBQW1CWixTQUFuQixFQUE4QmEseUJBQWdCQyxtQ0FBOUM7QUFENkI7QUFFaEMsS0FsQ1U7O0FBb0NMQyxnQkFBTixDQUFvQmYsU0FBcEIsRUFBK0I7QUFBQTs7QUFBQTtBQUMzQixtQkFBS1ksYUFBTCxDQUFtQlosU0FBbkIsRUFBOEJhLHlCQUFnQkMsbUNBQTlDO0FBRDJCO0FBRTlCLEtBdENVOztBQXdDTEUsa0JBQU4sQ0FBc0JoQixTQUF0QixFQUFpQztBQUFBOztBQUFBO0FBQzdCLG1CQUFLWSxhQUFMLENBQW1CWixTQUFuQixFQUE4QmEseUJBQWdCQyxtQ0FBOUM7QUFENkI7QUFFaEM7QUExQ1UsQyIsImZpbGUiOiJicm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL3JlbW90ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpbmRXaW5kb3cgfSBmcm9tICd0ZXN0Y2FmZS1icm93c2VyLXRvb2xzJztcbmltcG9ydCBXQVJOSU5HX01FU1NBR0UgZnJvbSAnLi4vLi4vLi4vbm90aWZpY2F0aW9ucy93YXJuaW5nLW1lc3NhZ2UnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBsb2NhbEJyb3dzZXJzRmxhZ3M6IHt9LFxuXG4gICAgYXN5bmMgb3BlbkJyb3dzZXIgKGJyb3dzZXJJZCkge1xuICAgICAgICBhd2FpdCB0aGlzLndhaXRGb3JDb25uZWN0aW9uUmVhZHkoYnJvd3NlcklkKTtcblxuICAgICAgICBjb25zdCBsb2NhbEJyb3dzZXJXaW5kb3cgPSBhd2FpdCBmaW5kV2luZG93KGJyb3dzZXJJZCk7XG5cbiAgICAgICAgdGhpcy5sb2NhbEJyb3dzZXJzRmxhZ3NbYnJvd3NlcklkXSA9IGxvY2FsQnJvd3NlcldpbmRvdyAhPT0gbnVsbDtcbiAgICB9LFxuXG4gICAgYXN5bmMgY2xvc2VCcm93c2VyIChicm93c2VySWQpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMubG9jYWxCcm93c2Vyc0ZsYWdzW2Jyb3dzZXJJZF07XG4gICAgfSxcblxuICAgIGFzeW5jIGlzTG9jYWxCcm93c2VyIChicm93c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxCcm93c2Vyc0ZsYWdzW2Jyb3dzZXJJZF07XG4gICAgfSxcblxuICAgIC8vIE5PVEU6IHdlIG11c3QgdHJ5IHRvIGRvIGEgbG9jYWwgc2NyZWVuc2hvdCBvciByZXNpemUsIGlmIGJyb3dzZXIgaXMgYWNjZXNzaWJsZSwgYW5kIGVtaXQgd2FybmluZyBvdGhlcndpc2VcbiAgICBhc3luYyBoYXNDdXN0b21BY3Rpb25Gb3JCcm93c2VyIChicm93c2VySWQpIHtcbiAgICAgICAgY29uc3QgaXNMb2NhbEJyb3dzZXIgPSB0aGlzLmxvY2FsQnJvd3NlcnNGbGFnc1ticm93c2VySWRdO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoYXNDbG9zZUJyb3dzZXI6ICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICBoYXNSZXNpemVXaW5kb3c6ICAgICAgICAgICAgICAgICFpc0xvY2FsQnJvd3NlcixcbiAgICAgICAgICAgIGhhc01heGltaXplV2luZG93OiAgICAgICAgICAgICAgIWlzTG9jYWxCcm93c2VyLFxuICAgICAgICAgICAgaGFzVGFrZVNjcmVlbnNob3Q6ICAgICAgICAgICAgICAhaXNMb2NhbEJyb3dzZXIsXG4gICAgICAgICAgICBoYXNDYW5SZXNpemVXaW5kb3dUb0RpbWVuc2lvbnM6ICFpc0xvY2FsQnJvd3NlclxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBhc3luYyB0YWtlU2NyZWVuc2hvdCAoYnJvd3NlcklkKSB7XG4gICAgICAgIHRoaXMucmVwb3J0V2FybmluZyhicm93c2VySWQsIFdBUk5JTkdfTUVTU0FHRS5icm93c2VyTWFuaXB1bGF0aW9uc09uUmVtb3RlQnJvd3Nlcik7XG4gICAgfSxcblxuICAgIGFzeW5jIHJlc2l6ZVdpbmRvdyAoYnJvd3NlcklkKSB7XG4gICAgICAgIHRoaXMucmVwb3J0V2FybmluZyhicm93c2VySWQsIFdBUk5JTkdfTUVTU0FHRS5icm93c2VyTWFuaXB1bGF0aW9uc09uUmVtb3RlQnJvd3Nlcik7XG4gICAgfSxcblxuICAgIGFzeW5jIG1heGltaXplV2luZG93IChicm93c2VySWQpIHtcbiAgICAgICAgdGhpcy5yZXBvcnRXYXJuaW5nKGJyb3dzZXJJZCwgV0FSTklOR19NRVNTQUdFLmJyb3dzZXJNYW5pcHVsYXRpb25zT25SZW1vdGVCcm93c2VyKTtcbiAgICB9XG59O1xuIl19
