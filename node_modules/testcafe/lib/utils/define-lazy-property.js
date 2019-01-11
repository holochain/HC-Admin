"use strict";

exports.__esModule = true;

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

exports.default = defineLazyProperty;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defineLazyProperty(obj, propName, initializer) {
    (0, _defineProperty2.default)(obj, propName, {
        propValue: null,

        get() {
            if (!this.propValue) this.propValue = initializer();

            return this.propValue;
        }
    });
}
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kZWZpbmUtbGF6eS1wcm9wZXJ0eS5qcyJdLCJuYW1lcyI6WyJkZWZpbmVMYXp5UHJvcGVydHkiLCJvYmoiLCJwcm9wTmFtZSIsImluaXRpYWxpemVyIiwicHJvcFZhbHVlIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQkFBd0JBLGtCOzs7O0FBQVQsU0FBU0Esa0JBQVQsQ0FBNkJDLEdBQTdCLEVBQWtDQyxRQUFsQyxFQUE0Q0MsV0FBNUMsRUFBeUQ7QUFDcEUsa0NBQXNCRixHQUF0QixFQUEyQkMsUUFBM0IsRUFBcUM7QUFDakNFLG1CQUFXLElBRHNCOztBQUdqQ0MsY0FBTztBQUNILGdCQUFJLENBQUMsS0FBS0QsU0FBVixFQUNJLEtBQUtBLFNBQUwsR0FBaUJELGFBQWpCOztBQUVKLG1CQUFPLEtBQUtDLFNBQVo7QUFDSDtBQVJnQyxLQUFyQztBQVVIIiwiZmlsZSI6InV0aWxzL2RlZmluZS1sYXp5LXByb3BlcnR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVmaW5lTGF6eVByb3BlcnR5IChvYmosIHByb3BOYW1lLCBpbml0aWFsaXplcikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCB7XG4gICAgICAgIHByb3BWYWx1ZTogbnVsbCxcblxuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnByb3BWYWx1ZSlcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BWYWx1ZSA9IGluaXRpYWxpemVyKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BWYWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIl19
