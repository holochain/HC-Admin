'use strict';

exports.__esModule = true;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

exports.getDelegatedAPIList = getDelegatedAPIList;
exports.delegateAPI = delegateAPI;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const API_IMPLEMENTATION_METHOD_RE = /^_(\S+)\$(getter|setter)?$/;

function getDelegatedAPIList(src) {
    return (0, _getOwnPropertyNames2.default)(src).map(prop => {
        const match = prop.match(API_IMPLEMENTATION_METHOD_RE);

        if (match) {
            return {
                srcProp: prop,
                apiProp: match[1],
                accessor: match[2]
            };
        }

        return null;
    }).filter(item => !!item);
}

function delegateAPI(dest, apiList, opts) {
    apiList.forEach(({ srcProp, apiProp, accessor }) => {
        const fn = function fn(...args) {
            if (opts.proxyMethod) opts.proxyMethod();

            let handler = null;

            if (opts.useCurrentCtxAsHandler) handler = this;else if (opts.getHandler) handler = opts.getHandler(apiProp, accessor);else handler = opts.handler;

            return handler[srcProp](...args);
        };

        if (accessor === 'getter') (0, _defineProperty2.default)(dest, apiProp, { get: fn, configurable: true });else if (accessor === 'setter') (0, _defineProperty2.default)(dest, apiProp, { set: fn, configurable: true });else dest[apiProp] = fn;
    });
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kZWxlZ2F0ZWQtYXBpLmpzIl0sIm5hbWVzIjpbImdldERlbGVnYXRlZEFQSUxpc3QiLCJkZWxlZ2F0ZUFQSSIsIkFQSV9JTVBMRU1FTlRBVElPTl9NRVRIT0RfUkUiLCJzcmMiLCJtYXAiLCJwcm9wIiwibWF0Y2giLCJzcmNQcm9wIiwiYXBpUHJvcCIsImFjY2Vzc29yIiwiZmlsdGVyIiwiaXRlbSIsImRlc3QiLCJhcGlMaXN0Iiwib3B0cyIsImZvckVhY2giLCJmbiIsImFyZ3MiLCJwcm94eU1ldGhvZCIsImhhbmRsZXIiLCJ1c2VDdXJyZW50Q3R4QXNIYW5kbGVyIiwiZ2V0SGFuZGxlciIsImdldCIsImNvbmZpZ3VyYWJsZSIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O1FBRWdCQSxtQixHQUFBQSxtQjtRQW1CQUMsVyxHQUFBQSxXOzs7O0FBckJoQixNQUFNQywrQkFBK0IsNEJBQXJDOztBQUVPLFNBQVNGLG1CQUFULENBQThCRyxHQUE5QixFQUFtQztBQUN0QyxXQUFPLG1DQUNrQkEsR0FEbEIsRUFFRkMsR0FGRSxDQUVFQyxRQUFRO0FBQ1QsY0FBTUMsUUFBUUQsS0FBS0MsS0FBTCxDQUFXSiw0QkFBWCxDQUFkOztBQUVBLFlBQUlJLEtBQUosRUFBVztBQUNQLG1CQUFPO0FBQ0hDLHlCQUFVRixJQURQO0FBRUhHLHlCQUFVRixNQUFNLENBQU4sQ0FGUDtBQUdIRywwQkFBVUgsTUFBTSxDQUFOO0FBSFAsYUFBUDtBQUtIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBZEUsRUFlRkksTUFmRSxDQWVLQyxRQUFRLENBQUMsQ0FBQ0EsSUFmZixDQUFQO0FBZ0JIOztBQUVNLFNBQVNWLFdBQVQsQ0FBc0JXLElBQXRCLEVBQTRCQyxPQUE1QixFQUFxQ0MsSUFBckMsRUFBMkM7QUFDOUNELFlBQVFFLE9BQVIsQ0FBZ0IsQ0FBQyxFQUFFUixPQUFGLEVBQVdDLE9BQVgsRUFBb0JDLFFBQXBCLEVBQUQsS0FBb0M7QUFDaEQsY0FBTU8sS0FBSyxTQUFMQSxFQUFLLENBQVUsR0FBR0MsSUFBYixFQUFtQjtBQUMxQixnQkFBSUgsS0FBS0ksV0FBVCxFQUNJSixLQUFLSSxXQUFMOztBQUVKLGdCQUFJQyxVQUFVLElBQWQ7O0FBRUEsZ0JBQUlMLEtBQUtNLHNCQUFULEVBQ0lELFVBQVUsSUFBVixDQURKLEtBR0ssSUFBSUwsS0FBS08sVUFBVCxFQUNERixVQUFVTCxLQUFLTyxVQUFMLENBQWdCYixPQUFoQixFQUF5QkMsUUFBekIsQ0FBVixDQURDLEtBSURVLFVBQVVMLEtBQUtLLE9BQWY7O0FBRUosbUJBQU9BLFFBQVFaLE9BQVIsRUFBaUIsR0FBR1UsSUFBcEIsQ0FBUDtBQUNILFNBaEJEOztBQWtCQSxZQUFJUixhQUFhLFFBQWpCLEVBQ0ksOEJBQXNCRyxJQUF0QixFQUE0QkosT0FBNUIsRUFBcUMsRUFBRWMsS0FBS04sRUFBUCxFQUFXTyxjQUFjLElBQXpCLEVBQXJDLEVBREosS0FHSyxJQUFJZCxhQUFhLFFBQWpCLEVBQ0QsOEJBQXNCRyxJQUF0QixFQUE0QkosT0FBNUIsRUFBcUMsRUFBRWdCLEtBQUtSLEVBQVAsRUFBV08sY0FBYyxJQUF6QixFQUFyQyxFQURDLEtBSURYLEtBQUtKLE9BQUwsSUFBZ0JRLEVBQWhCO0FBQ1AsS0EzQkQ7QUE0QkgiLCJmaWxlIjoidXRpbHMvZGVsZWdhdGVkLWFwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFQSV9JTVBMRU1FTlRBVElPTl9NRVRIT0RfUkUgPSAvXl8oXFxTKylcXCQoZ2V0dGVyfHNldHRlcik/JC87XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWxlZ2F0ZWRBUElMaXN0IChzcmMpIHtcbiAgICByZXR1cm4gT2JqZWN0XG4gICAgICAgIC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNyYylcbiAgICAgICAgLm1hcChwcm9wID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gcHJvcC5tYXRjaChBUElfSU1QTEVNRU5UQVRJT05fTUVUSE9EX1JFKTtcblxuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3JjUHJvcDogIHByb3AsXG4gICAgICAgICAgICAgICAgICAgIGFwaVByb3A6ICBtYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzb3I6IG1hdGNoWzJdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pXG4gICAgICAgIC5maWx0ZXIoaXRlbSA9PiAhIWl0ZW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVsZWdhdGVBUEkgKGRlc3QsIGFwaUxpc3QsIG9wdHMpIHtcbiAgICBhcGlMaXN0LmZvckVhY2goKHsgc3JjUHJvcCwgYXBpUHJvcCwgYWNjZXNzb3IgfSkgPT4ge1xuICAgICAgICBjb25zdCBmbiA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICBpZiAob3B0cy5wcm94eU1ldGhvZClcbiAgICAgICAgICAgICAgICBvcHRzLnByb3h5TWV0aG9kKCk7XG5cbiAgICAgICAgICAgIGxldCBoYW5kbGVyID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKG9wdHMudXNlQ3VycmVudEN0eEFzSGFuZGxlcilcbiAgICAgICAgICAgICAgICBoYW5kbGVyID0gdGhpcztcblxuICAgICAgICAgICAgZWxzZSBpZiAob3B0cy5nZXRIYW5kbGVyKVxuICAgICAgICAgICAgICAgIGhhbmRsZXIgPSBvcHRzLmdldEhhbmRsZXIoYXBpUHJvcCwgYWNjZXNzb3IpO1xuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaGFuZGxlciA9IG9wdHMuaGFuZGxlcjtcblxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXJbc3JjUHJvcF0oLi4uYXJncyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGFjY2Vzc29yID09PSAnZ2V0dGVyJylcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXN0LCBhcGlQcm9wLCB7IGdldDogZm4sIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9KTtcblxuICAgICAgICBlbHNlIGlmIChhY2Nlc3NvciA9PT0gJ3NldHRlcicpXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVzdCwgYXBpUHJvcCwgeyBzZXQ6IGZuLCBjb25maWd1cmFibGU6IHRydWUgfSk7XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGVzdFthcGlQcm9wXSA9IGZuO1xuICAgIH0pO1xufVxuIl19
