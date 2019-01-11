'use strict';

exports.__esModule = true;
exports.SelectorNodeTransform = exports.FunctionTransform = undefined;
exports.createReplicator = createReplicator;

var _lodash = require('lodash');

var _replicator = require('replicator');

var _replicator2 = _interopRequireDefault(_replicator);

var _builderSymbol = require('./builder-symbol');

var _builderSymbol2 = _interopRequireDefault(_builderSymbol);

var _compileClientFunction = require('../compiler/compile-client-function');

var _compileClientFunction2 = _interopRequireDefault(_compileClientFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createReplicator(transforms) {
    // NOTE: we will serialize replicator results
    // to JSON with a command or command result.
    // Therefore there is no need to do additional job here,
    // so we use identity functions for serialization.
    const replicator = new _replicator2.default({
        serialize: _lodash.identity,
        deserialize: _lodash.identity
    });

    return replicator.addTransforms(transforms);
}

// Replicator transforms
class FunctionTransform {
    constructor(callsiteNames) {
        this.type = 'Function';
        this.callsiteNames = callsiteNames;
    }

    shouldTransform(type) {
        return type === 'function';
    }

    toSerializable(fn) {
        const clientFnBuilder = fn[_builderSymbol2.default];

        if (clientFnBuilder) {
            return {
                fnCode: clientFnBuilder.compiledFnCode,
                dependencies: clientFnBuilder.getFunctionDependencies()
            };
        }

        return {
            fnCode: (0, _compileClientFunction2.default)(fn.toString(), null, this.callsiteNames.instantiation, this.callsiteNames.execution),
            dependencies: {}
        };
    }

    fromSerializable() {
        return void 0;
    }
}

exports.FunctionTransform = FunctionTransform;
class SelectorNodeTransform {
    constructor() {
        this.type = 'Node';
    }

    shouldTransform() {
        return false;
    }

    fromSerializable(nodeSnapshot) {
        return nodeSnapshot;
    }
}
exports.SelectorNodeTransform = SelectorNodeTransform;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQtZnVuY3Rpb25zL3JlcGxpY2F0b3IuanMiXSwibmFtZXMiOlsiY3JlYXRlUmVwbGljYXRvciIsInRyYW5zZm9ybXMiLCJyZXBsaWNhdG9yIiwiUmVwbGljYXRvciIsInNlcmlhbGl6ZSIsImlkZW50aXR5IiwiZGVzZXJpYWxpemUiLCJhZGRUcmFuc2Zvcm1zIiwiRnVuY3Rpb25UcmFuc2Zvcm0iLCJjb25zdHJ1Y3RvciIsImNhbGxzaXRlTmFtZXMiLCJ0eXBlIiwic2hvdWxkVHJhbnNmb3JtIiwidG9TZXJpYWxpemFibGUiLCJmbiIsImNsaWVudEZuQnVpbGRlciIsImZ1bmN0aW9uQnVpbGRlclN5bWJvbCIsImZuQ29kZSIsImNvbXBpbGVkRm5Db2RlIiwiZGVwZW5kZW5jaWVzIiwiZ2V0RnVuY3Rpb25EZXBlbmRlbmNpZXMiLCJ0b1N0cmluZyIsImluc3RhbnRpYXRpb24iLCJleGVjdXRpb24iLCJmcm9tU2VyaWFsaXphYmxlIiwiU2VsZWN0b3JOb2RlVHJhbnNmb3JtIiwibm9kZVNuYXBzaG90Il0sIm1hcHBpbmdzIjoiOzs7O1FBS2dCQSxnQixHQUFBQSxnQjs7QUFMaEI7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFTyxTQUFTQSxnQkFBVCxDQUEyQkMsVUFBM0IsRUFBdUM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFNQyxhQUFhLElBQUlDLG9CQUFKLENBQWU7QUFDOUJDLG1CQUFhQyxnQkFEaUI7QUFFOUJDLHFCQUFhRDtBQUZpQixLQUFmLENBQW5COztBQUtBLFdBQU9ILFdBQVdLLGFBQVgsQ0FBeUJOLFVBQXpCLENBQVA7QUFDSDs7QUFFRDtBQUNPLE1BQU1PLGlCQUFOLENBQXdCO0FBQzNCQyxnQkFBYUMsYUFBYixFQUE0QjtBQUN4QixhQUFLQyxJQUFMLEdBQXFCLFVBQXJCO0FBQ0EsYUFBS0QsYUFBTCxHQUFxQkEsYUFBckI7QUFDSDs7QUFFREUsb0JBQWlCRCxJQUFqQixFQUF1QjtBQUNuQixlQUFPQSxTQUFTLFVBQWhCO0FBQ0g7O0FBRURFLG1CQUFnQkMsRUFBaEIsRUFBb0I7QUFDaEIsY0FBTUMsa0JBQWtCRCxHQUFHRSx1QkFBSCxDQUF4Qjs7QUFFQSxZQUFJRCxlQUFKLEVBQXFCO0FBQ2pCLG1CQUFPO0FBQ0hFLHdCQUFjRixnQkFBZ0JHLGNBRDNCO0FBRUhDLDhCQUFjSixnQkFBZ0JLLHVCQUFoQjtBQUZYLGFBQVA7QUFJSDs7QUFFRCxlQUFPO0FBQ0hILG9CQUFjLHFDQUFzQkgsR0FBR08sUUFBSCxFQUF0QixFQUFxQyxJQUFyQyxFQUEyQyxLQUFLWCxhQUFMLENBQW1CWSxhQUE5RCxFQUE2RSxLQUFLWixhQUFMLENBQW1CYSxTQUFoRyxDQURYO0FBRUhKLDBCQUFjO0FBRlgsU0FBUDtBQUlIOztBQUVESyx1QkFBb0I7QUFDaEIsZUFBTyxLQUFLLENBQVo7QUFDSDtBQTVCMEI7O1FBQWxCaEIsaUIsR0FBQUEsaUI7QUErQk4sTUFBTWlCLHFCQUFOLENBQTRCO0FBQy9CaEIsa0JBQWU7QUFDWCxhQUFLRSxJQUFMLEdBQVksTUFBWjtBQUNIOztBQUVEQyxzQkFBbUI7QUFDZixlQUFPLEtBQVA7QUFDSDs7QUFFRFkscUJBQWtCRSxZQUFsQixFQUFnQztBQUM1QixlQUFPQSxZQUFQO0FBQ0g7QUFYOEI7UUFBdEJELHFCLEdBQUFBLHFCIiwiZmlsZSI6ImNsaWVudC1mdW5jdGlvbnMvcmVwbGljYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBSZXBsaWNhdG9yIGZyb20gJ3JlcGxpY2F0b3InO1xuaW1wb3J0IGZ1bmN0aW9uQnVpbGRlclN5bWJvbCBmcm9tICcuL2J1aWxkZXItc3ltYm9sJztcbmltcG9ydCBjb21waWxlQ2xpZW50RnVuY3Rpb24gZnJvbSAnLi4vY29tcGlsZXIvY29tcGlsZS1jbGllbnQtZnVuY3Rpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVwbGljYXRvciAodHJhbnNmb3Jtcykge1xuICAgIC8vIE5PVEU6IHdlIHdpbGwgc2VyaWFsaXplIHJlcGxpY2F0b3IgcmVzdWx0c1xuICAgIC8vIHRvIEpTT04gd2l0aCBhIGNvbW1hbmQgb3IgY29tbWFuZCByZXN1bHQuXG4gICAgLy8gVGhlcmVmb3JlIHRoZXJlIGlzIG5vIG5lZWQgdG8gZG8gYWRkaXRpb25hbCBqb2IgaGVyZSxcbiAgICAvLyBzbyB3ZSB1c2UgaWRlbnRpdHkgZnVuY3Rpb25zIGZvciBzZXJpYWxpemF0aW9uLlxuICAgIGNvbnN0IHJlcGxpY2F0b3IgPSBuZXcgUmVwbGljYXRvcih7XG4gICAgICAgIHNlcmlhbGl6ZTogICBpZGVudGl0eSxcbiAgICAgICAgZGVzZXJpYWxpemU6IGlkZW50aXR5XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVwbGljYXRvci5hZGRUcmFuc2Zvcm1zKHRyYW5zZm9ybXMpO1xufVxuXG4vLyBSZXBsaWNhdG9yIHRyYW5zZm9ybXNcbmV4cG9ydCBjbGFzcyBGdW5jdGlvblRyYW5zZm9ybSB7XG4gICAgY29uc3RydWN0b3IgKGNhbGxzaXRlTmFtZXMpIHtcbiAgICAgICAgdGhpcy50eXBlICAgICAgICAgID0gJ0Z1bmN0aW9uJztcbiAgICAgICAgdGhpcy5jYWxsc2l0ZU5hbWVzID0gY2FsbHNpdGVOYW1lcztcbiAgICB9XG5cbiAgICBzaG91bGRUcmFuc2Zvcm0gKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbic7XG4gICAgfVxuXG4gICAgdG9TZXJpYWxpemFibGUgKGZuKSB7XG4gICAgICAgIGNvbnN0IGNsaWVudEZuQnVpbGRlciA9IGZuW2Z1bmN0aW9uQnVpbGRlclN5bWJvbF07XG5cbiAgICAgICAgaWYgKGNsaWVudEZuQnVpbGRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmbkNvZGU6ICAgICAgIGNsaWVudEZuQnVpbGRlci5jb21waWxlZEZuQ29kZSxcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXM6IGNsaWVudEZuQnVpbGRlci5nZXRGdW5jdGlvbkRlcGVuZGVuY2llcygpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZuQ29kZTogICAgICAgY29tcGlsZUNsaWVudEZ1bmN0aW9uKGZuLnRvU3RyaW5nKCksIG51bGwsIHRoaXMuY2FsbHNpdGVOYW1lcy5pbnN0YW50aWF0aW9uLCB0aGlzLmNhbGxzaXRlTmFtZXMuZXhlY3V0aW9uKSxcbiAgICAgICAgICAgIGRlcGVuZGVuY2llczoge31cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmcm9tU2VyaWFsaXphYmxlICgpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3Rvck5vZGVUcmFuc2Zvcm0ge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy50eXBlID0gJ05vZGUnO1xuICAgIH1cblxuICAgIHNob3VsZFRyYW5zZm9ybSAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmcm9tU2VyaWFsaXphYmxlIChub2RlU25hcHNob3QpIHtcbiAgICAgICAgcmV0dXJuIG5vZGVTbmFwc2hvdDtcbiAgICB9XG59XG4iXX0=
