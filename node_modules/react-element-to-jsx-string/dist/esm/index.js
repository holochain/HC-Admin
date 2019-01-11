import React, { Fragment, isValidElement } from 'react';

var spacer = (function (times, tabStop) {
  if (times === 0) {
    return '';
  }

  return new Array(times * tabStop).fill(' ').join('');
});

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

function isObjectObject(o) {
  return isobject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

var isPlainObject = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

var isRegexp = function (re) {
	return Object.prototype.toString.call(re) === '[object RegExp]';
};

var isObj = function (x) {
	var type = typeof x;
	return x !== null && (type === 'object' || type === 'function');
};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lib = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (object) { return Object
    .getOwnPropertySymbols(object)
    .filter(function (keySymbol) { return object.propertyIsEnumerable(keySymbol); }); };

});

unwrapExports(lib);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



var getOwnEnumPropSymbols = lib.default;

var stringifyObject = function (val, opts, pad) {
	var seen = [];

	return function stringify(val, opts, pad) {
		opts = opts || {};
		opts.indent = opts.indent || '\t';
		pad = pad || '';

		var tokens = void 0;

		if (opts.inlineCharacterLimit === undefined) {
			tokens = {
				newLine: '\n',
				newLineOrSpace: '\n',
				pad: pad,
				indent: pad + opts.indent
			};
		} else {
			tokens = {
				newLine: '@@__STRINGIFY_OBJECT_NEW_LINE__@@',
				newLineOrSpace: '@@__STRINGIFY_OBJECT_NEW_LINE_OR_SPACE__@@',
				pad: '@@__STRINGIFY_OBJECT_PAD__@@',
				indent: '@@__STRINGIFY_OBJECT_INDENT__@@'
			};
		}

		var expandWhiteSpace = function expandWhiteSpace(string) {
			if (opts.inlineCharacterLimit === undefined) {
				return string;
			}

			var oneLined = string.replace(new RegExp(tokens.newLine, 'g'), '').replace(new RegExp(tokens.newLineOrSpace, 'g'), ' ').replace(new RegExp(tokens.pad + '|' + tokens.indent, 'g'), '');

			if (oneLined.length <= opts.inlineCharacterLimit) {
				return oneLined;
			}

			return string.replace(new RegExp(tokens.newLine + '|' + tokens.newLineOrSpace, 'g'), '\n').replace(new RegExp(tokens.pad, 'g'), pad).replace(new RegExp(tokens.indent, 'g'), pad + opts.indent);
		};

		if (seen.indexOf(val) !== -1) {
			return '"[Circular]"';
		}

		if (val === null || val === undefined || typeof val === 'number' || typeof val === 'boolean' || typeof val === 'function' || (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'symbol' || isRegexp(val)) {
			return String(val);
		}

		if (val instanceof Date) {
			return 'new Date(\'' + val.toISOString() + '\')';
		}

		if (Array.isArray(val)) {
			if (val.length === 0) {
				return '[]';
			}

			seen.push(val);

			var ret = '[' + tokens.newLine + val.map(function (el, i) {
				var eol = val.length - 1 === i ? tokens.newLine : ',' + tokens.newLineOrSpace;
				var value = stringify(el, opts, pad + opts.indent);
				if (opts.transform) {
					value = opts.transform(val, i, value);
				}
				return tokens.indent + value + eol;
			}).join('') + tokens.pad + ']';

			seen.pop(val);

			return expandWhiteSpace(ret);
		}

		if (isObj(val)) {
			var objKeys = Object.keys(val).concat(getOwnEnumPropSymbols(val));

			if (opts.filter) {
				objKeys = objKeys.filter(function (el) {
					return opts.filter(val, el);
				});
			}

			if (objKeys.length === 0) {
				return '{}';
			}

			seen.push(val);

			var _ret = '{' + tokens.newLine + objKeys.map(function (el, i) {
				var eol = objKeys.length - 1 === i ? tokens.newLine : ',' + tokens.newLineOrSpace;
				var isSymbol = (typeof el === 'undefined' ? 'undefined' : _typeof(el)) === 'symbol';
				var isClassic = !isSymbol && /^[a-z$_][a-z$_0-9]*$/i.test(el);
				var key = isSymbol || isClassic ? el : stringify(el, opts);
				var value = stringify(val[el], opts, pad + opts.indent);
				if (opts.transform) {
					value = opts.transform(val, el, value);
				}
				return tokens.indent + String(key) + ': ' + value + eol;
			}).join('') + tokens.pad + '}';

			seen.pop(val);

			return expandWhiteSpace(_ret);
		}

		val = String(val).replace(/[\r\n]/g, function (x) {
			return x === '\n' ? '\\n' : '\\r';
		});

		if (opts.singleQuotes === false) {
			val = val.replace(/"/g, '\\"');
			return '"' + val + '"';
		}

		val = val.replace(/\\?'/g, '\\\'');
		return '\'' + val + '\'';
	}(val, opts, pad);
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function sortObject(value) {
  // return non-object value as is
  if (value === null || (typeof value === 'undefined' ? 'undefined' : _typeof$1(value)) !== 'object') {
    return value;
  }

  // return date and regexp values as is
  if (value instanceof Date || value instanceof RegExp) {
    return value;
  }

  // make a copy of array with each item passed through sortObject()
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  // make a copy of object with key sorted
  return Object.keys(value).sort().reduce(function (result, key) {
    if (key === '_owner') {
      return result;
    }
    // eslint-disable-next-line no-param-reassign
    result[key] = sortObject(value[key]);
    return result;
  }, {});
}

/* eslint-disable no-use-before-define */

var createStringTreeNode = function createStringTreeNode(value) {
  return {
    type: 'string',
    value: value
  };
};

var createNumberTreeNode = function createNumberTreeNode(value) {
  return {
    type: 'number',
    value: value
  };
};

var createReactElementTreeNode = function createReactElementTreeNode(displayName, props, defaultProps, childrens) {
  return {
    type: 'ReactElement',
    displayName: displayName,
    props: props,
    defaultProps: defaultProps,
    childrens: childrens
  };
};

var createReactFragmentTreeNode = function createReactFragmentTreeNode(key, childrens) {
  return {
    type: 'ReactFragment',
    key: key,
    childrens: childrens
  };
};

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };


var supportFragment = Boolean(Fragment);

var getReactElementDisplayName = function getReactElementDisplayName(element) {
  return element.type.displayName || element.type.name || ( // function name
  typeof element.type === 'function' // function without a name, you should provide one
  ? 'No Display Name' : element.type);
};

var noChildren = function noChildren(propsValue, propName) {
  return propName !== 'children';
};

var onlyMeaningfulChildren = function onlyMeaningfulChildren(children) {
  return children !== true && children !== false && children !== null && children !== '';
};

var filterProps = function filterProps(originalProps, cb) {
  var filteredProps = {};

  Object.keys(originalProps).filter(function (key) {
    return cb(originalProps[key], key);
  }).forEach(function (key) {
    return filteredProps[key] = originalProps[key];
  });

  return filteredProps;
};

var parseReactElement = function parseReactElement(element, options) {
  var _options$displayName = options.displayName,
      displayNameFn = _options$displayName === undefined ? getReactElementDisplayName : _options$displayName;


  if (typeof element === 'string') {
    return createStringTreeNode(element);
  } else if (typeof element === 'number') {
    return createNumberTreeNode(element);
  } else if (!React.isValidElement(element)) {
    throw new Error('react-element-to-jsx-string: Expected a React.Element, got `' + (typeof element === 'undefined' ? 'undefined' : _typeof$2(element)) + '`');
  }

  var displayName = displayNameFn(element);

  var props = filterProps(element.props, noChildren);
  if (element.ref !== null) {
    props.ref = element.ref;
  }

  var key = element.key;
  if (typeof key === 'string' && key.search(/^\./)) {
    // React automatically add key=".X" when there are some children
    props.key = key;
  }

  var defaultProps = filterProps(element.type.defaultProps || {}, noChildren);
  var childrens = React.Children.toArray(element.props.children).filter(onlyMeaningfulChildren).map(function (child) {
    return parseReactElement(child, options);
  });

  if (supportFragment && element.type === Fragment) {
    return createReactFragmentTreeNode(key, childrens);
  }

  return createReactElementTreeNode(displayName, props, defaultProps, childrens);
};

function noRefCheck() {}

var defaultFunctionValue = function defaultFunctionValue(fn) {
  return fn.toString();
};

var formatFunction = (function (fn, options) {
  var _options$functionValu = options.functionValue,
      functionValue = _options$functionValu === undefined ? defaultFunctionValue : _options$functionValu,
      showFunctions = options.showFunctions;

  if (!showFunctions && functionValue === defaultFunctionValue) {
    return functionValue(noRefCheck);
  }

  return functionValue(fn);
});

var formatComplexDataStructure = (function (value, inline, lvl, options) {
  var normalizedValue = sortObject(value);

  var stringifiedValue = stringifyObject(normalizedValue, {
    transform: function transform(currentObj, prop, originalResult) {
      var currentValue = currentObj[prop];

      if (currentValue && isValidElement(currentValue)) {
        return formatTreeNode(parseReactElement(currentValue, options), true, lvl, options);
      }

      if (typeof currentValue === 'function') {
        return formatFunction(currentValue, options);
      }

      return originalResult;
    }
  });

  if (inline) {
    return stringifiedValue.replace(/\s+/g, ' ').replace(/{ /g, '{').replace(/ }/g, '}').replace(/\[ /g, '[').replace(/ ]/g, ']');
  }

  // Replace tabs with spaces, and add necessary indentation in front of each new line
  return stringifiedValue.replace(/\t/g, spacer(1, options.tabStop)).replace(/\n([^$])/g, '\n' + spacer(lvl + 1, options.tabStop) + '$1');
});

var _typeof$3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var escape = function escape(s) {
  return s.replace(/"/g, '&quot;');
};

var formatPropValue = function formatPropValue(propValue, inline, lvl, options) {
  if (typeof propValue === 'number') {
    return '{' + String(propValue) + '}';
  }

  if (typeof propValue === 'string') {
    return '"' + escape(propValue) + '"';
  }

  // > "Symbols (new in ECMAScript 2015, not yet supported in Flow)"
  // @see: https://flow.org/en/docs/types/primitives/
  // $FlowFixMe: Flow does not support Symbol
  if ((typeof propValue === 'undefined' ? 'undefined' : _typeof$3(propValue)) === 'symbol') {
    var symbolDescription = propValue.valueOf().toString().replace(/Symbol\((.*)\)/, '$1');

    if (!symbolDescription) {
      return '{Symbol()}';
    }

    return '{Symbol(\'' + symbolDescription + '\')}';
  }

  if (typeof propValue === 'function') {
    return '{' + formatFunction(propValue, options) + '}';
  }

  if (isValidElement(propValue)) {
    return '{' + formatTreeNode(parseReactElement(propValue, options), true, lvl, options) + '}';
  }

  if (propValue instanceof Date) {
    return '{new Date("' + propValue.toISOString() + '")}';
  }

  if (isPlainObject(propValue) || Array.isArray(propValue)) {
    return '{' + formatComplexDataStructure(propValue, inline, lvl, options) + '}';
  }

  return '{' + String(propValue) + '}';
};

var formatProp = (function (name, hasValue, value, hasDefaultValue, defaultValue, inline, lvl, options) {
  if (!hasValue && !hasDefaultValue) {
    throw new Error('The prop "' + name + '" has no value and no default: could not be formatted');
  }

  var usedValue = hasValue ? value : defaultValue;

  var useBooleanShorthandSyntax = options.useBooleanShorthandSyntax,
      tabStop = options.tabStop;


  var formattedPropValue = formatPropValue(usedValue, inline, lvl, options);

  var attributeFormattedInline = ' ';
  var attributeFormattedMultiline = '\n' + spacer(lvl + 1, tabStop);
  var isMultilineAttribute = formattedPropValue.includes('\n');

  if (useBooleanShorthandSyntax && formattedPropValue === '{false}' && !hasDefaultValue) {
    // If a boolean is false and not different from it's default, we do not render the attribute
    attributeFormattedInline = '';
    attributeFormattedMultiline = '';
  } else if (useBooleanShorthandSyntax && formattedPropValue === '{true}') {
    attributeFormattedInline += '' + name;
    attributeFormattedMultiline += '' + name;
  } else {
    attributeFormattedInline += name + '=' + formattedPropValue;
    attributeFormattedMultiline += name + '=' + formattedPropValue;
  }

  return {
    attributeFormattedInline: attributeFormattedInline,
    attributeFormattedMultiline: attributeFormattedMultiline,
    isMultilineAttribute: isMultilineAttribute
  };
});

var mergeSiblingPlainStringChildrenReducer = (function (previousNodes, currentNode) {
  var nodes = previousNodes.slice(0, previousNodes.length > 0 ? previousNodes.length - 1 : 0);
  var previousNode = previousNodes[previousNodes.length - 1];

  if (previousNode && (currentNode.type === 'string' || currentNode.type === 'number') && (previousNode.type === 'string' || previousNode.type === 'number')) {
    nodes.push(createStringTreeNode(String(previousNode.value) + String(currentNode.value)));
  } else {
    if (previousNode) {
      nodes.push(previousNode);
    }

    nodes.push(currentNode);
  }

  return nodes;
});

var propNameSorter = (function (sortProps) {
  return function (a, b) {
    if (a === b) {
      return 0;
    }

    if (['key', 'ref'].includes(a)) {
      return -1;
    } else if (['key', 'ref'].includes(b)) {
      return 1;
    }

    if (!sortProps) {
      return 0;
    }

    return a < b ? -1 : 1;
  };
});

var compensateMultilineStringElementIndentation = function compensateMultilineStringElementIndentation(element, formattedElement, inline, lvl, options) {
  var tabStop = options.tabStop;


  if (element.type === 'string') {
    return formattedElement.split('\n').map(function (line, offset) {
      if (offset === 0) {
        return line;
      }

      return '' + spacer(lvl, tabStop) + line;
    }).join('\n');
  }

  return formattedElement;
};

var formatOneChildren = function formatOneChildren(inline, lvl, options) {
  return function (element) {
    return compensateMultilineStringElementIndentation(element, formatTreeNode(element, inline, lvl, options), inline, lvl, options);
  };
};

var onlyPropsWithOriginalValue = function onlyPropsWithOriginalValue(defaultProps, props) {
  return function (propName) {
    var haveDefaultValue = Object.keys(defaultProps).includes(propName);
    return !haveDefaultValue || haveDefaultValue && defaultProps[propName] !== props[propName];
  };
};

var isInlineAttributeTooLong = function isInlineAttributeTooLong(attributes, inlineAttributeString, lvl, tabStop, maxInlineAttributesLineLength) {
  if (!maxInlineAttributesLineLength) {
    return attributes.length > 1;
  }

  return spacer(lvl, tabStop).length + inlineAttributeString.length > maxInlineAttributesLineLength;
};

var shouldRenderMultilineAttr = function shouldRenderMultilineAttr(attributes, inlineAttributeString, containsMultilineAttr, inline, lvl, tabStop, maxInlineAttributesLineLength) {
  return (isInlineAttributeTooLong(attributes, inlineAttributeString, lvl, tabStop, maxInlineAttributesLineLength) || containsMultilineAttr) && !inline;
};

var formatReactElementNode = (function (node, inline, lvl, options) {
  var type = node.type,
      _node$displayName = node.displayName,
      displayName = _node$displayName === undefined ? '' : _node$displayName,
      childrens = node.childrens,
      _node$props = node.props,
      props = _node$props === undefined ? {} : _node$props,
      _node$defaultProps = node.defaultProps,
      defaultProps = _node$defaultProps === undefined ? {} : _node$defaultProps;


  if (type !== 'ReactElement') {
    throw new Error('The "formatReactElementNode" function could only format node of type "ReactElement". Given:  ' + type);
  }

  var filterProps = options.filterProps,
      maxInlineAttributesLineLength = options.maxInlineAttributesLineLength,
      showDefaultProps = options.showDefaultProps,
      sortProps = options.sortProps,
      tabStop = options.tabStop;


  var out = '<' + displayName;

  var outInlineAttr = out;
  var outMultilineAttr = out;
  var containsMultilineAttr = false;

  var visibleAttributeNames = [];

  Object.keys(props).filter(function (propName) {
    return filterProps.indexOf(propName) === -1;
  }).filter(onlyPropsWithOriginalValue(defaultProps, props)).forEach(function (propName) {
    return visibleAttributeNames.push(propName);
  });

  Object.keys(defaultProps).filter(function (defaultPropName) {
    return filterProps.indexOf(defaultPropName) === -1;
  }).filter(function () {
    return showDefaultProps;
  }).filter(function (defaultPropName) {
    return !visibleAttributeNames.includes(defaultPropName);
  }).forEach(function (defaultPropName) {
    return visibleAttributeNames.push(defaultPropName);
  });

  var attributes = visibleAttributeNames.sort(propNameSorter(sortProps));

  attributes.forEach(function (attributeName) {
    var _formatProp = formatProp(attributeName, Object.keys(props).includes(attributeName), props[attributeName], Object.keys(defaultProps).includes(attributeName), defaultProps[attributeName], inline, lvl, options),
        attributeFormattedInline = _formatProp.attributeFormattedInline,
        attributeFormattedMultiline = _formatProp.attributeFormattedMultiline,
        isMultilineAttribute = _formatProp.isMultilineAttribute;

    if (isMultilineAttribute) {
      containsMultilineAttr = true;
    }

    outInlineAttr += attributeFormattedInline;
    outMultilineAttr += attributeFormattedMultiline;
  });

  outMultilineAttr += '\n' + spacer(lvl, tabStop);

  if (shouldRenderMultilineAttr(attributes, outInlineAttr, containsMultilineAttr, inline, lvl, tabStop, maxInlineAttributesLineLength)) {
    out = outMultilineAttr;
  } else {
    out = outInlineAttr;
  }

  if (childrens && childrens.length > 0) {
    var newLvl = lvl + 1;

    out += '>';

    if (!inline) {
      out += '\n';
      out += spacer(newLvl, tabStop);
    }

    out += childrens.reduce(mergeSiblingPlainStringChildrenReducer, []).map(formatOneChildren(inline, newLvl, options)).join(!inline ? '\n' + spacer(newLvl, tabStop) : '');

    if (!inline) {
      out += '\n';
      out += spacer(newLvl - 1, tabStop);
    }
    out += '</' + displayName + '>';
  } else {
    if (!isInlineAttributeTooLong(attributes, outInlineAttr, lvl, tabStop, maxInlineAttributesLineLength)) {
      out += ' ';
    }

    out += '/>';
  }

  return out;
});

var REACT_FRAGMENT_TAG_NAME_SHORT_SYNTAX = '';
var REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX = 'React.Fragment';

var toReactElementTreeNode = function toReactElementTreeNode(displayName, key, childrens) {
  var props = {};
  if (key) {
    props = { key: key };
  }

  return {
    type: 'ReactElement',
    displayName: displayName,
    props: props,
    defaultProps: {},
    childrens: childrens
  };
};

var isKeyedFragment = function isKeyedFragment(_ref) {
  var key = _ref.key;
  return Boolean(key);
};
var hasNoChildren = function hasNoChildren(_ref2) {
  var childrens = _ref2.childrens;
  return childrens.length === 0;
};

var formatReactFragmentNode = (function (node, inline, lvl, options) {
  var type = node.type,
      key = node.key,
      childrens = node.childrens;


  if (type !== 'ReactFragment') {
    throw new Error('The "formatReactFragmentNode" function could only format node of type "ReactFragment". Given: ' + type);
  }

  var useFragmentShortSyntax = options.useFragmentShortSyntax;


  var displayName = void 0;
  if (useFragmentShortSyntax) {
    if (hasNoChildren(node) || isKeyedFragment(node)) {
      displayName = REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX;
    } else {
      displayName = REACT_FRAGMENT_TAG_NAME_SHORT_SYNTAX;
    }
  } else {
    displayName = REACT_FRAGMENT_TAG_NAME_EXPLICIT_SYNTAX;
  }

  return formatReactElementNode(toReactElementTreeNode(displayName, key, childrens), inline, lvl, options);
});

var jsxStopChars = ['<', '>', '{', '}'];
var shouldBeEscaped = function shouldBeEscaped(s) {
  return jsxStopChars.some(function (jsxStopChar) {
    return s.includes(jsxStopChar);
  });
};

var escape$1 = function escape(s) {
  if (!shouldBeEscaped(s)) {
    return s;
  }

  return '{`' + s + '`}';
};

var preserveTrailingSpace = function preserveTrailingSpace(s) {
  var result = s;
  if (result.endsWith(' ')) {
    result = result.replace(/^(\S*)(\s*)$/, "$1{'$2'}");
  }

  if (result.startsWith(' ')) {
    result = result.replace(/^(\s*)(\S*)$/, "{'$1'}$2");
  }

  return result;
};

var formatTreeNode = (function (node, inline, lvl, options) {
  if (node.type === 'number') {
    return String(node.value);
  }

  if (node.type === 'string') {
    return node.value ? '' + preserveTrailingSpace(escape$1(String(node.value))) : '';
  }

  if (node.type === 'ReactElement') {
    return formatReactElementNode(node, inline, lvl, options);
  }

  if (node.type === 'ReactFragment') {
    return formatReactFragmentNode(node, inline, lvl, options);
  }

  throw new TypeError('Unknow format type "' + node.type + '"');
});

var formatTree = (function (node, options) {
  return formatTreeNode(node, false, 0, options);
});

var reactElementToJsxString = function reactElementToJsxString(element) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$filterProps = _ref.filterProps,
      filterProps = _ref$filterProps === undefined ? [] : _ref$filterProps,
      _ref$showDefaultProps = _ref.showDefaultProps,
      showDefaultProps = _ref$showDefaultProps === undefined ? true : _ref$showDefaultProps,
      _ref$showFunctions = _ref.showFunctions,
      showFunctions = _ref$showFunctions === undefined ? false : _ref$showFunctions,
      functionValue = _ref.functionValue,
      _ref$tabStop = _ref.tabStop,
      tabStop = _ref$tabStop === undefined ? 2 : _ref$tabStop,
      _ref$useBooleanShorth = _ref.useBooleanShorthandSyntax,
      useBooleanShorthandSyntax = _ref$useBooleanShorth === undefined ? true : _ref$useBooleanShorth,
      _ref$useFragmentShort = _ref.useFragmentShortSyntax,
      useFragmentShortSyntax = _ref$useFragmentShort === undefined ? true : _ref$useFragmentShort,
      _ref$sortProps = _ref.sortProps,
      sortProps = _ref$sortProps === undefined ? true : _ref$sortProps,
      maxInlineAttributesLineLength = _ref.maxInlineAttributesLineLength,
      displayName = _ref.displayName;

  if (!element) {
    throw new Error('react-element-to-jsx-string: Expected a ReactElement');
  }

  var options = {
    filterProps: filterProps,
    showDefaultProps: showDefaultProps,
    showFunctions: showFunctions,
    functionValue: functionValue,
    tabStop: tabStop,
    useBooleanShorthandSyntax: useBooleanShorthandSyntax,
    useFragmentShortSyntax: useFragmentShortSyntax,
    sortProps: sortProps,
    maxInlineAttributesLineLength: maxInlineAttributesLineLength,
    displayName: displayName
  };

  return formatTree(parseReactElement(element, options), options);
};

export default reactElementToJsxString;
//# sourceMappingURL=index.js.map
