'use strict';

exports.__esModule = true;

var _tty = require('tty');

var _tty2 = _interopRequireDefault(_tty);

var _elegantSpinner = require('elegant-spinner');

var _elegantSpinner2 = _interopRequireDefault(_elegantSpinner);

var _logUpdateAsyncHook = require('log-update-async-hook');

var _logUpdateAsyncHook2 = _interopRequireDefault(_logUpdateAsyncHook);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _isCi = require('is-ci');

var _isCi2 = _interopRequireDefault(_isCi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: To support piping, we use stderr as the log output
// stream, while stdout is used for the report output.
exports.default = {
    animation: null,
    isAnimated: _tty2.default.isatty(1) && !_isCi2.default,

    showSpinner() {
        // NOTE: we can use the spinner only if stderr is a TTY and we are not in CI environment (e.g. TravisCI),
        // otherwise we can't repaint animation frames. Thanks https://github.com/sindresorhus/ora for insight.
        if (this.isAnimated) {
            const spinnerFrame = (0, _elegantSpinner2.default)();

            this.animation = setInterval(() => {
                const frame = _chalk2.default.cyan(spinnerFrame());

                _logUpdateAsyncHook2.default.stderr(frame);
            }, 50);
        }
    },

    hideSpinner(isExit) {
        if (this.animation) {
            clearInterval(this.animation);
            _logUpdateAsyncHook2.default.stderr.clear();

            if (isExit) _logUpdateAsyncHook2.default.stderr.done();

            this.animation = null;
        }
    },

    write(text) {
        console.error(text);
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvbG9nLmpzIl0sIm5hbWVzIjpbImFuaW1hdGlvbiIsImlzQW5pbWF0ZWQiLCJ0dHkiLCJpc2F0dHkiLCJpc0NJIiwic2hvd1NwaW5uZXIiLCJzcGlubmVyRnJhbWUiLCJzZXRJbnRlcnZhbCIsImZyYW1lIiwiY2hhbGsiLCJjeWFuIiwibG9nVXBkYXRlIiwic3RkZXJyIiwiaGlkZVNwaW5uZXIiLCJpc0V4aXQiLCJjbGVhckludGVydmFsIiwiY2xlYXIiLCJkb25lIiwid3JpdGUiLCJ0ZXh0IiwiY29uc29sZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7QUFDQTtrQkFDZTtBQUNYQSxlQUFZLElBREQ7QUFFWEMsZ0JBQVlDLGNBQUlDLE1BQUosQ0FBVyxDQUFYLEtBQWlCLENBQUNDLGNBRm5COztBQUlYQyxrQkFBZTtBQUNYO0FBQ0E7QUFDQSxZQUFJLEtBQUtKLFVBQVQsRUFBcUI7QUFDakIsa0JBQU1LLGVBQWUsK0JBQXJCOztBQUVBLGlCQUFLTixTQUFMLEdBQWlCTyxZQUFZLE1BQU07QUFDL0Isc0JBQU1DLFFBQVFDLGdCQUFNQyxJQUFOLENBQVdKLGNBQVgsQ0FBZDs7QUFFQUssNkNBQVVDLE1BQVYsQ0FBaUJKLEtBQWpCO0FBQ0gsYUFKZ0IsRUFJZCxFQUpjLENBQWpCO0FBS0g7QUFDSixLQWhCVTs7QUFrQlhLLGdCQUFhQyxNQUFiLEVBQXFCO0FBQ2pCLFlBQUksS0FBS2QsU0FBVCxFQUFvQjtBQUNoQmUsMEJBQWMsS0FBS2YsU0FBbkI7QUFDQVcseUNBQVVDLE1BQVYsQ0FBaUJJLEtBQWpCOztBQUVBLGdCQUFJRixNQUFKLEVBQ0lILDZCQUFVQyxNQUFWLENBQWlCSyxJQUFqQjs7QUFFSixpQkFBS2pCLFNBQUwsR0FBaUIsSUFBakI7QUFDSDtBQUNKLEtBNUJVOztBQThCWGtCLFVBQU9DLElBQVAsRUFBYTtBQUNUQyxnQkFBUUMsS0FBUixDQUFjRixJQUFkO0FBQ0g7QUFoQ1UsQyIsImZpbGUiOiJjbGkvbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR0eSBmcm9tICd0dHknO1xuaW1wb3J0IGVsZWdhbnRTcGlubmVyIGZyb20gJ2VsZWdhbnQtc3Bpbm5lcic7XG5pbXBvcnQgbG9nVXBkYXRlIGZyb20gJ2xvZy11cGRhdGUtYXN5bmMtaG9vayc7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IGlzQ0kgZnJvbSAnaXMtY2knO1xuXG4vLyBOT1RFOiBUbyBzdXBwb3J0IHBpcGluZywgd2UgdXNlIHN0ZGVyciBhcyB0aGUgbG9nIG91dHB1dFxuLy8gc3RyZWFtLCB3aGlsZSBzdGRvdXQgaXMgdXNlZCBmb3IgdGhlIHJlcG9ydCBvdXRwdXQuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgYW5pbWF0aW9uOiAgbnVsbCxcbiAgICBpc0FuaW1hdGVkOiB0dHkuaXNhdHR5KDEpICYmICFpc0NJLFxuXG4gICAgc2hvd1NwaW5uZXIgKCkge1xuICAgICAgICAvLyBOT1RFOiB3ZSBjYW4gdXNlIHRoZSBzcGlubmVyIG9ubHkgaWYgc3RkZXJyIGlzIGEgVFRZIGFuZCB3ZSBhcmUgbm90IGluIENJIGVudmlyb25tZW50IChlLmcuIFRyYXZpc0NJKSxcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHdlIGNhbid0IHJlcGFpbnQgYW5pbWF0aW9uIGZyYW1lcy4gVGhhbmtzIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvb3JhIGZvciBpbnNpZ2h0LlxuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGVkKSB7XG4gICAgICAgICAgICBjb25zdCBzcGlubmVyRnJhbWUgPSBlbGVnYW50U3Bpbm5lcigpO1xuXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmcmFtZSA9IGNoYWxrLmN5YW4oc3Bpbm5lckZyYW1lKCkpO1xuXG4gICAgICAgICAgICAgICAgbG9nVXBkYXRlLnN0ZGVycihmcmFtZSk7XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaGlkZVNwaW5uZXIgKGlzRXhpdCkge1xuICAgICAgICBpZiAodGhpcy5hbmltYXRpb24pIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5hbmltYXRpb24pO1xuICAgICAgICAgICAgbG9nVXBkYXRlLnN0ZGVyci5jbGVhcigpO1xuXG4gICAgICAgICAgICBpZiAoaXNFeGl0KVxuICAgICAgICAgICAgICAgIGxvZ1VwZGF0ZS5zdGRlcnIuZG9uZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgd3JpdGUgKHRleHQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih0ZXh0KTtcbiAgICB9XG59O1xuXG4iXX0=
