'use strict';

exports.__esModule = true;
exports.resizeWindow = exports.takeScreenshot = exports.updateMobileViewportSize = exports.closeTab = exports.createClient = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let getActiveTab = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (cdpPort, browserId) {
        const tabs = yield _chromeRemoteInterface2.default.listTabs({ port: cdpPort });
        const tab = tabs.filter(function (t) {
            return t.type === 'page' && t.url.indexOf(browserId) > -1;
        })[0];

        return tab;
    });

    return function getActiveTab(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

let setEmulationBounds = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* ({ client, config, viewportSize, emulatedDevicePixelRatio }) {
        yield client.Emulation.setDeviceMetricsOverride({
            width: viewportSize.width,
            height: viewportSize.height,
            deviceScaleFactor: emulatedDevicePixelRatio,
            mobile: config.mobile,
            fitWindow: false
        });

        yield client.Emulation.setVisibleSize({ width: viewportSize.width, height: viewportSize.height });
    });

    return function setEmulationBounds(_x3) {
        return _ref2.apply(this, arguments);
    };
})();

let setEmulation = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)(function* (runtimeInfo) {
        const client = runtimeInfo.client,
              config = runtimeInfo.config;


        if (config.userAgent !== void 0) yield client.Network.setUserAgentOverride({ userAgent: config.userAgent });

        if (config.touch !== void 0) {
            const touchConfig = {
                enabled: config.touch,
                configuration: config.mobile ? 'mobile' : 'desktop',
                maxTouchPoints: 1
            };

            if (client.Emulation.setEmitTouchEventsForMouse) yield client.Emulation.setEmitTouchEventsForMouse(touchConfig);

            if (client.Emulation.setTouchEmulationEnabled) yield client.Emulation.setTouchEmulationEnabled(touchConfig);
        }

        yield resizeWindow({ width: config.width, height: config.height }, runtimeInfo);
    });

    return function setEmulation(_x4) {
        return _ref3.apply(this, arguments);
    };
})();

let createClient = exports.createClient = (() => {
    var _ref4 = (0, _asyncToGenerator3.default)(function* (runtimeInfo) {
        const browserId = runtimeInfo.browserId,
              config = runtimeInfo.config,
              cdpPort = runtimeInfo.cdpPort;


        let tab = null;
        let client = null;

        try {
            tab = yield getActiveTab(cdpPort, browserId);

            if (!tab) return;

            client = yield (0, _chromeRemoteInterface2.default)({ target: tab, port: cdpPort });
        } catch (e) {
            return;
        }

        runtimeInfo.tab = tab;
        runtimeInfo.client = client;

        yield client.Page.enable();
        yield client.Network.enable();
        yield client.Runtime.enable();

        const devicePixelRatioQueryResult = yield client.Runtime.evaluate({ expression: 'window.devicePixelRatio' });

        runtimeInfo.originalDevicePixelRatio = devicePixelRatioQueryResult.result.value;
        runtimeInfo.emulatedDevicePixelRatio = config.scaleFactor || runtimeInfo.originalDevicePixelRatio;

        if (config.emulation) yield setEmulation(runtimeInfo);
    });

    return function createClient(_x5) {
        return _ref4.apply(this, arguments);
    };
})();

let closeTab = exports.closeTab = (() => {
    var _ref5 = (0, _asyncToGenerator3.default)(function* ({ tab, cdpPort }) {
        yield _chromeRemoteInterface2.default.closeTab({ id: tab.id, port: cdpPort });
    });

    return function closeTab(_x6) {
        return _ref5.apply(this, arguments);
    };
})();

let updateMobileViewportSize = exports.updateMobileViewportSize = (() => {
    var _ref6 = (0, _asyncToGenerator3.default)(function* (runtimeInfo) {
        const windowDimensionsQueryResult = yield runtimeInfo.client.Runtime.evaluate({
            expression: `(${_clientFunctions.GET_WINDOW_DIMENSIONS_INFO_SCRIPT})()`,
            returnByValue: true
        });

        const windowDimensions = windowDimensionsQueryResult.result.value;

        runtimeInfo.viewportSize.width = windowDimensions.outerWidth;
        runtimeInfo.viewportSize.height = windowDimensions.outerHeight;
    });

    return function updateMobileViewportSize(_x7) {
        return _ref6.apply(this, arguments);
    };
})();

