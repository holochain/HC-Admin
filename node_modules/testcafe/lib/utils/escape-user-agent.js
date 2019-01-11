'use strict';

exports.__esModule = true;
exports.default = escapeUserAgent;

var _sanitizeFilename = require('sanitize-filename');

var _sanitizeFilename2 = _interopRequireDefault(_sanitizeFilename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function escapeUserAgent(userAgent) {
    return (0, _sanitizeFilename2.default)(userAgent.toString()).replace(/\s+/g, '_');
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9lc2NhcGUtdXNlci1hZ2VudC5qcyJdLCJuYW1lcyI6WyJlc2NhcGVVc2VyQWdlbnQiLCJ1c2VyQWdlbnQiLCJ0b1N0cmluZyIsInJlcGxhY2UiXSwibWFwcGluZ3MiOiI7OztrQkFFd0JBLGU7O0FBRnhCOzs7Ozs7QUFFZSxTQUFTQSxlQUFULENBQTBCQyxTQUExQixFQUFxQztBQUNoRCxXQUFPLGdDQUFpQkEsVUFBVUMsUUFBVixFQUFqQixFQUF1Q0MsT0FBdkMsQ0FBK0MsTUFBL0MsRUFBdUQsR0FBdkQsQ0FBUDtBQUNIIiwiZmlsZSI6InV0aWxzL2VzY2FwZS11c2VyLWFnZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNhbml0aXplRmlsZW5hbWUgZnJvbSAnc2FuaXRpemUtZmlsZW5hbWUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlc2NhcGVVc2VyQWdlbnQgKHVzZXJBZ2VudCkge1xuICAgIHJldHVybiBzYW5pdGl6ZUZpbGVuYW1lKHVzZXJBZ2VudC50b1N0cmluZygpKS5yZXBsYWNlKC9cXHMrL2csICdfJyk7XG59XG4iXX0=
