'use strict';

exports.__esModule = true;
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

class Assignable {
    _getAssignableProperties() {
        throw new Error('Not implemented');
    }

    _assignFrom(obj, validate, initOptions = {}) {
        if (!obj) return;

        const props = this._getAssignableProperties();

        for (let i = 0; i < props.length; i++) {
            var _props$i = props[i];
            const name = _props$i.name,
                  type = _props$i.type,
                  required = _props$i.required,
                  init = _props$i.init,
                  defaultValue = _props$i.defaultValue;


            const path = name.split('.');
            const lastIdx = path.length - 1;
            const last = path[lastIdx];
            let srcObj = obj;
            let destObj = this;

            for (let j = 0; j < lastIdx && srcObj && destObj; j++) {
                srcObj = srcObj[path[j]];
                destObj = destObj[path[j]];
            }

            if (destObj && 'defaultValue' in props[i]) destObj[name] = defaultValue;

            if (srcObj && destObj) {
                const srcVal = srcObj[last];

                if (srcVal !== void 0 || required) {
                    if (validate && type) type(name, srcVal);

                    destObj[last] = init ? init(name, srcVal, initOptions) : srcVal;
                }
            }
        }
    }
}
exports.default = Assignable;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hc3NpZ25hYmxlLmpzIl0sIm5hbWVzIjpbIkFzc2lnbmFibGUiLCJfZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMiLCJFcnJvciIsIl9hc3NpZ25Gcm9tIiwib2JqIiwidmFsaWRhdGUiLCJpbml0T3B0aW9ucyIsInByb3BzIiwiaSIsImxlbmd0aCIsIm5hbWUiLCJ0eXBlIiwicmVxdWlyZWQiLCJpbml0IiwiZGVmYXVsdFZhbHVlIiwicGF0aCIsInNwbGl0IiwibGFzdElkeCIsImxhc3QiLCJzcmNPYmoiLCJkZXN0T2JqIiwiaiIsInNyY1ZhbCJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsTUFBTUEsVUFBTixDQUFpQjtBQUM1QkMsK0JBQTRCO0FBQ3hCLGNBQU0sSUFBSUMsS0FBSixDQUFVLGlCQUFWLENBQU47QUFDSDs7QUFFREMsZ0JBQWFDLEdBQWIsRUFBa0JDLFFBQWxCLEVBQTRCQyxjQUFjLEVBQTFDLEVBQThDO0FBQzFDLFlBQUksQ0FBQ0YsR0FBTCxFQUNJOztBQUVKLGNBQU1HLFFBQVEsS0FBS04sd0JBQUwsRUFBZDs7QUFFQSxhQUFLLElBQUlPLElBQUksQ0FBYixFQUFnQkEsSUFBSUQsTUFBTUUsTUFBMUIsRUFBa0NELEdBQWxDLEVBQXVDO0FBQUEsMkJBQ2tCRCxNQUFNQyxDQUFOLENBRGxCO0FBQUEsa0JBQzNCRSxJQUQyQixZQUMzQkEsSUFEMkI7QUFBQSxrQkFDckJDLElBRHFCLFlBQ3JCQSxJQURxQjtBQUFBLGtCQUNmQyxRQURlLFlBQ2ZBLFFBRGU7QUFBQSxrQkFDTEMsSUFESyxZQUNMQSxJQURLO0FBQUEsa0JBQ0NDLFlBREQsWUFDQ0EsWUFERDs7O0FBR25DLGtCQUFNQyxPQUFVTCxLQUFLTSxLQUFMLENBQVcsR0FBWCxDQUFoQjtBQUNBLGtCQUFNQyxVQUFVRixLQUFLTixNQUFMLEdBQWMsQ0FBOUI7QUFDQSxrQkFBTVMsT0FBVUgsS0FBS0UsT0FBTCxDQUFoQjtBQUNBLGdCQUFJRSxTQUFVZixHQUFkO0FBQ0EsZ0JBQUlnQixVQUFVLElBQWQ7O0FBRUEsaUJBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSixPQUFKLElBQWVFLE1BQWYsSUFBeUJDLE9BQXpDLEVBQWtEQyxHQUFsRCxFQUF1RDtBQUNuREYseUJBQVVBLE9BQU9KLEtBQUtNLENBQUwsQ0FBUCxDQUFWO0FBQ0FELDBCQUFVQSxRQUFRTCxLQUFLTSxDQUFMLENBQVIsQ0FBVjtBQUNIOztBQUVELGdCQUFJRCxXQUFXLGtCQUFrQmIsTUFBTUMsQ0FBTixDQUFqQyxFQUNJWSxRQUFRVixJQUFSLElBQWdCSSxZQUFoQjs7QUFFSixnQkFBSUssVUFBVUMsT0FBZCxFQUF1QjtBQUNuQixzQkFBTUUsU0FBU0gsT0FBT0QsSUFBUCxDQUFmOztBQUVBLG9CQUFJSSxXQUFXLEtBQUssQ0FBaEIsSUFBcUJWLFFBQXpCLEVBQW1DO0FBQy9CLHdCQUFJUCxZQUFZTSxJQUFoQixFQUNJQSxLQUFLRCxJQUFMLEVBQVdZLE1BQVg7O0FBRUpGLDRCQUFRRixJQUFSLElBQWdCTCxPQUFPQSxLQUFLSCxJQUFMLEVBQVdZLE1BQVgsRUFBbUJoQixXQUFuQixDQUFQLEdBQXlDZ0IsTUFBekQ7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQXZDMkI7a0JBQVh0QixVIiwiZmlsZSI6InV0aWxzL2Fzc2lnbmFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBXQVJOSU5HOiB0aGlzIGZpbGUgaXMgdXNlZCBieSBib3RoIHRoZSBjbGllbnQgYW5kIHRoZSBzZXJ2ZXIuXG4vLyBEbyBub3QgdXNlIGFueSBicm93c2VyIG9yIG5vZGUtc3BlY2lmaWMgQVBJIVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3NpZ25hYmxlIHtcbiAgICBfZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMgKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIF9hc3NpZ25Gcm9tIChvYmosIHZhbGlkYXRlLCBpbml0T3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGlmICghb2JqKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5fZ2V0QXNzaWduYWJsZVByb3BlcnRpZXMoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB7IG5hbWUsIHR5cGUsIHJlcXVpcmVkLCBpbml0LCBkZWZhdWx0VmFsdWUgfSA9IHByb3BzW2ldO1xuXG4gICAgICAgICAgICBjb25zdCBwYXRoICAgID0gbmFtZS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgY29uc3QgbGFzdElkeCA9IHBhdGgubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGNvbnN0IGxhc3QgICAgPSBwYXRoW2xhc3RJZHhdO1xuICAgICAgICAgICAgbGV0IHNyY09iaiAgPSBvYmo7XG4gICAgICAgICAgICBsZXQgZGVzdE9iaiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGFzdElkeCAmJiBzcmNPYmogJiYgZGVzdE9iajsgaisrKSB7XG4gICAgICAgICAgICAgICAgc3JjT2JqICA9IHNyY09ialtwYXRoW2pdXTtcbiAgICAgICAgICAgICAgICBkZXN0T2JqID0gZGVzdE9ialtwYXRoW2pdXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRlc3RPYmogJiYgJ2RlZmF1bHRWYWx1ZScgaW4gcHJvcHNbaV0pXG4gICAgICAgICAgICAgICAgZGVzdE9ialtuYW1lXSA9IGRlZmF1bHRWYWx1ZTtcblxuICAgICAgICAgICAgaWYgKHNyY09iaiAmJiBkZXN0T2JqKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3JjVmFsID0gc3JjT2JqW2xhc3RdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNyY1ZhbCAhPT0gdm9pZCAwIHx8IHJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0ZSAmJiB0eXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZShuYW1lLCBzcmNWYWwpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlc3RPYmpbbGFzdF0gPSBpbml0ID8gaW5pdChuYW1lLCBzcmNWYWwsIGluaXRPcHRpb25zKSA6IHNyY1ZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
