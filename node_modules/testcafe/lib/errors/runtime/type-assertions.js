'use strict';

exports.__esModule = true;
exports.is = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

exports.assertType = assertType;

var _lodash = require('lodash');

var _ = require('./');

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _hook = require('../../api/request-hooks/hook');

var _hook2 = _interopRequireDefault(_hook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const START_FROM_VOWEL_RE = /^[aeiou]/i;

function getIndefiniteArticle(text) {
    return START_FROM_VOWEL_RE.test(text) ? 'an' : 'a';
}

function isNonNegativeValue(value) {
    return (0, _lodash.isFinite)(value) && value >= 0;
}

function getNumberTypeActualValueMsg(value, type) {
    if (type !== 'number') return type;

    if ((0, _isNan2.default)(value)) return NaN;

    if (!(0, _lodash.isFinite)(value)) return Infinity;

    return value;
}

const is = exports.is = {
    number: {
        name: 'number',
        predicate: _lodash.isFinite,
        getActualValueMsg: getNumberTypeActualValueMsg
    },

    nonNegativeNumber: {
        name: 'non-negative number',
        predicate: isNonNegativeValue,
        getActualValueMsg: getNumberTypeActualValueMsg
    },

    nonNegativeNumberString: {
        name: 'non-negative number',
        predicate: value => isNonNegativeValue(parseInt(value, 10)),

        getActualValueMsg: value => {
            const number = parseInt(value, 10);

            return isNaN(number) ? (0, _stringify2.default)(value) : number;
        }
    },

    boolean: {
        name: 'boolean',
        predicate: (value, type) => type === 'boolean'
    },

    string: {
        name: 'string',
        predicate: (value, type) => type === 'string'
    },

    function: {
        name: 'function',
        predicate: (value, type) => type === 'function'
    },

    regExp: {
        name: 'regular expression',
        predicate: _lodash.isRegExp
    },

    array: {
        name: 'array',
        predicate: value => Array.isArray(value)
    },

    nonNullObject: {
        name: 'non-null object',
        predicate: (value, type) => type === 'object' && !(0, _lodash.isNil)(value),
        getActualValueMsg: (value, type) => (0, _lodash.isNil)(value) ? String(value) : type
    },

    requestHookSubclass: {
        name: 'RequestHook subclass',
        predicate: value => value instanceof _hook2.default && value.constructor && value.constructor !== _hook2.default
    }
};

function assertType(types, callsiteName, what, value) {
    types = Array.isArray(types) ? types : [types];

    let pass = false;
    const actualType = typeof value;
    let actualMsg = actualType;
    let expectedTypeMsg = '';
    const last = types.length - 1;

    types.forEach((type, i) => {
        pass = pass || type.predicate(value, actualType);

        if (type.getActualValueMsg) actualMsg = type.getActualValueMsg(value, actualType);

        if (i === 0) expectedTypeMsg += type.name;else expectedTypeMsg += (i === last ? ' or ' + getIndefiniteArticle(type.name) + ' ' : ', ') + type.name;
    });

    if (!pass) {
        throw callsiteName ? new _.APIError(callsiteName, _message2.default.invalidValueType, what, expectedTypeMsg, actualMsg) : new _.GeneralError(_message2.default.invalidValueType, what, expectedTypeMsg, actualMsg);
    }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lcnJvcnMvcnVudGltZS90eXBlLWFzc2VydGlvbnMuanMiXSwibmFtZXMiOlsiYXNzZXJ0VHlwZSIsIlNUQVJUX0ZST01fVk9XRUxfUkUiLCJnZXRJbmRlZmluaXRlQXJ0aWNsZSIsInRleHQiLCJ0ZXN0IiwiaXNOb25OZWdhdGl2ZVZhbHVlIiwidmFsdWUiLCJnZXROdW1iZXJUeXBlQWN0dWFsVmFsdWVNc2ciLCJ0eXBlIiwiTmFOIiwiSW5maW5pdHkiLCJpcyIsIm51bWJlciIsIm5hbWUiLCJwcmVkaWNhdGUiLCJpc0Zpbml0ZU51bWJlciIsImdldEFjdHVhbFZhbHVlTXNnIiwibm9uTmVnYXRpdmVOdW1iZXIiLCJub25OZWdhdGl2ZU51bWJlclN0cmluZyIsInBhcnNlSW50IiwiaXNOYU4iLCJib29sZWFuIiwic3RyaW5nIiwiZnVuY3Rpb24iLCJyZWdFeHAiLCJpc1JlZ0V4cCIsImFycmF5IiwiQXJyYXkiLCJpc0FycmF5Iiwibm9uTnVsbE9iamVjdCIsIlN0cmluZyIsInJlcXVlc3RIb29rU3ViY2xhc3MiLCJSZXF1ZXN0SG9vayIsImNvbnN0cnVjdG9yIiwidHlwZXMiLCJjYWxsc2l0ZU5hbWUiLCJ3aGF0IiwicGFzcyIsImFjdHVhbFR5cGUiLCJhY3R1YWxNc2ciLCJleHBlY3RlZFR5cGVNc2ciLCJsYXN0IiwibGVuZ3RoIiwiZm9yRWFjaCIsImkiLCJBUElFcnJvciIsIk1FU1NBR0UiLCJpbnZhbGlkVmFsdWVUeXBlIiwiR2VuZXJhbEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O1FBeUZnQkEsVSxHQUFBQSxVOztBQXpGaEI7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTUMsc0JBQXNCLFdBQTVCOztBQUVBLFNBQVNDLG9CQUFULENBQStCQyxJQUEvQixFQUFxQztBQUNqQyxXQUFPRixvQkFBb0JHLElBQXBCLENBQXlCRCxJQUF6QixJQUFpQyxJQUFqQyxHQUF3QyxHQUEvQztBQUNIOztBQUVE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UTdCLEtBQUtNLFNBQUwsQ0FBZVIsS0FBZixFQUFzQmdDLFVBQXRCLENBQWY7O0FBRUEsWUFBSTlCLEtBQUtRLGlCQUFULEVBQ0l1QixZQUFZL0IsS0FBS1EsaUJBQUwsQ0FBdUJWLEtBQXZCLEVBQThCZ0MsVUFBOUIsQ0FBWjs7QUFFSixZQUFJTSxNQUFNLENBQVYsRUFDSUosbUJBQW1CaEMsS0FBS0ssSUFBeEIsQ0FESixLQUdJMkIsbUJBQW1CLENBQUNJLE1BQU1ILElBQU4sR0FBYSxTQUFTdkMscUJBQXFCTSxLQUFLSyxJQUExQixDQUFULEdBQTJDLEdBQXhELEdBQThELElBQS9ELElBQXVFTCxLQUFLSyxJQUEvRjtBQUNQLEtBVkQ7O0FBWUEsUUFBSSxDQUFDd0IsSUFBTCxFQUFXO0FBQ1AsY0FBTUYsZUFDRixJQUFJVSxVQUFKLENBQWFWLFlBQWIsRUFBMkJXLGtCQUFRQyxnQkFBbkMsRUFBcURYLElBQXJELEVBQTJESSxlQUEzRCxFQUE0RUQsU0FBNUUsQ0FERSxHQUVGLElBQUlTLGNBQUosQ0FBaUJGLGtCQUFRQyxnQkFBekIsRUFBMkNYLElBQTNDLEVBQWlESSxlQUFqRCxFQUFrRUQsU0FBbEUsQ0FGSjtBQUdIO0FBQ0oiLCJmaWxlIjoiZXJyb3JzL3J1bnRpbWUvdHlwZS1hc3NlcnRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNGaW5pdGUgYXMgaXNGaW5pdGVOdW1iZXIsIGlzUmVnRXhwLCBpc05pbCBhcyBpc051bGxPclVuZGVmaW5lZCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBBUElFcnJvciwgR2VuZXJhbEVycm9yIH0gZnJvbSAnLi8nO1xuaW1wb3J0IE1FU1NBR0UgZnJvbSAnLi9tZXNzYWdlJztcbmltcG9ydCBSZXF1ZXN0SG9vayBmcm9tICcuLi8uLi9hcGkvcmVxdWVzdC1ob29rcy9ob29rJztcblxuY29uc3QgU1RBUlRfRlJPTV9WT1dFTF9SRSA9IC9eW2FlaW91XS9pO1xuXG5mdW5jdGlvbiBnZXRJbmRlZmluaXRlQXJ0aWNsZSAodGV4dCkge1xuICAgIHJldHVybiBTVEFSVF9GUk9NX1ZPV0VMX1JFLnRlc3QodGV4dCkgPyAnYW4nIDogJ2EnO1xufVxuXG5mdW5jdGlvbiBpc05vbk5lZ2F0aXZlVmFsdWUgKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSA+PSAwO1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJUeXBlQWN0dWFsVmFsdWVNc2cgKHZhbHVlLCB0eXBlKSB7XG4gICAgaWYgKHR5cGUgIT09ICdudW1iZXInKVxuICAgICAgICByZXR1cm4gdHlwZTtcblxuICAgIGlmIChOdW1iZXIuaXNOYU4odmFsdWUpKVxuICAgICAgICByZXR1cm4gTmFOO1xuXG4gICAgaWYgKCFpc0Zpbml0ZU51bWJlcih2YWx1ZSkpXG4gICAgICAgIHJldHVybiBJbmZpbml0eTtcblxuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGNvbnN0IGlzID0ge1xuICAgIG51bWJlcjoge1xuICAgICAgICBuYW1lOiAgICAgICAgICAgICAgJ251bWJlcicsXG4gICAgICAgIHByZWRpY2F0ZTogICAgICAgICBpc0Zpbml0ZU51bWJlcixcbiAgICAgICAgZ2V0QWN0dWFsVmFsdWVNc2c6IGdldE51bWJlclR5cGVBY3R1YWxWYWx1ZU1zZ1xuICAgIH0sXG5cbiAgICBub25OZWdhdGl2ZU51bWJlcjoge1xuICAgICAgICBuYW1lOiAgICAgICAgICAgICAgJ25vbi1uZWdhdGl2ZSBudW1iZXInLFxuICAgICAgICBwcmVkaWNhdGU6ICAgICAgICAgaXNOb25OZWdhdGl2ZVZhbHVlLFxuICAgICAgICBnZXRBY3R1YWxWYWx1ZU1zZzogZ2V0TnVtYmVyVHlwZUFjdHVhbFZhbHVlTXNnXG4gICAgfSxcblxuICAgIG5vbk5lZ2F0aXZlTnVtYmVyU3RyaW5nOiB7XG4gICAgICAgIG5hbWU6ICAgICAgJ25vbi1uZWdhdGl2ZSBudW1iZXInLFxuICAgICAgICBwcmVkaWNhdGU6IHZhbHVlID0+IGlzTm9uTmVnYXRpdmVWYWx1ZShwYXJzZUludCh2YWx1ZSwgMTApKSxcblxuICAgICAgICBnZXRBY3R1YWxWYWx1ZU1zZzogdmFsdWUgPT4ge1xuICAgICAgICAgICAgY29uc3QgbnVtYmVyID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcblxuICAgICAgICAgICAgcmV0dXJuIGlzTmFOKG51bWJlcikgPyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgOiBudW1iZXI7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYm9vbGVhbjoge1xuICAgICAgICBuYW1lOiAgICAgICdib29sZWFuJyxcbiAgICAgICAgcHJlZGljYXRlOiAodmFsdWUsIHR5cGUpID0+IHR5cGUgPT09ICdib29sZWFuJ1xuICAgIH0sXG5cbiAgICBzdHJpbmc6IHtcbiAgICAgICAgbmFtZTogICAgICAnc3RyaW5nJyxcbiAgICAgICAgcHJlZGljYXRlOiAodmFsdWUsIHR5cGUpID0+IHR5cGUgPT09ICdzdHJpbmcnXG4gICAgfSxcblxuICAgIGZ1bmN0aW9uOiB7XG4gICAgICAgIG5hbWU6ICAgICAgJ2Z1bmN0aW9uJyxcbiAgICAgICAgcHJlZGljYXRlOiAodmFsdWUsIHR5cGUpID0+IHR5cGUgPT09ICdmdW5jdGlvbidcbiAgICB9LFxuXG4gICAgcmVnRXhwOiB7XG4gICAgICAgIG5hbWU6ICAgICAgJ3JlZ3VsYXIgZXhwcmVzc2lvbicsXG4gICAgICAgIHByZWRpY2F0ZTogaXNSZWdFeHBcbiAgICB9LFxuXG4gICAgYXJyYXk6IHtcbiAgICAgICAgbmFtZTogICAgICAnYXJyYXknLFxuICAgICAgICBwcmVkaWNhdGU6IHZhbHVlID0+IEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgfSxcblxuICAgIG5vbk51bGxPYmplY3Q6IHtcbiAgICAgICAgbmFtZTogICAgICAgICAgICAgICdub24tbnVsbCBvYmplY3QnLFxuICAgICAgICBwcmVkaWNhdGU6ICAgICAgICAgKHZhbHVlLCB0eXBlKSA9PiB0eXBlID09PSAnb2JqZWN0JyAmJiAhaXNOdWxsT3JVbmRlZmluZWQodmFsdWUpLFxuICAgICAgICBnZXRBY3R1YWxWYWx1ZU1zZzogKHZhbHVlLCB0eXBlKSA9PiBpc051bGxPclVuZGVmaW5lZCh2YWx1ZSkgPyBTdHJpbmcodmFsdWUpIDogdHlwZVxuICAgIH0sXG5cbiAgICByZXF1ZXN0SG9va1N1YmNsYXNzOiB7XG4gICAgICAgIG5hbWU6ICAgICAgJ1JlcXVlc3RIb29rIHN1YmNsYXNzJyxcbiAgICAgICAgcHJlZGljYXRlOiB2YWx1ZSA9PiB2YWx1ZSBpbnN0YW5jZW9mIFJlcXVlc3RIb29rICYmIHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yICE9PSBSZXF1ZXN0SG9va1xuICAgIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRUeXBlICh0eXBlcywgY2FsbHNpdGVOYW1lLCB3aGF0LCB2YWx1ZSkge1xuICAgIHR5cGVzID0gQXJyYXkuaXNBcnJheSh0eXBlcykgPyB0eXBlcyA6IFt0eXBlc107XG5cbiAgICBsZXQgcGFzcyAgICAgICAgICAgID0gZmFsc2U7XG4gICAgY29uc3QgYWN0dWFsVHlwZSAgICAgID0gdHlwZW9mIHZhbHVlO1xuICAgIGxldCBhY3R1YWxNc2cgICAgICAgPSBhY3R1YWxUeXBlO1xuICAgIGxldCBleHBlY3RlZFR5cGVNc2cgPSAnJztcbiAgICBjb25zdCBsYXN0ICAgICAgICAgICAgPSB0eXBlcy5sZW5ndGggLSAxO1xuXG4gICAgdHlwZXMuZm9yRWFjaCgodHlwZSwgaSkgPT4ge1xuICAgICAgICBwYXNzID0gcGFzcyB8fCB0eXBlLnByZWRpY2F0ZSh2YWx1ZSwgYWN0dWFsVHlwZSk7XG5cbiAgICAgICAgaWYgKHR5cGUuZ2V0QWN0dWFsVmFsdWVNc2cpXG4gICAgICAgICAgICBhY3R1YWxNc2cgPSB0eXBlLmdldEFjdHVhbFZhbHVlTXNnKHZhbHVlLCBhY3R1YWxUeXBlKTtcblxuICAgICAgICBpZiAoaSA9PT0gMClcbiAgICAgICAgICAgIGV4cGVjdGVkVHlwZU1zZyArPSB0eXBlLm5hbWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGV4cGVjdGVkVHlwZU1zZyArPSAoaSA9PT0gbGFzdCA/ICcgb3IgJyArIGdldEluZGVmaW5pdGVBcnRpY2xlKHR5cGUubmFtZSkgKyAnICcgOiAnLCAnKSArIHR5cGUubmFtZTtcbiAgICB9KTtcblxuICAgIGlmICghcGFzcykge1xuICAgICAgICB0aHJvdyBjYWxsc2l0ZU5hbWUgP1xuICAgICAgICAgICAgbmV3IEFQSUVycm9yKGNhbGxzaXRlTmFtZSwgTUVTU0FHRS5pbnZhbGlkVmFsdWVUeXBlLCB3aGF0LCBleHBlY3RlZFR5cGVNc2csIGFjdHVhbE1zZykgOlxuICAgICAgICAgICAgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLmludmFsaWRWYWx1ZVR5cGUsIHdoYXQsIGV4cGVjdGVkVHlwZU1zZywgYWN0dWFsTXNnKTtcbiAgICB9XG59XG4iXX0=
