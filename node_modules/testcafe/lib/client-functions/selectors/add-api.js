'use strict';

exports.__esModule = true;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let getSnapshot = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (getSelector, callsite, SelectorBuilder) {
        let node = null;
        const selector = new SelectorBuilder(getSelector(), { needError: true }, { instantiation: 'Selector' }).getFunction();

        try {
            node = yield selector();
        } catch (err) {
            err.callsite = callsite;
            throw err;
        }

        return node;
    });

    return function getSnapshot(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();

exports.addCustomMethods = addCustomMethods;
exports.addAPI = addAPI;

var _lodash = require('lodash');

var _builderSymbol = require('../builder-symbol');

var _builderSymbol2 = _interopRequireDefault(_builderSymbol);

var _snapshotProperties = require('./snapshot-properties');

var _getCallsite = require('../../errors/get-callsite');

var _clientFunctionBuilder = require('../client-function-builder');

var _clientFunctionBuilder2 = _interopRequireDefault(_clientFunctionBuilder);

var _reExecutablePromise = require('../../utils/re-executable-promise');

var _reExecutablePromise2 = _interopRequireDefault(_reExecutablePromise);

var _typeAssertions = require('../../errors/runtime/type-assertions');

var _makeRegExp = require('../../utils/make-reg-exp');

var _makeRegExp2 = _interopRequireDefault(_makeRegExp);

var _selectorTextFilter = require('./selector-text-filter');

var _selectorTextFilter2 = _interopRequireDefault(_selectorTextFilter);

var _selectorAttributeFilter = require('./selector-attribute-filter');

var _selectorAttributeFilter2 = _interopRequireDefault(_selectorAttributeFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const filterNodes = new _clientFunctionBuilder2.default((nodes, filter, querySelectorRoot, originNode, ...filterArgs) => {
    if (typeof filter === 'number') {
        const matchingNode = filter < 0 ? nodes[nodes.length + filter] : nodes[filter];

        return matchingNode ? [matchingNode] : [];
    }

    const result = [];

    if (typeof filter === 'string') {
        // NOTE: we can search for elements only in document or element.
        if (querySelectorRoot.nodeType !== 1 && querySelectorRoot.nodeType !== 9) return null;

        const matching = querySelectorRoot.querySelectorAll(filter);
        const matchingArr = [];

        for (let i = 0; i < matching.length; i++) matchingArr.push(matching[i]);

        filter = node => matchingArr.indexOf(node) > -1;
    }

    if (typeof filter === 'function') {
        for (let j = 0; j < nodes.length; j++) {
            if (filter(nodes[j], j, originNode, ...filterArgs)) result.push(nodes[j]);
        }
    }

    return result;
}).getFunction();

const expandSelectorResults = new _clientFunctionBuilder2.default((selector, populateDerivativeNodes) => {
    const nodes = selector();

    if (!nodes.length) return null;

    const result = [];

    for (let i = 0; i < nodes.length; i++) {
        const derivativeNodes = populateDerivativeNodes(nodes[i]);

        if (derivativeNodes) {
            for (let j = 0; j < derivativeNodes.length; j++) {
                if (result.indexOf(derivativeNodes[j]) < 0) result.push(derivativeNodes[j]);
            }
        }
    }

    return result;
}).getFunction();

function assertAddCustomDOMPropertiesOptions(properties) {
    (0, _typeAssertions.assertType)(_typeAssertions.is.nonNullObject, 'addCustomDOMProperties', '"addCustomDOMProperties" option', properties);

    (0, _keys2.default)(properties).forEach(prop => {
        (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'addCustomDOMProperties', `Custom DOM properties method '${prop}'`, properties[prop]);
    });
}

function assertAddCustomMethods(properties, opts) {
    (0, _typeAssertions.assertType)(_typeAssertions.is.nonNullObject, 'addCustomMethods', '"addCustomMethods" option', properties);

    if (opts !== void 0) (0, _typeAssertions.assertType)(_typeAssertions.is.nonNullObject, 'addCustomMethods', '"addCustomMethods" option', opts);

    (0, _keys2.default)(properties).forEach(prop => {
        (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'addCustomMethods', `Custom method '${prop}'`, properties[prop]);
    });
}

function prepareApiFnArgs(fnName, ...args) {
    args = args.map(arg => {
        if (typeof arg === 'string') return `'${arg}'`;
        if (typeof arg === 'function') return '[function]';
        return arg;
    });
    args = args.join(', ');

    return `.${fnName}(${args})`;
}

function getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, additionalDependencies) {
    return (0, _assign2.default)({}, options, { selectorFn, apiFn, filter, additionalDependencies });
}

function addSnapshotProperties(obj, getSelector, SelectorBuilder, properties) {
    properties.forEach(prop => {
        (0, _defineProperty2.default)(obj, prop, {
            get: () => {
                const callsite = (0, _getCallsite.getCallsiteForMethod)('get');

                return _reExecutablePromise2.default.fromFn((0, _asyncToGenerator3.default)(function* () {
                    const snapshot = yield getSnapshot(getSelector, callsite, SelectorBuilder);

                    return snapshot[prop];
                }));
            }
        });
    });
}

function addCustomMethods(obj, getSelector, SelectorBuilder, customMethods) {
    const customMethodProps = customMethods ? (0, _keys2.default)(customMethods) : [];

    customMethodProps.forEach(prop => {
        var _customMethods$prop = customMethods[prop],
            _customMethods$prop$r = _customMethods$prop.returnDOMNodes;
        const returnDOMNodes = _customMethods$prop$r === undefined ? false : _customMethods$prop$r,
              method = _customMethods$prop.method;


        const dependencies = {
            customMethod: method,
            selector: getSelector()
        };

        const callsiteNames = { instantiation: prop };

        if (returnDOMNodes) {
            obj[prop] = (...args) => {
                const selectorFn = () => {
                    /* eslint-disable no-undef */
                    const nodes = selector();

                    return customMethod.apply(customMethod, [nodes].concat(args));
                    /* eslint-enable no-undef */
                };

                const apiFn = prepareApiFnArgs(prop, ...args);
                const filter = () => true;

                const additionalDependencies = {
                    args,
                    customMethod: method
                };

                return createDerivativeSelectorWithFilter({ getSelector, SelectorBuilder, selectorFn, apiFn, filter, additionalDependencies });
            };
        } else {
            obj[prop] = new _clientFunctionBuilder2.default((...args) => {
                /* eslint-disable no-undef */
                const node = selector();

                return customMethod.apply(customMethod, [node].concat(args));
                /* eslint-enable no-undef */
            }, { dependencies }, callsiteNames).getFunction();
        }
    });
}

function addSnapshotPropertyShorthands({ obj, getSelector, SelectorBuilder, customDOMProperties, customMethods }) {
    let properties = _snapshotProperties.SNAPSHOT_PROPERTIES;

    if (customDOMProperties) properties = properties.concat((0, _keys2.default)(customDOMProperties));

    addSnapshotProperties(obj, getSelector, SelectorBuilder, properties);
    addCustomMethods(obj, getSelector, SelectorBuilder, customMethods);

    obj.getStyleProperty = prop => {
        const callsite = (0, _getCallsite.getCallsiteForMethod)('getStyleProperty');

        return _reExecutablePromise2.default.fromFn((0, _asyncToGenerator3.default)(function* () {
            const snapshot = yield getSnapshot(getSelector, callsite, SelectorBuilder);

            return snapshot.style ? snapshot.style[prop] : void 0;
        }));
    };

    obj.getAttribute = attrName => {
        const callsite = (0, _getCallsite.getCallsiteForMethod)('getAttribute');

        return _reExecutablePromise2.default.fromFn((0, _asyncToGenerator3.default)(function* () {
            const snapshot = yield getSnapshot(getSelector, callsite, SelectorBuilder);

            return snapshot.attributes ? snapshot.attributes[attrName] : void 0;
        }));
    };

    obj.hasAttribute = attrName => {
        const callsite = (0, _getCallsite.getCallsiteForMethod)('hasAttribute');

        return _reExecutablePromise2.default.fromFn((0, _asyncToGenerator3.default)(function* () {
            const snapshot = yield getSnapshot(getSelector, callsite, SelectorBuilder);

            return snapshot.attributes ? snapshot.attributes.hasOwnProperty(attrName) : false;
        }));
    };

    obj.getBoundingClientRectProperty = prop => {
        const callsite = (0, _getCallsite.getCallsiteForMethod)('getBoundingClientRectProperty');

        return _reExecutablePromise2.default.fromFn((0, _asyncToGenerator3.default)(function* () {
            const snapshot = yield getSnapshot(getSelector, callsite, SelectorBuilder);

            return snapshot.boundingClientRect ? snapshot.boundingClientRect[prop] : void 0;
        }));
    };

    obj.hasClass = name => {
        const callsite = (0, _getCallsite.getCallsiteForMethod)('hasClass');

        return _reExecutablePromise2.default.fromFn((0, _asyncToGenerator3.default)(function* () {
            const snapshot = yield getSnapshot(getSelector, callsite, SelectorBuilder);

            return snapshot.classNames ? snapshot.classNames.indexOf(name) > -1 : false;
        }));
    };
}

function createCounter(getSelector, SelectorBuilder) {
    const builder = new SelectorBuilder(getSelector(), { counterMode: true }, { instantiation: 'Selector' });
    const counter = builder.getFunction();
    const callsite = (0, _getCallsite.getCallsiteForMethod)('get');

    return (0, _asyncToGenerator3.default)(function* () {
        try {
            return yield counter();
        } catch (err) {
            err.callsite = callsite;
            throw err;
        }
    });
}

function addCounterProperties({ obj, getSelector, SelectorBuilder }) {
    Object.defineProperty(obj, 'count', {
        get: () => {
            const counter = createCounter(getSelector, SelectorBuilder);

            return _reExecutablePromise2.default.fromFn(() => counter());
        }
    });

    Object.defineProperty(obj, 'exists', {
        get: () => {
            const counter = createCounter(getSelector, SelectorBuilder);

            return _reExecutablePromise2.default.fromFn((0, _asyncToGenerator3.default)(function* () {
                return (yield counter()) > 0;
            }));
        }
    });
}

function convertFilterToClientFunctionIfNecessary(callsiteName, filter, dependencies) {
    if (typeof filter === 'function') {
        const builder = filter[_builderSymbol2.default];
        const fn = builder ? builder.fn : filter;
        const options = builder ? (0, _lodash.assign)({}, builder.options, { dependencies }) : { dependencies };

        return new _clientFunctionBuilder2.default(fn, options, { instantiation: callsiteName }).getFunction();
    }

    return filter;
}

function createDerivativeSelectorWithFilter({ getSelector, SelectorBuilder, selectorFn, apiFn, filter, additionalDependencies }) {
    const collectionModeSelectorBuilder = new SelectorBuilder(getSelector(), { collectionMode: true });
    const customDOMProperties = collectionModeSelectorBuilder.options.customDOMProperties;
    const customMethods = collectionModeSelectorBuilder.options.customMethods;

    let dependencies = {
        selector: collectionModeSelectorBuilder.getFunction(),
        filter: filter,
        filterNodes: filterNodes
    };

    var _collectionModeSelect = collectionModeSelectorBuilder.options;
    const boundTestRun = _collectionModeSelect.boundTestRun,
          timeout = _collectionModeSelect.timeout,
          visibilityCheck = _collectionModeSelect.visibilityCheck,
          apiFnChain = _collectionModeSelect.apiFnChain;


    dependencies = (0, _lodash.assign)(dependencies, additionalDependencies);

    const builder = new SelectorBuilder(selectorFn, {
        dependencies,
        customDOMProperties,
        customMethods,
        boundTestRun,
        timeout,
        visibilityCheck,
        apiFnChain,
        apiFn
    }, { instantiation: 'Selector' });

    return builder.getFunction();
}

const filterByText = convertFilterToClientFunctionIfNecessary('filter', _selectorTextFilter2.default);
const filterByAttr = convertFilterToClientFunctionIfNecessary('filter', _selectorAttributeFilter2.default);

function ensureRegExpContext(str) {
    // NOTE: if a regexp is created in a separate context (via the 'vm' module) we
    // should wrap it with new RegExp() to make the `instanceof RegExp` check successful.
    if (typeof str !== 'string' && !(str instanceof RegExp)) return new RegExp(str);

    return str;
}

function addFilterMethods(options) {
    const obj = options.obj,
          getSelector = options.getSelector,
          SelectorBuilder = options.SelectorBuilder;


    obj.nth = index => {
        (0, _typeAssertions.assertType)(_typeAssertions.is.number, 'nth', '"index" argument', index);

        const apiFn = prepareApiFnArgs('nth', index);
        const builder = new SelectorBuilder(getSelector(), { index, apiFn }, { instantiation: 'Selector' });

        return builder.getFunction();
    };

    obj.withText = text => {
        (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.regExp], 'withText', '"text" argument', text);

        const apiFn = prepareApiFnArgs('withText', text);

        text = ensureRegExpContext(text);

        const selectorFn = () => {
            /* eslint-disable no-undef */
            const nodes = selector();

            if (!nodes.length) return null;

            return filterNodes(nodes, filter, document, void 0, textRe);
            /* eslint-enable no-undef */
        };

        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filterByText, { textRe: (0, _makeRegExp2.default)(text) });

        return createDerivativeSelectorWithFilter(args);
    };

    obj.withExactText = text => {
        (0, _typeAssertions.assertType)(_typeAssertions.is.string, 'withExactText', '"text" argument', text);

        const selectorFn = () => {
            /* eslint-disable no-undef */
            const nodes = selector();

            if (!nodes.length) return null;

            return filterNodes(nodes, filter, document, void 0, exactText);
            /* eslint-enable no-undef */
        };

        const apiFn = prepareApiFnArgs('withExactText', text);
        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filterByText, { exactText: text });

        return createDerivativeSelectorWithFilter(args);
    };

    obj.withAttribute = (attrName, attrValue) => {
        (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.regExp], 'withAttribute', '"attrName" argument', attrName);

        const apiFn = prepareApiFnArgs('withAttribute', attrName, attrValue);

        attrName = ensureRegExpContext(attrName);

        if (attrValue !== void 0) {
            (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.regExp], 'withAttribute', '"attrValue" argument', attrValue);
            attrValue = ensureRegExpContext(attrValue);
        }

        const selectorFn = () => {
            /* eslint-disable no-undef */
            const nodes = selector();

            if (!nodes.length) return null;

            return filterNodes(nodes, filter, document, void 0, attrName, attrValue);
            /* eslint-enable no-undef */
        };

        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filterByAttr, {
            attrName,
            attrValue
        });

        return createDerivativeSelectorWithFilter(args);
    };

    obj.filter = (filter, dependencies) => {
        (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.function], 'filter', '"filter" argument', filter);

        const apiFn = prepareApiFnArgs('filter', filter);

        filter = convertFilterToClientFunctionIfNecessary('filter', filter, dependencies);

        const selectorFn = () => {
            /* eslint-disable no-undef */
            const nodes = selector();

            if (!nodes.length) return null;

            return filterNodes(nodes, filter, document, void 0);
            /* eslint-enable no-undef */
        };

        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter);

        return createDerivativeSelectorWithFilter(args);
    };

    obj.filterVisible = () => {
        const apiFn = prepareApiFnArgs('filterVisible');
        const builder = new SelectorBuilder(getSelector(), { filterVisible: true, apiFn }, { instantiation: 'Selector' });

        return builder.getFunction();
    };

    obj.filterHidden = () => {
        const apiFn = prepareApiFnArgs('filterHidden');
        const builder = new SelectorBuilder(getSelector(), { filterHidden: true, apiFn }, { instantiation: 'Selector' });

        return builder.getFunction();
    };
}

