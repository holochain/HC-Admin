'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _testcafeBrowserTools = require('testcafe-browser-tools');

var _testcafeBrowserTools2 = _interopRequireDefault(_testcafeBrowserTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    isMultiBrowser: true,

    openBrowser(browserId, pageUrl, browserName) {
        return (0, _asyncToGenerator3.default)(function* () {
            const args = browserName.split(' ');
            const alias = args.shift();

            const browserInfo = yield _testcafeBrowserTools2.default.getBrowserInfo(alias);
            const openParameters = (0, _assign2.default)({}, browserInfo);

            if (args.length) openParameters.cmd = args.join(' ') + (openParameters.cmd ? ' ' + openParameters.cmd : '');

            yield _testcafeBrowserTools2.default.open(openParameters, pageUrl);
        })();
    },

    isLocalBrowser() {
        return (0, _asyncToGenerator3.default)(function* () {
            return true;
        })();
    },

    getBrowserList() {
        return (0, _asyncToGenerator3.default)(function* () {
            const installations = yield _testcafeBrowserTools2.default.getInstallations();

            return (0, _keys2.default)(installations);
        })();
    },

    isValidBrowserName(browserName) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const browserNames = yield _this.getBrowserList();

            browserName = browserName.toLowerCase().split(' ')[0];

            return browserNames.indexOf(browserName) > -1;
        })();
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2xvY2FsbHktaW5zdGFsbGVkLmpzIl0sIm5hbWVzIjpbImlzTXVsdGlCcm93c2VyIiwib3BlbkJyb3dzZXIiLCJicm93c2VySWQiLCJwYWdlVXJsIiwiYnJvd3Nlck5hbWUiLCJhcmdzIiwic3BsaXQiLCJhbGlhcyIsInNoaWZ0IiwiYnJvd3NlckluZm8iLCJicm93c2VyVG9vbHMiLCJnZXRCcm93c2VySW5mbyIsIm9wZW5QYXJhbWV0ZXJzIiwibGVuZ3RoIiwiY21kIiwiam9pbiIsIm9wZW4iLCJpc0xvY2FsQnJvd3NlciIsImdldEJyb3dzZXJMaXN0IiwiaW5zdGFsbGF0aW9ucyIsImdldEluc3RhbGxhdGlvbnMiLCJpc1ZhbGlkQnJvd3Nlck5hbWUiLCJicm93c2VyTmFtZXMiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O2tCQUdlO0FBQ1hBLG9CQUFnQixJQURMOztBQUdMQyxlQUFOLENBQW1CQyxTQUFuQixFQUE4QkMsT0FBOUIsRUFBdUNDLFdBQXZDLEVBQW9EO0FBQUE7QUFDaEQsa0JBQU1DLE9BQVFELFlBQVlFLEtBQVosQ0FBa0IsR0FBbEIsQ0FBZDtBQUNBLGtCQUFNQyxRQUFRRixLQUFLRyxLQUFMLEVBQWQ7O0FBRUEsa0JBQU1DLGNBQWlCLE1BQU1DLCtCQUFhQyxjQUFiLENBQTRCSixLQUE1QixDQUE3QjtBQUNBLGtCQUFNSyxpQkFBaUIsc0JBQWMsRUFBZCxFQUFrQkgsV0FBbEIsQ0FBdkI7O0FBRUEsZ0JBQUlKLEtBQUtRLE1BQVQsRUFDSUQsZUFBZUUsR0FBZixHQUFxQlQsS0FBS1UsSUFBTCxDQUFVLEdBQVYsS0FBa0JILGVBQWVFLEdBQWYsR0FBcUIsTUFBTUYsZUFBZUUsR0FBMUMsR0FBZ0QsRUFBbEUsQ0FBckI7O0FBRUosa0JBQU1KLCtCQUFhTSxJQUFiLENBQWtCSixjQUFsQixFQUFrQ1QsT0FBbEMsQ0FBTjtBQVZnRDtBQVduRCxLQWRVOztBQWdCTGMsa0JBQU4sR0FBd0I7QUFBQTtBQUNwQixtQkFBTyxJQUFQO0FBRG9CO0FBRXZCLEtBbEJVOztBQW9CTEMsa0JBQU4sR0FBd0I7QUFBQTtBQUNwQixrQkFBTUMsZ0JBQWdCLE1BQU1ULCtCQUFhVSxnQkFBYixFQUE1Qjs7QUFFQSxtQkFBTyxvQkFBWUQsYUFBWixDQUFQO0FBSG9CO0FBSXZCLEtBeEJVOztBQTBCTEUsc0JBQU4sQ0FBMEJqQixXQUExQixFQUF1QztBQUFBOztBQUFBO0FBQ25DLGtCQUFNa0IsZUFBZSxNQUFNLE1BQUtKLGNBQUwsRUFBM0I7O0FBRUFkLDBCQUFjQSxZQUFZbUIsV0FBWixHQUEwQmpCLEtBQTFCLENBQWdDLEdBQWhDLEVBQXFDLENBQXJDLENBQWQ7O0FBRUEsbUJBQU9nQixhQUFhRSxPQUFiLENBQXFCcEIsV0FBckIsSUFBb0MsQ0FBQyxDQUE1QztBQUxtQztBQU10QztBQWhDVSxDIiwiZmlsZSI6ImJyb3dzZXIvcHJvdmlkZXIvYnVpbHQtaW4vbG9jYWxseS1pbnN0YWxsZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYnJvd3NlclRvb2xzIGZyb20gJ3Rlc3RjYWZlLWJyb3dzZXItdG9vbHMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpc011bHRpQnJvd3NlcjogdHJ1ZSxcblxuICAgIGFzeW5jIG9wZW5Ccm93c2VyIChicm93c2VySWQsIHBhZ2VVcmwsIGJyb3dzZXJOYW1lKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgID0gYnJvd3Nlck5hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgY29uc3QgYWxpYXMgPSBhcmdzLnNoaWZ0KCk7XG5cbiAgICAgICAgY29uc3QgYnJvd3NlckluZm8gICAgPSBhd2FpdCBicm93c2VyVG9vbHMuZ2V0QnJvd3NlckluZm8oYWxpYXMpO1xuICAgICAgICBjb25zdCBvcGVuUGFyYW1ldGVycyA9IE9iamVjdC5hc3NpZ24oe30sIGJyb3dzZXJJbmZvKTtcblxuICAgICAgICBpZiAoYXJncy5sZW5ndGgpXG4gICAgICAgICAgICBvcGVuUGFyYW1ldGVycy5jbWQgPSBhcmdzLmpvaW4oJyAnKSArIChvcGVuUGFyYW1ldGVycy5jbWQgPyAnICcgKyBvcGVuUGFyYW1ldGVycy5jbWQgOiAnJyk7XG5cbiAgICAgICAgYXdhaXQgYnJvd3NlclRvb2xzLm9wZW4ob3BlblBhcmFtZXRlcnMsIHBhZ2VVcmwpO1xuICAgIH0sXG5cbiAgICBhc3luYyBpc0xvY2FsQnJvd3NlciAoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBhc3luYyBnZXRCcm93c2VyTGlzdCAoKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbGxhdGlvbnMgPSBhd2FpdCBicm93c2VyVG9vbHMuZ2V0SW5zdGFsbGF0aW9ucygpO1xuXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhpbnN0YWxsYXRpb25zKTtcbiAgICB9LFxuXG4gICAgYXN5bmMgaXNWYWxpZEJyb3dzZXJOYW1lIChicm93c2VyTmFtZSkge1xuICAgICAgICBjb25zdCBicm93c2VyTmFtZXMgPSBhd2FpdCB0aGlzLmdldEJyb3dzZXJMaXN0KCk7XG5cbiAgICAgICAgYnJvd3Nlck5hbWUgPSBicm93c2VyTmFtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcgJylbMF07XG5cbiAgICAgICAgcmV0dXJuIGJyb3dzZXJOYW1lcy5pbmRleE9mKGJyb3dzZXJOYW1lKSA+IC0xO1xuICAgIH1cbn07XG4iXX0=
