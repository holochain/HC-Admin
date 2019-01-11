'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _locallyInstalled = require('./locally-installed');

var _locallyInstalled2 = _interopRequireDefault(_locallyInstalled);

var _remote = require('./remote');

var _remote2 = _interopRequireDefault(_remote);

var _firefox = require('./firefox');

var _firefox2 = _interopRequireDefault(_firefox);

var _chrome = require('./chrome');

var _chrome2 = _interopRequireDefault(_chrome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _assign2.default)({
    'locally-installed': _locallyInstalled2.default,
    'path': _path2.default,
    'remote': _remote2.default,
    'firefox': _firefox2.default,
    'chrome': _chrome2.default,
    'chromium': _chrome2.default,
    'chrome-canary': _chrome2.default
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2luZGV4LmpzIl0sIm5hbWVzIjpbImxvY2FsbHlJbnN0YWxsZWRCcm93c2VyUHJvdmlkZXIiLCJwYXRoQnJvd3NlclByb3ZpZGVyIiwicmVtb3RlQnJvd3NlclByb3ZpZGVyIiwiZmlyZWZveFByb3ZpZGVyIiwiY2hyb21lUHJvdmlkZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O2tCQUVlLHNCQUNYO0FBQ0kseUJBQXFCQSwwQkFEekI7QUFFSSxZQUFxQkMsY0FGekI7QUFHSSxjQUFxQkMsZ0JBSHpCO0FBSUksZUFBcUJDLGlCQUp6QjtBQUtJLGNBQXFCQyxnQkFMekI7QUFNSSxnQkFBcUJBLGdCQU56QjtBQU9JLHFCQUFxQkE7QUFQekIsQ0FEVyxDIiwiZmlsZSI6ImJyb3dzZXIvcHJvdmlkZXIvYnVpbHQtaW4vaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aEJyb3dzZXJQcm92aWRlciBmcm9tICcuL3BhdGgnO1xuaW1wb3J0IGxvY2FsbHlJbnN0YWxsZWRCcm93c2VyUHJvdmlkZXIgZnJvbSAnLi9sb2NhbGx5LWluc3RhbGxlZCc7XG5pbXBvcnQgcmVtb3RlQnJvd3NlclByb3ZpZGVyIGZyb20gJy4vcmVtb3RlJztcbmltcG9ydCBmaXJlZm94UHJvdmlkZXIgZnJvbSAnLi9maXJlZm94JztcbmltcG9ydCBjaHJvbWVQcm92aWRlciBmcm9tICcuL2Nocm9tZSc7XG5cbmV4cG9ydCBkZWZhdWx0IE9iamVjdC5hc3NpZ24oXG4gICAge1xuICAgICAgICAnbG9jYWxseS1pbnN0YWxsZWQnOiBsb2NhbGx5SW5zdGFsbGVkQnJvd3NlclByb3ZpZGVyLFxuICAgICAgICAncGF0aCc6ICAgICAgICAgICAgICBwYXRoQnJvd3NlclByb3ZpZGVyLFxuICAgICAgICAncmVtb3RlJzogICAgICAgICAgICByZW1vdGVCcm93c2VyUHJvdmlkZXIsXG4gICAgICAgICdmaXJlZm94JzogICAgICAgICAgIGZpcmVmb3hQcm92aWRlcixcbiAgICAgICAgJ2Nocm9tZSc6ICAgICAgICAgICAgY2hyb21lUHJvdmlkZXIsXG4gICAgICAgICdjaHJvbWl1bSc6ICAgICAgICAgIGNocm9tZVByb3ZpZGVyLFxuICAgICAgICAnY2hyb21lLWNhbmFyeSc6ICAgICBjaHJvbWVQcm92aWRlclxuICAgIH1cbik7XG4iXX0=
