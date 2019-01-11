'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = wrapTestFunction;

var _testController = require('./test-controller');

var _testController2 = _interopRequireDefault(_testController);

var _testRunTracker = require('./test-run-tracker');

var _testRunTracker2 = _interopRequireDefault(_testRunTracker);

var _errorList = require('../errors/error-list');

var _errorList2 = _interopRequireDefault(_errorList);

var _testRun = require('../errors/test-run');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrapTestFunction(fn) {
    return (() => {
        var _ref = (0, _asyncToGenerator3.default)(function* (testRun) {
            let result = null;
            const errList = new _errorList2.default();
            const markeredfn = _testRunTracker2.default.addTrackingMarkerToFunction(testRun.id, fn);

            testRun.controller = new _testController2.default(testRun);

            _testRunTracker2.default.ensureEnabled();

            try {
                result = yield markeredfn(testRun.controller);
            } catch (err) {
                errList.addError(err);
            }

            if (!errList.hasUncaughtErrorsInTestCode) {
                testRun.controller.callsitesWithoutAwait.forEach(function (callsite) {
                    errList.addError(new _testRun.MissingAwaitError(callsite));
                });
            }

            if (errList.hasErrors) throw errList;

            return result;
        });

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    })();
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvd3JhcC10ZXN0LWZ1bmN0aW9uLmpzIl0sIm5hbWVzIjpbIndyYXBUZXN0RnVuY3Rpb24iLCJmbiIsInRlc3RSdW4iLCJyZXN1bHQiLCJlcnJMaXN0IiwiVGVzdENhZmVFcnJvckxpc3QiLCJtYXJrZXJlZGZuIiwidGVzdFJ1blRyYWNrZXIiLCJhZGRUcmFja2luZ01hcmtlclRvRnVuY3Rpb24iLCJpZCIsImNvbnRyb2xsZXIiLCJUZXN0Q29udHJvbGxlciIsImVuc3VyZUVuYWJsZWQiLCJlcnIiLCJhZGRFcnJvciIsImhhc1VuY2F1Z2h0RXJyb3JzSW5UZXN0Q29kZSIsImNhbGxzaXRlc1dpdGhvdXRBd2FpdCIsImZvckVhY2giLCJNaXNzaW5nQXdhaXRFcnJvciIsImNhbGxzaXRlIiwiaGFzRXJyb3JzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQkFLd0JBLGdCOztBQUx4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVlLFNBQVNBLGdCQUFULENBQTJCQyxFQUEzQixFQUErQjtBQUMxQztBQUFBLG1EQUFPLFdBQU1DLE9BQU4sRUFBaUI7QUFDcEIsZ0JBQUlDLFNBQWUsSUFBbkI7QUFDQSxrQkFBTUMsVUFBYSxJQUFJQyxtQkFBSixFQUFuQjtBQUNBLGtCQUFNQyxhQUFhQyx5QkFBZUMsMkJBQWYsQ0FBMkNOLFFBQVFPLEVBQW5ELEVBQXVEUixFQUF2RCxDQUFuQjs7QUFFQUMsb0JBQVFRLFVBQVIsR0FBcUIsSUFBSUMsd0JBQUosQ0FBbUJULE9BQW5CLENBQXJCOztBQUVBSyxxQ0FBZUssYUFBZjs7QUFFQSxnQkFBSTtBQUNBVCx5QkFBUyxNQUFNRyxXQUFXSixRQUFRUSxVQUFuQixDQUFmO0FBQ0gsYUFGRCxDQUdBLE9BQU9HLEdBQVAsRUFBWTtBQUNSVCx3QkFBUVUsUUFBUixDQUFpQkQsR0FBakI7QUFDSDs7QUFFRCxnQkFBSSxDQUFDVCxRQUFRVywyQkFBYixFQUEwQztBQUN0Q2Isd0JBQVFRLFVBQVIsQ0FBbUJNLHFCQUFuQixDQUF5Q0MsT0FBekMsQ0FBaUQsb0JBQVk7QUFDekRiLDRCQUFRVSxRQUFSLENBQWlCLElBQUlJLDBCQUFKLENBQXNCQyxRQUF0QixDQUFqQjtBQUNILGlCQUZEO0FBR0g7O0FBRUQsZ0JBQUlmLFFBQVFnQixTQUFaLEVBQ0ksTUFBTWhCLE9BQU47O0FBRUosbUJBQU9ELE1BQVA7QUFDSCxTQTFCRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTJCSCIsImZpbGUiOiJhcGkvd3JhcC10ZXN0LWZ1bmN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRlc3RDb250cm9sbGVyIGZyb20gJy4vdGVzdC1jb250cm9sbGVyJztcbmltcG9ydCB0ZXN0UnVuVHJhY2tlciBmcm9tICcuL3Rlc3QtcnVuLXRyYWNrZXInO1xuaW1wb3J0IFRlc3RDYWZlRXJyb3JMaXN0IGZyb20gJy4uL2Vycm9ycy9lcnJvci1saXN0JztcbmltcG9ydCB7IE1pc3NpbmdBd2FpdEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzL3Rlc3QtcnVuJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd3JhcFRlc3RGdW5jdGlvbiAoZm4pIHtcbiAgICByZXR1cm4gYXN5bmMgdGVzdFJ1biA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgICAgICAgPSBudWxsO1xuICAgICAgICBjb25zdCBlcnJMaXN0ICAgID0gbmV3IFRlc3RDYWZlRXJyb3JMaXN0KCk7XG4gICAgICAgIGNvbnN0IG1hcmtlcmVkZm4gPSB0ZXN0UnVuVHJhY2tlci5hZGRUcmFja2luZ01hcmtlclRvRnVuY3Rpb24odGVzdFJ1bi5pZCwgZm4pO1xuXG4gICAgICAgIHRlc3RSdW4uY29udHJvbGxlciA9IG5ldyBUZXN0Q29udHJvbGxlcih0ZXN0UnVuKTtcblxuICAgICAgICB0ZXN0UnVuVHJhY2tlci5lbnN1cmVFbmFibGVkKCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IG1hcmtlcmVkZm4odGVzdFJ1bi5jb250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnJMaXN0LmFkZEVycm9yKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWVyckxpc3QuaGFzVW5jYXVnaHRFcnJvcnNJblRlc3RDb2RlKSB7XG4gICAgICAgICAgICB0ZXN0UnVuLmNvbnRyb2xsZXIuY2FsbHNpdGVzV2l0aG91dEF3YWl0LmZvckVhY2goY2FsbHNpdGUgPT4ge1xuICAgICAgICAgICAgICAgIGVyckxpc3QuYWRkRXJyb3IobmV3IE1pc3NpbmdBd2FpdEVycm9yKGNhbGxzaXRlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJMaXN0Lmhhc0Vycm9ycylcbiAgICAgICAgICAgIHRocm93IGVyckxpc3Q7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufVxuIl19
