'use strict';

exports.__esModule = true;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// Validations
let getValidHostname = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (hostname) {
        if (hostname) {
            const valid = yield endpointUtils.isMyHostname(hostname);

            if (!valid) throw new _runtime.GeneralError(_message2.default.invalidHostname, hostname);
        } else hostname = endpointUtils.getIPAddress();

        return hostname;
    });

    return function getValidHostname(_x) {
        return _ref.apply(this, arguments);
    };
})();

let getValidPort = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (port) {
        if (port) {
            const isFree = yield endpointUtils.isFreePort(port);

            if (!isFree) throw new _runtime.GeneralError(_message2.default.portIsNotFree, port);
        } else port = yield endpointUtils.getFreePort();

        return port;
    });

    return function getValidPort(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

// API


let createTestCafe = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)(function* (hostname, port1, port2, sslOptions, developmentMode, retryTestPages) {
        var _ref4 = yield _pinkie2.default.all([getValidHostname(hostname), getValidPort(port1), getValidPort(port2)]);

        hostname = _ref4[0];
        port1 = _ref4[1];
        port2 = _ref4[2];


        const testcafe = new TestCafe(hostname, port1, port2, {
            ssl: sslOptions,
            developmentMode,
            retryTestPages
        });

        setupExitHook(function (cb) {
            return testcafe.close().then(cb);
        });

        return testcafe;
    });

    return function createTestCafe(_x3, _x4, _x5, _x6, _x7, _x8) {
        return _ref3.apply(this, arguments);
    };
})();

// Embedding utils


var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _runtime = require('./errors/runtime');

