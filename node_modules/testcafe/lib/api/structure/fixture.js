'use strict';

exports.__esModule = true;

var _typeAssertions = require('../../errors/runtime/type-assertions');

var _handleTagArgs = require('../../utils/handle-tag-args');

var _handleTagArgs2 = _interopRequireDefault(_handleTagArgs);

var _testingUnit = require('./testing-unit');

var _testingUnit2 = _interopRequireDefault(_testingUnit);

var _wrapTestFunction = require('../wrap-test-function');

var _wrapTestFunction2 = _interopRequireDefault(_wrapTestFunction);

var _assertType = require('../request-hooks/assert-type');

var _assertType2 = _interopRequireDefault(_assertType);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Fixture extends _testingUnit2.default {
    constructor(testFile) {
        super(testFile, 'fixture');

        this.path = testFile.filename;

        this.pageUrl = 'about:blank';

        this.beforeEachFn = null;
        this.afterEachFn = null;

        this.beforeFn = null;
        this.afterFn = null;

        this.requestHooks = [];

        return this.apiOrigin;
    }

    _add(name, ...rest) {
        name = (0, _handleTagArgs2.default)(name, rest);

        (0, _typeAssertions.assertType)(_typeAssertions.is.string, 'apiOrigin', 'The fixture name', name);

        this.name = name;
        this.testFile.currentFixture = this;

        return this.apiOrigin;
    }

    _before$(fn) {
        (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'before', 'fixture.before hook', fn);

        this.beforeFn = fn;

        return this.apiOrigin;
    }

    _after$(fn) {
        (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'after', 'fixture.after hook', fn);

        this.afterFn = fn;

        return this.apiOrigin;
    }

    _beforeEach$(fn) {
        (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'beforeEach', 'fixture.beforeEach hook', fn);

        this.beforeEachFn = (0, _wrapTestFunction2.default)(fn);

        return this.apiOrigin;
    }

    _afterEach$(fn) {
        (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'afterEach', 'fixture.afterEach hook', fn);

        this.afterEachFn = (0, _wrapTestFunction2.default)(fn);

        return this.apiOrigin;
    }

    _requestHooks$(...hooks) {
        hooks = (0, _lodash.flattenDeep)(hooks);

        (0, _assertType2.default)(hooks);

        this.requestHooks = hooks;

        return this.apiOrigin;
    }
}

