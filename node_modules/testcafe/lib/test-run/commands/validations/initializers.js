'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.initUploadSelector = initUploadSelector;
exports.initSelector = initSelector;

var _selectorBuilder = require('../../../client-functions/selectors/selector-builder');

var _selectorBuilder2 = _interopRequireDefault(_selectorBuilder);

var _testRun = require('../../../errors/test-run');

var _runtime = require('../../../errors/runtime');

var _observation = require('../observation');

var _executeJsExpression = require('../../execute-js-expression');

var _executeJsExpression2 = _interopRequireDefault(_executeJsExpression);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initUploadSelector(name, val, initOptions) {
    initOptions.skipVisibilityCheck = true;

    return initSelector(name, val, initOptions);
}

function initSelector(name, val, _ref) {
    let testRun = _ref.testRun,
        options = (0, _objectWithoutProperties3.default)(_ref, ['testRun']);

    if (val instanceof _observation.ExecuteSelectorCommand) return val;

    try {
        if ((0, _utils.isJSExpression)(val)) val = (0, _executeJsExpression2.default)(val.value, testRun, options);

        const skipVisibilityCheck = options.skipVisibilityCheck,
              builderOptions = (0, _objectWithoutProperties3.default)(options, ['skipVisibilityCheck']);


        const builder = new _selectorBuilder2.default(val, (0, _extends3.default)({
            visibilityCheck: !skipVisibilityCheck
        }, builderOptions), { instantiation: 'Selector' });

        return builder.getCommand([]);
    } catch (err) {
        const msg = err.constructor === _runtime.APIError ? err.rawMessage : err.message;

        throw new _testRun.ActionSelectorError(name, msg);
    }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90ZXN0LXJ1bi9jb21tYW5kcy92YWxpZGF0aW9ucy9pbml0aWFsaXplcnMuanMiXSwibmFtZXMiOlsiaW5pdFVwbG9hZFNlbGVjdG9yIiwiaW5pdFNlbGVjdG9yIiwibmFtZSIsInZhbCIsImluaXRPcHRpb25zIiwic2tpcFZpc2liaWxpdHlDaGVjayIsInRlc3RSdW4iLCJvcHRpb25zIiwiRXhlY3V0ZVNlbGVjdG9yQ29tbWFuZCIsInZhbHVlIiwiYnVpbGRlck9wdGlvbnMiLCJidWlsZGVyIiwiU2VsZWN0b3JCdWlsZGVyIiwidmlzaWJpbGl0eUNoZWNrIiwiaW5zdGFudGlhdGlvbiIsImdldENvbW1hbmQiLCJlcnIiLCJtc2ciLCJjb25zdHJ1Y3RvciIsIkFQSUVycm9yIiwicmF3TWVzc2FnZSIsIm1lc3NhZ2UiLCJBY3Rpb25TZWxlY3RvckVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7UUFPZ0JBLGtCLEdBQUFBLGtCO1FBTUFDLFksR0FBQUEsWTs7QUFiaEI7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBRU8sU0FBU0Qsa0JBQVQsQ0FBNkJFLElBQTdCLEVBQW1DQyxHQUFuQyxFQUF3Q0MsV0FBeEMsRUFBcUQ7QUFDeERBLGdCQUFZQyxtQkFBWixHQUFrQyxJQUFsQzs7QUFFQSxXQUFPSixhQUFhQyxJQUFiLEVBQW1CQyxHQUFuQixFQUF3QkMsV0FBeEIsQ0FBUDtBQUNIOztBQUVNLFNBQVNILFlBQVQsQ0FBdUJDLElBQXZCLEVBQTZCQyxHQUE3QixRQUEyRDtBQUFBLFFBQXZCRyxPQUF1QixRQUF2QkEsT0FBdUI7QUFBQSxRQUFYQyxPQUFXOztBQUM5RCxRQUFJSixlQUFlSyxtQ0FBbkIsRUFDSSxPQUFPTCxHQUFQOztBQUVKLFFBQUk7QUFDQSxZQUFJLDJCQUFlQSxHQUFmLENBQUosRUFDSUEsTUFBTSxtQ0FBb0JBLElBQUlNLEtBQXhCLEVBQStCSCxPQUEvQixFQUF3Q0MsT0FBeEMsQ0FBTjs7QUFGSixjQUlRRixtQkFKUixHQUltREUsT0FKbkQsQ0FJUUYsbUJBSlI7QUFBQSxjQUlnQ0ssY0FKaEMsMENBSW1ESCxPQUpuRDs7O0FBTUEsY0FBTUksVUFBVSxJQUFJQyx5QkFBSixDQUFvQlQsR0FBcEI7QUFDWlUsNkJBQWlCLENBQUNSO0FBRE4sV0FFVEssY0FGUyxHQUdiLEVBQUVJLGVBQWUsVUFBakIsRUFIYSxDQUFoQjs7QUFLQSxlQUFPSCxRQUFRSSxVQUFSLENBQW1CLEVBQW5CLENBQVA7QUFDSCxLQVpELENBYUEsT0FBT0MsR0FBUCxFQUFZO0FBQ1IsY0FBTUMsTUFBTUQsSUFBSUUsV0FBSixLQUFvQkMsaUJBQXBCLEdBQStCSCxJQUFJSSxVQUFuQyxHQUFnREosSUFBSUssT0FBaEU7O0FBRUEsY0FBTSxJQUFJQyw0QkFBSixDQUF3QnBCLElBQXhCLEVBQThCZSxHQUE5QixDQUFOO0FBQ0g7QUFDSiIsImZpbGUiOiJ0ZXN0LXJ1bi9jb21tYW5kcy92YWxpZGF0aW9ucy9pbml0aWFsaXplcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VsZWN0b3JCdWlsZGVyIGZyb20gJy4uLy4uLy4uL2NsaWVudC1mdW5jdGlvbnMvc2VsZWN0b3JzL3NlbGVjdG9yLWJ1aWxkZXInO1xuaW1wb3J0IHsgQWN0aW9uU2VsZWN0b3JFcnJvciB9IGZyb20gJy4uLy4uLy4uL2Vycm9ycy90ZXN0LXJ1bic7XG5pbXBvcnQgeyBBUElFcnJvciB9IGZyb20gJy4uLy4uLy4uL2Vycm9ycy9ydW50aW1lJztcbmltcG9ydCB7IEV4ZWN1dGVTZWxlY3RvckNvbW1hbmQgfSBmcm9tICcuLi9vYnNlcnZhdGlvbic7XG5pbXBvcnQgZXhlY3V0ZUpzRXhwcmVzc2lvbiBmcm9tICcuLi8uLi9leGVjdXRlLWpzLWV4cHJlc3Npb24nO1xuaW1wb3J0IHsgaXNKU0V4cHJlc3Npb24gfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0VXBsb2FkU2VsZWN0b3IgKG5hbWUsIHZhbCwgaW5pdE9wdGlvbnMpIHtcbiAgICBpbml0T3B0aW9ucy5za2lwVmlzaWJpbGl0eUNoZWNrID0gdHJ1ZTtcblxuICAgIHJldHVybiBpbml0U2VsZWN0b3IobmFtZSwgdmFsLCBpbml0T3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0U2VsZWN0b3IgKG5hbWUsIHZhbCwgeyB0ZXN0UnVuLCAuLi5vcHRpb25zIH0pIHtcbiAgICBpZiAodmFsIGluc3RhbmNlb2YgRXhlY3V0ZVNlbGVjdG9yQ29tbWFuZClcbiAgICAgICAgcmV0dXJuIHZhbDtcblxuICAgIHRyeSB7XG4gICAgICAgIGlmIChpc0pTRXhwcmVzc2lvbih2YWwpKVxuICAgICAgICAgICAgdmFsID0gZXhlY3V0ZUpzRXhwcmVzc2lvbih2YWwudmFsdWUsIHRlc3RSdW4sIG9wdGlvbnMpO1xuXG4gICAgICAgIGNvbnN0IHsgc2tpcFZpc2liaWxpdHlDaGVjaywgLi4uYnVpbGRlck9wdGlvbnMgfSA9IG9wdGlvbnM7XG5cbiAgICAgICAgY29uc3QgYnVpbGRlciA9IG5ldyBTZWxlY3RvckJ1aWxkZXIodmFsLCB7XG4gICAgICAgICAgICB2aXNpYmlsaXR5Q2hlY2s6ICFza2lwVmlzaWJpbGl0eUNoZWNrLFxuICAgICAgICAgICAgLi4uYnVpbGRlck9wdGlvbnNcbiAgICAgICAgfSwgeyBpbnN0YW50aWF0aW9uOiAnU2VsZWN0b3InIH0pO1xuXG4gICAgICAgIHJldHVybiBidWlsZGVyLmdldENvbW1hbmQoW10pO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGVyci5jb25zdHJ1Y3RvciA9PT0gQVBJRXJyb3IgPyBlcnIucmF3TWVzc2FnZSA6IGVyci5tZXNzYWdlO1xuXG4gICAgICAgIHRocm93IG5ldyBBY3Rpb25TZWxlY3RvckVycm9yKG5hbWUsIG1zZyk7XG4gICAgfVxufVxuIl19
