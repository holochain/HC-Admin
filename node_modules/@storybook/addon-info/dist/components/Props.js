"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Props;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.function.name");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.array.filter");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _PropVal = _interopRequireDefault(require("./PropVal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var stylesheet = {
  propStyle: {},
  propNameStyle: {},
  propValueStyle: {}
};

function Props(props) {
  var maxPropsIntoLine = props.maxPropsIntoLine,
      maxPropArrayLength = props.maxPropArrayLength,
      maxPropObjectKeys = props.maxPropObjectKeys,
      maxPropStringLength = props.maxPropStringLength,
      node = props.node,
      singleLine = props.singleLine;
  var nodeProps = node.props;
  var defaultProps = node.type.defaultProps;

  if (!nodeProps || _typeof(nodeProps) !== 'object') {
    return _react.default.createElement("span", null);
  }

  var propValueStyle = stylesheet.propValueStyle,
      propNameStyle = stylesheet.propNameStyle;
  var names = Object.keys(nodeProps).filter(function (name) {
    return name[0] !== '_' && name !== 'children' && (!defaultProps || nodeProps[name] !== defaultProps[name]);
  });
  var breakIntoNewLines = names.length > maxPropsIntoLine;
  var endingSpace = singleLine ? ' ' : '';
  var items = [];
  names.forEach(function (name, i) {
    items.push(_react.default.createElement("span", {
      key: name
    }, breakIntoNewLines ? _react.default.createElement("span", null, _react.default.createElement("br", null), "\xA0\xA0") : ' ', _react.default.createElement("span", {
      style: propNameStyle
    }, name), (!nodeProps[name] || typeof nodeProps[name] !== 'boolean') && _react.default.createElement("span", null, "=", _react.default.createElement("span", {
      style: propValueStyle
    }, typeof nodeProps[name] === 'string' ? '"' : '{', _react.default.createElement(_PropVal.default, {
      val: nodeProps[name],
      maxPropObjectKeys: maxPropObjectKeys,
      maxPropArrayLength: maxPropArrayLength,
      maxPropStringLength: maxPropStringLength,
      maxPropsIntoLine: maxPropsIntoLine
    }), typeof nodeProps[name] === 'string' ? '"' : '}')), i === names.length - 1 && (breakIntoNewLines ? _react.default.createElement("br", null) : endingSpace)));
  });
  return _react.default.createElement("span", null, items);
}

Props.defaultProps = {
  singleLine: false
};
Props.propTypes = {
  node: _propTypes.default.node.isRequired,
  singleLine: _propTypes.default.bool,
  maxPropsIntoLine: _propTypes.default.number.isRequired,
  maxPropObjectKeys: _propTypes.default.number.isRequired,
  maxPropArrayLength: _propTypes.default.number.isRequired,
  maxPropStringLength: _propTypes.default.number.isRequired
};