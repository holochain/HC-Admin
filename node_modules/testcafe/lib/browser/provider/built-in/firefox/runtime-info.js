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
    var _ref = (0, _asyncToGenerator3.default)(function* (configString) {
        const config = (0, _config2.default)(configString);
        const marionettePort = config.marionettePort || (!config.userProfile ? yield (0, _endpointUtils.getFreePort)() : null);
        const runtimeInfo = { config, marionettePort };

        runtimeInfo.tempProfileDir = !config.userProfile ? yield (0, _createTempProfile2.default)(runtimeInfo) : null;

        return runtimeInfo;
    });

    return function (_x) {
        return _ref.apply(this, arguments);
    };
})();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2ZpcmVmb3gvcnVudGltZS1pbmZvLmpzIl0sIm5hbWVzIjpbImNvbmZpZ1N0cmluZyIsImNvbmZpZyIsIm1hcmlvbmV0dGVQb3J0IiwidXNlclByb2ZpbGUiLCJydW50aW1lSW5mbyIsInRlbXBQcm9maWxlRGlyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7K0NBR2UsV0FBZ0JBLFlBQWhCLEVBQThCO0FBQ3pDLGNBQU1DLFNBQWlCLHNCQUFVRCxZQUFWLENBQXZCO0FBQ0EsY0FBTUUsaUJBQWlCRCxPQUFPQyxjQUFQLEtBQTBCLENBQUNELE9BQU9FLFdBQVIsR0FBc0IsTUFBTSxpQ0FBNUIsR0FBNEMsSUFBdEUsQ0FBdkI7QUFDQSxjQUFNQyxjQUFpQixFQUFFSCxNQUFGLEVBQVVDLGNBQVYsRUFBdkI7O0FBRUFFLG9CQUFZQyxjQUFaLEdBQTZCLENBQUNKLE9BQU9FLFdBQVIsR0FBc0IsTUFBTSxpQ0FBa0JDLFdBQWxCLENBQTVCLEdBQTZELElBQTFGOztBQUVBLGVBQU9BLFdBQVA7QUFDSCxLIiwiZmlsZSI6ImJyb3dzZXIvcHJvdmlkZXIvYnVpbHQtaW4vZmlyZWZveC9ydW50aW1lLWluZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRGcmVlUG9ydCB9IGZyb20gJ2VuZHBvaW50LXV0aWxzJztcbmltcG9ydCBnZXRDb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IGNyZWF0ZVRlbXBQcm9maWxlIGZyb20gJy4vY3JlYXRlLXRlbXAtcHJvZmlsZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKGNvbmZpZ1N0cmluZykge1xuICAgIGNvbnN0IGNvbmZpZyAgICAgICAgID0gZ2V0Q29uZmlnKGNvbmZpZ1N0cmluZyk7XG4gICAgY29uc3QgbWFyaW9uZXR0ZVBvcnQgPSBjb25maWcubWFyaW9uZXR0ZVBvcnQgfHwgKCFjb25maWcudXNlclByb2ZpbGUgPyBhd2FpdCBnZXRGcmVlUG9ydCgpIDogbnVsbCk7XG4gICAgY29uc3QgcnVudGltZUluZm8gICAgPSB7IGNvbmZpZywgbWFyaW9uZXR0ZVBvcnQgfTtcblxuICAgIHJ1bnRpbWVJbmZvLnRlbXBQcm9maWxlRGlyID0gIWNvbmZpZy51c2VyUHJvZmlsZSA/IGF3YWl0IGNyZWF0ZVRlbXBQcm9maWxlKHJ1bnRpbWVJbmZvKSA6IG51bGw7XG5cbiAgICByZXR1cm4gcnVudGltZUluZm87XG59XG4iXX0=
