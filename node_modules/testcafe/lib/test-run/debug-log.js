'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _indentString = require('indent-string');

var _indentString2 = _interopRequireDefault(_indentString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TestRunDebugLog {
    constructor(userAgent) {
        this.driverMessageLogger = (0, _debug2.default)(`testcafe:test-run:${userAgent}:driver-message`);
        this.commandLogger = (0, _debug2.default)(`testcafe:test-run:${userAgent}:command`);
    }

    static _addEntry(logger, data) {
        const entry = data ? (0, _indentString2.default)(`\n${(0, _stringify2.default)(data, null, 2)}\n`, ' ', 4) : '';

        logger(entry);
    }

    driverMessage(msg) {
        TestRunDebugLog._addEntry(this.driverMessageLogger, msg);
    }

    command(cmd) {
        TestRunDebugLog._addEntry(this.commandLogger, cmd);
    }
}
exports.default = TestRunDebugLog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LXJ1bi9kZWJ1Zy1sb2cuanMiXSwibmFtZXMiOlsiVGVzdFJ1bkRlYnVnTG9nIiwiY29uc3RydWN0b3IiLCJ1c2VyQWdlbnQiLCJkcml2ZXJNZXNzYWdlTG9nZ2VyIiwiY29tbWFuZExvZ2dlciIsIl9hZGRFbnRyeSIsImxvZ2dlciIsImRhdGEiLCJlbnRyeSIsImRyaXZlck1lc3NhZ2UiLCJtc2ciLCJjb21tYW5kIiwiY21kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGVBQU4sQ0FBc0I7QUFDakNDLGdCQUFhQyxTQUFiLEVBQXdCO0FBQ3BCLGFBQUtDLG1CQUFMLEdBQTJCLHFCQUFhLHFCQUFvQkQsU0FBVSxpQkFBM0MsQ0FBM0I7QUFDQSxhQUFLRSxhQUFMLEdBQTJCLHFCQUFhLHFCQUFvQkYsU0FBVSxVQUEzQyxDQUEzQjtBQUNIOztBQUVELFdBQU9HLFNBQVAsQ0FBa0JDLE1BQWxCLEVBQTBCQyxJQUExQixFQUFnQztBQUM1QixjQUFNQyxRQUFRRCxPQUNWLDRCQUFjLEtBQUkseUJBQWVBLElBQWYsRUFBcUIsSUFBckIsRUFBMkIsQ0FBM0IsQ0FBOEIsSUFBaEQsRUFBcUQsR0FBckQsRUFBMEQsQ0FBMUQsQ0FEVSxHQUVWLEVBRko7O0FBSUFELGVBQU9FLEtBQVA7QUFDSDs7QUFFREMsa0JBQWVDLEdBQWYsRUFBb0I7QUFDaEJWLHdCQUFnQkssU0FBaEIsQ0FBMEIsS0FBS0YsbUJBQS9CLEVBQW9ETyxHQUFwRDtBQUNIOztBQUVEQyxZQUFTQyxHQUFULEVBQWM7QUFDVlosd0JBQWdCSyxTQUFoQixDQUEwQixLQUFLRCxhQUEvQixFQUE4Q1EsR0FBOUM7QUFDSDtBQXBCZ0M7a0JBQWhCWixlIiwiZmlsZSI6InRlc3QtcnVuL2RlYnVnLWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1Z0xvZ2dlciBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgaW5kZW50U3RyaW5nIGZyb20gJ2luZGVudC1zdHJpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0UnVuRGVidWdMb2cge1xuICAgIGNvbnN0cnVjdG9yICh1c2VyQWdlbnQpIHtcbiAgICAgICAgdGhpcy5kcml2ZXJNZXNzYWdlTG9nZ2VyID0gZGVidWdMb2dnZXIoYHRlc3RjYWZlOnRlc3QtcnVuOiR7dXNlckFnZW50fTpkcml2ZXItbWVzc2FnZWApO1xuICAgICAgICB0aGlzLmNvbW1hbmRMb2dnZXIgICAgICAgPSBkZWJ1Z0xvZ2dlcihgdGVzdGNhZmU6dGVzdC1ydW46JHt1c2VyQWdlbnR9OmNvbW1hbmRgKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2FkZEVudHJ5IChsb2dnZXIsIGRhdGEpIHtcbiAgICAgICAgY29uc3QgZW50cnkgPSBkYXRhID9cbiAgICAgICAgICAgIGluZGVudFN0cmluZyhgXFxuJHtKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKX1cXG5gLCAnICcsIDQpIDpcbiAgICAgICAgICAgICcnO1xuXG4gICAgICAgIGxvZ2dlcihlbnRyeSk7XG4gICAgfVxuXG4gICAgZHJpdmVyTWVzc2FnZSAobXNnKSB7XG4gICAgICAgIFRlc3RSdW5EZWJ1Z0xvZy5fYWRkRW50cnkodGhpcy5kcml2ZXJNZXNzYWdlTG9nZ2VyLCBtc2cpO1xuICAgIH1cblxuICAgIGNvbW1hbmQgKGNtZCkge1xuICAgICAgICBUZXN0UnVuRGVidWdMb2cuX2FkZEVudHJ5KHRoaXMuY29tbWFuZExvZ2dlciwgY21kKTtcbiAgICB9XG59XG4iXX0=
