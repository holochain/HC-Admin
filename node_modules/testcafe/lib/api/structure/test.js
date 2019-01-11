'use strict';

exports.__esModule = true;

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _testingUnit = require('./testing-unit');

var _testingUnit2 = _interopRequireDefault(_testingUnit);

var _typeAssertions = require('../../errors/runtime/type-assertions');

var _wrapTestFunction = require('../wrap-test-function');

var _wrapTestFunction2 = _interopRequireDefault(_wrapTestFunction);

var _assertType = require('../request-hooks/assert-type');

var _assertType2 = _interopRequireDefault(_assertType);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Test extends _testingUnit2.default {
    constructor(testFile) {
        super(testFile, 'test');

        this.fixture = testFile.currentFixture;

        this.fn = null;
        this.beforeFn = null;
        this.afterFn = null;
        this.requestHooks = [];

        return this.apiOrigin;
    }

    _add(name, fn) {
        (0, _typeAssertions.assertType)(_typeAssertions.is.string, 'apiOrigin', 'The test name', name);
        (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'apiOrigin', 'The test body', fn);
        (0, _typeAssertions.assertType)(_typeAssertions.is.nonNullObject, 'apiOrigin', `The fixture of '${name}' test`, this.fixture);

        this.name = name;
        this.fn = (0, _wrapTestFunction2.default)(fn);
        this.requestHooks = (0, _lodash.union)(this.requestHooks, (0, _from2.default)(this.fixture.requestHooks));

        if (this.testFile.collectedTests.indexOf(this) < 0) this.testFile.collectedTests.push(this);

        return this.apiOrigin;
    }

    _before$(fn) {
        (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'before', 'test.before hook', fn);

        this.beforeFn = (0, _wrapTestFunction2.default)(fn);

        return this.apiOrigin;
    }

    _after$(fn) {
        (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'after', 'test.after hook', fn);

        this.afterFn = (0, _wrapTestFunction2.default)(fn);

        return this.apiOrigin;
    }

    _requestHooks$(...hooks) {
        hooks = (0, _lodash.flattenDeep)(hooks);

        (0, _assertType2.default)(hooks);

        this.requestHooks = (0, _lodash.union)(this.requestHooks, hooks);

        return this.apiOrigin;
    }
}

