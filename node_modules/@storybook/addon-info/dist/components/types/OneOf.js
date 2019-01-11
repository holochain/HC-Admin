"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.array.map");

var _react = _interopRequireDefault(require("react"));

var _proptypes = require("./proptypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var joinValues = function joinValues(propTypes) {
  return propTypes.map(function (_ref) {
    var value = _ref.value;
    return value;
  }).join(' | ');
};

var OneOf = function OneOf(_ref2) {
  var propType = _ref2.propType;
  var propTypes = (0, _proptypes.getPropTypes)(propType);
  return _react.default.createElement("span", null, "oneOf ".concat(Array.isArray(propTypes) ? joinValues(propTypes) : propTypes));
};

OneOf.propTypes = {
  propType: _proptypes.TypeInfo.isRequired
};
var _default = OneOf;
exports.default = _default;