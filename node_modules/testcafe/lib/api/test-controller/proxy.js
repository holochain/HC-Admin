'use strict';

exports.__esModule = true;

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _delegatedApi = require('../../utils/delegated-api');

var _testRunTracker = require('../test-run-tracker');

var _testRunTracker2 = _interopRequireDefault(_testRunTracker);

var _runtime = require('../../errors/runtime');

var _message = require('../../errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const testControllerProxy = (0, _create2.default)(null);

(0, _delegatedApi.delegateAPI)(testControllerProxy, _2.default.API_LIST, {
    getHandler(propName, accessor) {
        const testRun = _testRunTracker2.default.resolveContextTestRun();

        if (!testRun) {
            let callsiteName = null;

            if (accessor === 'getter') callsiteName = 'get';else if (accessor === 'setter') callsiteName = 'set';else callsiteName = propName;

            throw new _runtime.APIError(callsiteName, _message2.default.testControllerProxyCantResolveTestRun);
        }

        return testRun.controller;
    }
});

exports.default = testControllerProxy;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvdGVzdC1jb250cm9sbGVyL3Byb3h5LmpzIl0sIm5hbWVzIjpbInRlc3RDb250cm9sbGVyUHJveHkiLCJUZXN0Q29udHJvbGxlciIsIkFQSV9MSVNUIiwiZ2V0SGFuZGxlciIsInByb3BOYW1lIiwiYWNjZXNzb3IiLCJ0ZXN0UnVuIiwidGVzdFJ1blRyYWNrZXIiLCJyZXNvbHZlQ29udGV4dFRlc3RSdW4iLCJjYWxsc2l0ZU5hbWUiLCJBUElFcnJvciIsIk1FU1NBR0UiLCJ0ZXN0Q29udHJvbGxlclByb3h5Q2FudFJlc29sdmVUZXN0UnVuIiwiY29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLHNCQUFzQixzQkFBYyxJQUFkLENBQTVCOztBQUVBLCtCQUFZQSxtQkFBWixFQUFpQ0MsV0FBZUMsUUFBaEQsRUFBMEQ7QUFDdERDLGVBQVlDLFFBQVosRUFBc0JDLFFBQXRCLEVBQWdDO0FBQzVCLGNBQU1DLFVBQVVDLHlCQUFlQyxxQkFBZixFQUFoQjs7QUFFQSxZQUFJLENBQUNGLE9BQUwsRUFBYztBQUNWLGdCQUFJRyxlQUFlLElBQW5COztBQUVBLGdCQUFJSixhQUFhLFFBQWpCLEVBQ0lJLGVBQWUsS0FBZixDQURKLEtBRUssSUFBSUosYUFBYSxRQUFqQixFQUNESSxlQUFlLEtBQWYsQ0FEQyxLQUdEQSxlQUFlTCxRQUFmOztBQUVKLGtCQUFNLElBQUlNLGlCQUFKLENBQWFELFlBQWIsRUFBMkJFLGtCQUFRQyxxQ0FBbkMsQ0FBTjtBQUNIOztBQUVELGVBQU9OLFFBQVFPLFVBQWY7QUFDSDtBQWxCcUQsQ0FBMUQ7O2tCQXFCZWIsbUIiLCJmaWxlIjoiYXBpL3Rlc3QtY29udHJvbGxlci9wcm94eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXN0Q29udHJvbGxlciBmcm9tICcuLyc7XG5pbXBvcnQgeyBkZWxlZ2F0ZUFQSSB9IGZyb20gJy4uLy4uL3V0aWxzL2RlbGVnYXRlZC1hcGknO1xuaW1wb3J0IHRlc3RSdW5UcmFja2VyIGZyb20gJy4uL3Rlc3QtcnVuLXRyYWNrZXInO1xuaW1wb3J0IHsgQVBJRXJyb3IgfSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQgTUVTU0FHRSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZS9tZXNzYWdlJztcblxuY29uc3QgdGVzdENvbnRyb2xsZXJQcm94eSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbmRlbGVnYXRlQVBJKHRlc3RDb250cm9sbGVyUHJveHksIFRlc3RDb250cm9sbGVyLkFQSV9MSVNULCB7XG4gICAgZ2V0SGFuZGxlciAocHJvcE5hbWUsIGFjY2Vzc29yKSB7XG4gICAgICAgIGNvbnN0IHRlc3RSdW4gPSB0ZXN0UnVuVHJhY2tlci5yZXNvbHZlQ29udGV4dFRlc3RSdW4oKTtcblxuICAgICAgICBpZiAoIXRlc3RSdW4pIHtcbiAgICAgICAgICAgIGxldCBjYWxsc2l0ZU5hbWUgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoYWNjZXNzb3IgPT09ICdnZXR0ZXInKVxuICAgICAgICAgICAgICAgIGNhbGxzaXRlTmFtZSA9ICdnZXQnO1xuICAgICAgICAgICAgZWxzZSBpZiAoYWNjZXNzb3IgPT09ICdzZXR0ZXInKVxuICAgICAgICAgICAgICAgIGNhbGxzaXRlTmFtZSA9ICdzZXQnO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNhbGxzaXRlTmFtZSA9IHByb3BOYW1lO1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgQVBJRXJyb3IoY2FsbHNpdGVOYW1lLCBNRVNTQUdFLnRlc3RDb250cm9sbGVyUHJveHlDYW50UmVzb2x2ZVRlc3RSdW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRlc3RSdW4uY29udHJvbGxlcjtcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgdGVzdENvbnRyb2xsZXJQcm94eTtcbiJdfQ==
