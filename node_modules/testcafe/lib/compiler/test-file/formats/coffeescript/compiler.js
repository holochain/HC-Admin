'use strict';

exports.__esModule = true;

var _coffeescript = require('coffeescript');

var _coffeescript2 = _interopRequireDefault(_coffeescript);

var _loadBabelLibs2 = require('../../../load-babel-libs');

var _loadBabelLibs3 = _interopRequireDefault(_loadBabelLibs2);

var _compiler = require('../es-next/compiler.js');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FIXTURE_RE = /(^|;|\s+)fixture\s*(\.|\(|'|")/;
const TEST_RE = /(^|;|\s+)test\s*/;

class CoffeeScriptTestFileCompiler extends _compiler2.default {
    _hasTests(code) {
        return FIXTURE_RE.test(code) && TEST_RE.test(code);
    }

    _compileCode(code, filename) {
        if (this.cache[filename]) return this.cache[filename];

        const transpiled = _coffeescript2.default.compile(code, {
            filename,
            bare: true,
            sourceMap: true,
            inlineMap: true,
            header: false
        });

        var _loadBabelLibs = (0, _loadBabelLibs3.default)();

        const babel = _loadBabelLibs.babel;

        const babelOptions = _compiler2.default.getBabelOptions(filename, code);
        const compiled = babel.transform(transpiled.js, babelOptions);

        this.cache[filename] = compiled.code;

        return compiled.code;
    }

    _getRequireCompilers() {
        return { '.coffee': (code, filename) => this._compileCode(code, filename) };
    }

    getSupportedExtension() {
        return '.coffee';
    }
}
exports.default = CoffeeScriptTestFileCompiler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlci90ZXN0LWZpbGUvZm9ybWF0cy9jb2ZmZWVzY3JpcHQvY29tcGlsZXIuanMiXSwibmFtZXMiOlsiRklYVFVSRV9SRSIsIlRFU1RfUkUiLCJDb2ZmZWVTY3JpcHRUZXN0RmlsZUNvbXBpbGVyIiwiRVNOZXh0VGVzdEZpbGVDb21waWxlciIsIl9oYXNUZXN0cyIsImNvZGUiLCJ0ZXN0IiwiX2NvbXBpbGVDb2RlIiwiZmlsZW5hbWUiLCJjYWNoZSIsInRyYW5zcGlsZWQiLCJDb2ZmZWVTY3JpcHQiLCJjb21waWxlIiwiYmFyZSIsInNvdXJjZU1hcCIsImlubGluZU1hcCIsImhlYWRlciIsImJhYmVsIiwiYmFiZWxPcHRpb25zIiwiZ2V0QmFiZWxPcHRpb25zIiwiY29tcGlsZWQiLCJ0cmFuc2Zvcm0iLCJqcyIsIl9nZXRSZXF1aXJlQ29tcGlsZXJzIiwiZ2V0U3VwcG9ydGVkRXh0ZW5zaW9uIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNQSxhQUFhLGdDQUFuQjtBQUNBLE1BQU1DLFVBQWEsa0JBQW5COztBQUVlLE1BQU1DLDRCQUFOLFNBQTJDQyxrQkFBM0MsQ0FBa0U7QUFDN0VDLGNBQVdDLElBQVgsRUFBaUI7QUFDYixlQUFPTCxXQUFXTSxJQUFYLENBQWdCRCxJQUFoQixLQUF5QkosUUFBUUssSUFBUixDQUFhRCxJQUFiLENBQWhDO0FBQ0g7O0FBRURFLGlCQUFjRixJQUFkLEVBQW9CRyxRQUFwQixFQUE4QjtBQUMxQixZQUFJLEtBQUtDLEtBQUwsQ0FBV0QsUUFBWCxDQUFKLEVBQ0ksT0FBTyxLQUFLQyxLQUFMLENBQVdELFFBQVgsQ0FBUDs7QUFFSixjQUFNRSxhQUFhQyx1QkFBYUMsT0FBYixDQUFxQlAsSUFBckIsRUFBMkI7QUFDMUNHLG9CQUQwQztBQUUxQ0ssa0JBQVcsSUFGK0I7QUFHMUNDLHVCQUFXLElBSCtCO0FBSTFDQyx1QkFBVyxJQUorQjtBQUsxQ0Msb0JBQVc7QUFMK0IsU0FBM0IsQ0FBbkI7O0FBSjBCLDZCQVlMLDhCQVpLOztBQUFBLGNBWWxCQyxLQVprQixrQkFZbEJBLEtBWmtCOztBQWExQixjQUFNQyxlQUFlZixtQkFBdUJnQixlQUF2QixDQUF1Q1gsUUFBdkMsRUFBaURILElBQWpELENBQXJCO0FBQ0EsY0FBTWUsV0FBZUgsTUFBTUksU0FBTixDQUFnQlgsV0FBV1ksRUFBM0IsRUFBK0JKLFlBQS9CLENBQXJCOztBQUVBLGFBQUtULEtBQUwsQ0FBV0QsUUFBWCxJQUF1QlksU0FBU2YsSUFBaEM7O0FBRUEsZUFBT2UsU0FBU2YsSUFBaEI7QUFDSDs7QUFFRGtCLDJCQUF3QjtBQUNwQixlQUFPLEVBQUUsV0FBVyxDQUFDbEIsSUFBRCxFQUFPRyxRQUFQLEtBQW9CLEtBQUtELFlBQUwsQ0FBa0JGLElBQWxCLEVBQXdCRyxRQUF4QixDQUFqQyxFQUFQO0FBQ0g7O0FBRURnQiw0QkFBeUI7QUFDckIsZUFBTyxTQUFQO0FBQ0g7QUFoQzRFO2tCQUE1RHRCLDRCIiwiZmlsZSI6ImNvbXBpbGVyL3Rlc3QtZmlsZS9mb3JtYXRzL2NvZmZlZXNjcmlwdC9jb21waWxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2ZmZWVTY3JpcHQgZnJvbSAnY29mZmVlc2NyaXB0JztcbmltcG9ydCBsb2FkQmFiZWxMaWJzIGZyb20gJy4uLy4uLy4uL2xvYWQtYmFiZWwtbGlicyc7XG5pbXBvcnQgRVNOZXh0VGVzdEZpbGVDb21waWxlciBmcm9tICcuLi9lcy1uZXh0L2NvbXBpbGVyLmpzJztcblxuY29uc3QgRklYVFVSRV9SRSA9IC8oXnw7fFxccyspZml4dHVyZVxccyooXFwufFxcKHwnfFwiKS87XG5jb25zdCBURVNUX1JFICAgID0gLyhefDt8XFxzKyl0ZXN0XFxzKi87XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvZmZlZVNjcmlwdFRlc3RGaWxlQ29tcGlsZXIgZXh0ZW5kcyBFU05leHRUZXN0RmlsZUNvbXBpbGVyIHtcbiAgICBfaGFzVGVzdHMgKGNvZGUpIHtcbiAgICAgICAgcmV0dXJuIEZJWFRVUkVfUkUudGVzdChjb2RlKSAmJiBURVNUX1JFLnRlc3QoY29kZSk7XG4gICAgfVxuXG4gICAgX2NvbXBpbGVDb2RlIChjb2RlLCBmaWxlbmFtZSkge1xuICAgICAgICBpZiAodGhpcy5jYWNoZVtmaWxlbmFtZV0pXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVtmaWxlbmFtZV07XG5cbiAgICAgICAgY29uc3QgdHJhbnNwaWxlZCA9IENvZmZlZVNjcmlwdC5jb21waWxlKGNvZGUsIHtcbiAgICAgICAgICAgIGZpbGVuYW1lLFxuICAgICAgICAgICAgYmFyZTogICAgICB0cnVlLFxuICAgICAgICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgICAgICAgICAgaW5saW5lTWFwOiB0cnVlLFxuICAgICAgICAgICAgaGVhZGVyOiAgICBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB7IGJhYmVsIH0gICAgPSBsb2FkQmFiZWxMaWJzKCk7XG4gICAgICAgIGNvbnN0IGJhYmVsT3B0aW9ucyA9IEVTTmV4dFRlc3RGaWxlQ29tcGlsZXIuZ2V0QmFiZWxPcHRpb25zKGZpbGVuYW1lLCBjb2RlKTtcbiAgICAgICAgY29uc3QgY29tcGlsZWQgICAgID0gYmFiZWwudHJhbnNmb3JtKHRyYW5zcGlsZWQuanMsIGJhYmVsT3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5jYWNoZVtmaWxlbmFtZV0gPSBjb21waWxlZC5jb2RlO1xuXG4gICAgICAgIHJldHVybiBjb21waWxlZC5jb2RlO1xuICAgIH1cblxuICAgIF9nZXRSZXF1aXJlQ29tcGlsZXJzICgpIHtcbiAgICAgICAgcmV0dXJuIHsgJy5jb2ZmZWUnOiAoY29kZSwgZmlsZW5hbWUpID0+IHRoaXMuX2NvbXBpbGVDb2RlKGNvZGUsIGZpbGVuYW1lKSB9O1xuICAgIH1cblxuICAgIGdldFN1cHBvcnRlZEV4dGVuc2lvbiAoKSB7XG4gICAgICAgIHJldHVybiAnLmNvZmZlZSc7XG4gICAgfVxufVxuIl19