exports.default = Fixture;
_testingUnit2.default._makeAPIListForChildClass(Fixture);
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RydWN0dXJlL2ZpeHR1cmUuanMiXSwibmFtZXMiOlsiRml4dHVyZSIsIlRlc3RpbmdVbml0IiwiY29uc3RydWN0b3IiLCJ0ZXN0RmlsZSIsInBhdGgiLCJmaWxlbmFtZSIsInBhZ2VVcmwiLCJiZWZvcmVFYWNoRm4iLCJhZnRlckVhY2hGbiIsImJlZm9yZUZuIiwiYWZ0ZXJGbiIsInJlcXVlc3RIb29rcyIsImFwaU9yaWdpbiIsIl9hZGQiLCJuYW1lIiwicmVzdCIsImlzIiwic3RyaW5nIiwiY3VycmVudEZpeHR1cmUiLCJfYmVmb3JlJCIsImZuIiwiZnVuY3Rpb24iLCJfYWZ0ZXIkIiwiX2JlZm9yZUVhY2gkIiwiX2FmdGVyRWFjaCQiLCJfcmVxdWVzdEhvb2tzJCIsImhvb2tzIiwiX21ha2VBUElMaXN0Rm9yQ2hpbGRDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFZSxNQUFNQSxPQUFOLFNBQXNCQyxxQkFBdEIsQ0FBa0M7QUFDN0NDLGdCQUFhQyxRQUFiLEVBQXVCO0FBQ25CLGNBQU1BLFFBQU4sRUFBZ0IsU0FBaEI7O0FBRUEsYUFBS0MsSUFBTCxHQUFZRCxTQUFTRSxRQUFyQjs7QUFFQSxhQUFLQyxPQUFMLEdBQWUsYUFBZjs7QUFFQSxhQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsYUFBS0MsV0FBTCxHQUFvQixJQUFwQjs7QUFFQSxhQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsYUFBS0MsT0FBTCxHQUFnQixJQUFoQjs7QUFFQSxhQUFLQyxZQUFMLEdBQW9CLEVBQXBCOztBQUVBLGVBQU8sS0FBS0MsU0FBWjtBQUNIOztBQUVEQyxTQUFNQyxJQUFOLEVBQVksR0FBR0MsSUFBZixFQUFxQjtBQUNqQkQsZUFBTyw2QkFBY0EsSUFBZCxFQUFvQkMsSUFBcEIsQ0FBUDs7QUFFQSx3Q0FBV0MsbUJBQUdDLE1BQWQsRUFBc0IsV0FBdEIsRUFBbUMsa0JBQW5DLEVBQXVESCxJQUF2RDs7QUFFQSxhQUFLQSxJQUFMLEdBQStCQSxJQUEvQjtBQUNBLGFBQUtYLFFBQUwsQ0FBY2UsY0FBZCxHQUErQixJQUEvQjs7QUFFQSxlQUFPLEtBQUtOLFNBQVo7QUFDSDs7QUFFRE8sYUFBVUMsRUFBVixFQUFjO0FBQ1Ysd0NBQVdKLG1CQUFHSyxRQUFkLEVBQXdCLFFBQXhCLEVBQWtDLHFCQUFsQyxFQUF5REQsRUFBekQ7O0FBRUEsYUFBS1gsUUFBTCxHQUFnQlcsRUFBaEI7O0FBRUEsZUFBTyxLQUFLUixTQUFaO0FBQ0g7O0FBRURVLFlBQVNGLEVBQVQsRUFBYTtBQUNULHdDQUFXSixtQkFBR0ssUUFBZCxFQUF3QixPQUF4QixFQUFpQyxvQkFBakMsRUFBdURELEVBQXZEOztBQUVBLGFBQUtWLE9BQUwsR0FBZVUsRUFBZjs7QUFFQSxlQUFPLEtBQUtSLFNBQVo7QUFDSDs7QUFFRFcsaUJBQWNILEVBQWQsRUFBa0I7QUFDZCx3Q0FBV0osbUJBQUdLLFFBQWQsRUFBd0IsWUFBeEIsRUFBc0MseUJBQXRDLEVBQWlFRCxFQUFqRTs7QUFFQSxhQUFLYixZQUFMLEdBQW9CLGdDQUFpQmEsRUFBakIsQ0FBcEI7O0FBRUEsZUFBTyxLQUFLUixTQUFaO0FBQ0g7O0FBRURZLGdCQUFhSixFQUFiLEVBQWlCO0FBQ2Isd0NBQVdKLG1CQUFHSyxRQUFkLEVBQXdCLFdBQXhCLEVBQXFDLHdCQUFyQyxFQUErREQsRUFBL0Q7O0FBRUEsYUFBS1osV0FBTCxHQUFtQixnQ0FBaUJZLEVBQWpCLENBQW5COztBQUVBLGVBQU8sS0FBS1IsU0FBWjtBQUNIOztBQUVEYSxtQkFBZ0IsR0FBR0MsS0FBbkIsRUFBMEI7QUFDdEJBLGdCQUFRLHlCQUFRQSxLQUFSLENBQVI7O0FBRUEsa0NBQXNCQSxLQUF0Qjs7QUFFQSxhQUFLZixZQUFMLEdBQW9CZSxLQUFwQjs7QUFFQSxlQUFPLEtBQUtkLFNBQVo7QUFDSDtBQXRFNEM7O2tCQUE1QlosTztBQXlFckJDLHNCQUFZMEIseUJBQVosQ0FBc0MzQixPQUF0QyIsImZpbGUiOiJhcGkvc3RydWN0dXJlL2ZpeHR1cmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NlcnRUeXBlLCBpcyB9IGZyb20gJy4uLy4uL2Vycm9ycy9ydW50aW1lL3R5cGUtYXNzZXJ0aW9ucyc7XG5pbXBvcnQgaGFuZGxlVGFnQXJncyBmcm9tICcuLi8uLi91dGlscy9oYW5kbGUtdGFnLWFyZ3MnO1xuaW1wb3J0IFRlc3RpbmdVbml0IGZyb20gJy4vdGVzdGluZy11bml0JztcbmltcG9ydCB3cmFwVGVzdEZ1bmN0aW9uIGZyb20gJy4uL3dyYXAtdGVzdC1mdW5jdGlvbic7XG5pbXBvcnQgYXNzZXJ0UmVxdWVzdEhvb2tUeXBlIGZyb20gJy4uL3JlcXVlc3QtaG9va3MvYXNzZXJ0LXR5cGUnO1xuaW1wb3J0IHsgZmxhdHRlbkRlZXAgYXMgZmxhdHRlbiB9IGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpeHR1cmUgZXh0ZW5kcyBUZXN0aW5nVW5pdCB7XG4gICAgY29uc3RydWN0b3IgKHRlc3RGaWxlKSB7XG4gICAgICAgIHN1cGVyKHRlc3RGaWxlLCAnZml4dHVyZScpO1xuXG4gICAgICAgIHRoaXMucGF0aCA9IHRlc3RGaWxlLmZpbGVuYW1lO1xuXG4gICAgICAgIHRoaXMucGFnZVVybCA9ICdhYm91dDpibGFuayc7XG5cbiAgICAgICAgdGhpcy5iZWZvcmVFYWNoRm4gPSBudWxsO1xuICAgICAgICB0aGlzLmFmdGVyRWFjaEZuICA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5iZWZvcmVGbiA9IG51bGw7XG4gICAgICAgIHRoaXMuYWZ0ZXJGbiAgPSBudWxsO1xuXG4gICAgICAgIHRoaXMucmVxdWVzdEhvb2tzID0gW107XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9hZGQgKG5hbWUsIC4uLnJlc3QpIHtcbiAgICAgICAgbmFtZSA9IGhhbmRsZVRhZ0FyZ3MobmFtZSwgcmVzdCk7XG5cbiAgICAgICAgYXNzZXJ0VHlwZShpcy5zdHJpbmcsICdhcGlPcmlnaW4nLCAnVGhlIGZpeHR1cmUgbmFtZScsIG5hbWUpO1xuXG4gICAgICAgIHRoaXMubmFtZSAgICAgICAgICAgICAgICAgICAgPSBuYW1lO1xuICAgICAgICB0aGlzLnRlc3RGaWxlLmN1cnJlbnRGaXh0dXJlID0gdGhpcztcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxuXG4gICAgX2JlZm9yZSQgKGZuKSB7XG4gICAgICAgIGFzc2VydFR5cGUoaXMuZnVuY3Rpb24sICdiZWZvcmUnLCAnZml4dHVyZS5iZWZvcmUgaG9vaycsIGZuKTtcblxuICAgICAgICB0aGlzLmJlZm9yZUZuID0gZm47XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9hZnRlciQgKGZuKSB7XG4gICAgICAgIGFzc2VydFR5cGUoaXMuZnVuY3Rpb24sICdhZnRlcicsICdmaXh0dXJlLmFmdGVyIGhvb2snLCBmbik7XG5cbiAgICAgICAgdGhpcy5hZnRlckZuID0gZm47XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9iZWZvcmVFYWNoJCAoZm4pIHtcbiAgICAgICAgYXNzZXJ0VHlwZShpcy5mdW5jdGlvbiwgJ2JlZm9yZUVhY2gnLCAnZml4dHVyZS5iZWZvcmVFYWNoIGhvb2snLCBmbik7XG5cbiAgICAgICAgdGhpcy5iZWZvcmVFYWNoRm4gPSB3cmFwVGVzdEZ1bmN0aW9uKGZuKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxuXG4gICAgX2FmdGVyRWFjaCQgKGZuKSB7XG4gICAgICAgIGFzc2VydFR5cGUoaXMuZnVuY3Rpb24sICdhZnRlckVhY2gnLCAnZml4dHVyZS5hZnRlckVhY2ggaG9vaycsIGZuKTtcblxuICAgICAgICB0aGlzLmFmdGVyRWFjaEZuID0gd3JhcFRlc3RGdW5jdGlvbihmbik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9yZXF1ZXN0SG9va3MkICguLi5ob29rcykge1xuICAgICAgICBob29rcyA9IGZsYXR0ZW4oaG9va3MpO1xuXG4gICAgICAgIGFzc2VydFJlcXVlc3RIb29rVHlwZShob29rcyk7XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0SG9va3MgPSBob29rcztcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxufVxuXG5UZXN0aW5nVW5pdC5fbWFrZUFQSUxpc3RGb3JDaGlsZENsYXNzKEZpeHR1cmUpO1xuIl19
