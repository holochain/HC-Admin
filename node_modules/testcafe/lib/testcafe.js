'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const lazyRequire = require('import-lazy')(require);
const sourceMapSupport = lazyRequire('source-map-support');
const hammerhead = lazyRequire('testcafe-hammerhead');
const loadAssets = lazyRequire('./load-assets');
const errorHandlers = lazyRequire('./utils/handle-errors');
const BrowserConnectionGateway = lazyRequire('./browser/connection/gateway');
const BrowserConnection = lazyRequire('./browser/connection');
const browserProviderPool = lazyRequire('./browser/provider/pool');
const Runner = lazyRequire('./runner');

// NOTE: CoffeeScript can't be loaded lazily, because it will break stack traces
require('coffeescript');

class TestCafe {
    constructor(hostname, port1, port2, options = {}) {
        this._setupSourceMapsSupport();

        errorHandlers.registerErrorHandlers();

        if (options.retryTestPages) options.staticContentCaching = { maxAge: 3600, mustRevalidate: false };

        this.closed = false;
        this.proxy = new hammerhead.Proxy(hostname, port1, port2, options);
        this.browserConnectionGateway = new BrowserConnectionGateway(this.proxy, { retryTestPages: options.retryTestPages });
        this.runners = [];
        this.retryTestPages = options.retryTestPages;

        this._registerAssets(options.developmentMode);
    }

    _registerAssets(developmentMode) {
        var _loadAssets = loadAssets(developmentMode);

        const favIcon = _loadAssets.favIcon,
              coreScript = _loadAssets.coreScript,
              driverScript = _loadAssets.driverScript,
              uiScript = _loadAssets.uiScript,
              uiStyle = _loadAssets.uiStyle,
              uiSprite = _loadAssets.uiSprite,
              automationScript = _loadAssets.automationScript,
              legacyRunnerScript = _loadAssets.legacyRunnerScript;


        this.proxy.GET('/testcafe-core.js', { content: coreScript, contentType: 'application/x-javascript' });
        this.proxy.GET('/testcafe-driver.js', { content: driverScript, contentType: 'application/x-javascript' });

        this.proxy.GET('/testcafe-legacy-runner.js', {
            content: legacyRunnerScript,
            contentType: 'application/x-javascript'
        });

        this.proxy.GET('/testcafe-automation.js', { content: automationScript, contentType: 'application/x-javascript' });
        this.proxy.GET('/testcafe-ui.js', { content: uiScript, contentType: 'application/x-javascript' });
        this.proxy.GET('/testcafe-ui-sprite.png', { content: uiSprite, contentType: 'image/png' });
        this.proxy.GET('/favicon.ico', { content: favIcon, contentType: 'image/x-icon' });

        this.proxy.GET('/testcafe-ui-styles.css', {
            content: uiStyle,
            contentType: 'text/css',
            isShadowUIStylesheet: true
        });
    }

    _setupSourceMapsSupport() {
        sourceMapSupport.install({
            hookRequire: true,
            handleUncaughtExceptions: false,
            environment: 'node'
        });
    }

    // API
    createBrowserConnection() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const browserInfo = yield browserProviderPool.getBrowserInfo('remote');

