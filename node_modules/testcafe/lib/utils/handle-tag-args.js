"use strict";

exports.__esModule = true;

var _raw = require("babel-runtime/core-js/string/raw");

var _raw2 = _interopRequireDefault(_raw);

exports.default = handleTagArgs;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleTagArgs(firstArg, rest) {
    if (Array.isArray(firstArg) && Array.isArray(firstArg.raw)) return _raw2.default.call(null, firstArg, ...rest);

    return firstArg;
}
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9oYW5kbGUtdGFnLWFyZ3MuanMiXSwibmFtZXMiOlsiaGFuZGxlVGFnQXJncyIsImZpcnN0QXJnIiwicmVzdCIsIkFycmF5IiwiaXNBcnJheSIsInJhdyIsImNhbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQUF3QkEsYTs7OztBQUFULFNBQVNBLGFBQVQsQ0FBd0JDLFFBQXhCLEVBQWtDQyxJQUFsQyxFQUF3QztBQUNuRCxRQUFJQyxNQUFNQyxPQUFOLENBQWNILFFBQWQsS0FBMkJFLE1BQU1DLE9BQU4sQ0FBY0gsU0FBU0ksR0FBdkIsQ0FBL0IsRUFDSSxPQUFPLGNBQVdDLElBQVgsQ0FBZ0IsSUFBaEIsRUFBc0JMLFFBQXRCLEVBQWdDLEdBQUdDLElBQW5DLENBQVA7O0FBRUosV0FBT0QsUUFBUDtBQUNIIiwiZmlsZSI6InV0aWxzL2hhbmRsZS10YWctYXJncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhhbmRsZVRhZ0FyZ3MgKGZpcnN0QXJnLCByZXN0KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZmlyc3RBcmcpICYmIEFycmF5LmlzQXJyYXkoZmlyc3RBcmcucmF3KSlcbiAgICAgICAgcmV0dXJuIFN0cmluZy5yYXcuY2FsbChudWxsLCBmaXJzdEFyZywgLi4ucmVzdCk7XG5cbiAgICByZXR1cm4gZmlyc3RBcmc7XG59XG4iXX0=
