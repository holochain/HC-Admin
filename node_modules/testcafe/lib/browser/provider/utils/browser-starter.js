'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _testcafeBrowserTools = require('testcafe-browser-tools');

var _testcafeBrowserTools2 = _interopRequireDefault(_testcafeBrowserTools);

var _delay = require('../../../utils/delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const POST_OPERATION_DELAY = 500;

class OperationsQueue {
    constructor() {
        this.chainPromise = _pinkie2.default.resolve();
    }

    executeOperation(operation) {
        const operationPromise = this.chainPromise.then(operation);

        this.chainPromise = operationPromise.then(() => (0, _delay2.default)(POST_OPERATION_DELAY));

        return operationPromise;
    }
}

class BrowserStarter {
    constructor() {
        // NOTE: You can't start multiple instances of the same app at the same time on macOS.
        // That's why a queue of opening requests is needed.
        this.macOSBrowserOpeningQueue = new OperationsQueue();
    }

    startBrowser(...openArgs) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const openBrowserOperation = function openBrowserOperation() {
                return _testcafeBrowserTools2.default.open(...openArgs);
            };

            if (_osFamily2.default.mac) yield _this.macOSBrowserOpeningQueue.executeOperation(openBrowserOperation);else yield openBrowserOperation();
        })();
    }
}
exports.default = BrowserStarter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL3V0aWxzL2Jyb3dzZXItc3RhcnRlci5qcyJdLCJuYW1lcyI6WyJQT1NUX09QRVJBVElPTl9ERUxBWSIsIk9wZXJhdGlvbnNRdWV1ZSIsImNvbnN0cnVjdG9yIiwiY2hhaW5Qcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJleGVjdXRlT3BlcmF0aW9uIiwib3BlcmF0aW9uIiwib3BlcmF0aW9uUHJvbWlzZSIsInRoZW4iLCJCcm93c2VyU3RhcnRlciIsIm1hY09TQnJvd3Nlck9wZW5pbmdRdWV1ZSIsInN0YXJ0QnJvd3NlciIsIm9wZW5BcmdzIiwib3BlbkJyb3dzZXJPcGVyYXRpb24iLCJicm93c2VyVG9vbHMiLCJvcGVuIiwiT1MiLCJtYWMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLE1BQU1BLHVCQUF1QixHQUE3Qjs7QUFFQSxNQUFNQyxlQUFOLENBQXNCO0FBQ2xCQyxrQkFBZTtBQUNYLGFBQUtDLFlBQUwsR0FBb0JDLGlCQUFRQyxPQUFSLEVBQXBCO0FBQ0g7O0FBRURDLHFCQUFrQkMsU0FBbEIsRUFBNkI7QUFDekIsY0FBTUMsbUJBQW1CLEtBQUtMLFlBQUwsQ0FBa0JNLElBQWxCLENBQXVCRixTQUF2QixDQUF6Qjs7QUFFQSxhQUFLSixZQUFMLEdBQW9CSyxpQkFBaUJDLElBQWpCLENBQXNCLE1BQU0scUJBQU1ULG9CQUFOLENBQTVCLENBQXBCOztBQUVBLGVBQU9RLGdCQUFQO0FBQ0g7QUFYaUI7O0FBY1AsTUFBTUUsY0FBTixDQUFxQjtBQUNoQ1Isa0JBQWU7QUFDWDtBQUNBO0FBQ0EsYUFBS1Msd0JBQUwsR0FBZ0MsSUFBSVYsZUFBSixFQUFoQztBQUNIOztBQUVLVyxnQkFBTixDQUFvQixHQUFHQyxRQUF2QixFQUFpQztBQUFBOztBQUFBO0FBQzdCLGtCQUFNQyx1QkFBdUIsU0FBdkJBLG9CQUF1QjtBQUFBLHVCQUFNQywrQkFBYUMsSUFBYixDQUFrQixHQUFHSCxRQUFyQixDQUFOO0FBQUEsYUFBN0I7O0FBRUEsZ0JBQUlJLG1CQUFHQyxHQUFQLEVBQ0ksTUFBTSxNQUFLUCx3QkFBTCxDQUE4QkwsZ0JBQTlCLENBQStDUSxvQkFBL0MsQ0FBTixDQURKLEtBR0ksTUFBTUEsc0JBQU47QUFOeUI7QUFPaEM7QUFkK0I7a0JBQWZKLGMiLCJmaWxlIjoiYnJvd3Nlci9wcm92aWRlci91dGlscy9icm93c2VyLXN0YXJ0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdwaW5raWUnO1xuaW1wb3J0IE9TIGZyb20gJ29zLWZhbWlseSc7XG5pbXBvcnQgYnJvd3NlclRvb2xzIGZyb20gJ3Rlc3RjYWZlLWJyb3dzZXItdG9vbHMnO1xuaW1wb3J0IGRlbGF5IGZyb20gJy4uLy4uLy4uL3V0aWxzL2RlbGF5JztcblxuXG5jb25zdCBQT1NUX09QRVJBVElPTl9ERUxBWSA9IDUwMDtcblxuY2xhc3MgT3BlcmF0aW9uc1F1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuY2hhaW5Qcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgZXhlY3V0ZU9wZXJhdGlvbiAob3BlcmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IG9wZXJhdGlvblByb21pc2UgPSB0aGlzLmNoYWluUHJvbWlzZS50aGVuKG9wZXJhdGlvbik7XG5cbiAgICAgICAgdGhpcy5jaGFpblByb21pc2UgPSBvcGVyYXRpb25Qcm9taXNlLnRoZW4oKCkgPT4gZGVsYXkoUE9TVF9PUEVSQVRJT05fREVMQVkpKTtcblxuICAgICAgICByZXR1cm4gb3BlcmF0aW9uUHJvbWlzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyb3dzZXJTdGFydGVyIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIC8vIE5PVEU6IFlvdSBjYW4ndCBzdGFydCBtdWx0aXBsZSBpbnN0YW5jZXMgb2YgdGhlIHNhbWUgYXBwIGF0IHRoZSBzYW1lIHRpbWUgb24gbWFjT1MuXG4gICAgICAgIC8vIFRoYXQncyB3aHkgYSBxdWV1ZSBvZiBvcGVuaW5nIHJlcXVlc3RzIGlzIG5lZWRlZC5cbiAgICAgICAgdGhpcy5tYWNPU0Jyb3dzZXJPcGVuaW5nUXVldWUgPSBuZXcgT3BlcmF0aW9uc1F1ZXVlKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgc3RhcnRCcm93c2VyICguLi5vcGVuQXJncykge1xuICAgICAgICBjb25zdCBvcGVuQnJvd3Nlck9wZXJhdGlvbiA9ICgpID0+IGJyb3dzZXJUb29scy5vcGVuKC4uLm9wZW5BcmdzKTtcblxuICAgICAgICBpZiAoT1MubWFjKVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5tYWNPU0Jyb3dzZXJPcGVuaW5nUXVldWUuZXhlY3V0ZU9wZXJhdGlvbihvcGVuQnJvd3Nlck9wZXJhdGlvbik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGF3YWl0IG9wZW5Ccm93c2VyT3BlcmF0aW9uKCk7XG4gICAgfVxufVxuIl19
