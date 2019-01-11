'use strict';

exports.__esModule = true;
exports.stop = exports.start = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let start = exports.start = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (pageUrl, { browserName, config, cdpPort, tempProfileDir }) {
        const chromeInfo = yield _testcafeBrowserTools2.default.getBrowserInfo(config.path || browserName);
        const chromeOpenParameters = (0, _assign2.default)({}, chromeInfo);

        chromeOpenParameters.cmd = buildChromeArgs(config, cdpPort, chromeOpenParameters.cmd, tempProfileDir);

        yield browserStarter.startBrowser(chromeOpenParameters, pageUrl);
    });

    return function start(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

let stop = exports.stop = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* ({ browserId }) {
        // NOTE: Chrome on Linux closes only after the second SIGTERM signall
        if (!(yield (0, _process.killBrowserProcess)(browserId))) yield (0, _process.killBrowserProcess)(browserId);
    });

    return function stop(_x3) {
        return _ref2.apply(this, arguments);
    };
})();

var _testcafeBrowserTools = require('testcafe-browser-tools');

var _testcafeBrowserTools2 = _interopRequireDefault(_testcafeBrowserTools);

var _process = require('../../../../utils/process');

var _browserStarter = require('../../utils/browser-starter');

var _browserStarter2 = _interopRequireDefault(_browserStarter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const browserStarter = new _browserStarter2.default();

function buildChromeArgs(config, cdpPort, platformArgs, profileDir) {
    return [].concat(cdpPort ? [`--remote-debugging-port=${cdpPort}`] : [], !config.userProfile ? [`--user-data-dir=${profileDir.path}`] : [], config.headless ? ['--headless'] : [], config.userArgs ? [config.userArgs] : [], platformArgs ? [platformArgs] : []).join(' ');
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2Nocm9tZS9sb2NhbC1jaHJvbWUuanMiXSwibmFtZXMiOlsicGFnZVVybCIsImJyb3dzZXJOYW1lIiwiY29uZmlnIiwiY2RwUG9ydCIsInRlbXBQcm9maWxlRGlyIiwiY2hyb21lSW5mbyIsImJyb3dzZXJUb29scyIsImdldEJyb3dzZXJJbmZvIiwicGF0aCIsImNocm9tZU9wZW5QYXJhbWV0ZXJzIiwiY21kIiwiYnVpbGRDaHJvbWVBcmdzIiwiYnJvd3NlclN0YXJ0ZXIiLCJzdGFydEJyb3dzZXIiLCJzdGFydCIsImJyb3dzZXJJZCIsInN0b3AiLCJCcm93c2VyU3RhcnRlciIsInBsYXRmb3JtQXJncyIsInByb2ZpbGVEaXIiLCJjb25jYXQiLCJ1c2VyUHJvZmlsZSIsImhlYWRsZXNzIiwidXNlckFyZ3MiLCJqb2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OzsrQ0FtQk8sV0FBc0JBLE9BQXRCLEVBQStCLEVBQUVDLFdBQUYsRUFBZUMsTUFBZixFQUF1QkMsT0FBdkIsRUFBZ0NDLGNBQWhDLEVBQS9CLEVBQWlGO0FBQ3BGLGNBQU1DLGFBQXVCLE1BQU1DLCtCQUFhQyxjQUFiLENBQTRCTCxPQUFPTSxJQUFQLElBQWVQLFdBQTNDLENBQW5DO0FBQ0EsY0FBTVEsdUJBQXVCLHNCQUFjLEVBQWQsRUFBa0JKLFVBQWxCLENBQTdCOztBQUVBSSw2QkFBcUJDLEdBQXJCLEdBQTJCQyxnQkFBZ0JULE1BQWhCLEVBQXdCQyxPQUF4QixFQUFpQ00scUJBQXFCQyxHQUF0RCxFQUEyRE4sY0FBM0QsQ0FBM0I7O0FBRUEsY0FBTVEsZUFBZUMsWUFBZixDQUE0Qkosb0JBQTVCLEVBQWtEVCxPQUFsRCxDQUFOO0FBQ0gsSzs7b0JBUHFCYyxLOzs7Ozs7Z0RBU2YsV0FBcUIsRUFBRUMsU0FBRixFQUFyQixFQUFvQztBQUN2QztBQUNBLFlBQUksRUFBQyxNQUFNLGlDQUFtQkEsU0FBbkIsQ0FBUCxDQUFKLEVBQ0ksTUFBTSxpQ0FBbUJBLFNBQW5CLENBQU47QUFDUCxLOztvQkFKcUJDLEk7Ozs7O0FBNUJ0Qjs7OztBQUNBOztBQUNBOzs7Ozs7QUFHQSxNQUFNSixpQkFBaUIsSUFBSUssd0JBQUosRUFBdkI7O0FBRUEsU0FBU04sZUFBVCxDQUEwQlQsTUFBMUIsRUFBa0NDLE9BQWxDLEVBQTJDZSxZQUEzQyxFQUF5REMsVUFBekQsRUFBcUU7QUFDakUsV0FBTyxHQUNGQyxNQURFLENBRUNqQixVQUFVLENBQUUsMkJBQTBCQSxPQUFRLEVBQXBDLENBQVYsR0FBbUQsRUFGcEQsRUFHQyxDQUFDRCxPQUFPbUIsV0FBUixHQUFzQixDQUFFLG1CQUFrQkYsV0FBV1gsSUFBSyxFQUFwQyxDQUF0QixHQUErRCxFQUhoRSxFQUlDTixPQUFPb0IsUUFBUCxHQUFrQixDQUFDLFlBQUQsQ0FBbEIsR0FBbUMsRUFKcEMsRUFLQ3BCLE9BQU9xQixRQUFQLEdBQWtCLENBQUNyQixPQUFPcUIsUUFBUixDQUFsQixHQUFzQyxFQUx2QyxFQU1DTCxlQUFlLENBQUNBLFlBQUQsQ0FBZixHQUFnQyxFQU5qQyxFQVFGTSxJQVJFLENBUUcsR0FSSCxDQUFQO0FBU0giLCJmaWxlIjoiYnJvd3Nlci9wcm92aWRlci9idWlsdC1pbi9jaHJvbWUvbG9jYWwtY2hyb21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJyb3dzZXJUb29scyBmcm9tICd0ZXN0Y2FmZS1icm93c2VyLXRvb2xzJztcbmltcG9ydCB7IGtpbGxCcm93c2VyUHJvY2VzcyB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxzL3Byb2Nlc3MnO1xuaW1wb3J0IEJyb3dzZXJTdGFydGVyIGZyb20gJy4uLy4uL3V0aWxzL2Jyb3dzZXItc3RhcnRlcic7XG5cblxuY29uc3QgYnJvd3NlclN0YXJ0ZXIgPSBuZXcgQnJvd3NlclN0YXJ0ZXIoKTtcblxuZnVuY3Rpb24gYnVpbGRDaHJvbWVBcmdzIChjb25maWcsIGNkcFBvcnQsIHBsYXRmb3JtQXJncywgcHJvZmlsZURpcikge1xuICAgIHJldHVybiBbXVxuICAgICAgICAuY29uY2F0KFxuICAgICAgICAgICAgY2RwUG9ydCA/IFtgLS1yZW1vdGUtZGVidWdnaW5nLXBvcnQ9JHtjZHBQb3J0fWBdIDogW10sXG4gICAgICAgICAgICAhY29uZmlnLnVzZXJQcm9maWxlID8gW2AtLXVzZXItZGF0YS1kaXI9JHtwcm9maWxlRGlyLnBhdGh9YF0gOiBbXSxcbiAgICAgICAgICAgIGNvbmZpZy5oZWFkbGVzcyA/IFsnLS1oZWFkbGVzcyddIDogW10sXG4gICAgICAgICAgICBjb25maWcudXNlckFyZ3MgPyBbY29uZmlnLnVzZXJBcmdzXSA6IFtdLFxuICAgICAgICAgICAgcGxhdGZvcm1BcmdzID8gW3BsYXRmb3JtQXJnc10gOiBbXVxuICAgICAgICApXG4gICAgICAgIC5qb2luKCcgJyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdGFydCAocGFnZVVybCwgeyBicm93c2VyTmFtZSwgY29uZmlnLCBjZHBQb3J0LCB0ZW1wUHJvZmlsZURpciB9KSB7XG4gICAgY29uc3QgY2hyb21lSW5mbyAgICAgICAgICAgPSBhd2FpdCBicm93c2VyVG9vbHMuZ2V0QnJvd3NlckluZm8oY29uZmlnLnBhdGggfHwgYnJvd3Nlck5hbWUpO1xuICAgIGNvbnN0IGNocm9tZU9wZW5QYXJhbWV0ZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgY2hyb21lSW5mbyk7XG5cbiAgICBjaHJvbWVPcGVuUGFyYW1ldGVycy5jbWQgPSBidWlsZENocm9tZUFyZ3MoY29uZmlnLCBjZHBQb3J0LCBjaHJvbWVPcGVuUGFyYW1ldGVycy5jbWQsIHRlbXBQcm9maWxlRGlyKTtcblxuICAgIGF3YWl0IGJyb3dzZXJTdGFydGVyLnN0YXJ0QnJvd3NlcihjaHJvbWVPcGVuUGFyYW1ldGVycywgcGFnZVVybCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzdG9wICh7IGJyb3dzZXJJZCB9KSB7XG4gICAgLy8gTk9URTogQ2hyb21lIG9uIExpbnV4IGNsb3NlcyBvbmx5IGFmdGVyIHRoZSBzZWNvbmQgU0lHVEVSTSBzaWduYWxsXG4gICAgaWYgKCFhd2FpdCBraWxsQnJvd3NlclByb2Nlc3MoYnJvd3NlcklkKSlcbiAgICAgICAgYXdhaXQga2lsbEJyb3dzZXJQcm9jZXNzKGJyb3dzZXJJZCk7XG59XG4iXX0=