var _message = require('./errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

var _embeddingUtils = require('./embedding-utils');

var _embeddingUtils2 = _interopRequireDefault(_embeddingUtils);

var _exportableLib = require('./api/exportable-lib');

var _exportableLib2 = _interopRequireDefault(_exportableLib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const lazyRequire = require('import-lazy')(require);
const TestCafe = lazyRequire('./testcafe');
const endpointUtils = lazyRequire('endpoint-utils');
const setupExitHook = lazyRequire('async-exit-hook');createTestCafe.embeddingUtils = _embeddingUtils2.default;

// Common API
(0, _keys2.default)(_exportableLib2.default).forEach(key => {
    (0, _defineProperty2.default)(createTestCafe, key, { get: () => _exportableLib2.default[key] });
});

exports.default = createTestCafe;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJob3N0bmFtZSIsInZhbGlkIiwiZW5kcG9pbnRVdGlscyIsImlzTXlIb3N0bmFtZSIsIkdlbmVyYWxFcnJvciIsIk1FU1NBR0UiLCJpbnZhbGlkSG9zdG5hbWUiLCJnZXRJUEFkZHJlc3MiLCJnZXRWYWxpZEhvc3RuYW1lIiwicG9ydCIsImlzRnJlZSIsImlzRnJlZVBvcnQiLCJwb3J0SXNOb3RGcmVlIiwiZ2V0RnJlZVBvcnQiLCJnZXRWYWxpZFBvcnQiLCJwb3J0MSIsInBvcnQyIiwic3NsT3B0aW9ucyIsImRldmVsb3BtZW50TW9kZSIsInJldHJ5VGVzdFBhZ2VzIiwiUHJvbWlzZSIsImFsbCIsInRlc3RjYWZlIiwiVGVzdENhZmUiLCJzc2wiLCJzZXR1cEV4aXRIb29rIiwiY2xvc2UiLCJ0aGVuIiwiY2IiLCJjcmVhdGVUZXN0Q2FmZSIsImxhenlSZXF1aXJlIiwicmVxdWlyZSIsImVtYmVkZGluZ1V0aWxzIiwiZXhwb3J0YWJsZUxpYiIsImZvckVhY2giLCJrZXkiLCJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXQTs7K0NBQ0EsV0FBaUNBLFFBQWpDLEVBQTJDO0FBQ3ZDLFlBQUlBLFFBQUosRUFBYztBQUNWLGtCQUFNQyxRQUFRLE1BQU1DLGNBQWNDLFlBQWQsQ0FBMkJILFFBQTNCLENBQXBCOztBQUVBLGdCQUFJLENBQUNDLEtBQUwsRUFDSSxNQUFNLElBQUlHLHFCQUFKLENBQWlCQyxrQkFBUUMsZUFBekIsRUFBMENOLFFBQTFDLENBQU47QUFDUCxTQUxELE1BT0lBLFdBQVdFLGNBQWNLLFlBQWQsRUFBWDs7QUFFSixlQUFPUCxRQUFQO0FBQ0gsSzs7b0JBWGNRLGdCOzs7Ozs7Z0RBYWYsV0FBNkJDLElBQTdCLEVBQW1DO0FBQy9CLFlBQUlBLElBQUosRUFBVTtBQUNOLGtCQUFNQyxTQUFTLE1BQU1SLGNBQWNTLFVBQWQsQ0FBeUJGLElBQXpCLENBQXJCOztBQUVBLGdCQUFJLENBQUNDLE1BQUwsRUFDSSxNQUFNLElBQUlOLHFCQUFKLENBQWlCQyxrQkFBUU8sYUFBekIsRUFBd0NILElBQXhDLENBQU47QUFDUCxTQUxELE1BT0lBLE9BQU8sTUFBTVAsY0FBY1csV0FBZCxFQUFiOztBQUVKLGVBQU9KLElBQVA7QUFDSCxLOztvQkFYY0ssWTs7Ozs7QUFhZjs7OztnREFDQSxXQUErQmQsUUFBL0IsRUFBeUNlLEtBQXpDLEVBQWdEQyxLQUFoRCxFQUF1REMsVUFBdkQsRUFBbUVDLGVBQW5FLEVBQW9GQyxjQUFwRixFQUFvRztBQUFBLG9CQUNyRSxNQUFNQyxpQkFBUUMsR0FBUixDQUFZLENBQ3pDYixpQkFBaUJSLFFBQWpCLENBRHlDLEVBRXpDYyxhQUFhQyxLQUFiLENBRnlDLEVBR3pDRCxhQUFhRSxLQUFiLENBSHlDLENBQVosQ0FEK0Q7O0FBQy9GaEIsZ0JBRCtGO0FBQ3JGZSxhQURxRjtBQUM5RUMsYUFEOEU7OztBQU9oRyxjQUFNTSxXQUFXLElBQUlDLFFBQUosQ0FBYXZCLFFBQWIsRUFBdUJlLEtBQXZCLEVBQThCQyxLQUE5QixFQUFxQztBQUNsRFEsaUJBQUtQLFVBRDZDO0FBRWxEQywyQkFGa0Q7QUFHbERDO0FBSGtELFNBQXJDLENBQWpCOztBQU1BTSxzQkFBYztBQUFBLG1CQUFNSCxTQUFTSSxLQUFULEdBQWlCQyxJQUFqQixDQUFzQkMsRUFBdEIsQ0FBTjtBQUFBLFNBQWQ7O0FBRUEsZUFBT04sUUFBUDtBQUNILEs7O29CQWhCY08sYzs7Ozs7QUFrQmY7OztBQXpEQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTUMsY0FBZ0JDLFFBQVEsYUFBUixFQUF1QkEsT0FBdkIsQ0FBdEI7QUFDQSxNQUFNUixXQUFnQk8sWUFBWSxZQUFaLENBQXRCO0FBQ0EsTUFBTTVCLGdCQUFnQjRCLFlBQVksZ0JBQVosQ0FBdEI7QUFDQSxNQUFNTCxnQkFBZ0JLLFlBQVksaUJBQVosQ0FBdEIsQ0FpREFELGVBQWVHLGNBQWYsR0FBZ0NBLHdCQUFoQzs7QUFFQTtBQUNBLG9CQUFZQyx1QkFBWixFQUEyQkMsT0FBM0IsQ0FBbUNDLE9BQU87QUFDdEMsa0NBQXNCTixjQUF0QixFQUFzQ00sR0FBdEMsRUFBMkMsRUFBRUMsS0FBSyxNQUFNSCx3QkFBY0UsR0FBZCxDQUFiLEVBQTNDO0FBQ0gsQ0FGRDs7a0JBSWVOLGMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdwaW5raWUnO1xuaW1wb3J0IHsgR2VuZXJhbEVycm9yIH0gZnJvbSAnLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQgTUVTU0FHRSBmcm9tICcuL2Vycm9ycy9ydW50aW1lL21lc3NhZ2UnO1xuaW1wb3J0IGVtYmVkZGluZ1V0aWxzIGZyb20gJy4vZW1iZWRkaW5nLXV0aWxzJztcbmltcG9ydCBleHBvcnRhYmxlTGliIGZyb20gJy4vYXBpL2V4cG9ydGFibGUtbGliJztcblxuY29uc3QgbGF6eVJlcXVpcmUgICA9IHJlcXVpcmUoJ2ltcG9ydC1sYXp5JykocmVxdWlyZSk7XG5jb25zdCBUZXN0Q2FmZSAgICAgID0gbGF6eVJlcXVpcmUoJy4vdGVzdGNhZmUnKTtcbmNvbnN0IGVuZHBvaW50VXRpbHMgPSBsYXp5UmVxdWlyZSgnZW5kcG9pbnQtdXRpbHMnKTtcbmNvbnN0IHNldHVwRXhpdEhvb2sgPSBsYXp5UmVxdWlyZSgnYXN5bmMtZXhpdC1ob29rJyk7XG5cbi8vIFZhbGlkYXRpb25zXG5hc3luYyBmdW5jdGlvbiBnZXRWYWxpZEhvc3RuYW1lIChob3N0bmFtZSkge1xuICAgIGlmIChob3N0bmFtZSkge1xuICAgICAgICBjb25zdCB2YWxpZCA9IGF3YWl0IGVuZHBvaW50VXRpbHMuaXNNeUhvc3RuYW1lKGhvc3RuYW1lKTtcblxuICAgICAgICBpZiAoIXZhbGlkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLmludmFsaWRIb3N0bmFtZSwgaG9zdG5hbWUpO1xuICAgIH1cbiAgICBlbHNlXG4gICAgICAgIGhvc3RuYW1lID0gZW5kcG9pbnRVdGlscy5nZXRJUEFkZHJlc3MoKTtcblxuICAgIHJldHVybiBob3N0bmFtZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0VmFsaWRQb3J0IChwb3J0KSB7XG4gICAgaWYgKHBvcnQpIHtcbiAgICAgICAgY29uc3QgaXNGcmVlID0gYXdhaXQgZW5kcG9pbnRVdGlscy5pc0ZyZWVQb3J0KHBvcnQpO1xuXG4gICAgICAgIGlmICghaXNGcmVlKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLnBvcnRJc05vdEZyZWUsIHBvcnQpO1xuICAgIH1cbiAgICBlbHNlXG4gICAgICAgIHBvcnQgPSBhd2FpdCBlbmRwb2ludFV0aWxzLmdldEZyZWVQb3J0KCk7XG5cbiAgICByZXR1cm4gcG9ydDtcbn1cblxuLy8gQVBJXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVUZXN0Q2FmZSAoaG9zdG5hbWUsIHBvcnQxLCBwb3J0Miwgc3NsT3B0aW9ucywgZGV2ZWxvcG1lbnRNb2RlLCByZXRyeVRlc3RQYWdlcykge1xuICAgIFtob3N0bmFtZSwgcG9ydDEsIHBvcnQyXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgZ2V0VmFsaWRIb3N0bmFtZShob3N0bmFtZSksXG4gICAgICAgIGdldFZhbGlkUG9ydChwb3J0MSksXG4gICAgICAgIGdldFZhbGlkUG9ydChwb3J0MilcbiAgICBdKTtcblxuICAgIGNvbnN0IHRlc3RjYWZlID0gbmV3IFRlc3RDYWZlKGhvc3RuYW1lLCBwb3J0MSwgcG9ydDIsIHtcbiAgICAgICAgc3NsOiBzc2xPcHRpb25zLFxuICAgICAgICBkZXZlbG9wbWVudE1vZGUsXG4gICAgICAgIHJldHJ5VGVzdFBhZ2VzXG4gICAgfSk7XG5cbiAgICBzZXR1cEV4aXRIb29rKGNiID0+IHRlc3RjYWZlLmNsb3NlKCkudGhlbihjYikpO1xuXG4gICAgcmV0dXJuIHRlc3RjYWZlO1xufVxuXG4vLyBFbWJlZGRpbmcgdXRpbHNcbmNyZWF0ZVRlc3RDYWZlLmVtYmVkZGluZ1V0aWxzID0gZW1iZWRkaW5nVXRpbHM7XG5cbi8vIENvbW1vbiBBUElcbk9iamVjdC5rZXlzKGV4cG9ydGFibGVMaWIpLmZvckVhY2goa2V5ID0+IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3JlYXRlVGVzdENhZmUsIGtleSwgeyBnZXQ6ICgpID0+IGV4cG9ydGFibGVMaWJba2V5XSB9KTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVUZXN0Q2FmZTtcbiJdfQ==