function addCustomDOMPropertiesMethod({ obj, getSelector, SelectorBuilder }) {
    obj.addCustomDOMProperties = customDOMProperties => {
        assertAddCustomDOMPropertiesOptions(customDOMProperties);

        const builder = new SelectorBuilder(getSelector(), { customDOMProperties }, { instantiation: 'Selector' });

        return builder.getFunction();
    };
}

function addCustomMethodsMethod({ obj, getSelector, SelectorBuilder }) {
    obj.addCustomMethods = function (methods, opts) {
        assertAddCustomMethods(methods, opts);

        const customMethods = {};

        (0, _keys2.default)(methods).forEach(methodName => {
            customMethods[methodName] = {
                method: methods[methodName],
                returnDOMNodes: opts && !!opts.returnDOMNodes
            };
        });

        const builder = new SelectorBuilder(getSelector(), { customMethods }, { instantiation: 'Selector' });

        return builder.getFunction();
    };
}

function addHierarchicalSelectors(options) {
    const obj = options.obj;

    // Find

    obj.find = (filter, dependencies) => {
        (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.function], 'find', '"filter" argument', filter);

        const apiFn = prepareApiFnArgs('find', filter);

        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);

        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                if (typeof filter === 'string') {
                    return typeof node.querySelectorAll === 'function' ? node.querySelectorAll(filter) : null;
                }

                const results = [];

                const visitNode = currentNode => {
                    const cnLength = currentNode.childNodes.length;

                    for (let i = 0; i < cnLength; i++) {
                        const child = currentNode.childNodes[i];

                        results.push(child);

                        visitNode(child);
                    }
                };

                visitNode(node);

                return filterNodes(results, filter, null, node);
            });
            /* eslint-enable no-undef */
        };

        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });

        return createDerivativeSelectorWithFilter(args);
    };

    // Parent
    obj.parent = (filter, dependencies) => {
        if (filter !== void 0) (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.function, _typeAssertions.is.number], 'parent', '"filter" argument', filter);

        const apiFn = prepareApiFnArgs('parent', filter);

        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);

        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                const parents = [];

                for (let parent = node.parentNode; parent; parent = parent.parentNode) parents.push(parent);

                return filter !== void 0 ? filterNodes(parents, filter, document, node) : parents;
            });
            /* eslint-enable no-undef */
        };

        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });

        return createDerivativeSelectorWithFilter(args);
    };

    // Child
    obj.child = (filter, dependencies) => {
        if (filter !== void 0) (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.function, _typeAssertions.is.number], 'child', '"filter" argument', filter);

        const apiFn = prepareApiFnArgs('child', filter);

        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);

        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                const childElements = [];
                const cnLength = node.childNodes.length;

                for (let i = 0; i < cnLength; i++) {
                    const child = node.childNodes[i];

                    if (child.nodeType === 1) childElements.push(child);
                }

                return filter !== void 0 ? filterNodes(childElements, filter, node, node) : childElements;
            });
            /* eslint-enable no-undef */
        };

        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });

        return createDerivativeSelectorWithFilter(args);
    };

    // Sibling
    obj.sibling = (filter, dependencies) => {
        if (filter !== void 0) (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.function, _typeAssertions.is.number], 'sibling', '"filter" argument', filter);

        const apiFn = prepareApiFnArgs('sibling', filter);

        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);

        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                const parent = node.parentNode;

                if (!parent) return null;

                const siblings = [];
                const cnLength = parent.childNodes.length;

                for (let i = 0; i < cnLength; i++) {
                    const child = parent.childNodes[i];

                    if (child.nodeType === 1 && child !== node) siblings.push(child);
                }

                return filter !== void 0 ? filterNodes(siblings, filter, parent, node) : siblings;
            });
            /* eslint-enable no-undef */
        };

        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });

        return createDerivativeSelectorWithFilter(args);
    };

    // Next sibling
    obj.nextSibling = (filter, dependencies) => {
        if (filter !== void 0) (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.function, _typeAssertions.is.number], 'nextSibling', '"filter" argument', filter);

        const apiFn = prepareApiFnArgs('nextSibling', filter);

        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);

        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                const parent = node.parentNode;

                if (!parent) return null;

                const siblings = [];
                const cnLength = parent.childNodes.length;
                let afterNode = false;

                for (let i = 0; i < cnLength; i++) {
                    const child = parent.childNodes[i];

                    if (child === node) afterNode = true;else if (afterNode && child.nodeType === 1) siblings.push(child);
                }

                return filter !== void 0 ? filterNodes(siblings, filter, parent, node) : siblings;
            });
            /* eslint-enable no-undef */
        };

        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });

        return createDerivativeSelectorWithFilter(args);
    };

    // Prev sibling
    obj.prevSibling = (filter, dependencies) => {
        if (filter !== void 0) (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.function, _typeAssertions.is.number], 'prevSibling', '"filter" argument', filter);

        const apiFn = prepareApiFnArgs('prevSibling', filter);

        filter = convertFilterToClientFunctionIfNecessary('find', filter, dependencies);

        const selectorFn = () => {
            /* eslint-disable no-undef */
            return expandSelectorResults(selector, node => {
                const parent = node.parentNode;

                if (!parent) return null;

                const siblings = [];
                const cnLength = parent.childNodes.length;

                for (let i = 0; i < cnLength; i++) {
                    const child = parent.childNodes[i];

                    if (child === node) break;

                    if (child.nodeType === 1) siblings.push(child);
                }

                return filter !== void 0 ? filterNodes(siblings, filter, parent, node) : siblings;
            });
            /* eslint-enable no-undef */
        };

        const args = getDerivativeSelectorArgs(options, selectorFn, apiFn, filter, { expandSelectorResults });

        return createDerivativeSelectorWithFilter(args);
    };
}

