'use strict';

exports.__esModule = true;
exports.default = showDeprecationMessage;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _callsiteRecord = require('callsite-record');

var _createStackFilter = require('../errors/create-stack-filter');

var _createStackFilter2 = _interopRequireDefault(_createStackFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function showDeprecationMessage(callsite, info) {
    let callsiteStr = '';

    if (callsite) {
        callsiteStr = callsite.renderSync({
            renderer: _callsiteRecord.renderers.noColor,
            stackFilter: (0, _createStackFilter2.default)(Error.stackTraceLimit)
        });
    }

    /* eslint-disable no-console */
    console.error(_chalk2.default.yellow('\n----'));
    console.error(_chalk2.default.yellow(`DEPRECATION-WARNING: ${info.what} was deprecated and will be removed in future releases.`));
    console.error(_chalk2.default.yellow(`Use ${info.useInstead} instead.`));
    console.error(_chalk2.default.yellow(`See https://devexpress.github.io/testcafe/documentation for more info.`));
    console.error(_chalk2.default.yellow(callsiteStr));
    console.error(_chalk2.default.yellow('----\n'));
    /* eslint-enable no-console */
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub3RpZmljYXRpb25zL2RlcHJlY2F0aW9uLW1lc3NhZ2UuanMiXSwibmFtZXMiOlsic2hvd0RlcHJlY2F0aW9uTWVzc2FnZSIsImNhbGxzaXRlIiwiaW5mbyIsImNhbGxzaXRlU3RyIiwicmVuZGVyU3luYyIsInJlbmRlcmVyIiwicmVuZGVyZXJzIiwibm9Db2xvciIsInN0YWNrRmlsdGVyIiwiRXJyb3IiLCJzdGFja1RyYWNlTGltaXQiLCJjb25zb2xlIiwiZXJyb3IiLCJjaGFsayIsInllbGxvdyIsIndoYXQiLCJ1c2VJbnN0ZWFkIl0sIm1hcHBpbmdzIjoiOzs7a0JBSXdCQSxzQjs7QUFKeEI7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsU0FBU0Esc0JBQVQsQ0FBaUNDLFFBQWpDLEVBQTJDQyxJQUEzQyxFQUFpRDtBQUM1RCxRQUFJQyxjQUFjLEVBQWxCOztBQUVBLFFBQUlGLFFBQUosRUFBYztBQUNWRSxzQkFBY0YsU0FBU0csVUFBVCxDQUFvQjtBQUM5QkMsc0JBQWFDLDBCQUFVQyxPQURPO0FBRTlCQyx5QkFBYSxpQ0FBa0JDLE1BQU1DLGVBQXhCO0FBRmlCLFNBQXBCLENBQWQ7QUFJSDs7QUFFRDtBQUNBQyxZQUFRQyxLQUFSLENBQWNDLGdCQUFNQyxNQUFOLENBQWEsUUFBYixDQUFkO0FBQ0FILFlBQVFDLEtBQVIsQ0FBY0MsZ0JBQU1DLE1BQU4sQ0FBYyx3QkFBdUJaLEtBQUthLElBQUsseURBQS9DLENBQWQ7QUFDQUosWUFBUUMsS0FBUixDQUFjQyxnQkFBTUMsTUFBTixDQUFjLE9BQU1aLEtBQUtjLFVBQVcsV0FBcEMsQ0FBZDtBQUNBTCxZQUFRQyxLQUFSLENBQWNDLGdCQUFNQyxNQUFOLENBQWMsd0VBQWQsQ0FBZDtBQUNBSCxZQUFRQyxLQUFSLENBQWNDLGdCQUFNQyxNQUFOLENBQWFYLFdBQWIsQ0FBZDtBQUNBUSxZQUFRQyxLQUFSLENBQWNDLGdCQUFNQyxNQUFOLENBQWEsUUFBYixDQUFkO0FBQ0E7QUFDSCIsImZpbGUiOiJub3RpZmljYXRpb25zL2RlcHJlY2F0aW9uLW1lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IHsgcmVuZGVyZXJzIH0gZnJvbSAnY2FsbHNpdGUtcmVjb3JkJztcbmltcG9ydCBjcmVhdGVTdGFja0ZpbHRlciBmcm9tICcuLi9lcnJvcnMvY3JlYXRlLXN0YWNrLWZpbHRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNob3dEZXByZWNhdGlvbk1lc3NhZ2UgKGNhbGxzaXRlLCBpbmZvKSB7XG4gICAgbGV0IGNhbGxzaXRlU3RyID0gJyc7XG5cbiAgICBpZiAoY2FsbHNpdGUpIHtcbiAgICAgICAgY2FsbHNpdGVTdHIgPSBjYWxsc2l0ZS5yZW5kZXJTeW5jKHtcbiAgICAgICAgICAgIHJlbmRlcmVyOiAgICByZW5kZXJlcnMubm9Db2xvcixcbiAgICAgICAgICAgIHN0YWNrRmlsdGVyOiBjcmVhdGVTdGFja0ZpbHRlcihFcnJvci5zdGFja1RyYWNlTGltaXQpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbiAgICBjb25zb2xlLmVycm9yKGNoYWxrLnllbGxvdygnXFxuLS0tLScpKTtcbiAgICBjb25zb2xlLmVycm9yKGNoYWxrLnllbGxvdyhgREVQUkVDQVRJT04tV0FSTklORzogJHtpbmZvLndoYXR9IHdhcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gZnV0dXJlIHJlbGVhc2VzLmApKTtcbiAgICBjb25zb2xlLmVycm9yKGNoYWxrLnllbGxvdyhgVXNlICR7aW5mby51c2VJbnN0ZWFkfSBpbnN0ZWFkLmApKTtcbiAgICBjb25zb2xlLmVycm9yKGNoYWxrLnllbGxvdyhgU2VlIGh0dHBzOi8vZGV2ZXhwcmVzcy5naXRodWIuaW8vdGVzdGNhZmUvZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBpbmZvLmApKTtcbiAgICBjb25zb2xlLmVycm9yKGNoYWxrLnllbGxvdyhjYWxsc2l0ZVN0cikpO1xuICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsueWVsbG93KCctLS0tXFxuJykpO1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xufVxuIl19