exports.default = Test;
_testingUnit2.default._makeAPIListForChildClass(Test);
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RydWN0dXJlL3Rlc3QuanMiXSwibmFtZXMiOlsiVGVzdCIsIlRlc3RpbmdVbml0IiwiY29uc3RydWN0b3IiLCJ0ZXN0RmlsZSIsImZpeHR1cmUiLCJjdXJyZW50Rml4dHVyZSIsImZuIiwiYmVmb3JlRm4iLCJhZnRlckZuIiwicmVxdWVzdEhvb2tzIiwiYXBpT3JpZ2luIiwiX2FkZCIsIm5hbWUiLCJpcyIsInN0cmluZyIsImZ1bmN0aW9uIiwibm9uTnVsbE9iamVjdCIsImNvbGxlY3RlZFRlc3RzIiwiaW5kZXhPZiIsInB1c2giLCJfYmVmb3JlJCIsIl9hZnRlciQiLCJfcmVxdWVzdEhvb2tzJCIsImhvb2tzIiwiX21ha2VBUElMaXN0Rm9yQ2hpbGRDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVlLE1BQU1BLElBQU4sU0FBbUJDLHFCQUFuQixDQUErQjtBQUMxQ0MsZ0JBQWFDLFFBQWIsRUFBdUI7QUFDbkIsY0FBTUEsUUFBTixFQUFnQixNQUFoQjs7QUFFQSxhQUFLQyxPQUFMLEdBQWVELFNBQVNFLGNBQXhCOztBQUVBLGFBQUtDLEVBQUwsR0FBb0IsSUFBcEI7QUFDQSxhQUFLQyxRQUFMLEdBQW9CLElBQXBCO0FBQ0EsYUFBS0MsT0FBTCxHQUFvQixJQUFwQjtBQUNBLGFBQUtDLFlBQUwsR0FBb0IsRUFBcEI7O0FBRUEsZUFBTyxLQUFLQyxTQUFaO0FBQ0g7O0FBRURDLFNBQU1DLElBQU4sRUFBWU4sRUFBWixFQUFnQjtBQUNaLHdDQUFXTyxtQkFBR0MsTUFBZCxFQUFzQixXQUF0QixFQUFtQyxlQUFuQyxFQUFvREYsSUFBcEQ7QUFDQSx3Q0FBV0MsbUJBQUdFLFFBQWQsRUFBd0IsV0FBeEIsRUFBcUMsZUFBckMsRUFBc0RULEVBQXREO0FBQ0Esd0NBQVdPLG1CQUFHRyxhQUFkLEVBQTZCLFdBQTdCLEVBQTJDLG1CQUFrQkosSUFBSyxRQUFsRSxFQUEyRSxLQUFLUixPQUFoRjs7QUFFQSxhQUFLUSxJQUFMLEdBQW9CQSxJQUFwQjtBQUNBLGFBQUtOLEVBQUwsR0FBb0IsZ0NBQWlCQSxFQUFqQixDQUFwQjtBQUNBLGFBQUtHLFlBQUwsR0FBb0IsbUJBQU0sS0FBS0EsWUFBWCxFQUF5QixvQkFBVyxLQUFLTCxPQUFMLENBQWFLLFlBQXhCLENBQXpCLENBQXBCOztBQUVBLFlBQUksS0FBS04sUUFBTCxDQUFjYyxjQUFkLENBQTZCQyxPQUE3QixDQUFxQyxJQUFyQyxJQUE2QyxDQUFqRCxFQUNJLEtBQUtmLFFBQUwsQ0FBY2MsY0FBZCxDQUE2QkUsSUFBN0IsQ0FBa0MsSUFBbEM7O0FBRUosZUFBTyxLQUFLVCxTQUFaO0FBQ0g7O0FBRURVLGFBQVVkLEVBQVYsRUFBYztBQUNWLHdDQUFXTyxtQkFBR0UsUUFBZCxFQUF3QixRQUF4QixFQUFrQyxrQkFBbEMsRUFBc0RULEVBQXREOztBQUVBLGFBQUtDLFFBQUwsR0FBZ0IsZ0NBQWlCRCxFQUFqQixDQUFoQjs7QUFFQSxlQUFPLEtBQUtJLFNBQVo7QUFDSDs7QUFFRFcsWUFBU2YsRUFBVCxFQUFhO0FBQ1Qsd0NBQVdPLG1CQUFHRSxRQUFkLEVBQXdCLE9BQXhCLEVBQWlDLGlCQUFqQyxFQUFvRFQsRUFBcEQ7O0FBRUEsYUFBS0UsT0FBTCxHQUFlLGdDQUFpQkYsRUFBakIsQ0FBZjs7QUFFQSxlQUFPLEtBQUtJLFNBQVo7QUFDSDs7QUFFRFksbUJBQWdCLEdBQUdDLEtBQW5CLEVBQTBCO0FBQ3RCQSxnQkFBUSx5QkFBUUEsS0FBUixDQUFSOztBQUVBLGtDQUFzQkEsS0FBdEI7O0FBRUEsYUFBS2QsWUFBTCxHQUFvQixtQkFBTSxLQUFLQSxZQUFYLEVBQXlCYyxLQUF6QixDQUFwQjs7QUFFQSxlQUFPLEtBQUtiLFNBQVo7QUFDSDtBQXJEeUM7O2tCQUF6QlYsSTtBQXdEckJDLHNCQUFZdUIseUJBQVosQ0FBc0N4QixJQUF0QyIsImZpbGUiOiJhcGkvc3RydWN0dXJlL3Rlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVzdGluZ1VuaXQgZnJvbSAnLi90ZXN0aW5nLXVuaXQnO1xuaW1wb3J0IHsgYXNzZXJ0VHlwZSwgaXMgfSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZS90eXBlLWFzc2VydGlvbnMnO1xuaW1wb3J0IHdyYXBUZXN0RnVuY3Rpb24gZnJvbSAnLi4vd3JhcC10ZXN0LWZ1bmN0aW9uJztcbmltcG9ydCBhc3NlcnRSZXF1ZXN0SG9va1R5cGUgZnJvbSAnLi4vcmVxdWVzdC1ob29rcy9hc3NlcnQtdHlwZSc7XG5pbXBvcnQgeyBmbGF0dGVuRGVlcCBhcyBmbGF0dGVuLCB1bmlvbiB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlc3QgZXh0ZW5kcyBUZXN0aW5nVW5pdCB7XG4gICAgY29uc3RydWN0b3IgKHRlc3RGaWxlKSB7XG4gICAgICAgIHN1cGVyKHRlc3RGaWxlLCAndGVzdCcpO1xuXG4gICAgICAgIHRoaXMuZml4dHVyZSA9IHRlc3RGaWxlLmN1cnJlbnRGaXh0dXJlO1xuXG4gICAgICAgIHRoaXMuZm4gICAgICAgICAgID0gbnVsbDtcbiAgICAgICAgdGhpcy5iZWZvcmVGbiAgICAgPSBudWxsO1xuICAgICAgICB0aGlzLmFmdGVyRm4gICAgICA9IG51bGw7XG4gICAgICAgIHRoaXMucmVxdWVzdEhvb2tzID0gW107XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9hZGQgKG5hbWUsIGZuKSB7XG4gICAgICAgIGFzc2VydFR5cGUoaXMuc3RyaW5nLCAnYXBpT3JpZ2luJywgJ1RoZSB0ZXN0IG5hbWUnLCBuYW1lKTtcbiAgICAgICAgYXNzZXJ0VHlwZShpcy5mdW5jdGlvbiwgJ2FwaU9yaWdpbicsICdUaGUgdGVzdCBib2R5JywgZm4pO1xuICAgICAgICBhc3NlcnRUeXBlKGlzLm5vbk51bGxPYmplY3QsICdhcGlPcmlnaW4nLCBgVGhlIGZpeHR1cmUgb2YgJyR7bmFtZX0nIHRlc3RgLCB0aGlzLmZpeHR1cmUpO1xuXG4gICAgICAgIHRoaXMubmFtZSAgICAgICAgID0gbmFtZTtcbiAgICAgICAgdGhpcy5mbiAgICAgICAgICAgPSB3cmFwVGVzdEZ1bmN0aW9uKGZuKTtcbiAgICAgICAgdGhpcy5yZXF1ZXN0SG9va3MgPSB1bmlvbih0aGlzLnJlcXVlc3RIb29rcywgQXJyYXkuZnJvbSh0aGlzLmZpeHR1cmUucmVxdWVzdEhvb2tzKSk7XG5cbiAgICAgICAgaWYgKHRoaXMudGVzdEZpbGUuY29sbGVjdGVkVGVzdHMuaW5kZXhPZih0aGlzKSA8IDApXG4gICAgICAgICAgICB0aGlzLnRlc3RGaWxlLmNvbGxlY3RlZFRlc3RzLnB1c2godGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9iZWZvcmUkIChmbikge1xuICAgICAgICBhc3NlcnRUeXBlKGlzLmZ1bmN0aW9uLCAnYmVmb3JlJywgJ3Rlc3QuYmVmb3JlIGhvb2snLCBmbik7XG5cbiAgICAgICAgdGhpcy5iZWZvcmVGbiA9IHdyYXBUZXN0RnVuY3Rpb24oZm4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwaU9yaWdpbjtcbiAgICB9XG5cbiAgICBfYWZ0ZXIkIChmbikge1xuICAgICAgICBhc3NlcnRUeXBlKGlzLmZ1bmN0aW9uLCAnYWZ0ZXInLCAndGVzdC5hZnRlciBob29rJywgZm4pO1xuXG4gICAgICAgIHRoaXMuYWZ0ZXJGbiA9IHdyYXBUZXN0RnVuY3Rpb24oZm4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwaU9yaWdpbjtcbiAgICB9XG5cbiAgICBfcmVxdWVzdEhvb2tzJCAoLi4uaG9va3MpIHtcbiAgICAgICAgaG9va3MgPSBmbGF0dGVuKGhvb2tzKTtcblxuICAgICAgICBhc3NlcnRSZXF1ZXN0SG9va1R5cGUoaG9va3MpO1xuXG4gICAgICAgIHRoaXMucmVxdWVzdEhvb2tzID0gdW5pb24odGhpcy5yZXF1ZXN0SG9va3MsIGhvb2tzKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxufVxuXG5UZXN0aW5nVW5pdC5fbWFrZUFQSUxpc3RGb3JDaGlsZENsYXNzKFRlc3QpO1xuIl19