function addAPI(selector, getSelector, SelectorBuilder, customDOMProperties, customMethods) {
    const options = { obj: selector, getSelector, SelectorBuilder, customDOMProperties, customMethods };

    addFilterMethods(options);
    addHierarchicalSelectors(options);
    addSnapshotPropertyShorthands(options);
    addCustomDOMPropertiesMethod(options);
    addCustomMethodsMethod(options);
    addCounterProperties(options);
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQtZnVuY3Rpb25zL3NlbGVjdG9ycy9hZGQtYXBpLmpzIl0sIm5hbWVzIjpbImdldFNlbGVjdG9yIiwiY2FsbHNpdGUiLCJTZWxlY3RvckJ1aWxkZXIiLCJub2RlIiwic2VsZWN0b3IiLCJuZWVkRXJyb3IiLCJpbnN0YW50aWF0aW9uIiwiZ2V0RnVuY3Rpb24iLCJlcnIiLCJnZXRTbmFwc2hvdCIsImFkZEN1c3RvbU1ldGhvZHMiLCJhZGRBUEkiLCJmaWx0ZXJOb2RlcyIsIkNsaWVudEZ1bmN0aW9uQnVpbGRlciIsIm5vZGVzIiwiZmlsdGVyIiwicXVlcnlTZWxlY3RvclJvb3QiLCJvcmlnaW5Ob2RlIiwiZmlsdGVyQXJncyIsIm1hdGNoaW5nTm9kZSIsImxlbmd0aCIsInJlc3VsdCIsIm5vZGVUeXBlIiwibWF0Y2hpbmciLCJxdWVyeVNlbGVjdG9yQWxsIiwibWF0Y2hpbmdBcnIiLCJpIiwicHVzaCIsImluZGV4T2YiLCJqIiwiZXhwYW5kU2VsZWN0b3JSZXN1bHRzIiwicG9wdWxhdGVEZXJpdmF0aXZlTm9kZXMiLCJkZXJpdmF0aXZlTm9kZXMiLCJhc3NlcnRBZGRDdXN0b21ET01Qcm9wZXJ0aWVzT3B0aW9ucyIsInByb3BlcnRpZXMiLCJpcyIsIm5vbk51bGxPYmplY3QiLCJmb3JFYWNoIiwicHJvcCIsImZ1bmN0aW9uIiwiYXNzZXJ0QWRkQ3VzdG9tTWV0aG9kcyIsIm9wdHMiLCJwcmVwYXJlQXBpRm5BcmdzIiwiZm5OYW1lIiwiYXJncyIsIm1hcCIsImFyZyIsImpvaW4iLCJnZXREZXJpdmF0aXZlU2VsZWN0b3JBcmdzIiwib3B0aW9ucyIsInNlbGVjdG9yRm4iLCJhcGlGbiIsImFkZGl0aW9uYWxEZXBlbmRlbmNpZXMiLCJhZGRTbmFwc2hvdFByb3BlcnRpZXMiLCJvYmoiLCJnZXQiLCJSZUV4ZWN1dGFibGVQcm9taXNlIiwiZnJvbUZuIiwic25hcHNob3QiLCJjdXN0b21NZXRob2RzIiwiY3VzdG9tTWV0aG9kUHJvcHMiLCJyZXR1cm5ET01Ob2RlcyIsIm1ldGhvZCIsImRlcGVuZGVuY2llcyIsImN1c3RvbU1ldGhvZCIsImNhbGxzaXRlTmFtZXMiLCJhcHBseSIsImNvbmNhdCIsImNyZWF0ZURlcml2YXRpdmVTZWxlY3RvcldpdGhGaWx0ZXIiLCJhZGRTbmFwc2hvdFByb3BlcnR5U2hvcnRoYW5kcyIsImN1c3RvbURPTVByb3BlcnRpZXMiLCJTTkFQU0hPVF9QUk9QRVJUSUVTIiwiZ2V0U3R5bGVQcm9wZXJ0eSIsInN0eWxlIiwiZ2V0QXR0cmlidXRlIiwiYXR0ck5hbWUiLCJhdHRyaWJ1dGVzIiwiaGFzQXR0cmlidXRlIiwiaGFzT3duUHJvcGVydHkiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3RQcm9wZXJ0eSIsImJvdW5kaW5nQ2xpZW50UmVjdCIsImhhc0NsYXNzIiwibmFtZSIsImNsYXNzTmFtZXMiLCJjcmVhdGVDb3VudGVyIiwiYnVpbGRlciIsImNvdW50ZXJNb2RlIiwiY291bnRlciIsImFkZENvdW50ZXJQcm9wZXJ0aWVzIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJjb252ZXJ0RmlsdGVyVG9DbGllbnRGdW5jdGlvbklmTmVjZXNzYXJ5IiwiY2FsbHNpdGVOYW1lIiwiY2xpZW50RnVuY3Rpb25CdWlsZGVyU3ltYm9sIiwiZm4iLCJjb2xsZWN0aW9uTW9kZVNlbGVjdG9yQnVpbGRlciIsImNvbGxlY3Rpb25Nb2RlIiwiYm91bmRUZXN0UnVuIiwidGltZW91dCIsInZpc2liaWxpdHlDaGVjayIsImFwaUZuQ2hhaW4iLCJmaWx0ZXJCeVRleHQiLCJzZWxlY3RvclRleHRGaWx0ZXIiLCJmaWx0ZXJCeUF0dHIiLCJzZWxlY3RvckF0dHJpYnV0ZUZpbHRlciIsImVuc3VyZVJlZ0V4cENvbnRleHQiLCJzdHIiLCJSZWdFeHAiLCJhZGRGaWx0ZXJNZXRob2RzIiwibnRoIiwiaW5kZXgiLCJudW1iZXIiLCJ3aXRoVGV4dCIsInRleHQiLCJzdHJpbmciLCJyZWdFeHAiLCJkb2N1bWVudCIsInRleHRSZSIsIndpdGhFeGFjdFRleHQiLCJleGFjdFRleHQiLCJ3aXRoQXR0cmlidXRlIiwiYXR0clZhbHVlIiwiZmlsdGVyVmlzaWJsZSIsImZpbHRlckhpZGRlbiIsImFkZEN1c3RvbURPTVByb3BlcnRpZXNNZXRob2QiLCJhZGRDdXN0b21ET01Qcm9wZXJ0aWVzIiwiYWRkQ3VzdG9tTWV0aG9kc01ldGhvZCIsIm1ldGhvZHMiLCJtZXRob2ROYW1lIiwiYWRkSGllcmFyY2hpY2FsU2VsZWN0b3JzIiwiZmluZCIsInJlc3VsdHMiLCJ2aXNpdE5vZGUiLCJjdXJyZW50Tm9kZSIsImNuTGVuZ3RoIiwiY2hpbGROb2RlcyIsImNoaWxkIiwicGFyZW50IiwicGFyZW50cyIsInBhcmVudE5vZGUiLCJjaGlsZEVsZW1lbnRzIiwic2libGluZyIsInNpYmxpbmdzIiwibmV4dFNpYmxpbmciLCJhZnRlck5vZGUiLCJwcmV2U2libGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQW1FQSxXQUE0QkEsV0FBNUIsRUFBeUNDLFFBQXpDLEVBQW1EQyxlQUFuRCxFQUFvRTtBQUNoRSxZQUFJQyxPQUFhLElBQWpCO0FBQ0EsY0FBTUMsV0FBVyxJQUFJRixlQUFKLENBQW9CRixhQUFwQixFQUFtQyxFQUFFSyxXQUFXLElBQWIsRUFBbkMsRUFBd0QsRUFBRUMsZUFBZSxVQUFqQixFQUF4RCxFQUF1RkMsV0FBdkYsRUFBakI7O0FBRUEsWUFBSTtBQUNBSixtQkFBTyxNQUFNQyxVQUFiO0FBQ0gsU0FGRCxDQUlBLE9BQU9JLEdBQVAsRUFBWTtBQUNSQSxnQkFBSVAsUUFBSixHQUFlQSxRQUFmO0FBQ0Esa0JBQU1PLEdBQU47QUFDSDs7QUFFRCxlQUFPTCxJQUFQO0FBQ0gsSzs7b0JBZGNNLFc7Ozs7O1FBb0VDQyxnQixHQUFBQSxnQjtRQTRqQkFDLE0sR0FBQUEsTTs7QUFuc0JoQjs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE1B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dW5jdGlvbnMvc2VsZWN0b3JzL2FkZC1hcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3NpZ24gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGNsaWVudEZ1bmN0aW9uQnVpbGRlclN5bWJvbCBmcm9tICcuLi9idWlsZGVyLXN5bWJvbCc7XG5pbXBvcnQgeyBTTkFQU0hPVF9QUk9QRVJUSUVTIH0gZnJvbSAnLi9zbmFwc2hvdC1wcm9wZXJ0aWVzJztcbmltcG9ydCB7IGdldENhbGxzaXRlRm9yTWV0aG9kIH0gZnJvbSAnLi4vLi4vZXJyb3JzL2dldC1jYWxsc2l0ZSc7XG5pbXBvcnQgQ2xpZW50RnVuY3Rpb25CdWlsZGVyIGZyb20gJy4uL2NsaWVudC1mdW5jdGlvbi1idWlsZGVyJztcbmltcG9ydCBSZUV4ZWN1dGFibGVQcm9taXNlIGZyb20gJy4uLy4uL3V0aWxzL3JlLWV4ZWN1dGFibGUtcHJvbWlzZSc7XG5pbXBvcnQgeyBhc3NlcnRUeXBlLCBpcyB9IGZyb20gJy4uLy4uL2Vycm9ycy9ydW50aW1lL3R5cGUtYXNzZXJ0aW9ucyc7XG5pbXBvcnQgbWFrZVJlZ0V4cCBmcm9tICcuLi8uLi91dGlscy9tYWtlLXJlZy1leHAnO1xuaW1wb3J0IHNlbGVjdG9yVGV4dEZpbHRlciBmcm9tICcuL3NlbGVjdG9yLXRleHQtZmlsdGVyJztcbmltcG9ydCBzZWxlY3RvckF0dHJpYnV0ZUZpbHRlciBmcm9tICcuL3NlbGVjdG9yLWF0dHJpYnV0ZS1maWx0ZXInO1xuXG5jb25zdCBmaWx0ZXJOb2RlcyA9IChuZXcgQ2xpZW50RnVuY3Rpb25CdWlsZGVyKChub2RlcywgZmlsdGVyLCBxdWVyeVNlbGVjdG9yUm9vdCwgb3JpZ2luTm9kZSwgLi4uZmlsdGVyQXJncykgPT4ge1xuICAgIGlmICh0eXBlb2YgZmlsdGVyID09PSAnbnVtYmVyJykge1xuICAgICAgICBjb25zdCBtYXRjaGluZ05vZGUgPSBmaWx0ZXIgPCAwID8gbm9kZXNbbm9kZXMubGVuZ3RoICsgZmlsdGVyXSA6IG5vZGVzW2ZpbHRlcl07XG5cbiAgICAgICAgcmV0dXJuIG1hdGNoaW5nTm9kZSA/IFttYXRjaGluZ05vZGVdIDogW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gW107XG5cbiAgICBpZiAodHlwZW9mIGZpbHRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gTk9URTogd2UgY2FuIHNlYXJjaCBmb3IgZWxlbWVudHMgb25seSBpbiBkb2N1bWVudCBvciBlbGVtZW50LlxuICAgICAgICBpZiAocXVlcnlTZWxlY3RvclJvb3Qubm9kZVR5cGUgIT09IDEgJiYgcXVlcnlTZWxlY3RvclJvb3Qubm9kZVR5cGUgIT09IDkpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCBtYXRjaGluZyAgICA9IHF1ZXJ5U2VsZWN0b3JSb290LnF1ZXJ5U2VsZWN0b3JBbGwoZmlsdGVyKTtcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdBcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoaW5nLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgbWF0Y2hpbmdBcnIucHVzaChtYXRjaGluZ1tpXSk7XG5cbiAgICAgICAgZmlsdGVyID0gbm9kZSA9PiBtYXRjaGluZ0Fyci5pbmRleE9mKG5vZGUpID4gLTE7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBub2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGZpbHRlcihub2Rlc1tqXSwgaiwgb3JpZ2luTm9kZSwgLi4uZmlsdGVyQXJncykpXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobm9kZXNbal0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn0pKS5nZXRGdW5jdGlvbigpO1xuXG5jb25zdCBleHBhbmRTZWxlY3RvclJlc3VsdHMgPSAobmV3IENsaWVudEZ1bmN0aW9uQnVpbGRlcigoc2VsZWN0b3IsIHBvcHVsYXRlRGVyaXZhdGl2ZU5vZGVzKSA9PiB7XG4gICAgY29uc3Qgbm9kZXMgPSBzZWxlY3RvcigpO1xuXG4gICAgaWYgKCFub2Rlcy5sZW5ndGgpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGRlcml2YXRpdmVOb2RlcyA9IHBvcHVsYXRlRGVyaXZhdGl2ZU5vZGVzKG5vZGVzW2ldKTtcblxuICAgICAgICBpZiAoZGVyaXZhdGl2ZU5vZGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRlcml2YXRpdmVOb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihkZXJpdmF0aXZlTm9kZXNbal0pIDwgMClcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZGVyaXZhdGl2ZU5vZGVzW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG5cbn0pKS5nZXRGdW5jdGlvbigpO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRTbmFwc2hvdCAoZ2V0U2VsZWN0b3IsIGNhbGxzaXRlLCBTZWxlY3RvckJ1aWxkZXIpIHtcbiAgICBsZXQgbm9kZSAgICAgICA9IG51bGw7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBuZXcgU2VsZWN0b3JCdWlsZGVyKGdldFNlbGVjdG9yKCksIHsgbmVlZEVycm9yOiB0cnVlIH0sIHsgaW5zdGFudGlhdGlvbjogJ1NlbGVjdG9yJyB9KS5nZXRGdW5jdGlvbigpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgbm9kZSA9IGF3YWl0IHNlbGVjdG9yKCk7XG4gICAgfVxuXG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICBlcnIuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xufVxuXG5mdW5jdGlvbiBhc3NlcnRBZGRDdXN0b21ET01Qcm9wZXJ0aWVzT3B0aW9ucyAocHJvcGVydGllcykge1xuICAgIGFzc2VydFR5cGUoaXMubm9uTnVsbE9iamVjdCwgJ2FkZEN1c3RvbURPTVByb3BlcnRpZXMnLCAnXCJhZGRDdXN0b21ET01Qcm9wZXJ0aWVzXCIgb3B0aW9uJywgcHJvcGVydGllcyk7XG5cbiAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICBhc3NlcnRUeXBlKGlzLmZ1bmN0aW9uLCAnYWRkQ3VzdG9tRE9NUHJvcGVydGllcycsIGBDdXN0b20gRE9NIHByb3BlcnRpZXMgbWV0aG9kICcke3Byb3B9J2AsIHByb3BlcnRpZXNbcHJvcF0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhc3NlcnRBZGRDdXN0b21NZXRob2RzIChwcm9wZXJ0aWVzLCBvcHRzKSB7XG4gICAgYXNzZXJ0VHlwZShpcy5ub25OdWxsT2JqZWN0LCAnYWRkQ3VzdG9tTWV0aG9kcycsICdcImFkZEN1c3RvbU1ldGhvZHNcIiBvcHRpb24nLCBwcm9wZXJ0aWVzKTtcblxuICAgIGlmIChvcHRzICE9PSB2b2lkIDApXG4gICAgICAgIGFzc2VydFR5cGUoaXMubm9uTnVsbE9iamVjdCwgJ2FkZEN1c3RvbU1ldGhvZHMnLCAnXCJhZGRDdXN0b21NZXRob2RzXCIgb3B0aW9uJywgb3B0cyk7XG5cbiAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICBhc3NlcnRUeXBlKGlzLmZ1bmN0aW9uLCAnYWRkQ3VzdG9tTWV0aG9kcycsIGBDdXN0b20gbWV0aG9kICcke3Byb3B9J2AsIHByb3BlcnRpZXNbcHJvcF0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlQXBpRm5BcmdzIChmbk5hbWUsIC4uLmFyZ3MpIHtcbiAgICBhcmdzID0gYXJncy5tYXAoYXJnID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIGAnJHthcmd9J2A7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgcmV0dXJuICdbZnVuY3Rpb25dJztcbiAgICAgICAgcmV0dXJuIGFyZztcbiAgICB9KTtcbiAgICBhcmdzID0gYXJncy5qb2luKCcsICcpO1xuXG4gICAgcmV0dXJuIGAuJHtmbk5hbWV9KCR7YXJnc30pYDtcbn1cblxuZnVuY3Rpb24gZ2V0RGVyaXZhdGl2ZVNlbGVjdG9yQXJncyAob3B0aW9ucywgc2VsZWN0b3JGbiwgYXBpRm4sIGZpbHRlciwgYWRkaXRpb25hbERlcGVuZGVuY2llcykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7IHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXIsIGFkZGl0aW9uYWxEZXBlbmRlbmNpZXMgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFNuYXBzaG90UHJvcGVydGllcyAob2JqLCBnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyLCBwcm9wZXJ0aWVzKSB7XG4gICAgcHJvcGVydGllcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxsc2l0ZSA9IGdldENhbGxzaXRlRm9yTWV0aG9kKCdnZXQnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBSZUV4ZWN1dGFibGVQcm9taXNlLmZyb21Gbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNuYXBzaG90ID0gYXdhaXQgZ2V0U25hcHNob3QoZ2V0U2VsZWN0b3IsIGNhbGxzaXRlLCBTZWxlY3RvckJ1aWxkZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzbmFwc2hvdFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRDdXN0b21NZXRob2RzIChvYmosIGdldFNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIsIGN1c3RvbU1ldGhvZHMpIHtcbiAgICBjb25zdCBjdXN0b21NZXRob2RQcm9wcyA9IGN1c3RvbU1ldGhvZHMgPyBPYmplY3Qua2V5cyhjdXN0b21NZXRob2RzKSA6IFtdO1xuXG4gICAgY3VzdG9tTWV0aG9kUHJvcHMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgY29uc3QgeyByZXR1cm5ET01Ob2RlcyA9IGZhbHNlLCBtZXRob2QgfSA9IGN1c3RvbU1ldGhvZHNbcHJvcF07XG5cbiAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0ge1xuICAgICAgICAgICAgY3VzdG9tTWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICBzZWxlY3RvcjogICAgIGdldFNlbGVjdG9yKClcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjYWxsc2l0ZU5hbWVzID0geyBpbnN0YW50aWF0aW9uOiBwcm9wIH07XG5cbiAgICAgICAgaWYgKHJldHVybkRPTU5vZGVzKSB7XG4gICAgICAgICAgICBvYmpbcHJvcF0gPSAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdG9yRm4gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gc2VsZWN0b3IoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VzdG9tTWV0aG9kLmFwcGx5KGN1c3RvbU1ldGhvZCwgW25vZGVzXS5jb25jYXQoYXJncykpO1xuICAgICAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFwaUZuID0gcHJlcGFyZUFwaUZuQXJncyhwcm9wLCAuLi5hcmdzKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSAoKSA9PiB0cnVlO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYWRkaXRpb25hbERlcGVuZGVuY2llcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYXJncyxcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tTWV0aG9kOiBtZXRob2RcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZURlcml2YXRpdmVTZWxlY3RvcldpdGhGaWx0ZXIoeyBnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyLCBzZWxlY3RvckZuLCBhcGlGbiwgZmlsdGVyLCBhZGRpdGlvbmFsRGVwZW5kZW5jaWVzIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9ialtwcm9wXSA9IChuZXcgQ2xpZW50RnVuY3Rpb25CdWlsZGVyKCguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gc2VsZWN0b3IoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjdXN0b21NZXRob2QuYXBwbHkoY3VzdG9tTWV0aG9kLCBbbm9kZV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICB9LCB7IGRlcGVuZGVuY2llcyB9LCBjYWxsc2l0ZU5hbWVzKSkuZ2V0RnVuY3Rpb24oKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTbmFwc2hvdFByb3BlcnR5U2hvcnRoYW5kcyAoeyBvYmosIGdldFNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIsIGN1c3RvbURPTVByb3BlcnRpZXMsIGN1c3RvbU1ldGhvZHMgfSkge1xuICAgIGxldCBwcm9wZXJ0aWVzID0gU05BUFNIT1RfUFJPUEVSVElFUztcblxuICAgIGlmIChjdXN0b21ET01Qcm9wZXJ0aWVzKVxuICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoT2JqZWN0LmtleXMoY3VzdG9tRE9NUHJvcGVydGllcykpO1xuXG4gICAgYWRkU25hcHNob3RQcm9wZXJ0aWVzKG9iaiwgZ2V0U2VsZWN0b3IsIFNlbGVjdG9yQnVpbGRlciwgcHJvcGVydGllcyk7XG4gICAgYWRkQ3VzdG9tTWV0aG9kcyhvYmosIGdldFNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIsIGN1c3RvbU1ldGhvZHMpO1xuXG4gICAgb2JqLmdldFN0eWxlUHJvcGVydHkgPSBwcm9wID0+IHtcbiAgICAgICAgY29uc3QgY2FsbHNpdGUgPSBnZXRDYWxsc2l0ZUZvck1ldGhvZCgnZ2V0U3R5bGVQcm9wZXJ0eScpO1xuXG4gICAgICAgIHJldHVybiBSZUV4ZWN1dGFibGVQcm9taXNlLmZyb21Gbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzbmFwc2hvdCA9IGF3YWl0IGdldFNuYXBzaG90KGdldFNlbGVjdG9yLCBjYWxsc2l0ZSwgU2VsZWN0b3JCdWlsZGVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIHNuYXBzaG90LnN0eWxlID8gc25hcHNob3Quc3R5bGVbcHJvcF0gOiB2b2lkIDA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYmouZ2V0QXR0cmlidXRlID0gYXR0ck5hbWUgPT4ge1xuICAgICAgICBjb25zdCBjYWxsc2l0ZSA9IGdldENhbGxzaXRlRm9yTWV0aG9kKCdnZXRBdHRyaWJ1dGUnKTtcblxuICAgICAgICByZXR1cm4gUmVFeGVjdXRhYmxlUHJvbWlzZS5mcm9tRm4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc25hcHNob3QgPSBhd2FpdCBnZXRTbmFwc2hvdChnZXRTZWxlY3RvciwgY2FsbHNpdGUsIFNlbGVjdG9yQnVpbGRlcik7XG5cbiAgICAgICAgICAgIHJldHVybiBzbmFwc2hvdC5hdHRyaWJ1dGVzID8gc25hcHNob3QuYXR0cmlidXRlc1thdHRyTmFtZV0gOiB2b2lkIDA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBvYmouaGFzQXR0cmlidXRlID0gYXR0ck5hbWUgPT4ge1xuICAgICAgICBjb25zdCBjYWxsc2l0ZSA9IGdldENhbGxzaXRlRm9yTWV0aG9kKCdoYXNBdHRyaWJ1dGUnKTtcblxuICAgICAgICByZXR1cm4gUmVFeGVjdXRhYmxlUHJvbWlzZS5mcm9tRm4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc25hcHNob3QgPSBhd2FpdCBnZXRTbmFwc2hvdChnZXRTZWxlY3RvciwgY2FsbHNpdGUsIFNlbGVjdG9yQnVpbGRlcik7XG5cbiAgICAgICAgICAgIHJldHVybiBzbmFwc2hvdC5hdHRyaWJ1dGVzID8gc25hcHNob3QuYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkgOiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9iai5nZXRCb3VuZGluZ0NsaWVudFJlY3RQcm9wZXJ0eSA9IHByb3AgPT4ge1xuICAgICAgICBjb25zdCBjYWxsc2l0ZSA9IGdldENhbGxzaXRlRm9yTWV0aG9kKCdnZXRCb3VuZGluZ0NsaWVudFJlY3RQcm9wZXJ0eScpO1xuXG4gICAgICAgIHJldHVybiBSZUV4ZWN1dGFibGVQcm9taXNlLmZyb21Gbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzbmFwc2hvdCA9IGF3YWl0IGdldFNuYXBzaG90KGdldFNlbGVjdG9yLCBjYWxsc2l0ZSwgU2VsZWN0b3JCdWlsZGVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIHNuYXBzaG90LmJvdW5kaW5nQ2xpZW50UmVjdCA/IHNuYXBzaG90LmJvdW5kaW5nQ2xpZW50UmVjdFtwcm9wXSA6IHZvaWQgMDtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9iai5oYXNDbGFzcyA9IG5hbWUgPT4ge1xuICAgICAgICBjb25zdCBjYWxsc2l0ZSA9IGdldENhbGxzaXRlRm9yTWV0aG9kKCdoYXNDbGFzcycpO1xuXG4gICAgICAgIHJldHVybiBSZUV4ZWN1dGFibGVQcm9taXNlLmZyb21Gbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzbmFwc2hvdCA9IGF3YWl0IGdldFNuYXBzaG90KGdldFNlbGVjdG9yLCBjYWxsc2l0ZSwgU2VsZWN0b3JCdWlsZGVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIHNuYXBzaG90LmNsYXNzTmFtZXMgPyBzbmFwc2hvdC5jbGFzc05hbWVzLmluZGV4T2YobmFtZSkgPiAtMSA6IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb3VudGVyIChnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyKSB7XG4gICAgY29uc3QgYnVpbGRlciAgPSBuZXcgU2VsZWN0b3JCdWlsZGVyKGdldFNlbGVjdG9yKCksIHsgY291bnRlck1vZGU6IHRydWUgfSwgeyBpbnN0YW50aWF0aW9uOiAnU2VsZWN0b3InIH0pO1xuICAgIGNvbnN0IGNvdW50ZXIgID0gYnVpbGRlci5nZXRGdW5jdGlvbigpO1xuICAgIGNvbnN0IGNhbGxzaXRlID0gZ2V0Q2FsbHNpdGVGb3JNZXRob2QoJ2dldCcpO1xuXG4gICAgcmV0dXJuIGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBjb3VudGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBlcnIuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFkZENvdW50ZXJQcm9wZXJ0aWVzICh7IG9iaiwgZ2V0U2VsZWN0b3IsIFNlbGVjdG9yQnVpbGRlciB9KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgJ2NvdW50Jywge1xuICAgICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ZXIgPSBjcmVhdGVDb3VudGVyKGdldFNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gUmVFeGVjdXRhYmxlUHJvbWlzZS5mcm9tRm4oKCkgPT4gY291bnRlcigpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgJ2V4aXN0cycsIHtcbiAgICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb3VudGVyID0gY3JlYXRlQ291bnRlcihnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIFJlRXhlY3V0YWJsZVByb21pc2UuZnJvbUZuKGFzeW5jICgpID0+IGF3YWl0IGNvdW50ZXIoKSA+IDApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRGaWx0ZXJUb0NsaWVudEZ1bmN0aW9uSWZOZWNlc3NhcnkgKGNhbGxzaXRlTmFtZSwgZmlsdGVyLCBkZXBlbmRlbmNpZXMpIHtcbiAgICBpZiAodHlwZW9mIGZpbHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gZmlsdGVyW2NsaWVudEZ1bmN0aW9uQnVpbGRlclN5bWJvbF07XG4gICAgICAgIGNvbnN0IGZuICAgICAgPSBidWlsZGVyID8gYnVpbGRlci5mbiA6IGZpbHRlcjtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGJ1aWxkZXIgPyBhc3NpZ24oe30sIGJ1aWxkZXIub3B0aW9ucywgeyBkZXBlbmRlbmNpZXMgfSkgOiB7IGRlcGVuZGVuY2llcyB9O1xuXG4gICAgICAgIHJldHVybiAobmV3IENsaWVudEZ1bmN0aW9uQnVpbGRlcihmbiwgb3B0aW9ucywgeyBpbnN0YW50aWF0aW9uOiBjYWxsc2l0ZU5hbWUgfSkpLmdldEZ1bmN0aW9uKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbHRlcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRGVyaXZhdGl2ZVNlbGVjdG9yV2l0aEZpbHRlciAoeyBnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyLCBzZWxlY3RvckZuLCBhcGlGbiwgZmlsdGVyLCBhZGRpdGlvbmFsRGVwZW5kZW5jaWVzIH0pIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uTW9kZVNlbGVjdG9yQnVpbGRlciA9IG5ldyBTZWxlY3RvckJ1aWxkZXIoZ2V0U2VsZWN0b3IoKSwgeyBjb2xsZWN0aW9uTW9kZTogdHJ1ZSB9KTtcbiAgICBjb25zdCBjdXN0b21ET01Qcm9wZXJ0aWVzICAgICAgICAgICA9IGNvbGxlY3Rpb25Nb2RlU2VsZWN0b3JCdWlsZGVyLm9wdGlvbnMuY3VzdG9tRE9NUHJvcGVydGllcztcbiAgICBjb25zdCBjdXN0b21NZXRob2RzICAgICAgICAgICAgICAgICA9IGNvbGxlY3Rpb25Nb2RlU2VsZWN0b3JCdWlsZGVyLm9wdGlvbnMuY3VzdG9tTWV0aG9kcztcblxuICAgIGxldCBkZXBlbmRlbmNpZXMgPSB7XG4gICAgICAgIHNlbGVjdG9yOiAgICBjb2xsZWN0aW9uTW9kZVNlbGVjdG9yQnVpbGRlci5nZXRGdW5jdGlvbigpLFxuICAgICAgICBmaWx0ZXI6ICAgICAgZmlsdGVyLFxuICAgICAgICBmaWx0ZXJOb2RlczogZmlsdGVyTm9kZXNcbiAgICB9O1xuXG4gICAgY29uc3QgeyBib3VuZFRlc3RSdW4sIHRpbWVvdXQsIHZpc2liaWxpdHlDaGVjaywgYXBpRm5DaGFpbiB9ID0gY29sbGVjdGlvbk1vZGVTZWxlY3RvckJ1aWxkZXIub3B0aW9ucztcblxuICAgIGRlcGVuZGVuY2llcyA9IGFzc2lnbihkZXBlbmRlbmNpZXMsIGFkZGl0aW9uYWxEZXBlbmRlbmNpZXMpO1xuXG4gICAgY29uc3QgYnVpbGRlciA9IG5ldyBTZWxlY3RvckJ1aWxkZXIoc2VsZWN0b3JGbiwge1xuICAgICAgICBkZXBlbmRlbmNpZXMsXG4gICAgICAgIGN1c3RvbURPTVByb3BlcnRpZXMsXG4gICAgICAgIGN1c3RvbU1ldGhvZHMsXG4gICAgICAgIGJvdW5kVGVzdFJ1bixcbiAgICAgICAgdGltZW91dCxcbiAgICAgICAgdmlzaWJpbGl0eUNoZWNrLFxuICAgICAgICBhcGlGbkNoYWluLFxuICAgICAgICBhcGlGblxuICAgIH0sIHsgaW5zdGFudGlhdGlvbjogJ1NlbGVjdG9yJyB9KTtcblxuICAgIHJldHVybiBidWlsZGVyLmdldEZ1bmN0aW9uKCk7XG59XG5cbmNvbnN0IGZpbHRlckJ5VGV4dCA9IGNvbnZlcnRGaWx0ZXJUb0NsaWVudEZ1bmN0aW9uSWZOZWNlc3NhcnkoJ2ZpbHRlcicsIHNlbGVjdG9yVGV4dEZpbHRlcik7XG5jb25zdCBmaWx0ZXJCeUF0dHIgPSBjb252ZXJ0RmlsdGVyVG9DbGllbnRGdW5jdGlvbklmTmVjZXNzYXJ5KCdmaWx0ZXInLCBzZWxlY3RvckF0dHJpYnV0ZUZpbHRlcik7XG5cbmZ1bmN0aW9uIGVuc3VyZVJlZ0V4cENvbnRleHQgKHN0cikge1xuICAgIC8vIE5PVEU6IGlmIGEgcmVnZXhwIGlzIGNyZWF0ZWQgaW4gYSBzZXBhcmF0ZSBjb250ZXh0ICh2aWEgdGhlICd2bScgbW9kdWxlKSB3ZVxuICAgIC8vIHNob3VsZCB3cmFwIGl0IHdpdGggbmV3IFJlZ0V4cCgpIHRvIG1ha2UgdGhlIGBpbnN0YW5jZW9mIFJlZ0V4cGAgY2hlY2sgc3VjY2Vzc2Z1bC5cbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycgJiYgIShzdHIgaW5zdGFuY2VvZiBSZWdFeHApKVxuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChzdHIpO1xuXG4gICAgcmV0dXJuIHN0cjtcbn1cblxuZnVuY3Rpb24gYWRkRmlsdGVyTWV0aG9kcyAob3B0aW9ucykge1xuICAgIGNvbnN0IHsgb2JqLCBnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyIH0gPSBvcHRpb25zO1xuXG4gICAgb2JqLm50aCA9IGluZGV4ID0+IHtcbiAgICAgICAgYXNzZXJ0VHlwZShpcy5udW1iZXIsICdudGgnLCAnXCJpbmRleFwiIGFyZ3VtZW50JywgaW5kZXgpO1xuXG4gICAgICAgIGNvbnN0IGFwaUZuICAgPSBwcmVwYXJlQXBpRm5BcmdzKCdudGgnLCBpbmRleCk7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgU2VsZWN0b3JCdWlsZGVyKGdldFNlbGVjdG9yKCksIHsgaW5kZXgsIGFwaUZuIH0sIHsgaW5zdGFudGlhdGlvbjogJ1NlbGVjdG9yJyB9KTtcblxuICAgICAgICByZXR1cm4gYnVpbGRlci5nZXRGdW5jdGlvbigpO1xuICAgIH07XG5cbiAgICBvYmoud2l0aFRleHQgPSB0ZXh0ID0+IHtcbiAgICAgICAgYXNzZXJ0VHlwZShbaXMuc3RyaW5nLCBpcy5yZWdFeHBdLCAnd2l0aFRleHQnLCAnXCJ0ZXh0XCIgYXJndW1lbnQnLCB0ZXh0KTtcblxuICAgICAgICBjb25zdCBhcGlGbiA9IHByZXBhcmVBcGlGbkFyZ3MoJ3dpdGhUZXh0JywgdGV4dCk7XG5cbiAgICAgICAgdGV4dCA9IGVuc3VyZVJlZ0V4cENvbnRleHQodGV4dCk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JGbiA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICBjb25zdCBub2RlcyA9IHNlbGVjdG9yKCk7XG5cbiAgICAgICAgICAgIGlmICghbm9kZXMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyTm9kZXMobm9kZXMsIGZpbHRlciwgZG9jdW1lbnQsIHZvaWQgMCwgdGV4dFJlKTtcbiAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhcmdzID0gZ2V0RGVyaXZhdGl2ZVNlbGVjdG9yQXJncyhvcHRpb25zLCBzZWxlY3RvckZuLCBhcGlGbiwgZmlsdGVyQnlUZXh0LCB7IHRleHRSZTogbWFrZVJlZ0V4cCh0ZXh0KSB9KTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRGVyaXZhdGl2ZVNlbGVjdG9yV2l0aEZpbHRlcihhcmdzKTtcbiAgICB9O1xuXG4gICAgb2JqLndpdGhFeGFjdFRleHQgPSB0ZXh0ID0+IHtcbiAgICAgICAgYXNzZXJ0VHlwZShpcy5zdHJpbmcsICd3aXRoRXhhY3RUZXh0JywgJ1widGV4dFwiIGFyZ3VtZW50JywgdGV4dCk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JGbiA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICBjb25zdCBub2RlcyA9IHNlbGVjdG9yKCk7XG5cbiAgICAgICAgICAgIGlmICghbm9kZXMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyTm9kZXMobm9kZXMsIGZpbHRlciwgZG9jdW1lbnQsIHZvaWQgMCwgZXhhY3RUZXh0KTtcbiAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhcGlGbiA9IHByZXBhcmVBcGlGbkFyZ3MoJ3dpdGhFeGFjdFRleHQnLCB0ZXh0KTtcbiAgICAgICAgY29uc3QgYXJncyAgPSBnZXREZXJpdmF0aXZlU2VsZWN0b3JBcmdzKG9wdGlvbnMsIHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXJCeVRleHQsIHsgZXhhY3RUZXh0OiB0ZXh0IH0pO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVEZXJpdmF0aXZlU2VsZWN0b3JXaXRoRmlsdGVyKGFyZ3MpO1xuICAgIH07XG5cbiAgICBvYmoud2l0aEF0dHJpYnV0ZSA9IChhdHRyTmFtZSwgYXR0clZhbHVlKSA9PiB7XG4gICAgICAgIGFzc2VydFR5cGUoW2lzLnN0cmluZywgaXMucmVnRXhwXSwgJ3dpdGhBdHRyaWJ1dGUnLCAnXCJhdHRyTmFtZVwiIGFyZ3VtZW50JywgYXR0ck5hbWUpO1xuXG4gICAgICAgIGNvbnN0IGFwaUZuID0gcHJlcGFyZUFwaUZuQXJncygnd2l0aEF0dHJpYnV0ZScsIGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuXG4gICAgICAgIGF0dHJOYW1lID0gZW5zdXJlUmVnRXhwQ29udGV4dChhdHRyTmFtZSk7XG5cbiAgICAgICAgaWYgKGF0dHJWYWx1ZSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBhc3NlcnRUeXBlKFtpcy5zdHJpbmcsIGlzLnJlZ0V4cF0sICd3aXRoQXR0cmlidXRlJywgJ1wiYXR0clZhbHVlXCIgYXJndW1lbnQnLCBhdHRyVmFsdWUpO1xuICAgICAgICAgICAgYXR0clZhbHVlID0gZW5zdXJlUmVnRXhwQ29udGV4dChhdHRyVmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JGbiA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICBjb25zdCBub2RlcyA9IHNlbGVjdG9yKCk7XG5cbiAgICAgICAgICAgIGlmICghbm9kZXMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyTm9kZXMobm9kZXMsIGZpbHRlciwgZG9jdW1lbnQsIHZvaWQgMCwgYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgYXJncyA9IGdldERlcml2YXRpdmVTZWxlY3RvckFyZ3Mob3B0aW9ucywgc2VsZWN0b3JGbiwgYXBpRm4sIGZpbHRlckJ5QXR0ciwge1xuICAgICAgICAgICAgYXR0ck5hbWUsXG4gICAgICAgICAgICBhdHRyVmFsdWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZURlcml2YXRpdmVTZWxlY3RvcldpdGhGaWx0ZXIoYXJncyk7XG4gICAgfTtcblxuICAgIG9iai5maWx0ZXIgPSAoZmlsdGVyLCBkZXBlbmRlbmNpZXMpID0+IHtcbiAgICAgICAgYXNzZXJ0VHlwZShbaXMuc3RyaW5nLCBpcy5mdW5jdGlvbl0sICdmaWx0ZXInLCAnXCJmaWx0ZXJcIiBhcmd1bWVudCcsIGZpbHRlcik7XG5cbiAgICAgICAgY29uc3QgYXBpRm4gPSBwcmVwYXJlQXBpRm5BcmdzKCdmaWx0ZXInLCBmaWx0ZXIpO1xuXG4gICAgICAgIGZpbHRlciA9IGNvbnZlcnRGaWx0ZXJUb0NsaWVudEZ1bmN0aW9uSWZOZWNlc3NhcnkoJ2ZpbHRlcicsIGZpbHRlciwgZGVwZW5kZW5jaWVzKTtcblxuICAgICAgICBjb25zdCBzZWxlY3RvckZuID0gKCkgPT4ge1xuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gc2VsZWN0b3IoKTtcblxuICAgICAgICAgICAgaWYgKCFub2Rlcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJOb2Rlcyhub2RlcywgZmlsdGVyLCBkb2N1bWVudCwgdm9pZCAwKTtcbiAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgfTtcblxuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBnZXREZXJpdmF0aXZlU2VsZWN0b3JBcmdzKG9wdGlvbnMsIHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXIpO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVEZXJpdmF0aXZlU2VsZWN0b3JXaXRoRmlsdGVyKGFyZ3MpO1xuICAgIH07XG5cbiAgICBvYmouZmlsdGVyVmlzaWJsZSA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBpRm4gICA9IHByZXBhcmVBcGlGbkFyZ3MoJ2ZpbHRlclZpc2libGUnKTtcbiAgICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBTZWxlY3RvckJ1aWxkZXIoZ2V0U2VsZWN0b3IoKSwgeyBmaWx0ZXJWaXNpYmxlOiB0cnVlLCBhcGlGbiB9LCB7IGluc3RhbnRpYXRpb246ICdTZWxlY3RvcicgfSk7XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIuZ2V0RnVuY3Rpb24oKTtcbiAgICB9O1xuXG4gICAgb2JqLmZpbHRlckhpZGRlbiA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBpRm4gICA9IHByZXBhcmVBcGlGbkFyZ3MoJ2ZpbHRlckhpZGRlbicpO1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IFNlbGVjdG9yQnVpbGRlcihnZXRTZWxlY3RvcigpLCB7IGZpbHRlckhpZGRlbjogdHJ1ZSwgYXBpRm4gfSwgeyBpbnN0YW50aWF0aW9uOiAnU2VsZWN0b3InIH0pO1xuXG4gICAgICAgIHJldHVybiBidWlsZGVyLmdldEZ1bmN0aW9uKCk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYWRkQ3VzdG9tRE9NUHJvcGVydGllc01ldGhvZCAoeyBvYmosIGdldFNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIgfSkge1xuICAgIG9iai5hZGRDdXN0b21ET01Qcm9wZXJ0aWVzID0gY3VzdG9tRE9NUHJvcGVydGllcyA9PiB7XG4gICAgICAgIGFzc2VydEFkZEN1c3RvbURPTVByb3BlcnRpZXNPcHRpb25zKGN1c3RvbURPTVByb3BlcnRpZXMpO1xuXG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgU2VsZWN0b3JCdWlsZGVyKGdldFNlbGVjdG9yKCksIHsgY3VzdG9tRE9NUHJvcGVydGllcyB9LCB7IGluc3RhbnRpYXRpb246ICdTZWxlY3RvcicgfSk7XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIuZ2V0RnVuY3Rpb24oKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhZGRDdXN0b21NZXRob2RzTWV0aG9kICh7IG9iaiwgZ2V0U2VsZWN0b3IsIFNlbGVjdG9yQnVpbGRlciB9KSB7XG4gICAgb2JqLmFkZEN1c3RvbU1ldGhvZHMgPSBmdW5jdGlvbiAobWV0aG9kcywgb3B0cykge1xuICAgICAgICBhc3NlcnRBZGRDdXN0b21NZXRob2RzKG1ldGhvZHMsIG9wdHMpO1xuXG4gICAgICAgIGNvbnN0IGN1c3RvbU1ldGhvZHMgPSB7fTtcblxuICAgICAgICBPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgICAgICAgICAgY3VzdG9tTWV0aG9kc1ttZXRob2ROYW1lXSA9IHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICAgICAgICAgbWV0aG9kc1ttZXRob2ROYW1lXSxcbiAgICAgICAgICAgICAgICByZXR1cm5ET01Ob2Rlczogb3B0cyAmJiAhIW9wdHMucmV0dXJuRE9NTm9kZXNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgU2VsZWN0b3JCdWlsZGVyKGdldFNlbGVjdG9yKCksIHsgY3VzdG9tTWV0aG9kcyB9LCB7IGluc3RhbnRpYXRpb246ICdTZWxlY3RvcicgfSk7XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkZXIuZ2V0RnVuY3Rpb24oKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhZGRIaWVyYXJjaGljYWxTZWxlY3RvcnMgKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IG9iaiB9ID0gb3B0aW9ucztcblxuICAgIC8vIEZpbmRcbiAgICBvYmouZmluZCA9IChmaWx0ZXIsIGRlcGVuZGVuY2llcykgPT4ge1xuICAgICAgICBhc3NlcnRUeXBlKFtpcy5zdHJpbmcsIGlzLmZ1bmN0aW9uXSwgJ2ZpbmQnLCAnXCJmaWx0ZXJcIiBhcmd1bWVudCcsIGZpbHRlcik7XG5cbiAgICAgICAgY29uc3QgYXBpRm4gPSBwcmVwYXJlQXBpRm5BcmdzKCdmaW5kJywgZmlsdGVyKTtcblxuICAgICAgICBmaWx0ZXIgPSBjb252ZXJ0RmlsdGVyVG9DbGllbnRGdW5jdGlvbklmTmVjZXNzYXJ5KCdmaW5kJywgZmlsdGVyLCBkZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yRm4gPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZFNlbGVjdG9yUmVzdWx0cyhzZWxlY3Rvciwgbm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygbm9kZS5xdWVyeVNlbGVjdG9yQWxsID09PSAnZnVuY3Rpb24nID9cbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucXVlcnlTZWxlY3RvckFsbChmaWx0ZXIpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdmlzaXROb2RlID0gY3VycmVudE5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbkxlbmd0aCA9IGN1cnJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY25MZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBjdXJyZW50Tm9kZS5jaGlsZE5vZGVzW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goY2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpdE5vZGUoY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZpc2l0Tm9kZShub2RlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJOb2RlcyhyZXN1bHRzLCBmaWx0ZXIsIG51bGwsIG5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgYXJncyA9IGdldERlcml2YXRpdmVTZWxlY3RvckFyZ3Mob3B0aW9ucywgc2VsZWN0b3JGbiwgYXBpRm4sIGZpbHRlciwgeyBleHBhbmRTZWxlY3RvclJlc3VsdHMgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZURlcml2YXRpdmVTZWxlY3RvcldpdGhGaWx0ZXIoYXJncyk7XG4gICAgfTtcblxuICAgIC8vIFBhcmVudFxuICAgIG9iai5wYXJlbnQgPSAoZmlsdGVyLCBkZXBlbmRlbmNpZXMpID0+IHtcbiAgICAgICAgaWYgKGZpbHRlciAhPT0gdm9pZCAwKVxuICAgICAgICAgICAgYXNzZXJ0VHlwZShbaXMuc3RyaW5nLCBpcy5mdW5jdGlvbiwgaXMubnVtYmVyXSwgJ3BhcmVudCcsICdcImZpbHRlclwiIGFyZ3VtZW50JywgZmlsdGVyKTtcblxuICAgICAgICBjb25zdCBhcGlGbiA9IHByZXBhcmVBcGlGbkFyZ3MoJ3BhcmVudCcsIGZpbHRlcik7XG5cbiAgICAgICAgZmlsdGVyID0gY29udmVydEZpbHRlclRvQ2xpZW50RnVuY3Rpb25JZk5lY2Vzc2FyeSgnZmluZCcsIGZpbHRlciwgZGVwZW5kZW5jaWVzKTtcblxuICAgICAgICBjb25zdCBzZWxlY3RvckZuID0gKCkgPT4ge1xuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgICAgIHJldHVybiBleHBhbmRTZWxlY3RvclJlc3VsdHMoc2VsZWN0b3IsIG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTsgcGFyZW50OyBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50cy5wdXNoKHBhcmVudCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyICE9PSB2b2lkIDAgPyBmaWx0ZXJOb2RlcyhwYXJlbnRzLCBmaWx0ZXIsIGRvY3VtZW50LCBub2RlKSA6IHBhcmVudHM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBhcmdzID0gZ2V0RGVyaXZhdGl2ZVNlbGVjdG9yQXJncyhvcHRpb25zLCBzZWxlY3RvckZuLCBhcGlGbiwgZmlsdGVyLCB7IGV4cGFuZFNlbGVjdG9yUmVzdWx0cyB9KTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRGVyaXZhdGl2ZVNlbGVjdG9yV2l0aEZpbHRlcihhcmdzKTtcbiAgICB9O1xuXG4gICAgLy8gQ2hpbGRcbiAgICBvYmouY2hpbGQgPSAoZmlsdGVyLCBkZXBlbmRlbmNpZXMpID0+IHtcbiAgICAgICAgaWYgKGZpbHRlciAhPT0gdm9pZCAwKVxuICAgICAgICAgICAgYXNzZXJ0VHlwZShbaXMuc3RyaW5nLCBpcy5mdW5jdGlvbiwgaXMubnVtYmVyXSwgJ2NoaWxkJywgJ1wiZmlsdGVyXCIgYXJndW1lbnQnLCBmaWx0ZXIpO1xuXG4gICAgICAgIGNvbnN0IGFwaUZuID0gcHJlcGFyZUFwaUZuQXJncygnY2hpbGQnLCBmaWx0ZXIpO1xuXG4gICAgICAgIGZpbHRlciA9IGNvbnZlcnRGaWx0ZXJUb0NsaWVudEZ1bmN0aW9uSWZOZWNlc3NhcnkoJ2ZpbmQnLCBmaWx0ZXIsIGRlcGVuZGVuY2llcyk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JGbiA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICByZXR1cm4gZXhwYW5kU2VsZWN0b3JSZXN1bHRzKHNlbGVjdG9yLCBub2RlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZEVsZW1lbnRzID0gW107XG4gICAgICAgICAgICAgICAgY29uc3QgY25MZW5ndGggICAgICA9IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNuTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBub2RlLmNoaWxkTm9kZXNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRFbGVtZW50cy5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyICE9PSB2b2lkIDAgPyBmaWx0ZXJOb2RlcyhjaGlsZEVsZW1lbnRzLCBmaWx0ZXIsIG5vZGUsIG5vZGUpIDogY2hpbGRFbGVtZW50cztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bmRlZiAqL1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBnZXREZXJpdmF0aXZlU2VsZWN0b3JBcmdzKG9wdGlvbnMsIHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXIsIHsgZXhwYW5kU2VsZWN0b3JSZXN1bHRzIH0pO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVEZXJpdmF0aXZlU2VsZWN0b3JXaXRoRmlsdGVyKGFyZ3MpO1xuICAgIH07XG5cbiAgICAvLyBTaWJsaW5nXG4gICAgb2JqLnNpYmxpbmcgPSAoZmlsdGVyLCBkZXBlbmRlbmNpZXMpID0+IHtcbiAgICAgICAgaWYgKGZpbHRlciAhPT0gdm9pZCAwKVxuICAgICAgICAgICAgYXNzZXJ0VHlwZShbaXMuc3RyaW5nLCBpcy5mdW5jdGlvbiwgaXMubnVtYmVyXSwgJ3NpYmxpbmcnLCAnXCJmaWx0ZXJcIiBhcmd1bWVudCcsIGZpbHRlcik7XG5cbiAgICAgICAgY29uc3QgYXBpRm4gPSBwcmVwYXJlQXBpRm5BcmdzKCdzaWJsaW5nJywgZmlsdGVyKTtcblxuICAgICAgICBmaWx0ZXIgPSBjb252ZXJ0RmlsdGVyVG9DbGllbnRGdW5jdGlvbklmTmVjZXNzYXJ5KCdmaW5kJywgZmlsdGVyLCBkZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yRm4gPSAoKSA9PiB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuICAgICAgICAgICAgcmV0dXJuIGV4cGFuZFNlbGVjdG9yUmVzdWx0cyhzZWxlY3Rvciwgbm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnROb2RlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFwYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2libGluZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbkxlbmd0aCA9IHBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY25MZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IHBhcmVudC5jaGlsZE5vZGVzW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSAmJiBjaGlsZCAhPT0gbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmdzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIgIT09IHZvaWQgMCA/IGZpbHRlck5vZGVzKHNpYmxpbmdzLCBmaWx0ZXIsIHBhcmVudCwgbm9kZSkgOiBzaWJsaW5ncztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bmRlZiAqL1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBnZXREZXJpdmF0aXZlU2VsZWN0b3JBcmdzKG9wdGlvbnMsIHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXIsIHsgZXhwYW5kU2VsZWN0b3JSZXN1bHRzIH0pO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVEZXJpdmF0aXZlU2VsZWN0b3JXaXRoRmlsdGVyKGFyZ3MpO1xuICAgIH07XG5cbiAgICAvLyBOZXh0IHNpYmxpbmdcbiAgICBvYmoubmV4dFNpYmxpbmcgPSAoZmlsdGVyLCBkZXBlbmRlbmNpZXMpID0+IHtcbiAgICAgICAgaWYgKGZpbHRlciAhPT0gdm9pZCAwKVxuICAgICAgICAgICAgYXNzZXJ0VHlwZShbaXMuc3RyaW5nLCBpcy5mdW5jdGlvbiwgaXMubnVtYmVyXSwgJ25leHRTaWJsaW5nJywgJ1wiZmlsdGVyXCIgYXJndW1lbnQnLCBmaWx0ZXIpO1xuXG4gICAgICAgIGNvbnN0IGFwaUZuID0gcHJlcGFyZUFwaUZuQXJncygnbmV4dFNpYmxpbmcnLCBmaWx0ZXIpO1xuXG4gICAgICAgIGZpbHRlciA9IGNvbnZlcnRGaWx0ZXJUb0NsaWVudEZ1bmN0aW9uSWZOZWNlc3NhcnkoJ2ZpbmQnLCBmaWx0ZXIsIGRlcGVuZGVuY2llcyk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JGbiA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICByZXR1cm4gZXhwYW5kU2VsZWN0b3JSZXN1bHRzKHNlbGVjdG9yLCBub2RlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBub2RlLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzaWJsaW5ncyA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNuTGVuZ3RoID0gcGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGxldCBhZnRlck5vZGUgID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNuTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBwYXJlbnQuY2hpbGROb2Rlc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQgPT09IG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlck5vZGUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFmdGVyTm9kZSAmJiBjaGlsZC5ub2RlVHlwZSA9PT0gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmdzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIgIT09IHZvaWQgMCA/IGZpbHRlck5vZGVzKHNpYmxpbmdzLCBmaWx0ZXIsIHBhcmVudCwgbm9kZSkgOiBzaWJsaW5ncztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bmRlZiAqL1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBnZXREZXJpdmF0aXZlU2VsZWN0b3JBcmdzKG9wdGlvbnMsIHNlbGVjdG9yRm4sIGFwaUZuLCBmaWx0ZXIsIHsgZXhwYW5kU2VsZWN0b3JSZXN1bHRzIH0pO1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVEZXJpdmF0aXZlU2VsZWN0b3JXaXRoRmlsdGVyKGFyZ3MpO1xuICAgIH07XG5cbiAgICAvLyBQcmV2IHNpYmxpbmdcbiAgICBvYmoucHJldlNpYmxpbmcgPSAoZmlsdGVyLCBkZXBlbmRlbmNpZXMpID0+IHtcbiAgICAgICAgaWYgKGZpbHRlciAhPT0gdm9pZCAwKVxuICAgICAgICAgICAgYXNzZXJ0VHlwZShbaXMuc3RyaW5nLCBpcy5mdW5jdGlvbiwgaXMubnVtYmVyXSwgJ3ByZXZTaWJsaW5nJywgJ1wiZmlsdGVyXCIgYXJndW1lbnQnLCBmaWx0ZXIpO1xuXG4gICAgICAgIGNvbnN0IGFwaUZuID0gcHJlcGFyZUFwaUZuQXJncygncHJldlNpYmxpbmcnLCBmaWx0ZXIpO1xuXG4gICAgICAgIGZpbHRlciA9IGNvbnZlcnRGaWx0ZXJUb0NsaWVudEZ1bmN0aW9uSWZOZWNlc3NhcnkoJ2ZpbmQnLCBmaWx0ZXIsIGRlcGVuZGVuY2llcyk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JGbiA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG4gICAgICAgICAgICByZXR1cm4gZXhwYW5kU2VsZWN0b3JSZXN1bHRzKHNlbGVjdG9yLCBub2RlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBub2RlLnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzaWJsaW5ncyA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNuTGVuZ3RoID0gcGFyZW50LmNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbkxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gcGFyZW50LmNoaWxkTm9kZXNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkID09PSBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2libGluZ3MucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlciAhPT0gdm9pZCAwID8gZmlsdGVyTm9kZXMoc2libGluZ3MsIGZpbHRlciwgcGFyZW50LCBub2RlKSA6IHNpYmxpbmdzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgYXJncyA9IGdldERlcml2YXRpdmVTZWxlY3RvckFyZ3Mob3B0aW9ucywgc2VsZWN0b3JGbiwgYXBpRm4sIGZpbHRlciwgeyBleHBhbmRTZWxlY3RvclJlc3VsdHMgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZURlcml2YXRpdmVTZWxlY3RvcldpdGhGaWx0ZXIoYXJncyk7XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFQSSAoc2VsZWN0b3IsIGdldFNlbGVjdG9yLCBTZWxlY3RvckJ1aWxkZXIsIGN1c3RvbURPTVByb3BlcnRpZXMsIGN1c3RvbU1ldGhvZHMpIHtcbiAgICBjb25zdCBvcHRpb25zID0geyBvYmo6IHNlbGVjdG9yLCBnZXRTZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyLCBjdXN0b21ET01Qcm9wZXJ0aWVzLCBjdXN0b21NZXRob2RzIH07XG5cbiAgICBhZGRGaWx0ZXJNZXRob2RzKG9wdGlvbnMpO1xuICAgIGFkZEhpZXJhcmNoaWNhbFNlbGVjdG9ycyhvcHRpb25zKTtcbiAgICBhZGRTbmFwc2hvdFByb3BlcnR5U2hvcnRoYW5kcyhvcHRpb25zKTtcbiAgICBhZGRDdXN0b21ET01Qcm9wZXJ0aWVzTWV0aG9kKG9wdGlvbnMpO1xuICAgIGFkZEN1c3RvbU1ldGhvZHNNZXRob2Qob3B0aW9ucyk7XG4gICAgYWRkQ291bnRlclByb3BlcnRpZXMob3B0aW9ucyk7XG59XG4iXX0=
