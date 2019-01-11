'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _lodash = require('lodash');

var _dedent = require('dedent');

var _dedent2 = _interopRequireDefault(_dedent);

var _clientFunctionBuilder = require('../client-function-builder');

var _clientFunctionBuilder2 = _interopRequireDefault(_clientFunctionBuilder);

var _replicator = require('../replicator');

var _runtime = require('../../errors/runtime');

var _builderSymbol = require('../builder-symbol');

var _builderSymbol2 = _interopRequireDefault(_builderSymbol);

var _message = require('../../errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

var _typeAssertions = require('../../errors/runtime/type-assertions');

var _observation = require('../../test-run/commands/observation');

var _defineLazyProperty = require('../../utils/define-lazy-property');

var _defineLazyProperty2 = _interopRequireDefault(_defineLazyProperty);

var _addApi = require('./add-api');

var _createSnapshotMethods = require('./create-snapshot-methods');

var _createSnapshotMethods2 = _interopRequireDefault(_createSnapshotMethods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SelectorBuilder extends _clientFunctionBuilder2.default {
    constructor(fn, options, callsiteNames) {
        const apiFn = options && options.apiFn;
        const builderFromSelector = fn && fn[_builderSymbol2.default];
        const builderFromPromiseOrSnapshot = fn && fn.selector && fn.selector[_builderSymbol2.default];
        let builder = builderFromSelector || builderFromPromiseOrSnapshot;

        builder = builder instanceof SelectorBuilder ? builder : null;

        if (builder) {
            fn = builder.fn;

            if (options === void 0 || typeof options === 'object') options = (0, _lodash.merge)({}, builder.options, options, { sourceSelectorBuilder: builder });
        }

        super(fn, options, callsiteNames);

        if (!this.options.apiFnChain) {
            const fnType = typeof this.fn;
            let item = fnType === 'string' ? `'${this.fn}'` : `[${fnType}]`;

            item = `Selector(${item})`;
            this.options.apiFn = item;
            this.options.apiFnChain = [item];
        }

        if (apiFn) this.options.apiFnChain.push(apiFn);

        this.options.apiFnID = this.options.apiFnChain.length - 1;
    }

    _getCompiledFnCode() {
        // OPTIMIZATION: if selector was produced from another selector and
        // it has same dependencies as source selector, then we can
        // avoid recompilation and just re-use already compiled code.
        const hasSameDependenciesAsSourceSelector = this.options.sourceSelectorBuilder && this.options.sourceSelectorBuilder.options.dependencies === this.options.dependencies;

        if (hasSameDependenciesAsSourceSelector) return this.options.sourceSelectorBuilder.compiledFnCode;

        const code = typeof this.fn === 'string' ? `(function(){return document.querySelectorAll(${(0, _stringify2.default)(this.fn)});});` : super._getCompiledFnCode();

        if (code) {
            return (0, _dedent2.default)(`(function(){
                    var __f$=${code};
                    return function(){
                        var args           = __dependencies$.boundArgs || arguments;
                        var selectorFilter = window['%testCafeSelectorFilter%'];
                        
                        var nodes = __f$.apply(this, args);
                        nodes     = selectorFilter.cast(nodes);
                        
                        if (!nodes.length && !selectorFilter.error)
                            selectorFilter.error = __dependencies$.apiInfo.apiFnID;

                        return selectorFilter.filter(nodes, __dependencies$.filterOptions, __dependencies$.apiInfo);
                    };
                 })();`);
        }

        return null;
    }

    _createInvalidFnTypeError() {
        return new _runtime.ClientFunctionAPIError(this.callsiteNames.instantiation, this.callsiteNames.instantiation, _message2.default.selectorInitializedWithWrongType, typeof this.fn);
    }

    _executeCommand(args, testRun, callsite) {
        const resultPromise = super._executeCommand(args, testRun, callsite);

        this._addBoundArgsSelectorGetter(resultPromise, args);

        // OPTIMIZATION: use buffer function as selector not to trigger lazy property ahead of time
        (0, _addApi.addAPI)(resultPromise, () => resultPromise.selector, SelectorBuilder, this.options.customDOMProperties, this.options.customMethods);

        return resultPromise;
    }

    _getSourceSelectorBuilderApiFnID() {
        let selectorAncestor = this;

        while (selectorAncestor.options.sourceSelectorBuilder) selectorAncestor = selectorAncestor.options.sourceSelectorBuilder;

        return selectorAncestor.options.apiFnID;
    }

    getFunctionDependencies() {
        const dependencies = super.getFunctionDependencies();

        var _options = this.options;
        const filterVisible = _options.filterVisible,
              filterHidden = _options.filterHidden,
              counterMode = _options.counterMode,
              collectionMode = _options.collectionMode,
              index = _options.index,
              customDOMProperties = _options.customDOMProperties,
              customMethods = _options.customMethods,
              apiFnChain = _options.apiFnChain,
              boundArgs = _options.boundArgs;


        return (0, _lodash.merge)({}, dependencies, {
            filterOptions: {
                filterVisible,
                filterHidden,
                counterMode,
                collectionMode,
                index: (0, _lodash.isNil)(index) ? null : index
            },
            apiInfo: {
                apiFnChain,
                apiFnID: this._getSourceSelectorBuilderApiFnID()
            },
            boundArgs,
            customDOMProperties,
            customMethods
        });
    }

    _createTestRunCommand(encodedArgs, encodedDependencies) {
        return new _observation.ExecuteSelectorCommand({
            instantiationCallsiteName: this.callsiteNames.instantiation,
            fnCode: this.compiledFnCode,
            args: encodedArgs,
            dependencies: encodedDependencies,
            needError: this.options.needError,
            apiFnChain: this.options.apiFnChain,
            visibilityCheck: !!this.options.visibilityCheck,
            timeout: this.options.timeout
        });
    }

    _validateOptions(options) {
        super._validateOptions(options);

        if (!(0, _lodash.isNil)(options.visibilityCheck)) (0, _typeAssertions.assertType)(_typeAssertions.is.boolean, this.callsiteNames.instantiation, '"visibilityCheck" option', options.visibilityCheck);

        if (!(0, _lodash.isNil)(options.timeout)) (0, _typeAssertions.assertType)(_typeAssertions.is.nonNegativeNumber, this.callsiteNames.instantiation, '"timeout" option', options.timeout);
    }

    _getReplicatorTransforms() {
        const transforms = super._getReplicatorTransforms();

        transforms.push(new _replicator.SelectorNodeTransform());

        return transforms;
    }

    _addBoundArgsSelectorGetter(obj, selectorArgs) {
        (0, _defineLazyProperty2.default)(obj, 'selector', () => {
            const builder = new SelectorBuilder(this.getFunction(), { boundArgs: selectorArgs });

            return builder.getFunction();
        });
    }

    _decorateFunction(selectorFn) {
        super._decorateFunction(selectorFn);

        (0, _addApi.addAPI)(selectorFn, () => selectorFn, SelectorBuilder, this.options.customDOMProperties, this.options.customMethods);
    }

    _processResult(result, selectorArgs) {
        const snapshot = super._processResult(result, selectorArgs);

        if (snapshot && !this.options.counterMode) {
            this._addBoundArgsSelectorGetter(snapshot, selectorArgs);
            (0, _createSnapshotMethods2.default)(snapshot);

            if (this.options.customMethods) (0, _addApi.addCustomMethods)(snapshot, () => snapshot.selector, SelectorBuilder, this.options.customMethods);
        }

        return snapshot;
    }
}
exports.default = SelectorBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQtZnVuY3Rpb25zL3NlbGVjdG9ycy9zZWxlY3Rvci1idWlsZGVyLmpzIl0sIm5hbWVzIjpbIlNlbGVjdG9yQnVpbGRlciIsIkNsaWVudEZ1bmN0aW9uQnVpbGRlciIsImNvbnN0cnVjdG9yIiwiZm4iLCJvcHRpb25zIiwiY2FsbHNpdGVOYW1lcyIsImFwaUZuIiwiYnVpbGRlckZyb21TZWxlY3RvciIsImZ1bmN0aW9uQnVpbGRlclN5bWJvbCIsImJ1aWxkZXJGcm9tUHJvbWlzZU9yU25hcHNob3QiLCJzZWxlY3RvciIsImJ1aWxkZXIiLCJzb3VyY2VTZWxlY3RvckJ1aWxkZXIiLCJhcGlGbkNoYWluIiwiZm5UeXBlIiwiaXRlbSIsInB1c2giLCJhcGlGbklEIiwibGVuZ3RoIiwiX2dldENvbXBpbGVkRm5Db2RlIiwiaGFzU2FtZURlcGVuZGVuY2llc0FzU291cmNlU2VsZWN0b3IiLCJkZXBlbmRlbmNpZXMiLCJjb21waWxlZEZuQ29kZSIsImNvZGUiLCJfY3JlYXRlSW52YWxpZEZuVHlwZUVycm9yIiwiQ2xpZW50RnVuY3Rpb25BUElFcnJvciIsImluc3RhbnRpYXRpb24iLCJNRVNTQUdFIiwic2VsZWN0b3JJbml0aWFsaXplZFdpdGhXcm9uZ1R5cGUiLCJfZXhlY3V0ZUNvbW1hbmQiLCJhcmdzIiwidGVzdFJ1biIsImNhbGxzaXRlIiwicmVzdWx0UHJvbWlzZSIsIl9hZGRCb3VuZEFyZ3NTZWxlY3RvckdldHRlciIsImN1c3RvbURPTVByb3BlcnRpZXMiLCJjdXN0b21NZXRob2RzIiwiX2dldFNvdXJjZVNlbGVjdG9yQnVpbGRlckFwaUZuSUQiLCJzZWxlY3RvckFuY2VzdG9yIiwiZ2V0RnVuY3Rpb25EZXBlbmRlbmNpZXMiLCJmaWx0ZXJWaXNpYmxlIiwiZmlsdGVySGlkZGVuIiwiY291bnRlck1vZGUiLCJjb2xsZWN0aW9uTW9kZSIsImluZGV4IiwiYm91bmRBcmdzIiwiZmlsdGVyT3B0aW9ucyIsImFwaUluZm8iLCJfY3JlYXRlVGVzdFJ1bkNvbW1hbmQiLCJlbmNvZGVkQXJncyIsImVuY29kZWREZXBlbmRlbmNpZXMiLCJFeGVjdXRlU2VsZWN0b3JDb21tYW5kIiwiaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZSIsImZuQ29kZSIsIm5lZWRFcnJvciIsInZpc2liaWxpdHlDaGVjayIsInRpbWVvdXQiLCJfdmFsaWRhdGVPcHRpb25zIiwiaXMiLCJib29sZWFuIiwibm9uTmVnYXRpdmVOdW1iZXIiLCJfZ2V0UmVwbGljYXRvclRyYW5zZm9ybXMiLCJ0cmFuc2Zvcm1zIiwiU2VsZWN0b3JOb2RlVHJhbnNmb3JtIiwib2JqIiwic2VsZWN0b3JBcmdzIiwiZ2V0RnVuY3Rpb24iLCJfZGVjb3JhdGVGdW5jdGlvbiIsInNlbGVjdG9yRm4iLCJfcHJvY2Vzc1Jlc3VsdCIsInJlc3VsdCIsInNuYXBzaG90Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsZUFBTixTQUE4QkMsK0JBQTlCLENBQW9EO0FBQy9EQyxnQkFBYUMsRUFBYixFQUFpQkMsT0FBakIsRUFBMEJDLGFBQTFCLEVBQXlDO0FBQ3JDLGNBQU1DLFFBQStCRixXQUFXQSxRQUFRRSxLQUF4RDtBQUNBLGNBQU1DLHNCQUErQkosTUFBTUEsR0FBR0ssdUJBQUgsQ0FBM0M7QUFDQSxjQUFNQywrQkFBK0JOLE1BQU1BLEdBQUdPLFFBQVQsSUFBcUJQLEdBQUdPLFFBQUgsQ0FBWUYsdUJBQVosQ0FBMUQ7QUFDQSxZQUFJRyxVQUFpQ0osdUJBQXVCRSw0QkFBNUQ7O0FBRUFFLGtCQUFVQSxtQkFBbUJYLGVBQW5CLEdBQXFDVyxPQUFyQyxHQUErQyxJQUF6RDs7QUFFQSxZQUFJQSxPQUFKLEVBQWE7QUFDVFIsaUJBQUtRLFFBQVFSLEVBQWI7O0FBRUEsZ0JBQUlDLFlBQVksS0FBSyxDQUFqQixJQUFzQixPQUFP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QUFyQixFQUE2QkwsWUFBN0IsQ0FBakI7O0FBRUEsWUFBSU0sWUFBWSxDQUFDLEtBQUtuRSxPQUFMLENBQWFzQyxXQUE5QixFQUEyQztBQUN2QyxpQkFBS1IsMkJBQUwsQ0FBaUNxQyxRQUFqQyxFQUEyQ04sWUFBM0M7QUFDQSxpREFBc0JNLFFBQXRCOztBQUVBLGdCQUFJLEtBQUtuRSxPQUFMLENBQWFnQyxhQUFqQixFQUNJLDhCQUFpQm1DLFFBQWpCLEVBQTJCLE1BQU1BLFNBQVM3RCxRQUExQyxFQUFvRFYsZUFBcEQsRUFBcUUsS0FBS0ksT0FBTCxDQUFhZ0MsYUFBbEY7QUFDUDs7QUFFRCxlQUFPbUMsUUFBUDtBQUNIO0FBekw4RDtrQkFBOUN2RSxlIiwiZmlsZSI6ImNsaWVudC1mdW5jdGlvbnMvc2VsZWN0b3JzL3NlbGVjdG9yLWJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc05pbCBhcyBpc051bGxPclVuZGVmaW5lZCwgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGRlZGVudCBmcm9tICdkZWRlbnQnO1xuaW1wb3J0IENsaWVudEZ1bmN0aW9uQnVpbGRlciBmcm9tICcuLi9jbGllbnQtZnVuY3Rpb24tYnVpbGRlcic7XG5pbXBvcnQgeyBTZWxlY3Rvck5vZGVUcmFuc2Zvcm0gfSBmcm9tICcuLi9yZXBsaWNhdG9yJztcbmltcG9ydCB7IENsaWVudEZ1bmN0aW9uQVBJRXJyb3IgfSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQgZnVuY3Rpb25CdWlsZGVyU3ltYm9sIGZyb20gJy4uL2J1aWxkZXItc3ltYm9sJztcbmltcG9ydCBNRVNTQUdFIGZyb20gJy4uLy4uL2Vycm9ycy9ydW50aW1lL21lc3NhZ2UnO1xuaW1wb3J0IHsgYXNzZXJ0VHlwZSwgaXMgfSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZS90eXBlLWFzc2VydGlvbnMnO1xuaW1wb3J0IHsgRXhlY3V0ZVNlbGVjdG9yQ29tbWFuZCB9IGZyb20gJy4uLy4uL3Rlc3QtcnVuL2NvbW1hbmRzL29ic2VydmF0aW9uJztcbmltcG9ydCBkZWZpbmVMYXp5UHJvcGVydHkgZnJvbSAnLi4vLi4vdXRpbHMvZGVmaW5lLWxhenktcHJvcGVydHknO1xuaW1wb3J0IHsgYWRkQVBJLCBhZGRDdXN0b21NZXRob2RzIH0gZnJvbSAnLi9hZGQtYXBpJztcbmltcG9ydCBjcmVhdGVTbmFwc2hvdE1ldGhvZHMgZnJvbSAnLi9jcmVhdGUtc25hcHNob3QtbWV0aG9kcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdG9yQnVpbGRlciBleHRlbmRzIENsaWVudEZ1bmN0aW9uQnVpbGRlciB7XG4gICAgY29uc3RydWN0b3IgKGZuLCBvcHRpb25zLCBjYWxsc2l0ZU5hbWVzKSB7XG4gICAgICAgIGNvbnN0IGFwaUZuICAgICAgICAgICAgICAgICAgICAgICAgPSBvcHRpb25zICYmIG9wdGlvbnMuYXBpRm47XG4gICAgICAgIGNvbnN0IGJ1aWxkZXJGcm9tU2VsZWN0b3IgICAgICAgICAgPSBmbiAmJiBmbltmdW5jdGlvbkJ1aWxkZXJTeW1ib2xdO1xuICAgICAgICBjb25zdCBidWlsZGVyRnJvbVByb21pc2VPclNuYXBzaG90ID0gZm4gJiYgZm4uc2VsZWN0b3IgJiYgZm4uc2VsZWN0b3JbZnVuY3Rpb25CdWlsZGVyU3ltYm9sXTtcbiAgICAgICAgbGV0IGJ1aWxkZXIgICAgICAgICAgICAgICAgICAgICAgICA9IGJ1aWxkZXJGcm9tU2VsZWN0b3IgfHwgYnVpbGRlckZyb21Qcm9taXNlT3JTbmFwc2hvdDtcblxuICAgICAgICBidWlsZGVyID0gYnVpbGRlciBpbnN0YW5jZW9mIFNlbGVjdG9yQnVpbGRlciA/IGJ1aWxkZXIgOiBudWxsO1xuXG4gICAgICAgIGlmIChidWlsZGVyKSB7XG4gICAgICAgICAgICBmbiA9IGJ1aWxkZXIuZm47XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDAgfHwgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBtZXJnZSh7fSwgYnVpbGRlci5vcHRpb25zLCBvcHRpb25zLCB7IHNvdXJjZVNlbGVjdG9yQnVpbGRlcjogYnVpbGRlciB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyKGZuLCBvcHRpb25zLCBjYWxsc2l0ZU5hbWVzKTtcblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5hcGlGbkNoYWluKSB7XG4gICAgICAgICAgICBjb25zdCBmblR5cGUgPSB0eXBlb2YgdGhpcy5mbjtcbiAgICAgICAgICAgIGxldCBpdGVtICAgICA9IGZuVHlwZSA9PT0gJ3N0cmluZycgPyBgJyR7dGhpcy5mbn0nYCA6IGBbJHtmblR5cGV9XWA7XG5cbiAgICAgICAgICAgIGl0ZW0gICAgICAgICAgICAgICAgICAgID0gYFNlbGVjdG9yKCR7aXRlbX0pYDtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hcGlGbiAgICAgID0gaXRlbTtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hcGlGbkNoYWluID0gW2l0ZW1dO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFwaUZuKVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFwaUZuQ2hhaW4ucHVzaChhcGlGbik7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmFwaUZuSUQgPSB0aGlzLm9wdGlvbnMuYXBpRm5DaGFpbi5sZW5ndGggLSAxO1xuICAgIH1cblxuICAgIF9nZXRDb21waWxlZEZuQ29kZSAoKSB7XG4gICAgICAgIC8vIE9QVElNSVpBVElPTjogaWYgc2VsZWN0b3Igd2FzIHByb2R1Y2VkIGZyb20gYW5vdGhlciBzZWxlY3RvciBhbmRcbiAgICAgICAgLy8gaXQgaGFzIHNhbWUgZGVwZW5kZW5jaWVzIGFzIHNvdXJjZSBzZWxlY3RvciwgdGhlbiB3ZSBjYW5cbiAgICAgICAgLy8gYXZvaWQgcmVjb21waWxhdGlvbiBhbmQganVzdCByZS11c2UgYWxyZWFkeSBjb21waWxlZCBjb2RlLlxuICAgICAgICBjb25zdCBoYXNTYW1lRGVwZW5kZW5jaWVzQXNTb3VyY2VTZWxlY3RvciA9IHRoaXMub3B0aW9ucy5zb3VyY2VTZWxlY3RvckJ1aWxkZXIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc291cmNlU2VsZWN0b3JCdWlsZGVyLm9wdGlvbnMuZGVwZW5kZW5jaWVzID09PVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5kZXBlbmRlbmNpZXM7XG5cbiAgICAgICAgaWYgKGhhc1NhbWVEZXBlbmRlbmNpZXNBc1NvdXJjZVNlbGVjdG9yKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zb3VyY2VTZWxlY3RvckJ1aWxkZXIuY29tcGlsZWRGbkNvZGU7XG5cbiAgICAgICAgY29uc3QgY29kZSA9IHR5cGVvZiB0aGlzLmZuID09PSAnc3RyaW5nJyA/XG4gICAgICAgICAgICBgKGZ1bmN0aW9uKCl7cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJHtKU09OLnN0cmluZ2lmeSh0aGlzLmZuKX0pO30pO2AgOlxuICAgICAgICAgICAgc3VwZXIuX2dldENvbXBpbGVkRm5Db2RlKCk7XG5cbiAgICAgICAgaWYgKGNvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWRlbnQoXG4gICAgICAgICAgICAgICAgYChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgX19mJD0ke2NvZGV9O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzICAgICAgICAgICA9IF9fZGVwZW5kZW5jaWVzJC5ib3VuZEFyZ3MgfHwgYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yRmlsdGVyID0gd2luZG93WycldGVzdENhZmVTZWxlY3RvckZpbHRlciUnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGVzID0gX19mJC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzICAgICA9IHNlbGVjdG9yRmlsdGVyLmNhc3Qobm9kZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW5vZGVzLmxlbmd0aCAmJiAhc2VsZWN0b3JGaWx0ZXIuZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JGaWx0ZXIuZXJyb3IgPSBfX2RlcGVuZGVuY2llcyQuYXBpSW5mby5hcGlGbklEO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0b3JGaWx0ZXIuZmlsdGVyKG5vZGVzLCBfX2RlcGVuZGVuY2llcyQuZmlsdGVyT3B0aW9ucywgX19kZXBlbmRlbmNpZXMkLmFwaUluZm8pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICB9KSgpO2BcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBfY3JlYXRlSW52YWxpZEZuVHlwZUVycm9yICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDbGllbnRGdW5jdGlvbkFQSUVycm9yKHRoaXMuY2FsbHNpdGVOYW1lcy5pbnN0YW50aWF0aW9uLCB0aGlzLmNhbGxzaXRlTmFtZXMuaW5zdGFudGlhdGlvbiwgTUVTU0FHRS5zZWxlY3RvckluaXRpYWxpemVkV2l0aFdyb25nVHlwZSwgdHlwZW9mIHRoaXMuZm4pO1xuICAgIH1cblxuICAgIF9leGVjdXRlQ29tbWFuZCAoYXJncywgdGVzdFJ1biwgY2FsbHNpdGUpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0UHJvbWlzZSA9IHN1cGVyLl9leGVjdXRlQ29tbWFuZChhcmdzLCB0ZXN0UnVuLCBjYWxsc2l0ZSk7XG5cbiAgICAgICAgdGhpcy5fYWRkQm91bmRBcmdzU2VsZWN0b3JHZXR0ZXIocmVzdWx0UHJvbWlzZSwgYXJncyk7XG5cbiAgICAgICAgLy8gT1BUSU1JWkFUSU9OOiB1c2UgYnVmZmVyIGZ1bmN0aW9uIGFzIHNlbGVjdG9yIG5vdCB0byB0cmlnZ2VyIGxhenkgcHJvcGVydHkgYWhlYWQgb2YgdGltZVxuICAgICAgICBhZGRBUEkocmVzdWx0UHJvbWlzZSwgKCkgPT4gcmVzdWx0UHJvbWlzZS5zZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyLCB0aGlzLm9wdGlvbnMuY3VzdG9tRE9NUHJvcGVydGllcywgdGhpcy5vcHRpb25zLmN1c3RvbU1ldGhvZHMpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHRQcm9taXNlO1xuICAgIH1cblxuICAgIF9nZXRTb3VyY2VTZWxlY3RvckJ1aWxkZXJBcGlGbklEICgpIHtcbiAgICAgICAgbGV0IHNlbGVjdG9yQW5jZXN0b3IgPSB0aGlzO1xuXG4gICAgICAgIHdoaWxlIChzZWxlY3RvckFuY2VzdG9yLm9wdGlvbnMuc291cmNlU2VsZWN0b3JCdWlsZGVyKVxuICAgICAgICAgICAgc2VsZWN0b3JBbmNlc3RvciA9IHNlbGVjdG9yQW5jZXN0b3Iub3B0aW9ucy5zb3VyY2VTZWxlY3RvckJ1aWxkZXI7XG5cbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yQW5jZXN0b3Iub3B0aW9ucy5hcGlGbklEO1xuICAgIH1cblxuICAgIGdldEZ1bmN0aW9uRGVwZW5kZW5jaWVzICgpIHtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gc3VwZXIuZ2V0RnVuY3Rpb25EZXBlbmRlbmNpZXMoKTtcblxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBmaWx0ZXJWaXNpYmxlLFxuICAgICAgICAgICAgZmlsdGVySGlkZGVuLFxuICAgICAgICAgICAgY291bnRlck1vZGUsXG4gICAgICAgICAgICBjb2xsZWN0aW9uTW9kZSxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY3VzdG9tRE9NUHJvcGVydGllcyxcbiAgICAgICAgICAgIGN1c3RvbU1ldGhvZHMsXG4gICAgICAgICAgICBhcGlGbkNoYWluLFxuICAgICAgICAgICAgYm91bmRBcmdzXG4gICAgICAgIH0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAgICAgcmV0dXJuIG1lcmdlKHt9LCBkZXBlbmRlbmNpZXMsIHtcbiAgICAgICAgICAgIGZpbHRlck9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJWaXNpYmxlLFxuICAgICAgICAgICAgICAgIGZpbHRlckhpZGRlbixcbiAgICAgICAgICAgICAgICBjb3VudGVyTW9kZSxcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uTW9kZSxcbiAgICAgICAgICAgICAgICBpbmRleDogaXNOdWxsT3JVbmRlZmluZWQoaW5kZXgpID8gbnVsbCA6IGluZGV4XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXBpSW5mbzoge1xuICAgICAgICAgICAgICAgIGFwaUZuQ2hhaW4sXG4gICAgICAgICAgICAgICAgYXBpRm5JRDogdGhpcy5fZ2V0U291cmNlU2VsZWN0b3JCdWlsZGVyQXBpRm5JRCgpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm91bmRBcmdzLFxuICAgICAgICAgICAgY3VzdG9tRE9NUHJvcGVydGllcyxcbiAgICAgICAgICAgIGN1c3RvbU1ldGhvZHNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZVRlc3RSdW5Db21tYW5kIChlbmNvZGVkQXJncywgZW5jb2RlZERlcGVuZGVuY2llcykge1xuICAgICAgICByZXR1cm4gbmV3IEV4ZWN1dGVTZWxlY3RvckNvbW1hbmQoe1xuICAgICAgICAgICAgaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZTogdGhpcy5jYWxsc2l0ZU5hbWVzLmluc3RhbnRpYXRpb24sXG4gICAgICAgICAgICBmbkNvZGU6ICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBpbGVkRm5Db2RlLFxuICAgICAgICAgICAgYXJnczogICAgICAgICAgICAgICAgICAgICAgZW5jb2RlZEFyZ3MsXG4gICAgICAgICAgICBkZXBlbmRlbmNpZXM6ICAgICAgICAgICAgICBlbmNvZGVkRGVwZW5kZW5jaWVzLFxuICAgICAgICAgICAgbmVlZEVycm9yOiAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm5lZWRFcnJvcixcbiAgICAgICAgICAgIGFwaUZuQ2hhaW46ICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hcGlGbkNoYWluLFxuICAgICAgICAgICAgdmlzaWJpbGl0eUNoZWNrOiAgICAgICAgICAgISF0aGlzLm9wdGlvbnMudmlzaWJpbGl0eUNoZWNrLFxuICAgICAgICAgICAgdGltZW91dDogICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnRpbWVvdXRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3ZhbGlkYXRlT3B0aW9ucyAob3B0aW9ucykge1xuICAgICAgICBzdXBlci5fdmFsaWRhdGVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy52aXNpYmlsaXR5Q2hlY2spKVxuICAgICAgICAgICAgYXNzZXJ0VHlwZShpcy5ib29sZWFuLCB0aGlzLmNhbGxzaXRlTmFtZXMuaW5zdGFudGlhdGlvbiwgJ1widmlzaWJpbGl0eUNoZWNrXCIgb3B0aW9uJywgb3B0aW9ucy52aXNpYmlsaXR5Q2hlY2spO1xuXG4gICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy50aW1lb3V0KSlcbiAgICAgICAgICAgIGFzc2VydFR5cGUoaXMubm9uTmVnYXRpdmVOdW1iZXIsIHRoaXMuY2FsbHNpdGVOYW1lcy5pbnN0YW50aWF0aW9uLCAnXCJ0aW1lb3V0XCIgb3B0aW9uJywgb3B0aW9ucy50aW1lb3V0KTtcbiAgICB9XG5cbiAgICBfZ2V0UmVwbGljYXRvclRyYW5zZm9ybXMgKCkge1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm1zID0gc3VwZXIuX2dldFJlcGxpY2F0b3JUcmFuc2Zvcm1zKCk7XG5cbiAgICAgICAgdHJhbnNmb3Jtcy5wdXNoKG5ldyBTZWxlY3Rvck5vZGVUcmFuc2Zvcm0oKSk7XG5cbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybXM7XG4gICAgfVxuXG4gICAgX2FkZEJvdW5kQXJnc1NlbGVjdG9yR2V0dGVyIChvYmosIHNlbGVjdG9yQXJncykge1xuICAgICAgICBkZWZpbmVMYXp5UHJvcGVydHkob2JqLCAnc2VsZWN0b3InLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IFNlbGVjdG9yQnVpbGRlcih0aGlzLmdldEZ1bmN0aW9uKCksIHsgYm91bmRBcmdzOiBzZWxlY3RvckFyZ3MgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmdldEZ1bmN0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9kZWNvcmF0ZUZ1bmN0aW9uIChzZWxlY3RvckZuKSB7XG4gICAgICAgIHN1cGVyLl9kZWNvcmF0ZUZ1bmN0aW9uKHNlbGVjdG9yRm4pO1xuXG4gICAgICAgIGFkZEFQSShzZWxlY3RvckZuLCAoKSA9PiBzZWxlY3RvckZuLCBTZWxlY3RvckJ1aWxkZXIsIHRoaXMub3B0aW9ucy5jdXN0b21ET01Qcm9wZXJ0aWVzLCB0aGlzLm9wdGlvbnMuY3VzdG9tTWV0aG9kcyk7XG4gICAgfVxuXG4gICAgX3Byb2Nlc3NSZXN1bHQgKHJlc3VsdCwgc2VsZWN0b3JBcmdzKSB7XG4gICAgICAgIGNvbnN0IHNuYXBzaG90ID0gc3VwZXIuX3Byb2Nlc3NSZXN1bHQocmVzdWx0LCBzZWxlY3RvckFyZ3MpO1xuXG4gICAgICAgIGlmIChzbmFwc2hvdCAmJiAhdGhpcy5vcHRpb25zLmNvdW50ZXJNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLl9hZGRCb3VuZEFyZ3NTZWxlY3RvckdldHRlcihzbmFwc2hvdCwgc2VsZWN0b3JBcmdzKTtcbiAgICAgICAgICAgIGNyZWF0ZVNuYXBzaG90TWV0aG9kcyhzbmFwc2hvdCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY3VzdG9tTWV0aG9kcylcbiAgICAgICAgICAgICAgICBhZGRDdXN0b21NZXRob2RzKHNuYXBzaG90LCAoKSA9PiBzbmFwc2hvdC5zZWxlY3RvciwgU2VsZWN0b3JCdWlsZGVyLCB0aGlzLm9wdGlvbnMuY3VzdG9tTWV0aG9kcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc25hcHNob3Q7XG4gICAgfVxufVxuXG4iXX0=