let takeScreenshot = exports.takeScreenshot = (() => {
    var _ref7 = (0, _asyncToGenerator3.default)(function* (path, { client }) {
        var _ref8 = yield client.Page.getLayoutMetrics();

        const visualViewport = _ref8.visualViewport;


        const clipRegion = {
            x: visualViewport.pageX,
            y: visualViewport.pageY,
            width: visualViewport.clientWidth,
            height: visualViewport.clientHeight,
            scale: visualViewport.scale
        };

        const screenshot = yield client.Page.captureScreenshot({ fromSurface: true, clip: clipRegion });

        yield (0, _promisifiedFunctions.writeFile)(path, screenshot.data, { encoding: 'base64' });
    });

    return function takeScreenshot(_x8, _x9) {
        return _ref7.apply(this, arguments);
    };
})();

let resizeWindow = exports.resizeWindow = (() => {
    var _ref9 = (0, _asyncToGenerator3.default)(function* (newDimensions, runtimeInfo) {
        const browserId = runtimeInfo.browserId,
              config = runtimeInfo.config,
              viewportSize = runtimeInfo.viewportSize,
              providerMethods = runtimeInfo.providerMethods;


        const currentWidth = viewportSize.width;
        const currentHeight = viewportSize.height;
        const newWidth = newDimensions.width || currentWidth;
        const newHeight = newDimensions.height || currentHeight;

        if (!config.headless) yield providerMethods.resizeLocalBrowserWindow(browserId, newWidth, newHeight, currentWidth, currentHeight);

        viewportSize.width = newWidth;
        viewportSize.height = newHeight;

        if (config.emulation) yield setEmulationBounds(runtimeInfo);
    });

    return function resizeWindow(_x10, _x11) {
        return _ref9.apply(this, arguments);
    };
})();

exports.isHeadlessTab = isHeadlessTab;

var _chromeRemoteInterface = require('chrome-remote-interface');

var _chromeRemoteInterface2 = _interopRequireDefault(_chromeRemoteInterface);

var _promisifiedFunctions = require('../../../../utils/promisified-functions');

