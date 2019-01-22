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
        this.requestHooks = this.fixture.requestHooks.length ? (0, _from2.default)(this.fixture.requestHooks) : [];

        return this.apiOrigin;
    }

    _add(name, fn) {
        (0, _typeAssertions.assertType)(_typeAssertions.is.string, 'apiOrigin', 'The test name', name);
        (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'apiOrigin', 'The test body', fn);

        this.name = name;
        this.fn = (0, _wrapTestFunction2.default)(fn);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RydWN0dXJlL3Rlc3QuanMiXSwibmFtZXMiOlsiVGVzdCIsIlRlc3RpbmdVbml0IiwiY29uc3RydWN0b3IiLCJ0ZXN0RmlsZSIsImZpeHR1cmUiLCJjdXJyZW50Rml4dHVyZSIsImZuIiwiYmVmb3JlRm4iLCJhZnRlckZuIiwicmVxdWVzdEhvb2tzIiwibGVuZ3RoIiwiYXBpT3JpZ2luIiwiX2FkZCIsIm5hbWUiLCJpcyIsInN0cmluZyIsImZ1bmN0aW9uIiwiY29sbGVjdGVkVGVzdHMiLCJpbmRleE9mIiwicHVzaCIsIl9iZWZvcmUkIiwiX2FmdGVyJCIsIl9yZXF1ZXN0SG9va3MkIiwiaG9va3MiLCJfbWFrZUFQSUxpc3RGb3JDaGlsZENsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRWUsTUFBTUEsSUFBTixTQUFtQkMscUJBQW5CLENBQStCO0FBQzFDQyxnQkFBYUMsUUFBYixFQUF1QjtBQUNuQixjQUFNQSxRQUFOLEVBQWdCLE1BQWhCOztBQUVBLGFBQUtDLE9BQUwsR0FBZUQsU0FBU0UsY0FBeEI7O0FBRUEsYUFBS0MsRUFBTCxHQUFvQixJQUFwQjtBQUNBLGFBQUtDLFFBQUwsR0FBb0IsSUFBcEI7QUFDQSxhQUFLQyxPQUFMLEdBQW9CLElBQXBCO0FBQ0EsYUFBS0MsWUFBTCxHQUFvQixLQUFLTCxPQUFMLENBQWFLLFlBQWIsQ0FBMEJDLE1BQTFCLEdBQW1DLG9CQUFXLEtBQUtOLE9BQUwsQ0FBYUssWUFBeEIsQ0FBbkMsR0FBMkUsRUFBL0Y7O0FBRUEsZUFBTyxLQUFLRSxTQUFaO0FBQ0g7O0FBRURDLFNBQU1DLElBQU4sRUFBWVAsRUFBWixFQUFnQjtBQUNaLHdDQUFXUSxtQkFBR0MsTUFBZCxFQUFzQixXQUF0QixFQUFtQyxlQUFuQyxFQUFvREYsSUFBcEQ7QUFDQSx3Q0FBV0MsbUJBQUdFLFFBQWQsRUFBd0IsV0FBeEIsRUFBcUMsZUFBckMsRUFBc0RWLEVBQXREOztBQUVBLGFBQUtPLElBQUwsR0FBWUEsSUFBWjtBQUNBLGFBQUtQLEVBQUwsR0FBWSxnQ0FBaUJBLEVBQWpCLENBQVo7O0FBRUEsWUFBSSxLQUFLSCxRQUFMLENBQWNjLGNBQWQsQ0FBNkJDLE9BQTdCLENBQXFDLElBQXJDLElBQTZDLENBQWpELEVBQ0ksS0FBS2YsUUFBTCxDQUFjYyxjQUFkLENBQTZCRSxJQUE3QixDQUFrQyxJQUFsQzs7QUFFSixlQUFPLEtBQUtSLFNBQVo7QUFDSDs7QUFFRFMsYUFBVWQsRUFBVixFQUFjO0FBQ1Ysd0NBQVdRLG1CQUFHRSxRQUFkLEVBQXdCLFFBQXhCLEVBQWtDLGtCQUFsQyxFQUFzRFYsRUFBdEQ7O0FBRUEsYUFBS0MsUUFBTCxHQUFnQixnQ0FBaUJELEVBQWpCLENBQWhCOztBQUVBLGVBQU8sS0FBS0ssU0FBWjtBQUNIOztBQUVEVSxZQUFTZixFQUFULEVBQWE7QUFDVCx3Q0FBV1EsbUJBQUdFLFFBQWQsRUFBd0IsT0FBeEIsRUFBaUMsaUJBQWpDLEVBQW9EVixFQUFwRDs7QUFFQSxhQUFLRSxPQUFMLEdBQWUsZ0NBQWlCRixFQUFqQixDQUFmOztBQUVBLGVBQU8sS0FBS0ssU0FBWjtBQUNIOztBQUVEVyxtQkFBZ0IsR0FBR0MsS0FBbkIsRUFBMEI7QUFDdEJBLGdCQUFRLHlCQUFRQSxLQUFSLENBQVI7O0FBRUEsa0NBQXNCQSxLQUF0Qjs7QUFFQSxhQUFLZCxZQUFMLEdBQW9CLG1CQUFNLEtBQUtBLFlBQVgsRUFBeUJjLEtBQXpCLENBQXBCOztBQUVBLGVBQU8sS0FBS1osU0FBWjtBQUNIO0FBbkR5Qzs7a0JBQXpCWCxJO0FBc0RyQkMsc0JBQVl1Qix5QkFBWixDQUFzQ3hCLElBQXRDIiwiZmlsZSI6ImFwaS9zdHJ1Y3R1cmUvdGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXN0aW5nVW5pdCBmcm9tICcuL3Rlc3RpbmctdW5pdCc7XG5pbXBvcnQgeyBhc3NlcnRUeXBlLCBpcyB9IGZyb20gJy4uLy4uL2Vycm9ycy9ydW50aW1lL3R5cGUtYXNzZXJ0aW9ucyc7XG5pbXBvcnQgd3JhcFRlc3RGdW5jdGlvbiBmcm9tICcuLi93cmFwLXRlc3QtZnVuY3Rpb24nO1xuaW1wb3J0IGFzc2VydFJlcXVlc3RIb29rVHlwZSBmcm9tICcuLi9yZXF1ZXN0LWhvb2tzL2Fzc2VydC10eXBlJztcbmltcG9ydCB7IGZsYXR0ZW5EZWVwIGFzIGZsYXR0ZW4sIHVuaW9uIH0gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVzdCBleHRlbmRzIFRlc3RpbmdVbml0IHtcbiAgICBjb25zdHJ1Y3RvciAodGVzdEZpbGUpIHtcbiAgICAgICAgc3VwZXIodGVzdEZpbGUsICd0ZXN0Jyk7XG5cbiAgICAgICAgdGhpcy5maXh0dXJlID0gdGVzdEZpbGUuY3VycmVudEZpeHR1cmU7XG5cbiAgICAgICAgdGhpcy5mbiAgICAgICAgICAgPSBudWxsO1xuICAgICAgICB0aGlzLmJlZm9yZUZuICAgICA9IG51bGw7XG4gICAgICAgIHRoaXMuYWZ0ZXJGbiAgICAgID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZXF1ZXN0SG9va3MgPSB0aGlzLmZpeHR1cmUucmVxdWVzdEhvb2tzLmxlbmd0aCA/IEFycmF5LmZyb20odGhpcy5maXh0dXJlLnJlcXVlc3RIb29rcykgOiBbXTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxuXG4gICAgX2FkZCAobmFtZSwgZm4pIHtcbiAgICAgICAgYXNzZXJ0VHlwZShpcy5zdHJpbmcsICdhcGlPcmlnaW4nLCAnVGhlIHRlc3QgbmFtZScsIG5hbWUpO1xuICAgICAgICBhc3NlcnRUeXBlKGlzLmZ1bmN0aW9uLCAnYXBpT3JpZ2luJywgJ1RoZSB0ZXN0IGJvZHknLCBmbik7XG5cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5mbiAgID0gd3JhcFRlc3RGdW5jdGlvbihmbik7XG5cbiAgICAgICAgaWYgKHRoaXMudGVzdEZpbGUuY29sbGVjdGVkVGVzdHMuaW5kZXhPZih0aGlzKSA8IDApXG4gICAgICAgICAgICB0aGlzLnRlc3RGaWxlLmNvbGxlY3RlZFRlc3RzLnB1c2godGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9iZWZvcmUkIChmbikge1xuICAgICAgICBhc3NlcnRUeXBlKGlzLmZ1bmN0aW9uLCAnYmVmb3JlJywgJ3Rlc3QuYmVmb3JlIGhvb2snLCBmbik7XG5cbiAgICAgICAgdGhpcy5iZWZvcmVGbiA9IHdyYXBUZXN0RnVuY3Rpb24oZm4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwaU9yaWdpbjtcbiAgICB9XG5cbiAgICBfYWZ0ZXIkIChmbikge1xuICAgICAgICBhc3NlcnRUeXBlKGlzLmZ1bmN0aW9uLCAnYWZ0ZXInLCAndGVzdC5hZnRlciBob29rJywgZm4pO1xuXG4gICAgICAgIHRoaXMuYWZ0ZXJGbiA9IHdyYXBUZXN0RnVuY3Rpb24oZm4pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwaU9yaWdpbjtcbiAgICB9XG5cbiAgICBfcmVxdWVzdEhvb2tzJCAoLi4uaG9va3MpIHtcbiAgICAgICAgaG9va3MgPSBmbGF0dGVuKGhvb2tzKTtcblxuICAgICAgICBhc3NlcnRSZXF1ZXN0SG9va1R5cGUoaG9va3MpO1xuXG4gICAgICAgIHRoaXMucmVxdWVzdEhvb2tzID0gdW5pb24odGhpcy5yZXF1ZXN0SG9va3MsIGhvb2tzKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxufVxuXG5UZXN0aW5nVW5pdC5fbWFrZUFQSUxpc3RGb3JDaGlsZENsYXNzKFRlc3QpO1xuIl19
