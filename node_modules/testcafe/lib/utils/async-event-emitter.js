'use strict';

exports.__esModule = true;

var _legacy = require('emittery/legacy');

var _legacy2 = _interopRequireDefault(_legacy);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AsyncEventEmitter extends _legacy2.default {
    once(event, listener) {
        return new _pinkie2.default((resolve, reject) => {
            const off = this.on(event, function (data) {
                try {
                    off();

                    const result = listener ? listener.call(this, data) : data;

                    resolve(result);

                    return result;
                } catch (e) {
                    reject(e);

                    throw e;
                }
            });
        });
    }
}
exports.default = AsyncEventEmitter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hc3luYy1ldmVudC1lbWl0dGVyLmpzIl0sIm5hbWVzIjpbIkFzeW5jRXZlbnRFbWl0dGVyIiwiRW1pdHRlcnkiLCJvbmNlIiwiZXZlbnQiLCJsaXN0ZW5lciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib2ZmIiwib24iLCJkYXRhIiwicmVzdWx0IiwiY2FsbCIsImUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHZSxNQUFNQSxpQkFBTixTQUFnQ0MsZ0JBQWhDLENBQXlDO0FBQ3BEQyxTQUFNQyxLQUFOLEVBQWFDLFFBQWIsRUFBdUI7QUFDbkIsZUFBTyxJQUFJQyxnQkFBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUNwQyxrQkFBTUMsTUFBTSxLQUFLQyxFQUFMLENBQVFOLEtBQVIsRUFBZSxVQUFVTyxJQUFWLEVBQWdCO0FBQ3ZDLG9CQUFJO0FBQ0FGOztBQUVBLDBCQUFNRyxTQUFTUCxXQUFXQSxTQUFTUSxJQUFULENBQWMsSUFBZCxFQUFvQkYsSUFBcEIsQ0FBWCxHQUF1Q0EsSUFBdEQ7O0FBRUFKLDRCQUFRSyxNQUFSOztBQUVBLDJCQUFPQSxNQUFQO0FBQ0gsaUJBUkQsQ0FTQSxPQUFPRSxDQUFQLEVBQVU7QUFDTk4sMkJBQU9NLENBQVA7O0FBRUEsMEJBQU1BLENBQU47QUFDSDtBQUNKLGFBZlcsQ0FBWjtBQWdCSCxTQWpCTSxDQUFQO0FBa0JIO0FBcEJtRDtrQkFBbkNiLGlCIiwiZmlsZSI6InV0aWxzL2FzeW5jLWV2ZW50LWVtaXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRW1pdHRlcnkgZnJvbSAnZW1pdHRlcnkvbGVnYWN5JztcbmltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXN5bmNFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFbWl0dGVyeSB7XG4gICAgb25jZSAoZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvZmYgPSB0aGlzLm9uKGV2ZW50LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9mZigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGxpc3RlbmVyID8gbGlzdGVuZXIuY2FsbCh0aGlzLCBkYXRhKSA6IGRhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcblxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