var _clientFunctions = require('../../utils/client-functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isHeadlessTab({ tab, config }) {
    return tab && config.headless;
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2Nocm9tZS9jZHAuanMiXSwibmFtZXMiOlsiY2RwUG9ydCIsImJyb3dzZXJJZCIsInRhYnMiLCJyZW1vdGVDaHJvbWUiLCJsaXN0VGFicyIsInBvcnQiLCJ0YWIiLCJmaWx0ZXIiLCJ0IiwidHlwZSIsInVybCIsImluZGV4T2YiLCJnZXRBY3RpdmVUYWIiLCJjbGllbnQiLCJjb25maWciLCJ2aWV3cG9ydFNpemUiLCJlbXVsYXRlZERldmljZVBpeGVsUmF0aW8iLCJFbXVsYXRpb24iLCJzZXREZXZpY2VNZXRyaWNzT3ZlcnJpZGUiLCJ3aWR0aCIsImhlaWdodCIsImRldmljZVNjYWxlRmFjdG9yIiwibW9iaWxlIiwiZml0V2luZG93Iiwic2V0VmlzaWJsZVNpemUiLCJzZXRFbXVsYXRpb25Cb3VuZHMiLCJydW50aW1lSW5mbyIsInVzZXJBZ2VudCIsIk5ldHdvcmsiLCJzZXRVc2VyQWdlbnRPdmVycmlkZSIsInRvdWNoIiwidG91Y2hDb25maWciLCJlbmFibGVkIiwiY29uZmlndXJhdGlvbiIsIm1heFRvdWNoUG9pbnRzIiwic2V0RW1pdFRvdWNoRXZlbnRzRm9yTW91c2UiLCJzZXRUb3VjaEVtdWxhdGlvbkVuYWJsZWQiLCJyZXNpemVXaW5kb3ciLCJzZXRFbXVsYXRpb24iLCJ0YXJnZXQiLCJlIiwiUGFnZSIsImVuYWJsZSIsIlJ1bnRpbWUiLCJkZXZpY2VQaXhlbFJhdGlvUXVlcnlSZXN1bHQiLCJldmFsdWF0ZSIsImV4cHJlc3Npb24iLCJvcmlnaW5hbERldmljZVBpeGVsUmF0aW8iLCJyZXN1bHQiLCJ2YWx1ZSIsInNjYWxlRmFjdG9yIiwiZW11bGF0aW9uIiwiY3JlYXRlQ2xpZW50IiwiY2xvc2VUYWIiLCJpZCIsIndpbmRvd0RpbWVuc2lvbnNRdWVyeVJlc3VsdCIsIkdFVF9XSU5ET1dfRElNRU5TSU9OU19JTkZPX1NDUklQVCIsInJldHVybkJ5VmFsdWUiLCJ3aW5kb3dEaW1lbnNpb25zIiwib3V0ZXJXaWR0aCIsIm91dGVySGVpZ2h0IiwidXBkYXRlTW9iaWxlVmlld3BvcnRTaXplIiwicGF0aCIsImdldExheW91dE1ldHJpY3MiLCJ2aXN1YWxWaWV3cG9ydCIsImNsaXBSZWdpb24iLCJ4IiwicGFnZVgiLCJ5IiwicGFnZVkiLCJjbGllbnRXaWR0aCIsImNsaWVudEhlaWdodCIsInNjYWxlIiwic2NyZWVuc2hvdCIsImNhcHR1cmVTY3JlZW5zaG90IiwiZnJvbVN1cmZhY2UiLCJjbGlwIiwiZGF0YSIsImVuY29kaW5nIiwidGFrZVNjcmVlbnNob3QiLCJuZXdEaW1lbnNpb25zIiwicHJvdmlkZXJNZXRob2RzIiwiY3VycmVudFdpZHRoIiwiY3VycmVudEhlaWdodCIsIm5ld1dpZHRoIiwibmV3SGVpZ2h0IiwiaGVhZGxlc3MiLCJyZXNpemVMb2NhbEJyb3dzZXJXaW5kb3ciLCJpc0hlYWRsZXNzVGFiIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OytDQUtBLFdBQTZCQSxPQUE3QixFQUFzQ0MsU0FBdEMsRUFBaUQ7QUFDN0MsY0FBTUMsT0FBTyxNQUFNQyxnQ0FBYUMsUUFBYixDQUFzQixFQUFFQyxNQUFNTCxPQUFSLEVBQXRCLENBQW5CO0FBQ0EsY0FBTU0sTUFBT0osS0FBS0ssTUFBTCxDQUFZO0FBQUEsbUJBQUtDLEVBQUVDLElBQUYsS0FBVyxNQUFYLElBQXFCRCxFQUFFRSxHQUFGLENBQU1DLE9BQU4sQ0FBY1YsU0FBZCxJQUEyQixDQUFDLENBQXREO0FBQUEsU0FBWixFQUFxRSxDQUFyRSxDQUFiOztBQUVBLGVBQU9LLEdBQVA7QUFDSCxLOztvQkFMY00sWTs7Ozs7O2dEQU9mLFdBQW1DLEVBQUVDLE1BQUYsRUFBVUMsTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0NDLHdCQUFoQyxFQUFuQyxFQUErRjtBQUMzRixjQUFNSCxPQUFPSSxTQUFQLENBQWlCQyx3QkFBakIsQ0FBMEM7QUFDNUNDLG1CQUFtQkosYUFBYUksS0FEWTtBQUU1Q0Msb0JBQW1CTCxhQUFhSyxN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OlsiaW1wb3J0IHJlbW90ZUNocm9tZSBmcm9tICdjaHJvbWUtcmVtb3RlLWludGVyZmFjZSc7XG5pbXBvcnQgeyB3cml0ZUZpbGUgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlscy9wcm9taXNpZmllZC1mdW5jdGlvbnMnO1xuaW1wb3J0IHsgR0VUX1dJTkRPV19ESU1FTlNJT05TX0lORk9fU0NSSVBUIH0gZnJvbSAnLi4vLi4vdXRpbHMvY2xpZW50LWZ1bmN0aW9ucyc7XG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWN0aXZlVGFiIChjZHBQb3J0LCBicm93c2VySWQpIHtcbiAgICBjb25zdCB0YWJzID0gYXdhaXQgcmVtb3RlQ2hyb21lLmxpc3RUYWJzKHsgcG9ydDogY2RwUG9ydCB9KTtcbiAgICBjb25zdCB0YWIgID0gdGFicy5maWx0ZXIodCA9PiB0LnR5cGUgPT09ICdwYWdlJyAmJiB0LnVybC5pbmRleE9mKGJyb3dzZXJJZCkgPiAtMSlbMF07XG5cbiAgICByZXR1cm4gdGFiO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRFbXVsYXRpb25Cb3VuZHMgKHsgY2xpZW50LCBjb25maWcsIHZpZXdwb3J0U2l6ZSwgZW11bGF0ZWREZXZpY2VQaXhlbFJhdGlvIH0pIHtcbiAgICBhd2FpdCBjbGllbnQuRW11bGF0aW9uLnNldERldmljZU1ldHJpY3NPdmVycmlkZSh7XG4gICAgICAgIHdpZHRoOiAgICAgICAgICAgICB2aWV3cG9ydFNpemUud2lkdGgsXG4gICAgICAgIGhlaWdodDogICAgICAgICAgICB2aWV3cG9ydFNpemUuaGVpZ2h0LFxuICAgICAgICBkZXZpY2VTY2FsZUZhY3RvcjogZW11bGF0ZWREZXZpY2VQaXhlbFJhdGlvLFxuICAgICAgICBtb2JpbGU6ICAgICAgICAgICAgY29uZmlnLm1vYmlsZSxcbiAgICAgICAgZml0V2luZG93OiAgICAgICAgIGZhbHNlXG4gICAgfSk7XG5cbiAgICBhd2FpdCBjbGllbnQuRW11bGF0aW9uLnNldFZpc2libGVTaXplKHsgd2lkdGg6IHZpZXdwb3J0U2l6ZS53aWR0aCwgaGVpZ2h0OiB2aWV3cG9ydFNpemUuaGVpZ2h0IH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZXRFbXVsYXRpb24gKHJ1bnRpbWVJbmZvKSB7XG4gICAgY29uc3QgeyBjbGllbnQsIGNvbmZpZyB9ID0gcnVudGltZUluZm87XG5cbiAgICBpZiAoY29uZmlnLnVzZXJBZ2VudCAhPT0gdm9pZCAwKVxuICAgICAgICBhd2FpdCBjbGllbnQuTmV0d29yay5zZXRVc2VyQWdlbnRPdmVycmlkZSh7IHVzZXJBZ2VudDogY29uZmlnLnVzZXJBZ2VudCB9KTtcblxuICAgIGlmIChjb25maWcudG91Y2ggIT09IHZvaWQgMCkge1xuICAgICAgICBjb25zdCB0b3VjaENvbmZpZyA9IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6ICAgICAgICBjb25maWcudG91Y2gsXG4gICAgICAgICAgICBjb25maWd1cmF0aW9uOiAgY29uZmlnLm1vYmlsZSA/ICdtb2JpbGUnIDogJ2Rlc2t0b3AnLFxuICAgICAgICAgICAgbWF4VG91Y2hQb2ludHM6IDFcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoY2xpZW50LkVtdWxhdGlvbi5zZXRFbWl0VG91Y2hFdmVudHNGb3JNb3VzZSlcbiAgICAgICAgICAgIGF3YWl0IGNsaWVudC5FbXVsYXRpb24uc2V0RW1pdFRvdWNoRXZlbnRzRm9yTW91c2UodG91Y2hDb25maWcpO1xuXG4gICAgICAgIGlmIChjbGllbnQuRW11bGF0aW9uLnNldFRvdWNoRW11bGF0aW9uRW5hYmxlZClcbiAgICAgICAgICAgIGF3YWl0IGNsaWVudC5FbXVsYXRpb24uc2V0VG91Y2hFbXVsYXRpb25FbmFibGVkKHRvdWNoQ29uZmlnKTtcbiAgICB9XG5cbiAgICBhd2FpdCByZXNpemVXaW5kb3coeyB3aWR0aDogY29uZmlnLndpZHRoLCBoZWlnaHQ6IGNvbmZpZy5oZWlnaHQgfSwgcnVudGltZUluZm8pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2xpZW50IChydW50aW1lSW5mbykge1xuICAgIGNvbnN0IHsgYnJvd3NlcklkLCBjb25maWcsIGNkcFBvcnQgfSA9IHJ1bnRpbWVJbmZvO1xuXG4gICAgbGV0IHRhYiAgICA9IG51bGw7XG4gICAgbGV0IGNsaWVudCA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgICB0YWIgPSBhd2FpdCBnZXRBY3RpdmVUYWIoY2RwUG9ydCwgYnJvd3NlcklkKTtcblxuICAgICAgICBpZiAoIXRhYilcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBjbGllbnQgPSBhd2FpdCByZW1vdGVDaHJvbWUoeyB0YXJnZXQ6IHRhYiwgcG9ydDogY2RwUG9ydCB9KTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJ1bnRpbWVJbmZvLnRhYiAgICA9IHRhYjtcbiAgICBydW50aW1lSW5mby5jbGllbnQgPSBjbGllbnQ7XG5cbiAgICBhd2FpdCBjbGllbnQuUGFnZS5lbmFibGUoKTtcbiAgICBhd2FpdCBjbGllbnQuTmV0d29yay5lbmFibGUoKTtcbiAgICBhd2FpdCBjbGllbnQuUnVudGltZS5lbmFibGUoKTtcblxuICAgIGNvbnN0IGRldmljZVBpeGVsUmF0aW9RdWVyeVJlc3VsdCA9IGF3YWl0IGNsaWVudC5SdW50aW1lLmV2YWx1YXRlKHsgZXhwcmVzc2lvbjogJ3dpbmRvdy5kZXZpY2VQaXhlbFJhdGlvJyB9KTtcblxuICAgIHJ1bnRpbWVJbmZvLm9yaWdpbmFsRGV2aWNlUGl4ZWxSYXRpbyA9IGRldmljZVBpeGVsUmF0aW9RdWVyeVJlc3VsdC5yZXN1bHQudmFsdWU7XG4gICAgcnVudGltZUluZm8uZW11bGF0ZWREZXZpY2VQaXhlbFJhdGlvID0gY29uZmlnLnNjYWxlRmFjdG9yIHx8IHJ1bnRpbWVJbmZvLm9yaWdpbmFsRGV2aWNlUGl4ZWxSYXRpbztcblxuICAgIGlmIChjb25maWcuZW11bGF0aW9uKVxuICAgICAgICBhd2FpdCBzZXRFbXVsYXRpb24ocnVudGltZUluZm8pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNIZWFkbGVzc1RhYiAoeyB0YWIsIGNvbmZpZyB9KSB7XG4gICAgcmV0dXJuIHRhYiAmJiBjb25maWcuaGVhZGxlc3M7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbG9zZVRhYiAoeyB0YWIsIGNkcFBvcnQgfSkge1xuICAgIGF3YWl0IHJlbW90ZUNocm9tZS5jbG9zZVRhYih7IGlkOiB0YWIuaWQsIHBvcnQ6IGNkcFBvcnQgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVNb2JpbGVWaWV3cG9ydFNpemUgKHJ1bnRpbWVJbmZvKSB7XG4gICAgY29uc3Qgd2luZG93RGltZW5zaW9uc1F1ZXJ5UmVzdWx0ID0gYXdhaXQgcnVudGltZUluZm8uY2xpZW50LlJ1bnRpbWUuZXZhbHVhdGUoe1xuICAgICAgICBleHByZXNzaW9uOiAgICBgKCR7R0VUX1dJTkRPV19ESU1FTlNJT05TX0lORk9fU0NSSVBUfSkoKWAsXG4gICAgICAgIHJldHVybkJ5VmFsdWU6IHRydWVcbiAgICB9KTtcblxuICAgIGNvbnN0IHdpbmRvd0RpbWVuc2lvbnMgPSB3aW5kb3dEaW1lbnNpb25zUXVlcnlSZXN1bHQucmVzdWx0LnZhbHVlO1xuXG4gICAgcnVudGltZUluZm8udmlld3BvcnRTaXplLndpZHRoICA9IHdpbmRvd0RpbWVuc2lvbnMub3V0ZXJXaWR0aDtcbiAgICBydW50aW1lSW5mby52aWV3cG9ydFNpemUuaGVpZ2h0ID0gd2luZG93RGltZW5zaW9ucy5vdXRlckhlaWdodDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRha2VTY3JlZW5zaG90IChwYXRoLCB7IGNsaWVudCB9KSB7XG4gICAgY29uc3QgeyB2aXN1YWxWaWV3cG9ydCB9ID0gYXdhaXQgY2xpZW50LlBhZ2UuZ2V0TGF5b3V0TWV0cmljcygpO1xuXG4gICAgY29uc3QgY2xpcFJlZ2lvbiA9IHtcbiAgICAgICAgeDogICAgICB2aXN1YWxWaWV3cG9ydC5wYWdlWCxcbiAgICAgICAgeTogICAgICB2aXN1YWxWaWV3cG9ydC5wYWdlWSxcbiAgICAgICAgd2lkdGg6ICB2aXN1YWxWaWV3cG9ydC5jbGllbnRXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiB2aXN1YWxWaWV3cG9ydC5jbGllbnRIZWlnaHQsXG4gICAgICAgIHNjYWxlOiAgdmlzdWFsVmlld3BvcnQuc2NhbGVcbiAgICB9O1xuXG4gICAgY29uc3Qgc2NyZWVuc2hvdCA9IGF3YWl0IGNsaWVudC5QYWdlLmNhcHR1cmVTY3JlZW5zaG90KHsgZnJvbVN1cmZhY2U6IHRydWUsIGNsaXA6IGNsaXBSZWdpb24gfSk7XG5cbiAgICBhd2FpdCB3cml0ZUZpbGUocGF0aCwgc2NyZWVuc2hvdC5kYXRhLCB7IGVuY29kaW5nOiAnYmFzZTY0JyB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc2l6ZVdpbmRvdyAobmV3RGltZW5zaW9ucywgcnVudGltZUluZm8pIHtcbiAgICBjb25zdCB7IGJyb3dzZXJJZCwgY29uZmlnLCB2aWV3cG9ydFNpemUsIHByb3ZpZGVyTWV0aG9kcyB9ID0gcnVudGltZUluZm87XG5cbiAgICBjb25zdCBjdXJyZW50V2lkdGggID0gdmlld3BvcnRTaXplLndpZHRoO1xuICAgIGNvbnN0IGN1cnJlbnRIZWlnaHQgPSB2aWV3cG9ydFNpemUuaGVpZ2h0O1xuICAgIGNvbnN0IG5ld1dpZHRoICAgICAgPSBuZXdEaW1lbnNpb25zLndpZHRoIHx8IGN1cnJlbnRXaWR0aDtcbiAgICBjb25zdCBuZXdIZWlnaHQgICAgID0gbmV3RGltZW5zaW9ucy5oZWlnaHQgfHwgY3VycmVudEhlaWdodDtcblxuICAgIGlmICghY29uZmlnLmhlYWRsZXNzKVxuICAgICAgICBhd2FpdCBwcm92aWRlck1ldGhvZHMucmVzaXplTG9jYWxCcm93c2VyV2luZG93KGJyb3dzZXJJZCwgbmV3V2lkdGgsIG5ld0hlaWdodCwgY3VycmVudFdpZHRoLCBjdXJyZW50SGVpZ2h0KTtcblxuICAgIHZpZXdwb3J0U2l6ZS53aWR0aCAgPSBuZXdXaWR0aDtcbiAgICB2aWV3cG9ydFNpemUuaGVpZ2h0ID0gbmV3SGVpZ2h0O1xuXG4gICAgaWYgKGNvbmZpZy5lbXVsYXRpb24pXG4gICAgICAgIGF3YWl0IHNldEVtdWxhdGlvbkJvdW5kcyhydW50aW1lSW5mbyk7XG59XG4iXX0=
