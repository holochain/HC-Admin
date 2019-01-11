'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _endpointUtils = require('endpoint-utils');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _createTempProfile = require('./create-temp-profile');

var _createTempProfile2 = _interopRequireDefault(_createTempProfile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (proxyHostName, configString) {
        const config = (0, _config2.default)(configString);
        const tempProfileDir = !config.userProfile ? yield (0, _createTempProfile2.default)(proxyHostName, config) : null;
        const cdpPort = config.cdpPort || (!config.userProfile ? yield (0, _endpointUtils.getFreePort)() : null);

        return { config, cdpPort, tempProfileDir };
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2Nocm9tZS9ydW50aW1lLWluZm8uanMiXSwibmFtZXMiOlsicHJveHlIb3N0TmFtZSIsImNvbmZpZ1N0cmluZyIsImNvbmZpZyIsInRlbXBQcm9maWxlRGlyIiwidXNlclByb2ZpbGUiLCJjZHBQb3J0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7K0NBR2UsV0FBZ0JBLGFBQWhCLEVBQStCQyxZQUEvQixFQUE2QztBQUN4RCxjQUFNQyxTQUFpQixzQkFBVUQsWUFBVixDQUF2QjtBQUNBLGNBQU1FLGlCQUFpQixDQUFDRCxPQUFPRSxXQUFSLEdBQXNCLE1BQU0saUNBQWtCSixhQUFsQixFQUFpQ0UsTUFBakMsQ0FBNUIsR0FBdUUsSUFBOUY7QUFDQSxjQUFNRyxVQUFpQkgsT0FBT0csT0FBUCxLQUFtQixDQUFDSCxPQUFPRSxXQUFSLEdBQXNCLE1BQU0saUNBQTVCLEdBQTRDLElBQS9ELENBQXZCOztBQUVBLGVBQU8sRUFBRUYsTUFBRixFQUFVRyxPQUFWLEVBQW1CRixjQUFuQixFQUFQO0FBQ0gsSyIsImZpbGUiOiJicm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2Nocm9tZS9ydW50aW1lLWluZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRGcmVlUG9ydCB9IGZyb20gJ2VuZHBvaW50LXV0aWxzJztcbmltcG9ydCBnZXRDb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IGNyZWF0ZVRlbXBQcm9maWxlIGZyb20gJy4vY3JlYXRlLXRlbXAtcHJvZmlsZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHByb3h5SG9zdE5hbWUsIGNvbmZpZ1N0cmluZykge1xuICAgIGNvbnN0IGNvbmZpZyAgICAgICAgID0gZ2V0Q29uZmlnKGNvbmZpZ1N0cmluZyk7XG4gICAgY29uc3QgdGVtcFByb2ZpbGVEaXIgPSAhY29uZmlnLnVzZXJQcm9maWxlID8gYXdhaXQgY3JlYXRlVGVtcFByb2ZpbGUocHJveHlIb3N0TmFtZSwgY29uZmlnKSA6IG51bGw7XG4gICAgY29uc3QgY2RwUG9ydCAgICAgICAgPSBjb25maWcuY2RwUG9ydCB8fCAoIWNvbmZpZy51c2VyUHJvZmlsZSA/IGF3YWl0IGdldEZyZWVQb3J0KCkgOiBudWxsKTtcblxuICAgIHJldHVybiB7IGNvbmZpZywgY2RwUG9ydCwgdGVtcFByb2ZpbGVEaXIgfTtcbn1cbiJdfQ==
