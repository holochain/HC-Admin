'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _makeDir = require('make-dir');

var _makeDir2 = _interopRequireDefault(_makeDir);

var _tempDirectory = require('../../../../utils/temp-directory');

var _tempDirectory2 = _interopRequireDefault(_tempDirectory);

var _promisifiedFunctions = require('../../../../utils/promisified-functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (proxyHostName) {
        const tempDir = yield _tempDirectory2.default.createDirectory('chrome-profile');
        const profileDirName = _path2.default.join(tempDir.path, 'Default');

        yield (0, _makeDir2.default)(profileDirName);

        const preferences = {
            'credentials_enable_service': false,

            'devtools': {
                'preferences': {
                    'currentDockState': '"undocked"',
                    'lastDockState': '"bottom"'
                }
            },

            'profile': {
                'content_settings': {
                    'exceptions': {
                        'automatic_downloads': {
                            [proxyHostName]: { setting: 1 }
                        }
                    }
                },

                'password_manager_enabled': false
            },

            'translate': {
                'enabled': false
            }
        };

        yield (0, _promisifiedFunctions.writeFile)(_path2.default.join(profileDirName, 'Preferences'), (0, _stringify2.default)(preferences));
        yield (0, _promisifiedFunctions.writeFile)(_path2.default.join(tempDir.path, 'First Run'), '');

        return tempDir;
    });

    return function (_x) {
        return _ref.apply(this, arguments);
    };
})();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2Nocm9tZS9jcmVhdGUtdGVtcC1wcm9maWxlLmpzIl0sIm5hbWVzIjpbInByb3h5SG9zdE5hbWUiLCJ0ZW1wRGlyIiwiVGVtcERpcmVjdG9yeSIsImNyZWF0ZURpcmVjdG9yeSIsInByb2ZpbGVEaXJOYW1lIiwicGF0aCIsImpvaW4iLCJwcmVmZXJlbmNlcyIsInNldHRpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7OzsrQ0FHZSxXQUFnQkEsYUFBaEIsRUFBK0I7QUFDMUMsY0FBTUMsVUFBaUIsTUFBTUMsd0JBQWNDLGVBQWQsQ0FBOEIsZ0JBQTlCLENBQTdCO0FBQ0EsY0FBTUMsaUJBQWlCQyxlQUFLQyxJQUFMLENBQVVMLFFBQVFJLElBQWxCLEVBQXdCLFNBQXhCLENBQXZCOztBQUVBLGNBQU0sdUJBQVFELGNBQVIsQ0FBTjs7QUFFQSxjQUFNRyxjQUFjO0FBQ2hCLDBDQUE4QixLQURkOztBQUdoQix3QkFBWTtBQUNSLCtCQUFlO0FBQ1gsd0NBQW9CLFlBRFQ7QUFFWCxxQ0FBb0I7QUFGVDtBQURQLGFBSEk7O0FBVWhCLHVCQUFXO0FBQ1Asb0NBQW9CO0FBQ2hCLGtDQUFjO0FBQ1YsK0NBQXVCO0FBQ25CLDZCQUFDUCxhQUFELEdBQWlCLEVBQUVRLFNBQVMsQ0FBWDtBQURFO0FBRGI7QUFERSxpQkFEYjs7QUFTUCw0Q0FBNEI7QUFUckIsYUFWSzs7QUFzQmhCLHlCQUFhO0FBQ1QsMkJBQVc7QUFERjtBQXRCRyxTQUFwQjs7QUEyQkEsY0FBTSxxQ0FBVUgsZUFBS0MsSUFBTCxDQUFVRixjQUFWLEVBQTBCLGFBQTFCLENBQVYsRUFBb0QseUJBQWVHLFdBQWYsQ0FBcEQsQ0FBTjtBQUNBLGNBQU0scUNBQVVGLGVBQUtDLElBQUwsQ0FBVUwsUUFBUUksSUFBbEIsRUFBd0IsV0FBeEIsQ0FBVixFQUFnRCxFQUFoRCxDQUFOOztBQUVBLGVBQU9KLE9BQVA7QUFDSCxLIiwiZmlsZSI6ImJyb3dzZXIvcHJvdmlkZXIvYnVpbHQtaW4vY2hyb21lL2NyZWF0ZS10ZW1wLXByb2ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBtYWtlRGlyIGZyb20gJ21ha2UtZGlyJztcbmltcG9ydCBUZW1wRGlyZWN0b3J5IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxzL3RlbXAtZGlyZWN0b3J5JztcbmltcG9ydCB7IHdyaXRlRmlsZSB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxzL3Byb21pc2lmaWVkLWZ1bmN0aW9ucyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHByb3h5SG9zdE5hbWUpIHtcbiAgICBjb25zdCB0ZW1wRGlyICAgICAgICA9IGF3YWl0IFRlbXBEaXJlY3RvcnkuY3JlYXRlRGlyZWN0b3J5KCdjaHJvbWUtcHJvZmlsZScpO1xuICAgIGNvbnN0IHByb2ZpbGVEaXJOYW1lID0gcGF0aC5qb2luKHRlbXBEaXIucGF0aCwgJ0RlZmF1bHQnKTtcblxuICAgIGF3YWl0IG1ha2VEaXIocHJvZmlsZURpck5hbWUpO1xuXG4gICAgY29uc3QgcHJlZmVyZW5jZXMgPSB7XG4gICAgICAgICdjcmVkZW50aWFsc19lbmFibGVfc2VydmljZSc6IGZhbHNlLFxuXG4gICAgICAgICdkZXZ0b29scyc6IHtcbiAgICAgICAgICAgICdwcmVmZXJlbmNlcyc6IHtcbiAgICAgICAgICAgICAgICAnY3VycmVudERvY2tTdGF0ZSc6ICdcInVuZG9ja2VkXCInLFxuICAgICAgICAgICAgICAgICdsYXN0RG9ja1N0YXRlJzogICAgJ1wiYm90dG9tXCInXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ3Byb2ZpbGUnOiB7XG4gICAgICAgICAgICAnY29udGVudF9zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgICAgICAnZXhjZXB0aW9ucyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2F1dG9tYXRpY19kb3dubG9hZHMnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbcHJveHlIb3N0TmFtZV06IHsgc2V0dGluZzogMSB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAncGFzc3dvcmRfbWFuYWdlcl9lbmFibGVkJzogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAndHJhbnNsYXRlJzoge1xuICAgICAgICAgICAgJ2VuYWJsZWQnOiBmYWxzZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGF3YWl0IHdyaXRlRmlsZShwYXRoLmpvaW4ocHJvZmlsZURpck5hbWUsICdQcmVmZXJlbmNlcycpLCBKU09OLnN0cmluZ2lmeShwcmVmZXJlbmNlcykpO1xuICAgIGF3YWl0IHdyaXRlRmlsZShwYXRoLmpvaW4odGVtcERpci5wYXRoLCAnRmlyc3QgUnVuJyksICcnKTtcblxuICAgIHJldHVybiB0ZW1wRGlyO1xufVxuIl19
