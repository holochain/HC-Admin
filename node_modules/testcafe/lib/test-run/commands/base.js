'use strict';

exports.__esModule = true;

var _assignable = require('../../utils/assignable');

var _assignable2 = _interopRequireDefault(_assignable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CommandBase extends _assignable2.default {
    constructor(obj, testRun, type, validateProperties = true) {
        super();

        this.type = type;

        this._assignFrom(obj, validateProperties, { testRun });
    }
}
exports.default = CommandBase;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0LXJ1bi9jb21tYW5kcy9iYXNlLmpzIl0sIm5hbWVzIjpbIkNvbW1hbmRCYXNlIiwiQXNzaWduYWJsZSIsImNvbnN0cnVjdG9yIiwib2JqIiwidGVzdFJ1biIsInR5cGUiLCJ2YWxpZGF0ZVByb3BlcnRpZXMiLCJfYXNzaWduRnJvbSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Ozs7QUFFZSxNQUFNQSxXQUFOLFNBQTBCQyxvQkFBMUIsQ0FBcUM7QUFDaERDLGdCQUFhQyxHQUFiLEVBQWtCQyxPQUFsQixFQUEyQkMsSUFBM0IsRUFBaUNDLHFCQUFxQixJQUF0RCxFQUE0RDtBQUN4RDs7QUFFQSxhQUFLRCxJQUFMLEdBQVlBLElBQVo7O0FBRUEsYUFBS0UsV0FBTCxDQUFpQkosR0FBakIsRUFBc0JHLGtCQUF0QixFQUEwQyxFQUFFRixPQUFGLEVBQTFDO0FBQ0g7QUFQK0M7a0JBQS9CSixXIiwiZmlsZSI6InRlc3QtcnVuL2NvbW1hbmRzL2Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzaWduYWJsZSBmcm9tICcuLi8uLi91dGlscy9hc3NpZ25hYmxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWFuZEJhc2UgZXh0ZW5kcyBBc3NpZ25hYmxlIHtcbiAgICBjb25zdHJ1Y3RvciAob2JqLCB0ZXN0UnVuLCB0eXBlLCB2YWxpZGF0ZVByb3BlcnRpZXMgPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcblxuICAgICAgICB0aGlzLl9hc3NpZ25Gcm9tKG9iaiwgdmFsaWRhdGVQcm9wZXJ0aWVzLCB7IHRlc3RSdW4gfSk7XG4gICAgfVxufVxuIl19
