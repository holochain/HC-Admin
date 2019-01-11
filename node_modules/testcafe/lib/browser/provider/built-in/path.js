'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _testcafeBrowserTools = require('testcafe-browser-tools');

var _testcafeBrowserTools2 = _interopRequireDefault(_testcafeBrowserTools);

var _string = require('../../../utils/string');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    isMultiBrowser: true,

    _handleString(str) {
        return (0, _asyncToGenerator3.default)(function* () {
            const args = (0, _string.splitQuotedText)(str, ' ', '`"\'');
            const path = args.shift();

            const browserInfo = yield _testcafeBrowserTools2.default.getBrowserInfo(path);

            if (!browserInfo) return null;

            const params = (0, _assign2.default)({}, browserInfo);

            if (args.length) params.cmd = args.join(' ') + (params.cmd ? ' ' + params.cmd : '');

            return params;
        })();
    },

    _handleJSON(str) {
        return (0, _asyncToGenerator3.default)(function* () {
            let params = null;

            try {
                params = JSON.parse(str);
            } catch (e) {
                return null;
            }

            if (!params.path) return null;

            const openParameters = yield _testcafeBrowserTools2.default.getBrowserInfo(params.path);

            if (!openParameters) return null;

            if (params.cmd) openParameters.cmd = params.cmd;

            return openParameters;
        })();
    },

    openBrowser(browserId, pageUrl, browserName) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const openParameters = (yield _this._handleString(browserName)) || (yield _this._handleJSON(browserName));

            if (!openParameters) throw new Error('The specified browser name is not valid!');

            yield _testcafeBrowserTools2.default.open(openParameters, pageUrl);
        })();
    },

    isLocalBrowser() {
        return (0, _asyncToGenerator3.default)(function* () {
            return true;
        })();
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL3BhdGguanMiXSwibmFtZXMiOlsiaXNNdWx0aUJyb3dzZXIiLCJfaGFuZGxlU3RyaW5nIiwic3RyIiwiYXJncyIsInBhdGgiLCJzaGlmdCIsImJyb3dzZXJJbmZvIiwiYnJvd3NlclRvb2xzIiwiZ2V0QnJvd3NlckluZm8iLCJwYXJhbXMiLCJsZW5ndGgiLCJjbWQiLCJqb2luIiwiX2hhbmRsZUpTT04iLCJKU09OIiwicGFyc2UiLCJlIiwib3BlblBhcmFtZXRlcnMiLCJvcGVuQnJvd3NlciIsImJyb3dzZXJJZCIsInBhZ2VVcmwiLCJicm93c2VyTmFtZSIsIkVycm9yIiwib3BlbiIsImlzTG9jYWxCcm93c2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O2tCQUVlO0FBQ1hBLG9CQUFnQixJQURMOztBQUdMQyxpQkFBTixDQUFxQkMsR0FBckIsRUFBMEI7QUFBQTtBQUN0QixrQkFBTUMsT0FBTyw2QkFBZ0JELEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLE1BQTFCLENBQWI7QUFDQSxrQkFBTUUsT0FBT0QsS0FBS0UsS0FBTCxFQUFiOztBQUVBLGtCQUFNQyxjQUFjLE1BQU1DLCtCQUFhQyxjQUFiLENBQTRCSixJQUE1QixDQUExQjs7QUFFQSxnQkFBSSxDQUFDRSxXQUFMLEVBQ0ksT0FBTyxJQUFQOztBQUVKLGtCQUFNRyxTQUFTLHNCQUFjLEVBQWQsRUFBa0JILFdBQWxCLENBQWY7O0FBRUEsZ0JBQUlILEtBQUtPLE1BQVQsRUFDSUQsT0FBT0UsR0FBUCxHQUFhUixLQUFLUyxJQUFMLENBQVUsR0FBVixLQUFrQkgsT0FBT0UsR0FBUCxHQUFhLE1BQU1GLE9BQU9FLEdBQTFCLEdBQWdDLEVBQWxELENBQWI7O0FBRUosbUJBQU9GLE1BQVA7QUFkc0I7QUFlekIsS0FsQlU7O0FBb0JMSSxlQUFOLENBQW1CWCxHQUFuQixFQUF3QjtBQUFBO0FBQ3BCLGdCQUFJTyxTQUFTLElBQWI7O0FBRUEsZ0JBQUk7QUFDQUEseUJBQVNLLEtBQUtDLEtBQUwsQ0FBV2IsR0FBWCxDQUFUO0FBQ0gsYUFGRCxDQUdBLE9BQU9jLENBQVAsRUFBVTtBQUNOLHVCQUFPLElBQVA7QUFDSDs7QUFFRCxnQkFBSSxDQUFDUCxPQUFPTCxJQUFaLEVBQ0ksT0FBTyxJQUFQOztBQUVKLGtCQUFNYSxpQkFBaUIsTUFBTVYsK0JBQWFDLGNBQWIsQ0FBNEJDLE9BQU9MLElBQW5DLENBQTdCOztBQUVBLGdCQUFJLENBQUNhLGNBQUwsRUFDSSxPQUFPLElBQVA7O0FBRUosZ0JBQUlSLE9BQU9FLEdBQVgsRUFDSU0sZUFBZU4sR0FBZixHQUFxQkYsT0FBT0UsR0FBNUI7O0FBRUosbUJBQU9NLGNBQVA7QUFyQm9CO0FBc0J2QixLQTFDVTs7QUE0Q0xDLGVBQU4sQ0FBbUJDLFNBQW5CLEVBQThCQyxPQUE5QixFQUF1Q0MsV0FBdkMsRUFBb0Q7QUFBQTs7QUFBQTtBQUNoRCxrQkFBTUosaUJBQWlCLE9BQU0sTUFBS2hCLGFBQUwsQ0FBbUJvQixXQUFuQixDQUFOLE1BQXlDLE1BQU0sTUFBS1IsV0FBTCxDQUFpQlEsV0FBakIsQ0FBL0MsQ0FBdkI7O0FBRUEsZ0JBQUksQ0FBQ0osY0FBTCxFQUNJLE1BQU0sSUFBSUssS0FBSixDQUFVLDBDQUFWLENBQU47O0FBRUosa0JBQU1mLCtCQUFhZ0IsSUFBYixDQUFrQk4sY0FBbEIsRUFBa0NHLE9BQWxDLENBQU47QUFOZ0Q7QUFPbkQsS0FuRFU7O0FBcURMSSxrQkFBTixHQUF3QjtBQUFBO0FBQ3BCLG1CQUFPLElBQVA7QUFEb0I7QUFFdkI7QUF2RFUsQyIsImZpbGUiOiJicm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL3BhdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYnJvd3NlclRvb2xzIGZyb20gJ3Rlc3RjYWZlLWJyb3dzZXItdG9vbHMnO1xuaW1wb3J0IHsgc3BsaXRRdW90ZWRUZXh0IH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvc3RyaW5nJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGlzTXVsdGlCcm93c2VyOiB0cnVlLFxuXG4gICAgYXN5bmMgX2hhbmRsZVN0cmluZyAoc3RyKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBzcGxpdFF1b3RlZFRleHQoc3RyLCAnICcsICdgXCJcXCcnKTtcbiAgICAgICAgY29uc3QgcGF0aCA9IGFyZ3Muc2hpZnQoKTtcblxuICAgICAgICBjb25zdCBicm93c2VySW5mbyA9IGF3YWl0IGJyb3dzZXJUb29scy5nZXRCcm93c2VySW5mbyhwYXRoKTtcblxuICAgICAgICBpZiAoIWJyb3dzZXJJbmZvKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgYnJvd3NlckluZm8pO1xuXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aClcbiAgICAgICAgICAgIHBhcmFtcy5jbWQgPSBhcmdzLmpvaW4oJyAnKSArIChwYXJhbXMuY21kID8gJyAnICsgcGFyYW1zLmNtZCA6ICcnKTtcblxuICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH0sXG5cbiAgICBhc3luYyBfaGFuZGxlSlNPTiAoc3RyKSB7XG4gICAgICAgIGxldCBwYXJhbXMgPSBudWxsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBKU09OLnBhcnNlKHN0cik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFwYXJhbXMucGF0aClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IG9wZW5QYXJhbWV0ZXJzID0gYXdhaXQgYnJvd3NlclRvb2xzLmdldEJyb3dzZXJJbmZvKHBhcmFtcy5wYXRoKTtcblxuICAgICAgICBpZiAoIW9wZW5QYXJhbWV0ZXJzKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgaWYgKHBhcmFtcy5jbWQpXG4gICAgICAgICAgICBvcGVuUGFyYW1ldGVycy5jbWQgPSBwYXJhbXMuY21kO1xuXG4gICAgICAgIHJldHVybiBvcGVuUGFyYW1ldGVycztcbiAgICB9LFxuXG4gICAgYXN5bmMgb3BlbkJyb3dzZXIgKGJyb3dzZXJJZCwgcGFnZVVybCwgYnJvd3Nlck5hbWUpIHtcbiAgICAgICAgY29uc3Qgb3BlblBhcmFtZXRlcnMgPSBhd2FpdCB0aGlzLl9oYW5kbGVTdHJpbmcoYnJvd3Nlck5hbWUpIHx8IGF3YWl0IHRoaXMuX2hhbmRsZUpTT04oYnJvd3Nlck5hbWUpO1xuXG4gICAgICAgIGlmICghb3BlblBhcmFtZXRlcnMpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzcGVjaWZpZWQgYnJvd3NlciBuYW1lIGlzIG5vdCB2YWxpZCEnKTtcblxuICAgICAgICBhd2FpdCBicm93c2VyVG9vbHMub3BlbihvcGVuUGFyYW1ldGVycywgcGFnZVVybCk7XG4gICAgfSxcblxuICAgIGFzeW5jIGlzTG9jYWxCcm93c2VyICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufTtcbiJdfQ==
