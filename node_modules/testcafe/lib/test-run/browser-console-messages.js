'use strict';

exports.__esModule = true;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assignable = require('../utils/assignable');

var _assignable2 = _interopRequireDefault(_assignable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BrowserConsoleMessages extends _assignable2.default {
    constructor(obj) {
        super();

        this.log = [];
        this.info = [];
        this.warn = [];
        this.error = [];

        this._assignFrom(obj);
    }

    _getAssignableProperties() {
        return [{ name: 'log' }, { name: 'info' }, { name: 'warn' }, { name: 'error' }];
    }

    concat(consoleMessages) {
        this.log = this.log.concat(consoleMessages.log);
        this.info = this.info.concat(consoleMessages.info);
        this.warn = this.warn.concat(consoleMessages.warn);
        this.error = this.error.concat(consoleMessages.error);
    }

    addMessage(type, msg) {
        this[type].push(msg);
    }

    getCopy() {
        const copy = {};
        const properties = this._getAssignableProperties();

        for (var _iterator = properties, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            const property = _ref;

            copy[property.name] = this[property.name].slice();
        }return copy;
    }
}
exports.default = BrowserConsoleMessages; // -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LXJ1bi9icm93c2VyLWNvbnNvbGUtbWVzc2FnZXMuanMiXSwibmFtZXMiOlsiQnJvd3NlckNvbnNvbGVNZXNzYWdlcyIsIkFzc2lnbmFibGUiLCJjb25zdHJ1Y3RvciIsIm9iaiIsImxvZyIsImluZm8iLCJ3YXJuIiwiZXJyb3IiLCJfYXNzaWduRnJvbSIsIl9nZXRBc3NpZ25hYmxlUHJvcGVydGllcyIsIm5hbWUiLCJjb25jYXQiLCJjb25zb2xlTWVzc2FnZXMiLCJhZGRNZXNzYWdlIiwidHlwZSIsIm1zZyIsInB1c2giLCJnZXRDb3B5IiwiY29weSIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsInNsaWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUlBOzs7Ozs7QUFHZSxNQUFNQSxzQkFBTixTQUFxQ0Msb0JBQXJDLENBQWdEO0FBQzNEQyxnQkFBYUMsR0FBYixFQUFrQjtBQUNkOztBQUVBLGFBQUtDLEdBQUwsR0FBYSxFQUFiO0FBQ0EsYUFBS0MsSUFBTCxHQUFhLEVBQWI7QUFDQSxhQUFLQyxJQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUtDLEtBQUwsR0FBYSxFQUFiOztBQUVBLGFBQUtDLFdBQUwsQ0FBaUJMLEdBQWpCO0FBQ0g7O0FBRURNLCtCQUE0QjtBQUN4QixlQUFPLENBQ0gsRUFBRUMsTUFBTSxLQUFSLEVBREcsRUFFSCxFQUFFQSxNQUFNLE1BQVIsRUFGRyxFQUdILEVBQUVBLE1BQU0sTUFBUixFQUhHLEVBSUgsRUFBRUEsTUFBTSxPQUFSLEVBSkcsQ0FBUDtBQU1IOztBQUVEQyxXQUFRQyxlQUFSLEVBQXlCO0FBQ3JCLGFBQUtSLEdBQUwsR0FBYSxLQUFLQSxHQUFMLENBQVNPLE1BQVQsQ0FBZ0JDLGdCQUFnQlIsR0FBaEMsQ0FBYjtBQUNBLGFBQUtDLElBQUwsR0FBYSxLQUFLQSxJQUFMLENBQVVNLE1BQVYsQ0FBaUJDLGdCQUFnQlAsSUFBakMsQ0FBYjtBQUNBLGFBQUtDLElBQUwsR0FBYSxLQUFLQSxJQUFMLENBQVVLLE1BQVYsQ0FBaUJDLGdCQUFnQk4sSUFBakMsQ0FBYjtBQUNBLGFBQUtDLEtBQUwsR0FBYSxLQUFLQSxLQUFMLENBQVdJLE1BQVgsQ0FBa0JDLGdCQUFnQkwsS0FBbEMsQ0FBYjtBQUNIOztBQUVETSxlQUFZQyxJQUFaLEVBQWtCQyxHQUFsQixFQUF1QjtBQUNuQixhQUFLRCxJQUFMLEVBQVdFLElBQVgsQ0FBZ0JELEdBQWhCO0FBQ0g7O0FBRURFLGNBQVc7QUFDUCxjQUFNQyxPQUFPLEVBQWI7QUFDQSxjQUFNQyxhQUFhLEtBQUtWLHdCQUFMLEVBQW5COztBQUVBLDZCQUF1QlUsVUFBdkI7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLGtCQUFXQyxRQUFYOztBQUNJRixpQkFBS0UsU0FBU1YsSUFBZCxJQUFzQixLQUFLVSxTQUFTVixJQUFkLEVBQW9CVyxLQUFwQixFQUF0QjtBQURKLFNBR0EsT0FBT0gsSUFBUDtBQUNIO0FBeEMwRDtrQkFBMUNsQixzQixFQVByQjtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ0ZXN0LXJ1bi9icm93c2VyLWNvbnNvbGUtbWVzc2FnZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBXQVJOSU5HOiB0aGlzIGZpbGUgaXMgdXNlZCBieSBib3RoIHRoZSBjbGllbnQgYW5kIHRoZSBzZXJ2ZXIuXG4vLyBEbyBub3QgdXNlIGFueSBicm93c2VyIG9yIG5vZGUtc3BlY2lmaWMgQVBJIVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuaW1wb3J0IEFzc2lnbmFibGUgZnJvbSAnLi4vdXRpbHMvYXNzaWduYWJsZSc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJvd3NlckNvbnNvbGVNZXNzYWdlcyBleHRlbmRzIEFzc2lnbmFibGUge1xuICAgIGNvbnN0cnVjdG9yIChvYmopIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmxvZyAgID0gW107XG4gICAgICAgIHRoaXMuaW5mbyAgPSBbXTtcbiAgICAgICAgdGhpcy53YXJuICA9IFtdO1xuICAgICAgICB0aGlzLmVycm9yID0gW107XG5cbiAgICAgICAgdGhpcy5fYXNzaWduRnJvbShvYmopO1xuICAgIH1cblxuICAgIF9nZXRBc3NpZ25hYmxlUHJvcGVydGllcyAoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7IG5hbWU6ICdsb2cnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdpbmZvJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnd2FybicgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ2Vycm9yJyB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgY29uY2F0IChjb25zb2xlTWVzc2FnZXMpIHtcbiAgICAgICAgdGhpcy5sb2cgICA9IHRoaXMubG9nLmNvbmNhdChjb25zb2xlTWVzc2FnZXMubG9nKTtcbiAgICAgICAgdGhpcy5pbmZvICA9IHRoaXMuaW5mby5jb25jYXQoY29uc29sZU1lc3NhZ2VzLmluZm8pO1xuICAgICAgICB0aGlzLndhcm4gID0gdGhpcy53YXJuLmNvbmNhdChjb25zb2xlTWVzc2FnZXMud2Fybik7XG4gICAgICAgIHRoaXMuZXJyb3IgPSB0aGlzLmVycm9yLmNvbmNhdChjb25zb2xlTWVzc2FnZXMuZXJyb3IpO1xuICAgIH1cblxuICAgIGFkZE1lc3NhZ2UgKHR5cGUsIG1zZykge1xuICAgICAgICB0aGlzW3R5cGVdLnB1c2gobXNnKTtcbiAgICB9XG5cbiAgICBnZXRDb3B5ICgpIHtcbiAgICAgICAgY29uc3QgY29weSA9IHt9O1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5fZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIHByb3BlcnRpZXMpXG4gICAgICAgICAgICBjb3B5W3Byb3BlcnR5Lm5hbWVdID0gdGhpc1twcm9wZXJ0eS5uYW1lXS5zbGljZSgpO1xuXG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbn1cbiJdfQ==
