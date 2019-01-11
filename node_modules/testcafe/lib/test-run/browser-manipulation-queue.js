'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _testcafeBrowserTools = require('testcafe-browser-tools');

var _utils = require('./commands/utils');

var _type = require('./commands/type');

var _type2 = _interopRequireDefault(_type);

var _warningMessage = require('../notifications/warning-message');

var _warningMessage2 = _interopRequireDefault(_warningMessage);

var _testRun = require('../errors/test-run/');

var _type3 = require('../errors/test-run/type');

var _type4 = _interopRequireDefault(_type3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BrowserManipulationQueue {
    constructor(browserConnection, screenshotCapturer, warningLog) {
        this.commands = [];
        this.browserId = browserConnection.id;
        this.browserProvider = browserConnection.provider;
        this.screenshotCapturer = screenshotCapturer;
        this.warningLog = warningLog;
    }

    _resizeWindow(width, height, currentWidth, currentHeight) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const canResizeWindow = yield _this.browserProvider.canResizeWindowToDimensions(_this.browserId, width, height);

            if (!canResizeWindow) throw new _testRun.WindowDimensionsOverflowError();

            try {
                return yield _this.browserProvider.resizeWindow(_this.browserId, width, height, currentWidth, currentHeight);
            } catch (err) {
                _this.warningLog.addWarning(_warningMessage2.default.resizeError, err.message);
                return null;
            }
        })();
    }

    _resizeWindowToFitDevice(device, portrait, currentWidth, currentHeight) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var _getViewportSize = (0, _testcafeBrowserTools.getViewportSize)(device);

            const landscapeWidth = _getViewportSize.landscapeWidth,
                  portraitWidth = _getViewportSize.portraitWidth;


            const width = portrait ? portraitWidth : landscapeWidth;
            const height = portrait ? landscapeWidth : portraitWidth;

            return yield _this2._resizeWindow(width, height, currentWidth, currentHeight);
        })();
    }

    _maximizeWindow() {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            try {
                return yield _this3.browserProvider.maximizeWindow(_this3.browserId);
            } catch (err) {
                _this3.warningLog.addWarning(_warningMessage2.default.maximizeError, err.message);
                return null;
            }
        })();
    }

    _takeScreenshot(capture) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this4.screenshotCapturer.enabled) {
                _this4.warningLog.addWarning(_warningMessage2.default.screenshotsPathNotSpecified);
                return null;
            }

            try {
                return yield capture();
            } catch (err) {
                if (err.type === _type4.default.invalidElementScreenshotDimensionsError) throw err;

                _this4.warningLog.addWarning(_warningMessage2.default.screenshotError, err.stack);
                return null;
            }
        })();
    }

    executePendingManipulation(driverMsg) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const command = _this5.commands.shift();

            switch (command.type) {
                case _type2.default.takeElementScreenshot:
                case _type2.default.takeScreenshot:
                    return yield _this5._takeScreenshot(function () {
                        return _this5.screenshotCapturer.captureAction({
                            customPath: command.path,
                            pageDimensions: driverMsg.pageDimensions,
                            cropDimensions: driverMsg.cropDimensions,
                            markSeed: command.markSeed
                        });
                    });

                case _type2.default.takeScreenshotOnFail:
                    return yield _this5._takeScreenshot(function () {
                        return _this5.screenshotCapturer.captureError({
                            pageDimensions: driverMsg.pageDimensions,
                            markSeed: command.markSeed
                        });
                    });

                case _type2.default.resizeWindow:
                    return yield _this5._resizeWindow(command.width, command.height, driverMsg.pageDimensions.innerWidth, driverMsg.pageDimensions.innerHeight);

                case _type2.default.resizeWindowToFitDevice:
                    return yield _this5._resizeWindowToFitDevice(command.device, command.options.portraitOrientation, driverMsg.pageDimensions.innerWidth, driverMsg.pageDimensions.innerHeight);

                case _type2.default.maximizeWindow:
                    return yield _this5._maximizeWindow();
            }

            return null;
        })();
    }

    push(command) {
        this.commands.push(command);
    }

    removeAllNonServiceManipulations() {
        this.commands = this.commands.filter(command => (0, _utils.isServiceCommand)(command));
    }
}
exports.default = BrowserManipulationQueue;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LXJ1bi9icm93c2VyLW1hbmlwdWxhdGlvbi1xdWV1ZS5qcyJdLCJuYW1lcyI6WyJCcm93c2VyTWFuaXB1bGF0aW9uUXVldWUiLCJjb25zdHJ1Y3RvciIsImJyb3dzZXJDb25uZWN0aW9uIiwic2NyZWVuc2hvdENhcHR1cmVyIiwid2FybmluZ0xvZyIsImNvbW1hbmRzIiwiYnJvd3NlcklkIiwiaWQiLCJicm93c2VyUHJvdmlkZXIiLCJwcm92aWRlciIsIl9yZXNpemVXaW5kb3ciLCJ3aWR0aCIsImhlaWdodCIsImN1cnJlbnRXaWR0aCIsImN1cnJlbnRIZWlnaHQiLCJjYW5SZXNpemVXaW5kb3ciLCJjYW5SZXNpemVXaW5kb3dUb0RpbWVuc2lvbnMiLCJXaW5kb3dEaW1lbnNpb25zT3ZlcmZsb3dFcnJvciIsInJlc2l6ZVdpbmRvdyIsImVyciIsImFkZFdhcm5pbmciLCJXQVJOSU5HX01FU1NBR0UiLCJyZXNpemVFcnJvciIsIm1lc3NhZ2UiLCJfcmVzaXplV2luZG93VG9GaXREZXZpY2UiLCJkZXZpY2UiLCJwb3J0cmFpdCIsImxhbmRzY2FwZVdpZHRoIiwicG9ydHJhaXRXaWR0aCIsIl9tYXhpbWl6ZVdpbmRvdyIsIm1heGltaXplV2luZG93IiwibWF4aW1pemVFcnJvciIsIl90YWtlU2NyZWVuc2hvdCIsImNhcHR1cmUiLCJlbmFibGVkIiwic2NyZWVuc2hvdHNQYXRoTm90U3BlY2lmaWVkIiwidHlwZSIsIkVSUk9SX1RZUEUiLCJpbnZhbGlkRWxlbWVudFNjcmVlbnNob3REaW1lbnNpb25zRXJyb3IiLCJzY3JlZW5zaG90RXJyb3IiLCJzdGFjayIsImV4ZWN1dGVQZW5kaW5nTWFuaXB1bGF0aW9uIiwiZHJpdmVyTXNnIiwiY29tbWFuZCIsInNoaWZ0IiwiQ09NTUFORF9UWVBFIiwidGFrZUVsZW1lbnRTY3JlZW5zaG90IiwidGFrZVNjcmVlbnNob3QiLCJjYXB0dXJlQWN0aW9uIiwiY3VzdG9tUGF0aCIsInBhdGgiLCJwYWdlRGltZW5zaW9ucyIsImNyb3BEaW1lbnNpb25zIiwibWFya1NlZWQiLCJ0YWtlU2NyZWVuc2hvdE9uRmFpbCIsImNhcHR1cmVFcnJvciIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsInJlc2l6ZVdpbmRvd1RvRml0RGV2aWNlIiwib3B0aW9ucyIsInBvcnRyYWl0T3JpZW50YXRpb24iLCJwdXNoIiwicmVtb3ZlQWxsTm9uU2VydmljZU1hbmlwdWxhdGlvbnMiLCJmaWx0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFHZSxNQUFNQSx3QkFBTixDQUErQjtBQUMxQ0MsZ0JBQWFDLGlCQUFiLEVBQWdDQyxrQkFBaEMsRUFBb0RDLFVBQXBELEVBQWdFO0FBQzVELGFBQUtDLFFBQUwsR0FBMEIsRUFBMUI7QUFDQSxhQUFLQyxTQUFMLEdBQTBCSixrQkFBa0JLLEVBQTVDO0FBQ0EsYUFBS0MsZUFBTCxHQUEwQk4sa0JBQWtCTyxRQUE1QztBQUNBLGFBQUtOLGtCQUFMLEdBQTBCQSxrQkFBMUI7QUFDQSxhQUFLQyxVQUFMLEdBQTBCQSxVQUExQjtBQUNIOztBQUVLTSxpQkFBTixDQUFxQkMsS0FBckIsRUFBNEJDLE1BQTVCLEVBQW9DQyxZQUFwQyxFQUFrREMsYUFBbEQsRUFBaUU7QUFBQTs7QUFBQTtBQUM3RCxrQkFBTUMsa0JBQWtCLE1BQU0sTUFBS1AsZUFBTCxDQUFxQlEsMkJBQXJCLENBQWlELE1BQUtWLFNBQXRELEVBQWlFSyxLQUFqRSxFQUF3RUMsTUFBeEUsQ0FBOUI7O0FBRUEsZ0JBQUksQ0FBQ0csZUFBTCxFQUNJLE1BQU0sSUFBSUUsc0NBQUosRUFBTjs7QUFFSixnQkFBSTtBQUNBLHVCQUFPLE1BQU0sTUFBS1QsZUFBTCxDQUFxQlUsWUFBckIsQ0FBa0MsTUFBS1osU0FBdkMsRUFBa0RLLEtBQWxELEVBQXlEQyxNQUF6RCxFQUFpRUMsWUFBakUsRUFBK0VDLGFBQS9FLENBQWI7QUFDSCxhQUZELENBR0EsT0FB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QUFVUyxjQUFWLENBQXlCSyxVQUEzRSxFQUF1RmQsVUFBVVMsY0FBVixDQUF5Qk0sV0FBaEgsQ0FBYjs7QUFFSixxQkFBS1osZUFBYWEsdUJBQWxCO0FBQ0ksMkJBQU8sTUFBTSxPQUFLbEMsd0JBQUwsQ0FBOEJtQixRQUFRbEIsTUFBdEMsRUFBOENrQixRQUFRZ0IsT0FBUixDQUFnQkMsbUJBQTlELEVBQW1GbEIsVUFBVVMsY0FBVixDQUF5QkssVUFBNUcsRUFBd0hkLFVBQVVTLGNBQVYsQ0FBeUJNLFdBQWpKLENBQWI7O0FBRUoscUJBQUtaLGVBQWFmLGNBQWxCO0FBQ0ksMkJBQU8sTUFBTSxPQUFLRCxlQUFMLEVBQWI7QUF2QlI7O0FBMEJBLG1CQUFPLElBQVA7QUE3QnlDO0FBOEI1Qzs7QUFFRGdDLFNBQU1sQixPQUFOLEVBQWU7QUFDWCxhQUFLdEMsUUFBTCxDQUFjd0QsSUFBZCxDQUFtQmxCLE9BQW5CO0FBQ0g7O0FBRURtQix1Q0FBb0M7QUFDaEMsYUFBS3pELFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxDQUFjMEQsTUFBZCxDQUFxQnBCLFdBQVcsNkJBQWlCQSxPQUFqQixDQUFoQyxDQUFoQjtBQUNIO0FBbkd5QztrQkFBekIzQyx3QiIsImZpbGUiOiJ0ZXN0LXJ1bi9icm93c2VyLW1hbmlwdWxhdGlvbi1xdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFZpZXdwb3J0U2l6ZSB9IGZyb20gJ3Rlc3RjYWZlLWJyb3dzZXItdG9vbHMnO1xuaW1wb3J0IHsgaXNTZXJ2aWNlQ29tbWFuZCB9IGZyb20gJy4vY29tbWFuZHMvdXRpbHMnO1xuaW1wb3J0IENPTU1BTkRfVFlQRSBmcm9tICcuL2NvbW1hbmRzL3R5cGUnO1xuaW1wb3J0IFdBUk5JTkdfTUVTU0FHRSBmcm9tICcuLi9ub3RpZmljYXRpb25zL3dhcm5pbmctbWVzc2FnZSc7XG5pbXBvcnQgeyBXaW5kb3dEaW1lbnNpb25zT3ZlcmZsb3dFcnJvciB9IGZyb20gJy4uL2Vycm9ycy90ZXN0LXJ1bi8nO1xuaW1wb3J0IEVSUk9SX1RZUEUgZnJvbSAnLi4vZXJyb3JzL3Rlc3QtcnVuL3R5cGUnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyb3dzZXJNYW5pcHVsYXRpb25RdWV1ZSB7XG4gICAgY29uc3RydWN0b3IgKGJyb3dzZXJDb25uZWN0aW9uLCBzY3JlZW5zaG90Q2FwdHVyZXIsIHdhcm5pbmdMb2cpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kcyAgICAgICAgICAgPSBbXTtcbiAgICAgICAgdGhpcy5icm93c2VySWQgICAgICAgICAgPSBicm93c2VyQ29ubmVjdGlvbi5pZDtcbiAgICAgICAgdGhpcy5icm93c2VyUHJvdmlkZXIgICAgPSBicm93c2VyQ29ubmVjdGlvbi5wcm92aWRlcjtcbiAgICAgICAgdGhpcy5zY3JlZW5zaG90Q2FwdHVyZXIgPSBzY3JlZW5zaG90Q2FwdHVyZXI7XG4gICAgICAgIHRoaXMud2FybmluZ0xvZyAgICAgICAgID0gd2FybmluZ0xvZztcbiAgICB9XG5cbiAgICBhc3luYyBfcmVzaXplV2luZG93ICh3aWR0aCwgaGVpZ2h0LCBjdXJyZW50V2lkdGgsIGN1cnJlbnRIZWlnaHQpIHtcbiAgICAgICAgY29uc3QgY2FuUmVzaXplV2luZG93ID0gYXdhaXQgdGhpcy5icm93c2VyUHJvdmlkZXIuY2FuUmVzaXplV2luZG93VG9EaW1lbnNpb25zKHRoaXMuYnJvd3NlcklkLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICBpZiAoIWNhblJlc2l6ZVdpbmRvdylcbiAgICAgICAgICAgIHRocm93IG5ldyBXaW5kb3dEaW1lbnNpb25zT3ZlcmZsb3dFcnJvcigpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5icm93c2VyUHJvdmlkZXIucmVzaXplV2luZG93KHRoaXMuYnJvd3NlcklkLCB3aWR0aCwgaGVpZ2h0LCBjdXJyZW50V2lkdGgsIGN1cnJlbnRIZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZ0xvZy5hZGRXYXJuaW5nKFdBUk5JTkdfTUVTU0FHRS5yZXNpemVFcnJvciwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBfcmVzaXplV2luZG93VG9GaXREZXZpY2UgKGRldmljZSwgcG9ydHJhaXQsIGN1cnJlbnRXaWR0aCwgY3VycmVudEhlaWdodCkge1xuICAgICAgICBjb25zdCB7IGxhbmRzY2FwZVdpZHRoLCBwb3J0cmFpdFdpZHRoIH0gPSBnZXRWaWV3cG9ydFNpemUoZGV2aWNlKTtcblxuICAgICAgICBjb25zdCB3aWR0aCAgPSBwb3J0cmFpdCA/IHBvcnRyYWl0V2lkdGggOiBsYW5kc2NhcGVXaWR0aDtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gcG9ydHJhaXQgPyBsYW5kc2NhcGVXaWR0aCA6IHBvcnRyYWl0V2lkdGg7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3Jlc2l6ZVdpbmRvdyh3aWR0aCwgaGVpZ2h0LCBjdXJyZW50V2lkdGgsIGN1cnJlbnRIZWlnaHQpO1xuICAgIH1cblxuICAgIGFzeW5jIF9tYXhpbWl6ZVdpbmRvdyAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5icm93c2VyUHJvdmlkZXIubWF4aW1pemVXaW5kb3codGhpcy5icm93c2VySWQpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZ0xvZy5hZGRXYXJuaW5nKFdBUk5JTkdfTUVTU0FHRS5tYXhpbWl6ZUVycm9yLCBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIF90YWtlU2NyZWVuc2hvdCAoY2FwdHVyZSkge1xuICAgICAgICBpZiAoIXRoaXMuc2NyZWVuc2hvdENhcHR1cmVyLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZ0xvZy5hZGRXYXJuaW5nKFdBUk5JTkdfTUVTU0FHRS5zY3JlZW5zaG90c1BhdGhOb3RTcGVjaWZpZWQpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGNhcHR1cmUoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyLnR5cGUgPT09IEVSUk9SX1RZUEUuaW52YWxpZEVsZW1lbnRTY3JlZW5zaG90RGltZW5zaW9uc0Vycm9yKVxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcblxuICAgICAgICAgICAgdGhpcy53YXJuaW5nTG9nLmFkZFdhcm5pbmcoV0FSTklOR19NRVNTQUdFLnNjcmVlbnNob3RFcnJvciwgZXJyLnN0YWNrKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZVBlbmRpbmdNYW5pcHVsYXRpb24gKGRyaXZlck1zZykge1xuICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5jb21tYW5kcy5zaGlmdCgpO1xuXG4gICAgICAgIHN3aXRjaCAoY29tbWFuZC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIENPTU1BTkRfVFlQRS50YWtlRWxlbWVudFNjcmVlbnNob3Q6XG4gICAgICAgICAgICBjYXNlIENPTU1BTkRfVFlQRS50YWtlU2NyZWVuc2hvdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fdGFrZVNjcmVlbnNob3QoKCkgPT4gdGhpcy5zY3JlZW5zaG90Q2FwdHVyZXIuY2FwdHVyZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbVBhdGg6ICAgICBjb21tYW5kLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VEaW1lbnNpb25zOiBkcml2ZXJNc2cucGFnZURpbWVuc2lvbnMsXG4gICAgICAgICAgICAgICAgICAgIGNyb3BEaW1lbnNpb25zOiBkcml2ZXJNc2cuY3JvcERpbWVuc2lvbnMsXG4gICAgICAgICAgICAgICAgICAgIG1hcmtTZWVkOiAgICAgICBjb21tYW5kLm1hcmtTZWVkXG4gICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjYXNlIENPTU1BTkRfVFlQRS50YWtlU2NyZWVuc2hvdE9uRmFpbDpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fdGFrZVNjcmVlbnNob3QoKCkgPT4gdGhpcy5zY3JlZW5zaG90Q2FwdHVyZXIuY2FwdHVyZUVycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZURpbWVuc2lvbnM6IGRyaXZlck1zZy5wYWdlRGltZW5zaW9ucyxcbiAgICAgICAgICAgICAgICAgICAgbWFya1NlZWQ6ICAgICAgIGNvbW1hbmQubWFya1NlZWRcbiAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNhc2UgQ09NTUFORF9UWVBFLnJlc2l6ZVdpbmRvdzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fcmVzaXplV2luZG93KGNvbW1hbmQud2lkdGgsIGNvbW1hbmQuaGVpZ2h0LCBkcml2ZXJNc2cucGFnZURpbWVuc2lvbnMuaW5uZXJXaWR0aCwgZHJpdmVyTXNnLnBhZ2VEaW1lbnNpb25zLmlubmVySGVpZ2h0KTtcblxuICAgICAgICAgICAgY2FzZSBDT01NQU5EX1RZUEUucmVzaXplV2luZG93VG9GaXREZXZpY2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3Jlc2l6ZVdpbmRvd1RvRml0RGV2aWNlKGNvbW1hbmQuZGV2aWNlLCBjb21tYW5kLm9wdGlvbnMucG9ydHJhaXRPcmllbnRhdGlvbiwgZHJpdmVyTXNnLnBhZ2VEaW1lbnNpb25zLmlubmVyV2lkdGgsIGRyaXZlck1zZy5wYWdlRGltZW5zaW9ucy5pbm5lckhlaWdodCk7XG5cbiAgICAgICAgICAgIGNhc2UgQ09NTUFORF9UWVBFLm1heGltaXplV2luZG93OlxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9tYXhpbWl6ZVdpbmRvdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHVzaCAoY29tbWFuZCkge1xuICAgICAgICB0aGlzLmNvbW1hbmRzLnB1c2goY29tbWFuZCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQWxsTm9uU2VydmljZU1hbmlwdWxhdGlvbnMgKCkge1xuICAgICAgICB0aGlzLmNvbW1hbmRzID0gdGhpcy5jb21tYW5kcy5maWx0ZXIoY29tbWFuZCA9PiBpc1NlcnZpY2VDb21tYW5kKGNvbW1hbmQpKTtcbiAgICB9XG59XG4iXX0=