            return new BrowserConnection(_this.browserConnectionGateway, browserInfo, true);
        })();
    }

    createRunner() {
        const newRunner = new Runner(this.proxy, this.browserConnectionGateway, { retryTestPages: this.retryTestPages });

        this.runners.push(newRunner);

        return newRunner;
    }

    close() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (_this2.closed) return;

            _this2.closed = true;

            yield _pinkie2.default.all(_this2.runners.map(function (runner) {
                return runner.stop();
            }));

            yield browserProviderPool.dispose();

            _this2.browserConnectionGateway.close();
            _this2.proxy.close();
        })();
    }
}
exports.default = TestCafe;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0Y2FmZS5qcyJdLCJuYW1lcyI6WyJsYXp5UmVxdWlyZSIsInJlcXVpcmUiLCJzb3VyY2VNYXBTdXBwb3J0IiwiaGFtbWVyaGVhZCIsImxvYWRBc3NldHMiLCJlcnJvckhhbmRsZXJzIiwiQnJvd3NlckNvbm5lY3Rpb25HYXRld2F5IiwiQnJvd3NlckNvbm5lY3Rpb24iLCJicm93c2VyUHJvdmlkZXJQb29sIiwiUnVubmVyIiwiVGVzdENhZmUiLCJjb25zdHJ1Y3RvciIsImhvc3RuYW1lIiwicG9ydDEiLCJwb3J0MiIsIm9wdGlvbnMiLCJfc2V0dXBTb3VyY2VNYXBzU3VwcG9ydCIsInJlZ2lzdGVyRXJyb3JIYW5kbGVycyIsInJldHJ5VGVzdFBhZ2VzIiwic3RhdGljQ29udGVudENhY2hpbmciLCJtYXhBZ2UiLCJtdXN0UmV2YWxpZGF0ZSIsImNsb3NlZCIsInByb3h5IiwiUHJveHkiLCJicm93c2VyQ29ubmVjdGlvbkdhdGV3YXkiLCJydW5uZXJzIiwiX3JlZ2lzdGVyQXNzZXRzIiwiZGV2ZWxvcG1lbnRNb2RlIiwiZmF2SWNvbiIsImNvcmVTY3JpcHQiLCJkcml2ZXJTY3JpcHQiLCJ1aVNjcmlwdCIsInVpU3R5bGUiLCJ1aVNwcml0ZSIsImF1dG9tYXRpb25TY3JpcHQiLCJsZWdhY3lSdW5uZXJTY3JpcHQiLCJHRVQiLCJjb250ZW50IiwiY29udGVudFR5cGUiLCJpc1NoYWRvd1VJU3R5bGVzaGVldCIsImluc3RhbGwiLCJob29rUmVxdWlyZSIsImhhbmRsZVVuY2F1Z2h0RXhjZXB0aW9ucyIsImVudmlyb25tZW50IiwiY3JlYXRlQnJvd3NlckNvbm5lY3Rpb24iLCJicm93c2VySW5mbyIsImdldEJyb3dzZXJJbmZvIiwiY3JlYXRlUnVubmVyIiwibmV3UnVubmVyIiwicHVzaCIsImNsb3NlIiwiUHJvbWlzZSIsImFsbCIsIm1hcCIsInJ1bm5lciIsInN0b3AiLCJkaXNwb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7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QUFZZDtBQTdFeUI7a0JBQVR6QyxRIiwiZmlsZSI6InRlc3RjYWZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb21pc2UgZnJvbSAncGlua2llJztcblxuY29uc3QgbGF6eVJlcXVpcmUgICAgICAgICAgICAgID0gcmVxdWlyZSgnaW1wb3J0LWxhenknKShyZXF1aXJlKTtcbmNvbnN0IHNvdXJjZU1hcFN1cHBvcnQgICAgICAgICA9IGxhenlSZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKTtcbmNvbnN0IGhhbW1lcmhlYWQgICAgICAgICAgICAgICA9IGxhenlSZXF1aXJlKCd0ZXN0Y2FmZS1oYW1tZXJoZWFkJyk7XG5jb25zdCBsb2FkQXNzZXRzICAgICAgICAgICAgICAgPSBsYXp5UmVxdWlyZSgnLi9sb2FkLWFzc2V0cycpO1xuY29uc3QgZXJyb3JIYW5kbGVycyAgICAgICAgICAgID0gbGF6eVJlcXVpcmUoJy4vdXRpbHMvaGFuZGxlLWVycm9ycycpO1xuY29uc3QgQnJvd3NlckNvbm5lY3Rpb25HYXRld2F5ID0gbGF6eVJlcXVpcmUoJy4vYnJvd3Nlci9jb25uZWN0aW9uL2dhdGV3YXknKTtcbmNvbnN0IEJyb3dzZXJDb25uZWN0aW9uICAgICAgICA9IGxhenlSZXF1aXJlKCcuL2Jyb3dzZXIvY29ubmVjdGlvbicpO1xuY29uc3QgYnJvd3NlclByb3ZpZGVyUG9vbCAgICAgID0gbGF6eVJlcXVpcmUoJy4vYnJvd3Nlci9wcm92aWRlci9wb29sJyk7XG5jb25zdCBSdW5uZXIgICAgICAgICAgICAgICAgICAgPSBsYXp5UmVxdWlyZSgnLi9ydW5uZXInKTtcblxuLy8gTk9URTogQ29mZmVlU2NyaXB0IGNhbid0IGJlIGxvYWRlZCBsYXppbHksIGJlY2F1c2UgaXQgd2lsbCBicmVhayBzdGFjayB0cmFjZXNcbnJlcXVpcmUoJ2NvZmZlZXNjcmlwdCcpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0Q2FmZSB7XG4gICAgY29uc3RydWN0b3IgKGhvc3RuYW1lLCBwb3J0MSwgcG9ydDIsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9zZXR1cFNvdXJjZU1hcHNTdXBwb3J0KCk7XG5cbiAgICAgICAgZXJyb3JIYW5kbGVycy5yZWdpc3RlckVycm9ySGFuZGxlcnMoKTtcblxuICAgICAgICBpZiAob3B0aW9ucy5yZXRyeVRlc3RQYWdlcylcbiAgICAgICAgICAgIG9wdGlvbnMuc3RhdGljQ29udGVudENhY2hpbmcgPSB7IG1heEFnZTogMzYwMCwgbXVzdFJldmFsaWRhdGU6IGZhbHNlIH07XG5cbiAgICAgICAgdGhpcy5jbG9zZWQgICAgICAgICAgICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wcm94eSAgICAgICAgICAgICAgICAgICAgPSBuZXcgaGFtbWVyaGVhZC5Qcm94eShob3N0bmFtZSwgcG9ydDEsIHBvcnQyLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbkdhdGV3YXkgPSBuZXcgQnJvd3NlckNvbm5lY3Rpb25HYXRld2F5KHRoaXMucHJveHksIHsgcmV0cnlUZXN0UGFnZXM6IG9wdGlvbnMucmV0cnlUZXN0UGFnZXMgfSk7XG4gICAgICAgIHRoaXMucnVubmVycyAgICAgICAgICAgICAgICAgID0gW107XG4gICAgICAgIHRoaXMucmV0cnlUZXN0UGFnZXMgICAgICAgICAgID0gb3B0aW9ucy5yZXRyeVRlc3RQYWdlcztcblxuICAgICAgICB0aGlzLl9yZWdpc3RlckFzc2V0cyhvcHRpb25zLmRldmVsb3BtZW50TW9kZSk7XG4gICAgfVxuXG4gICAgX3JlZ2lzdGVyQXNzZXRzIChkZXZlbG9wbWVudE1vZGUpIHtcbiAgICAgICAgY29uc3QgeyBmYXZJY29uLCBjb3JlU2NyaXB0LCBkcml2ZXJTY3JpcHQsIHVpU2NyaXB0LFxuICAgICAgICAgICAgdWlTdHlsZSwgdWlTcHJpdGUsIGF1dG9tYXRpb25TY3JpcHQsIGxlZ2FjeVJ1bm5lclNjcmlwdCB9ID0gbG9hZEFzc2V0cyhkZXZlbG9wbWVudE1vZGUpO1xuXG4gICAgICAgIHRoaXMucHJveHkuR0VUKCcvdGVzdGNhZmUtY29yZS5qcycsIHsgY29udGVudDogY29yZVNjcmlwdCwgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnIH0pO1xuICAgICAgICB0aGlzLnByb3h5LkdFVCgnL3Rlc3RjYWZlLWRyaXZlci5qcycsIHsgY29udGVudDogZHJpdmVyU2NyaXB0LCBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCcgfSk7XG5cbiAgICAgICAgdGhpcy5wcm94eS5HRVQoJy90ZXN0Y2FmZS1sZWdhY3ktcnVubmVyLmpzJywge1xuICAgICAgICAgICAgY29udGVudDogICAgIGxlZ2FjeVJ1bm5lclNjcmlwdCxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0J1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnByb3h5LkdFVCgnL3Rlc3RjYWZlLWF1dG9tYXRpb24uanMnLCB7IGNvbnRlbnQ6IGF1dG9tYXRpb25TY3JpcHQsIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0JyB9KTtcbiAgICAgICAgdGhpcy5wcm94eS5HRVQoJy90ZXN0Y2FmZS11aS5qcycsIHsgY29udGVudDogdWlTY3JpcHQsIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0JyB9KTtcbiAgICAgICAgdGhpcy5wcm94eS5HRVQoJy90ZXN0Y2FmZS11aS1zcHJpdGUucG5nJywgeyBjb250ZW50OiB1aVNwcml0ZSwgY29udGVudFR5cGU6ICdpbWFnZS9wbmcnIH0pO1xuICAgICAgICB0aGlzLnByb3h5LkdFVCgnL2Zhdmljb24uaWNvJywgeyBjb250ZW50OiBmYXZJY29uLCBjb250ZW50VHlwZTogJ2ltYWdlL3gtaWNvbicgfSk7XG5cbiAgICAgICAgdGhpcy5wcm94eS5HRVQoJy90ZXN0Y2FmZS11aS1zdHlsZXMuY3NzJywge1xuICAgICAgICAgICAgY29udGVudDogICAgICAgICAgICAgIHVpU3R5bGUsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogICAgICAgICAgJ3RleHQvY3NzJyxcbiAgICAgICAgICAgIGlzU2hhZG93VUlTdHlsZXNoZWV0OiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9zZXR1cFNvdXJjZU1hcHNTdXBwb3J0ICgpIHtcbiAgICAgICAgc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKHtcbiAgICAgICAgICAgIGhvb2tSZXF1aXJlOiAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgIGhhbmRsZVVuY2F1Z2h0RXhjZXB0aW9uczogZmFsc2UsXG4gICAgICAgICAgICBlbnZpcm9ubWVudDogICAgICAgICAgICAgICdub2RlJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBUElcbiAgICBhc3luYyBjcmVhdGVCcm93c2VyQ29ubmVjdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGJyb3dzZXJJbmZvID0gYXdhaXQgYnJvd3NlclByb3ZpZGVyUG9vbC5nZXRCcm93c2VySW5mbygncmVtb3RlJyk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBCcm93c2VyQ29ubmVjdGlvbih0aGlzLmJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheSwgYnJvd3NlckluZm8sIHRydWUpO1xuICAgIH1cblxuICAgIGNyZWF0ZVJ1bm5lciAoKSB7XG4gICAgICAgIGNvbnN0IG5ld1J1bm5lciA9IG5ldyBSdW5uZXIodGhpcy5wcm94eSwgdGhpcy5icm93c2VyQ29ubmVjdGlvbkdhdGV3YXksIHsgcmV0cnlUZXN0UGFnZXM6IHRoaXMucmV0cnlUZXN0UGFnZXMgfSk7XG5cbiAgICAgICAgdGhpcy5ydW5uZXJzLnB1c2gobmV3UnVubmVyKTtcblxuICAgICAgICByZXR1cm4gbmV3UnVubmVyO1xuICAgIH1cblxuICAgIGFzeW5jIGNsb3NlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCh0aGlzLnJ1bm5lcnMubWFwKHJ1bm5lciA9PiBydW5uZXIuc3RvcCgpKSk7XG5cbiAgICAgICAgYXdhaXQgYnJvd3NlclByb3ZpZGVyUG9vbC5kaXNwb3NlKCk7XG5cbiAgICAgICAgdGhpcy5icm93c2VyQ29ubmVjdGlvbkdhdGV3YXkuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5wcm94eS5jbG9zZSgpO1xuICAgIH1cbn1cbiJdfQ==
