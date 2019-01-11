'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let generatePreferences = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (profileDir, { marionettePort, config }) {
        const prefsFileName = _path2.default.join(profileDir, 'user.js');

        let prefs = ['user_pref("browser.link.open_newwindow.override.external", 2);', 'user_pref("app.update.enabled", false);', 'user_pref("app.update.auto", false);', 'user_pref("app.update.mode", 0);', 'user_pref("app.update.service.enabled", false);', 'user_pref("browser.shell.checkDefaultBrowser", false);', 'user_pref("browser.usedOnWindows10", true);', 'user_pref("browser.rights.3.shown", true);', 'user_pref("browser.startup.homepage_override.mstone","ignore");', 'user_pref("browser.tabs.warnOnCloseOtherTabs", false);', 'user_pref("browser.tabs.warnOnClose", false);', 'user_pref("browser.sessionstore.resume_from_crash", false);', 'user_pref("toolkit.telemetry.reportingpolicy.firstRun", false);', 'user_pref("toolkit.telemetry.enabled", false);', 'user_pref("toolkit.telemetry.rejected", true);', 'user_pref("datareporting.healthreport.uploadEnabled", false);', 'user_pref("datareporting.healthreport.service.enabled", false);', 'user_pref("datareporting.healthreport.service.firstRun", false);', 'user_pref("datareporting.policy.dataSubmissionEnabled", false);', 'user_pref("datareporting.policy.dataSubmissionPolicyBypassNotification", true);', 'user_pref("app.shield.optoutstudies.enabled", false);', 'user_pref("extensions.shield-recipe-client.enabled", false);', 'user_pref("extensions.shield-recipe-client.first_run", false);', 'user_pref("extensions.shield-recipe-client.startupExperimentPrefs.browser.newtabpage.activity-stream.enabled", false);', 'user_pref("devtools.toolbox.host", "window");', 'user_pref("devtools.toolbox.previousHost", "bottom");', 'user_pref("signon.rememberSignons", false);'];

        if (marionettePort) {
            prefs = prefs.concat([`user_pref("marionette.port", ${marionettePort});`, 'user_pref("marionette.enabled", true);']);
        }

        if (config.disableMultiprocessing) {
            prefs = prefs.concat(['user_pref("browser.tabs.remote.autostart", false);', 'user_pref("browser.tabs.remote.autostart.2", false);']);
        }

        yield (0, _promisifiedFunctions.writeFile)(prefsFileName, prefs.join('\n'));
    });

    return function generatePreferences(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tempDirectory = require('../../../../utils/temp-directory');

var _tempDirectory2 = _interopRequireDefault(_tempDirectory);

var _promisifiedFunctions = require('../../../../utils/promisified-functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (runtimeInfo) {
        const tmpDir = yield _tempDirectory2.default.createDirectory('firefox-profile');

        yield generatePreferences(tmpDir.path, runtimeInfo);

        return tmpDir;
    });

    return function (_x3) {
        return _ref2.apply(this, arguments);
    };
})();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2ZpcmVmb3gvY3JlYXRlLXRlbXAtcHJvZmlsZS5qcyJdLCJuYW1lcyI6WyJwcm9maWxlRGlyIiwibWFyaW9uZXR0ZVBvcnQiLCJjb25maWciLCJwcmVmc0ZpbGVOYW1lIiwicGF0aCIsImpvaW4iLCJwcmVmcyIsImNvbmNhdCIsImRpc2FibGVNdWx0aXByb2Nlc3NpbmciLCJnZW5lcmF0ZVByZWZlcmVuY2VzIiwicnVudGltZUluZm8iLCJ0bXBEaXIiLCJUZW1wRGlyZWN0b3J5IiwiY3JlYXRlRGlyZWN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7K0NBS0EsV0FBb0NBLFVBQXBDLEVBQWdELEVBQUVDLGNBQUYsRUFBa0JDLE1BQWxCLEVBQWhELEVBQTRFO0FBQ3hFLGNBQU1DLGdCQUFnQkMsZUFBS0MsSUFBTCxDQUFVTCxVQUFWLEVBQXNCLFNBQXRCLENBQXRCOztBQUVBLFlBQUlNLFFBQVEsQ0FDUixnRUFEUSxFQUVSLHlDQUZRLEVBR1Isc0NBSFEsRUFJUixrQ0FKUSxFQUtSLGlEQUxRLEVBTVIsd0RBTlEsRUFPUiw2Q0FQUSxFQVFSLDRDQVJRLEVBU1IsaUVBVFEsRUFVUix3REFWUSxFQVdSLCtDQVhRLEVBWVIsNkRBWlEsRUFhUixpRUFiUSxFQWNSLGdEQWRRLEVBZVIsZ0RBZlEsRUFnQlIsK0RBaEJRLEVBaUJSLGlFQWpCUSxFQWtCUixrRUFsQlEsRUFtQlIsaUVBbkJRLEVBb0JSLGlGQXBCUSxFQXFCUix1REFyQlEsRUFzQlIsOERBdEJRLEVBdUJSLGdFQXZCUSxFQXdCUix3SEF4QlEsRUF5QlIsK0NBekJRLEVBMEJSLHVEQTFCUSxFQTJCUiw2Q0EzQlEsQ0FBWjs7QUE4QkEsWUFBSUwsY0FBSixFQUFvQjtBQUNoQkssb0JBQVFBLE1BQU1DLE1BQU4sQ0FBYSxDQUNoQixnQ0FBK0JOLGNBQWUsSUFEOUIsRUFFakIsd0NBRmlCLENBQWIsQ0FBUjtBQUlIOztBQUVELFlBQUlDLE9BQU9NLHNCQUFYLEVBQW1DO0FBQy9CRixvQkFBUUEsTUFBTUMsTUFBTixDQUFhLENBQ2pCLG9EQURpQixFQUVqQixzREFGaUIsQ0FBYixDQUFSO0FBSUg7O0FBRUQsY0FBTSxxQ0FBVUosYUFBVixFQUF5QkcsTUFBTUQsSUFBTixDQUFXLElBQVgsQ0FBekIsQ0FBTjtBQUNILEs7O29CQWhEY0ksbUI7Ozs7O0FBTGY7Ozs7QUFDQTs7OztBQUNBOzs7OztnREFxRGUsV0FBZ0JDLFdBQWhCLEVBQTZCO0FBQ3hDLGNBQU1DLFNBQVMsTUFBTUMsd0JBQWNDLGVBQWQsQ0FBOEIsaUJBQTlCLENBQXJCOztBQUVBLGNBQU1KLG9CQUFvQkUsT0FBT1AsSUFBM0IsRUFBaUNNLFdBQWpDLENBQU47O0FBRUEsZUFBT0MsTUFBUDtBQUNILEsiLCJmaWxlIjoiYnJvd3Nlci9wcm92aWRlci9idWlsdC1pbi9maXJlZm94L2NyZWF0ZS10ZW1wLXByb2ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBUZW1wRGlyZWN0b3J5IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxzL3RlbXAtZGlyZWN0b3J5JztcbmltcG9ydCB7IHdyaXRlRmlsZSB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxzL3Byb21pc2lmaWVkLWZ1bmN0aW9ucyc7XG5cblxuYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVQcmVmZXJlbmNlcyAocHJvZmlsZURpciwgeyBtYXJpb25ldHRlUG9ydCwgY29uZmlnIH0pIHtcbiAgICBjb25zdCBwcmVmc0ZpbGVOYW1lID0gcGF0aC5qb2luKHByb2ZpbGVEaXIsICd1c2VyLmpzJyk7XG5cbiAgICBsZXQgcHJlZnMgPSBbXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLmxpbmsub3Blbl9uZXd3aW5kb3cub3ZlcnJpZGUuZXh0ZXJuYWxcIiwgMik7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImFwcC51cGRhdGUuZW5hYmxlZFwiLCBmYWxzZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImFwcC51cGRhdGUuYXV0b1wiLCBmYWxzZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImFwcC51cGRhdGUubW9kZVwiLCAwKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiYXBwLnVwZGF0ZS5zZXJ2aWNlLmVuYWJsZWRcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnNoZWxsLmNoZWNrRGVmYXVsdEJyb3dzZXJcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnVzZWRPbldpbmRvd3MxMFwiLCB0cnVlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiYnJvd3Nlci5yaWdodHMuMy5zaG93blwiLCB0cnVlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiYnJvd3Nlci5zdGFydHVwLmhvbWVwYWdlX292ZXJyaWRlLm1zdG9uZVwiLFwiaWdub3JlXCIpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnRhYnMud2Fybk9uQ2xvc2VPdGhlclRhYnNcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnRhYnMud2Fybk9uQ2xvc2VcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJicm93c2VyLnNlc3Npb25zdG9yZS5yZXN1bWVfZnJvbV9jcmFzaFwiLCBmYWxzZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcInRvb2xraXQudGVsZW1ldHJ5LnJlcG9ydGluZ3BvbGljeS5maXJzdFJ1blwiLCBmYWxzZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcInRvb2xraXQudGVsZW1ldHJ5LmVuYWJsZWRcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJ0b29sa2l0LnRlbGVtZXRyeS5yZWplY3RlZFwiLCB0cnVlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiZGF0YXJlcG9ydGluZy5oZWFsdGhyZXBvcnQudXBsb2FkRW5hYmxlZFwiLCBmYWxzZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImRhdGFyZXBvcnRpbmcuaGVhbHRocmVwb3J0LnNlcnZpY2UuZW5hYmxlZFwiLCBmYWxzZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImRhdGFyZXBvcnRpbmcuaGVhbHRocmVwb3J0LnNlcnZpY2UuZmlyc3RSdW5cIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJkYXRhcmVwb3J0aW5nLnBvbGljeS5kYXRhU3VibWlzc2lvbkVuYWJsZWRcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJkYXRhcmVwb3J0aW5nLnBvbGljeS5kYXRhU3VibWlzc2lvblBvbGljeUJ5cGFzc05vdGlmaWNhdGlvblwiLCB0cnVlKTsnLFxuICAgICAgICAndXNlcl9wcmVmKFwiYXBwLnNoaWVsZC5vcHRvdXRzdHVkaWVzLmVuYWJsZWRcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJleHRlbnNpb25zLnNoaWVsZC1yZWNpcGUtY2xpZW50LmVuYWJsZWRcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJleHRlbnNpb25zLnNoaWVsZC1yZWNpcGUtY2xpZW50LmZpcnN0X3J1blwiLCBmYWxzZSk7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImV4dGVuc2lvbnMuc2hpZWxkLXJlY2lwZS1jbGllbnQuc3RhcnR1cEV4cGVyaW1lbnRQcmVmcy5icm93c2VyLm5ld3RhYnBhZ2UuYWN0aXZpdHktc3RyZWFtLmVuYWJsZWRcIiwgZmFsc2UpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJkZXZ0b29scy50b29sYm94Lmhvc3RcIiwgXCJ3aW5kb3dcIik7JyxcbiAgICAgICAgJ3VzZXJfcHJlZihcImRldnRvb2xzLnRvb2xib3gucHJldmlvdXNIb3N0XCIsIFwiYm90dG9tXCIpOycsXG4gICAgICAgICd1c2VyX3ByZWYoXCJzaWdub24ucmVtZW1iZXJTaWdub25zXCIsIGZhbHNlKTsnXG4gICAgXTtcblxuICAgIGlmIChtYXJpb25ldHRlUG9ydCkge1xuICAgICAgICBwcmVmcyA9IHByZWZzLmNvbmNhdChbXG4gICAgICAgICAgICBgdXNlcl9wcmVmKFwibWFyaW9uZXR0ZS5wb3J0XCIsICR7bWFyaW9uZXR0ZVBvcnR9KTtgLFxuICAgICAgICAgICAgJ3VzZXJfcHJlZihcIm1hcmlvbmV0dGUuZW5hYmxlZFwiLCB0cnVlKTsnXG4gICAgICAgIF0pO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuZGlzYWJsZU11bHRpcHJvY2Vzc2luZykge1xuICAgICAgICBwcmVmcyA9IHByZWZzLmNvbmNhdChbXG4gICAgICAgICAgICAndXNlcl9wcmVmKFwiYnJvd3Nlci50YWJzLnJlbW90ZS5hdXRvc3RhcnRcIiwgZmFsc2UpOycsXG4gICAgICAgICAgICAndXNlcl9wcmVmKFwiYnJvd3Nlci50YWJzLnJlbW90ZS5hdXRvc3RhcnQuMlwiLCBmYWxzZSk7JyxcbiAgICAgICAgXSk7XG4gICAgfVxuXG4gICAgYXdhaXQgd3JpdGVGaWxlKHByZWZzRmlsZU5hbWUsIHByZWZzLmpvaW4oJ1xcbicpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHJ1bnRpbWVJbmZvKSB7XG4gICAgY29uc3QgdG1wRGlyID0gYXdhaXQgVGVtcERpcmVjdG9yeS5jcmVhdGVEaXJlY3RvcnkoJ2ZpcmVmb3gtcHJvZmlsZScpO1xuXG4gICAgYXdhaXQgZ2VuZXJhdGVQcmVmZXJlbmNlcyh0bXBEaXIucGF0aCwgcnVudGltZUluZm8pO1xuXG4gICAgcmV0dXJuIHRtcERpcjtcbn1cbiJdfQ==
