'use strict';

exports.__esModule = true;
exports.stop = exports.start = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let start = exports.start = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (pageUrl, runtimeInfo) {
        const browserName = runtimeInfo.browserName,
              config = runtimeInfo.config;


        const firefoxInfo = yield _testcafeBrowserTools2.default.getBrowserInfo(config.path || browserName);
        const firefoxOpenParameters = (0, _assign2.default)({}, firefoxInfo);

        if (_osFamily2.default.mac && !config.userProfile) correctOpenParametersForMac(firefoxOpenParameters);

        firefoxOpenParameters.cmd = buildFirefoxArgs(config, firefoxOpenParameters.cmd, runtimeInfo, runtimeInfo.newInstance);

        yield browserStarter.startBrowser(firefoxOpenParameters, pageUrl);
    });

    return function start(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

let stop = exports.stop = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* ({ browserId }) {
        yield (0, _process.killBrowserProcess)(browserId);
    });

    return function stop(_x3) {
        return _ref2.apply(this, arguments);
    };
})();

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _testcafeBrowserTools = require('testcafe-browser-tools');

var _testcafeBrowserTools2 = _interopRequireDefault(_testcafeBrowserTools);

var _process = require('../../../../utils/process');

var _browserStarter = require('../../utils/browser-starter');

var _browserStarter2 = _interopRequireDefault(_browserStarter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const browserStarter = new _browserStarter2.default();

function correctOpenParametersForMac(parameters) {
    parameters.macOpenCmdTemplate = parameters.macOpenCmdTemplate.replace('open', 'open -n').replace(' {{{pageUrl}}}', '');

    parameters.macOpenCmdTemplate += ' {{{pageUrl}}}';
}

function buildFirefoxArgs(config, platformArgs, { marionettePort, tempProfileDir }) {
    return [].concat(marionettePort ? ['-marionette'] : [], !config.userProfile ? ['-no-remote', '-new-instance', `-profile "${tempProfileDir.path}"`] : [], config.headless ? ['-headless'] : [], config.userArgs ? [config.userArgs] : [], platformArgs ? [platformArgs] : []).join(' ');
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2ZpcmVmb3gvbG9jYWwtZmlyZWZveC5qcyJdLCJuYW1lcyI6WyJwYWdlVXJsIiwicnVudGltZUluZm8iLCJicm93c2VyTmFtZSIsImNvbmZpZyIsImZpcmVmb3hJbmZvIiwiYnJvd3NlclRvb2xzIiwiZ2V0QnJvd3NlckluZm8iLCJwYXRoIiwiZmlyZWZveE9wZW5QYXJhbWV0ZXJzIiwiT1MiLCJtYWMiLCJ1c2VyUHJvZmlsZSIsImNvcnJlY3RPcGVuUGFyYW1ldGVyc0Zvck1hYyIsImNtZCIsImJ1aWxkRmlyZWZveEFyZ3MiLCJuZXdJbnN0YW5jZSIsImJyb3dzZXJTdGFydGVyIiwic3RhcnRCcm93c2VyIiwic3RhcnQiLCJicm93c2VySWQiLCJzdG9wIiwiQnJvd3NlclN0YXJ0ZXIiLCJwYXJhbWV0ZXJzIiwibWFjT3BlbkNtZFRlbXBsYXRlIiwicmVwbGFjZSIsInBsYXRmb3JtQXJncyIsIm1hcmlvbmV0dGVQb3J0IiwidGVtcFByb2ZpbGVEaXIiLCJjb25jYXQiLCJoZWFkbGVzcyIsInVzZXJBcmdzIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7K0NBNEJPLFdBQXNCQSxPQUF0QixFQUErQkMsV0FBL0IsRUFBNEM7QUFBQSxjQUN2Q0MsV0FEdUMsR0FDZkQsV0FEZSxDQUN2Q0MsV0FEdUM7QUFBQSxjQUMxQkMsTUFEMEIsR0FDZkYsV0FEZSxDQUMxQkUsTUFEMEI7OztBQUcvQyxjQUFNQyxjQUF3QixNQUFNQywrQkFBYUMsY0FBYixDQUE0QkgsT0FBT0ksSUFBUCxJQUFlTCxXQUEzQyxDQUFwQztBQUNBLGNBQU1NLHdCQUF3QixzQkFBYyxFQUFkLEVBQWtCSixXQUFsQixDQUE5Qjs7QUFFQSxZQUFJSyxtQkFBR0MsR0FBSCxJQUFVLENBQUNQLE9BQU9RLFdBQXRCLEVBQ0lDLDRCQUE0QkoscUJBQTVCOztBQUVKQSw4QkFBc0JLLEdBQXRCLEdBQTRCQyxpQkFBaUJYLE1BQWpCLEVBQXlCSyxzQkFBc0JLLEdBQS9DLEVBQW9EWixXQUFwRCxFQUFpRUEsWUFBWWMsV0FBN0UsQ0FBNUI7O0FBRUEsY0FBTUMsZUFBZUMsWUFBZixDQUE0QlQscUJBQTVCLEVBQW1EUixPQUFuRCxDQUFOO0FBQ0gsSzs7b0JBWnFCa0IsSzs7Ozs7O2dEQWNmLFdBQXFCLEVBQUVDLFNBQUYsRUFBckIsRUFBb0M7QUFDdkMsY0FBTSxpQ0FBbUJBLFNBQW5CLENBQU47QUFDSCxLOztvQkFGcUJDLEk7Ozs7O0FBMUN0Qjs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUdBLE1BQU1KLGlCQUFpQixJQUFJSyx3QkFBSixFQUF2Qjs7QUFFQSxTQUFTVCwyQkFBVCxDQUFzQ1UsVUFBdEMsRUFBa0Q7QUFDOUNBLGVBQVdDLGtCQUFYLEdBQWdDRCxXQUFXQyxrQkFBWCxDQUMzQkMsT0FEMkIsQ0FDbkIsTUFEbUIsRUFDWCxTQURXLEVBRTNCQSxPQUYyQixDQUVuQixnQkFGbUIsRUFFRCxFQUZDLENBQWhDOztBQUlBRixlQUFXQyxrQkFBWCxJQUFpQyxnQkFBakM7QUFDSDs7QUFFRCxTQUFTVCxnQkFBVCxDQUEyQlgsTUFBM0IsRUFBbUNzQixZQUFuQyxFQUFpRCxFQUFFQyxjQUFGLEVBQWtCQyxjQUFsQixFQUFqRCxFQUFxRjtBQUNqRixXQUFPLEdBQ0ZDLE1BREUsQ0FFQ0YsaUJBQWlCLENBQUMsYUFBRCxDQUFqQixHQUFtQyxFQUZwQyxFQUdDLENBQUN2QixPQUFPUSxXQUFSLEdBQXNCLENBQUMsWUFBRCxFQUFlLGVBQWYsRUFBaUMsYUFBWWdCLGVBQWVwQixJQUFLLEdBQWpFLENBQXRCLEdBQTZGLEVBSDlGLEVBSUNKLE9BQU8wQixRQUFQLEdBQWtCLENBQUMsV0FBRCxDQUFsQixHQUFrQyxFQUpuQyxFQUtDMUIsT0FBTzJCLFFBQVAsR0FBa0IsQ0FBQzNCLE9BQU8yQixRQUFSLENBQWxCLEdBQXNDLEVBTHZDLEVBTUNMLGVBQWUsQ0FBQ0EsWUFBRCxDQUFmLEdBQWdDLEVBTmpDLEVBUUZNLElBUkUsQ0FRRyxHQVJILENBQVA7QUFTSCIsImZpbGUiOiJicm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2ZpcmVmb3gvbG9jYWwtZmlyZWZveC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPUyBmcm9tICdvcy1mYW1pbHknO1xuaW1wb3J0IGJyb3dzZXJUb29scyBmcm9tICd0ZXN0Y2FmZS1icm93c2VyLXRvb2xzJztcbmltcG9ydCB7IGtpbGxCcm93c2VyUHJvY2VzcyB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxzL3Byb2Nlc3MnO1xuaW1wb3J0IEJyb3dzZXJTdGFydGVyIGZyb20gJy4uLy4uL3V0aWxzL2Jyb3dzZXItc3RhcnRlcic7XG5cblxuY29uc3QgYnJvd3NlclN0YXJ0ZXIgPSBuZXcgQnJvd3NlclN0YXJ0ZXIoKTtcblxuZnVuY3Rpb24gY29ycmVjdE9wZW5QYXJhbWV0ZXJzRm9yTWFjIChwYXJhbWV0ZXJzKSB7XG4gICAgcGFyYW1ldGVycy5tYWNPcGVuQ21kVGVtcGxhdGUgPSBwYXJhbWV0ZXJzLm1hY09wZW5DbWRUZW1wbGF0ZVxuICAgICAgICAucmVwbGFjZSgnb3BlbicsICdvcGVuIC1uJylcbiAgICAgICAgLnJlcGxhY2UoJyB7e3twYWdlVXJsfX19JywgJycpO1xuXG4gICAgcGFyYW1ldGVycy5tYWNPcGVuQ21kVGVtcGxhdGUgKz0gJyB7e3twYWdlVXJsfX19Jztcbn1cblxuZnVuY3Rpb24gYnVpbGRGaXJlZm94QXJncyAoY29uZmlnLCBwbGF0Zm9ybUFyZ3MsIHsgbWFyaW9uZXR0ZVBvcnQsIHRlbXBQcm9maWxlRGlyIH0pIHtcbiAgICByZXR1cm4gW11cbiAgICAgICAgLmNvbmNhdChcbiAgICAgICAgICAgIG1hcmlvbmV0dGVQb3J0ID8gWyctbWFyaW9uZXR0ZSddIDogW10sXG4gICAgICAgICAgICAhY29uZmlnLnVzZXJQcm9maWxlID8gWyctbm8tcmVtb3RlJywgJy1uZXctaW5zdGFuY2UnLCBgLXByb2ZpbGUgXCIke3RlbXBQcm9maWxlRGlyLnBhdGh9XCJgXSA6IFtdLFxuICAgICAgICAgICAgY29uZmlnLmhlYWRsZXNzID8gWyctaGVhZGxlc3MnXSA6IFtdLFxuICAgICAgICAgICAgY29uZmlnLnVzZXJBcmdzID8gW2NvbmZpZy51c2VyQXJnc10gOiBbXSxcbiAgICAgICAgICAgIHBsYXRmb3JtQXJncyA/IFtwbGF0Zm9ybUFyZ3NdIDogW11cbiAgICAgICAgKVxuICAgICAgICAuam9pbignICcpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnQgKHBhZ2VVcmwsIHJ1bnRpbWVJbmZvKSB7XG4gICAgY29uc3QgeyBicm93c2VyTmFtZSwgY29uZmlnIH0gPSBydW50aW1lSW5mbztcblxuICAgIGNvbnN0IGZpcmVmb3hJbmZvICAgICAgICAgICA9IGF3YWl0IGJyb3dzZXJUb29scy5nZXRCcm93c2VySW5mbyhjb25maWcucGF0aCB8fCBicm93c2VyTmFtZSk7XG4gICAgY29uc3QgZmlyZWZveE9wZW5QYXJhbWV0ZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgZmlyZWZveEluZm8pO1xuXG4gICAgaWYgKE9TLm1hYyAmJiAhY29uZmlnLnVzZXJQcm9maWxlKVxuICAgICAgICBjb3JyZWN0T3BlblBhcmFtZXRlcnNGb3JNYWMoZmlyZWZveE9wZW5QYXJhbWV0ZXJzKTtcblxuICAgIGZpcmVmb3hPcGVuUGFyYW1ldGVycy5jbWQgPSBidWlsZEZpcmVmb3hBcmdzKGNvbmZpZywgZmlyZWZveE9wZW5QYXJhbWV0ZXJzLmNtZCwgcnVudGltZUluZm8sIHJ1bnRpbWVJbmZvLm5ld0luc3RhbmNlKTtcblxuICAgIGF3YWl0IGJyb3dzZXJTdGFydGVyLnN0YXJ0QnJvd3NlcihmaXJlZm94T3BlblBhcmFtZXRlcnMsIHBhZ2VVcmwpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RvcCAoeyBicm93c2VySWQgfSkge1xuICAgIGF3YWl0IGtpbGxCcm93c2VyUHJvY2Vzcyhicm93c2VySWQpO1xufVxuIl19
