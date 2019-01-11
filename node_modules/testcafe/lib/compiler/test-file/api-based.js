'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _path = require('path');

var _fs = require('fs');

var _stripBom = require('strip-bom');

var _stripBom2 = _interopRequireDefault(_stripBom);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _testFile = require('../../api/structure/test-file');

var _testFile2 = _interopRequireDefault(_testFile);

var _fixture = require('../../api/structure/fixture');

var _fixture2 = _interopRequireDefault(_fixture);

var _test = require('../../api/structure/test');

var _test2 = _interopRequireDefault(_test);

var _runtime = require('../../errors/runtime');

var _stackCleaningHook = require('../../errors/stack-cleaning-hook');

var _stackCleaningHook2 = _interopRequireDefault(_stackCleaningHook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CWD = process.cwd();

const EXPORTABLE_LIB_PATH = (0, _path.join)(__dirname, '../../api/exportable-lib');

const FIXTURE_RE = /(^|;|\s+)fixture\s*(\.|\(|`)/;
const TEST_RE = /(^|;|\s+)test\s*(\.|\()/;

const Module = module.constructor;

class APIBasedTestFileCompilerBase extends _base2.default {
    constructor() {
        super();

        this.cache = (0, _create2.default)(null);
        this.origRequireExtensions = (0, _create2.default)(null);
    }

    static get EXPORTABLE_LIB_PATH() {
        return EXPORTABLE_LIB_PATH;
    }

    static _getNodeModulesLookupPath(filename) {
        const dir = (0, _path.dirname)(filename);

        return Module._nodeModulePaths(dir);
    }

    static _isNodeModulesDep(filename) {
        return (0, _path.relative)(CWD, filename).split(_path.sep).indexOf('node_modules') >= 0;
    }

    static _execAsModule(code, filename) {
        const mod = new Module(filename, module.parent);

        mod.filename = filename;
        mod.paths = APIBasedTestFileCompilerBase._getNodeModulesLookupPath(filename);

        mod._compile(code, filename);
    }

    _compileCode() /* code, filename */{
        throw new Error('Not implemented');
    }

    _getRequireCompilers() {
        throw new Error('Not implemented');
    }

    _setupRequireHook(testFile) {
        const requireCompilers = this._getRequireCompilers();

        this.origRequireExtensions = (0, _create2.default)(null);

        (0, _keys2.default)(requireCompilers).forEach(ext => {
            const origExt = require.extensions[ext];

            this.origRequireExtensions[ext] = origExt;

            require.extensions[ext] = (mod, filename) => {
                // NOTE: remove global API so that it will be unavailable for the dependencies
                this._removeGlobalAPI();

                if (APIBasedTestFileCompilerBase._isNodeModulesDep(filename) && origExt) origExt(mod, filename);else {
                    const code = (0, _fs.readFileSync)(filename).toString();
                    const compiledCode = requireCompilers[ext]((0, _stripBom2.default)(code), filename);

                    mod.paths = APIBasedTestFileCompilerBase._getNodeModulesLookupPath(filename);

                    mod._compile(compiledCode, filename);
                }

                this._addGlobalAPI(testFile);
            };
        });
    }

    _removeRequireHook() {
        (0, _keys2.default)(this.origRequireExtensions).forEach(ext => {
            require.extensions[ext] = this.origRequireExtensions[ext];
        });
    }

    _compileCodeForTestFile(code, filename) {
        let compiledCode = null;

        _stackCleaningHook2.default.enabled = true;

        try {
            compiledCode = this._compileCode(code, filename);
        } catch (err) {
            throw new _runtime.TestCompilationError(_stackCleaningHook2.default.cleanError(err));
        } finally {
            _stackCleaningHook2.default.enabled = false;
        }

        return compiledCode;
    }

    _addGlobalAPI(testFile) {
        Object.defineProperty(global, 'fixture', {
            get: () => new _fixture2.default(testFile),
            configurable: true
        });

        Object.defineProperty(global, 'test', {
            get: () => new _test2.default(testFile),
            configurable: true
        });
    }

    _removeGlobalAPI() {
        delete global.fixture;
        delete global.test;
    }

    compile(code, filename) {
        const compiledCode = this._compileCodeForTestFile(code, filename);
        const testFile = new _testFile2.default(filename);

        this._addGlobalAPI(testFile);

        _stackCleaningHook2.default.enabled = true;

        this._setupRequireHook(testFile);

        try {
            APIBasedTestFileCompilerBase._execAsModule(compiledCode, filename);
        } catch (err) {
            // HACK: workaround for the `instanceof` problem
            // (see: http://stackoverflow.com/questions/33870684/why-doesnt-instanceof-work-on-instances-of-error-subclasses-under-babel-node)
            if (err.constructor !== _runtime.APIError) throw new _runtime.TestCompilationError(_stackCleaningHook2.default.cleanError(err));

            throw err;
        } finally {
            this._removeRequireHook();
            _stackCleaningHook2.default.enabled = false;

            this._removeGlobalAPI();
        }

        return testFile.getTests();
    }

    _hasTests(code) {
        return FIXTURE_RE.test(code) && TEST_RE.test(code);
    }

    cleanUp() {
        this.cache = {};
    }
}
exports.default = APIBasedTestFileCompilerBase;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlci90ZXN0LWZpbGUvYXBpLWJhc2VkLmpzIl0sIm5hbWVzIjpbIkNXRCIsInByb2Nlc3MiLCJjd2QiLCJFWFBPUlRBQkxFX0xJQl9QQVRIIiwiX19kaXJuYW1lIiwiRklYVFVSRV9SRSIsIlRFU1RfUkUiLCJNb2R1bGUiLCJtb2R1bGUiLCJjb25zdHJ1Y3RvciIsIkFQSUJhc2VkVGVzdEZpbGVDb21waWxlckJhc2UiLCJUZXN0RmlsZUNvbXBpbGVyQmFzZSIsImNhY2hlIiwib3JpZ1JlcXVpcmVFeHRlbnNpb25zIiwiX2dldE5vZGVNb2R1bGVzTG9va3VwUGF0aCIsImZpbGVuYW1lIiwiZGlyIiwiX25vZGVNb2R1bGVQYXRocyIsIl9pc05vZGVNb2R1bGVzRGVwIiwic3BsaXQiLCJwYXRoU2VwIiwiaW5kZXhPZiIsIl9leGVjQXNNb2R1bGUiLCJjb2RlIiwibW9kIiwicGFyZW50IiwicGF0aHMiLCJfY29tcGlsZSIsIl9jb21waWxlQ29kZSIsIkVycm9yIiwiX2dldFJlcXVpcmVDb21waWxlcnMiLCJfc2V0dXBSZXF1aXJlSG9vayIsInRlc3RGaWxlIiwicmVxdWlyZUNvbXBpbGVycyIsImZvckVhY2giLCJleHQiLCJvcmlnRXh0IiwicmVxdWlyZSIsImV4dGVuc2lvbnMiLCJfcmVtb3ZlR2xvYmFsQVBJIiwidG9TdHJpbmciLCJjb21waWxlZENvZGUiLCJfYWRkR2xvYmFsQVBJIiwiX3JlbW92ZVJlcXVpcmVIb29rIiwiX2NvbXBpbGVDb2RlRm9yVGVzdEZpbGUiLCJzdGFja0NsZWFuaW5nSG9vayIsImVuYWJsZWQiLCJlcnIiLCJUZXN0Q29tcGlsYXRpb25FcnJvciIsImNsZWFuRXJyb3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdsb2JhbCIsImdldCIsIkZpeHR1cmUiLCJjb25maWd1cmFibGUiLCJUZXN0IiwiZml4dHVyZSIsInRlc3QiLCJjb21waWxlIiwiVGVzdEZpbGUiLCJBUElFcnJvciIsImdldFRl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QUwsQ0FBNkJyQixJQUE3QixFQUFtQ1IsUUFBbkMsQ0FBckI7QUFDQSxjQUFNaUIsV0FBZSxJQUFJNEIsa0JBQUosQ0FBYTdDLFFBQWIsQ0FBckI7O0FBRUEsYUFBSzJCLGFBQUwsQ0FBbUJWLFFBQW5COztBQUVBYSxvQ0FBa0JDLE9BQWxCLEdBQTRCLElBQTVCOztBQUVBLGFBQUtmLGlCQUFMLENBQXVCQyxRQUF2Qjs7QUFFQSxZQUFJO0FBQ0F0Qix5Q0FBNkJZLGFBQTdCLENBQTJDbUIsWUFBM0MsRUFBeUQxQixRQUF6RDtBQUNILFNBRkQsQ0FHQSxPQUFPZ0MsR0FBUCxFQUFZO0FBQ1I7QUFDQTtBQUNBLGdCQUFJQSxJQUFJdEMsV0FBSixLQUFvQm9ELGlCQUF4QixFQUNJLE1BQU0sSUFBSWIsNkJBQUosQ0FBeUJILDRCQUFrQkksVUFBbEIsQ0FBNkJGLEdBQTdCLENBQXpCLENBQU47O0FBRUosa0JBQU1BLEdBQU47QUFDSCxTQVZELFNBV1E7QUFDSixpQkFBS0osa0JBQUw7QUFDQUUsd0NBQWtCQyxPQUFsQixHQUE0QixLQUE1Qjs7QUFFQSxpQkFBS1AsZ0JBQUw7QUFDSDs7QUFFRCxlQUFPUCxTQUFTOEIsUUFBVCxFQUFQO0FBQ0g7O0FBRURDLGNBQVd4QyxJQUFYLEVBQWlCO0FBQ2IsZUFBT2xCLFdBQVdxRCxJQUFYLENBQWdCbkMsSUFBaEIsS0FBeUJqQixRQUFRb0QsSUFBUixDQUFhbkMsSUFBYixDQUFoQztBQUNIOztBQUVEeUMsY0FBVztBQUNQLGFBQUtwRCxLQUFMLEdBQWEsRUFBYjtBQUNIO0FBdEowRTtrQkFBMURGLDRCIiwiZmlsZSI6ImNvbXBpbGVyL3Rlc3QtZmlsZS9hcGktYmFzZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkaXJuYW1lLCByZWxhdGl2ZSwgam9pbiwgc2VwIGFzIHBhdGhTZXAgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCBzdHJpcEJvbSBmcm9tICdzdHJpcC1ib20nO1xuaW1wb3J0IFRlc3RGaWxlQ29tcGlsZXJCYXNlIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgVGVzdEZpbGUgZnJvbSAnLi4vLi4vYXBpL3N0cnVjdHVyZS90ZXN0LWZpbGUnO1xuaW1wb3J0IEZpeHR1cmUgZnJvbSAnLi4vLi4vYXBpL3N0cnVjdHVyZS9maXh0dXJlJztcbmltcG9ydCBUZXN0IGZyb20gJy4uLy4uL2FwaS9zdHJ1Y3R1cmUvdGVzdCc7XG5pbXBvcnQgeyBUZXN0Q29tcGlsYXRpb25FcnJvciwgQVBJRXJyb3IgfSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQgc3RhY2tDbGVhbmluZ0hvb2sgZnJvbSAnLi4vLi4vZXJyb3JzL3N0YWNrLWNsZWFuaW5nLWhvb2snO1xuXG5jb25zdCBDV0QgPSBwcm9jZXNzLmN3ZCgpO1xuXG5jb25zdCBFWFBPUlRBQkxFX0xJQl9QQVRIID0gam9pbihfX2Rpcm5hbWUsICcuLi8uLi9hcGkvZXhwb3J0YWJsZS1saWInKTtcblxuY29uc3QgRklYVFVSRV9SRSA9IC8oXnw7fFxccyspZml4dHVyZVxccyooXFwufFxcKHxgKS87XG5jb25zdCBURVNUX1JFICAgID0gLyhefDt8XFxzKyl0ZXN0XFxzKihcXC58XFwoKS87XG5cbmNvbnN0IE1vZHVsZSA9IG1vZHVsZS5jb25zdHJ1Y3RvcjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVBJQmFzZWRUZXN0RmlsZUNvbXBpbGVyQmFzZSBleHRlbmRzIFRlc3RGaWxlQ29tcGlsZXJCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5jYWNoZSAgICAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLm9yaWdSZXF1aXJlRXh0ZW5zaW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBFWFBPUlRBQkxFX0xJQl9QQVRIICgpIHtcbiAgICAgICAgcmV0dXJuIEVYUE9SVEFCTEVfTElCX1BBVEg7XG4gICAgfVxuXG4gICAgc3RhdGljIF9nZXROb2RlTW9kdWxlc0xvb2t1cFBhdGggKGZpbGVuYW1lKSB7XG4gICAgICAgIGNvbnN0IGRpciA9IGRpcm5hbWUoZmlsZW5hbWUpO1xuXG4gICAgICAgIHJldHVybiBNb2R1bGUuX25vZGVNb2R1bGVQYXRocyhkaXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBfaXNOb2RlTW9kdWxlc0RlcCAoZmlsZW5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0aXZlKENXRCwgZmlsZW5hbWUpXG4gICAgICAgICAgICAuc3BsaXQocGF0aFNlcClcbiAgICAgICAgICAgIC5pbmRleE9mKCdub2RlX21vZHVsZXMnKSA+PSAwO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZXhlY0FzTW9kdWxlIChjb2RlLCBmaWxlbmFtZSkge1xuICAgICAgICBjb25zdCBtb2QgPSBuZXcgTW9kdWxlKGZpbGVuYW1lLCBtb2R1bGUucGFyZW50KTtcblxuICAgICAgICBtb2QuZmlsZW5hbWUgPSBmaWxlbmFtZTtcbiAgICAgICAgbW9kLnBhdGhzICAgID0gQVBJQmFzZWRUZXN0RmlsZUNvbXBpbGVyQmFzZS5fZ2V0Tm9kZU1vZHVsZXNMb29rdXBQYXRoKGZpbGVuYW1lKTtcblxuICAgICAgICBtb2QuX2NvbXBpbGUoY29kZSwgZmlsZW5hbWUpO1xuICAgIH1cblxuICAgIF9jb21waWxlQ29kZSAoLyogY29kZSwgZmlsZW5hbWUgKi8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBfZ2V0UmVxdWlyZUNvbXBpbGVycyAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gICAgfVxuXG4gICAgX3NldHVwUmVxdWlyZUhvb2sgKHRlc3RGaWxlKSB7XG4gICAgICAgIGNvbnN0IHJlcXVpcmVDb21waWxlcnMgPSB0aGlzLl9nZXRSZXF1aXJlQ29tcGlsZXJzKCk7XG5cbiAgICAgICAgdGhpcy5vcmlnUmVxdWlyZUV4dGVuc2lvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHJlcXVpcmVDb21waWxlcnMpLmZvckVhY2goZXh0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdFeHQgPSByZXF1aXJlLmV4dGVuc2lvbnNbZXh0XTtcblxuICAgICAgICAgICAgdGhpcy5vcmlnUmVxdWlyZUV4dGVuc2lvbnNbZXh0XSA9IG9yaWdFeHQ7XG5cbiAgICAgICAgICAgIHJlcXVpcmUuZXh0ZW5zaW9uc1tleHRdID0gKG1vZCwgZmlsZW5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBOT1RFOiByZW1vdmUgZ2xvYmFsIEFQSSBzbyB0aGF0IGl0IHdpbGwgYmUgdW5hdmFpbGFibGUgZm9yIHRoZSBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVHbG9iYWxBUEkoKTtcblxuICAgICAgICAgICAgICAgIGlmIChBUElCYXNlZFRlc3RGaWxlQ29tcGlsZXJCYXNlLl9pc05vZGVNb2R1bGVzRGVwKGZpbGVuYW1lKSAmJiBvcmlnRXh0KVxuICAgICAgICAgICAgICAgICAgICBvcmlnRXh0KG1vZCwgZmlsZW5hbWUpO1xuXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvZGUgICAgICAgICA9IHJlYWRGaWxlU3luYyhmaWxlbmFtZSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcGlsZWRDb2RlID0gcmVxdWlyZUNvbXBpbGVyc1tleHRdKHN0cmlwQm9tKGNvZGUpLCBmaWxlbmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbW9kLnBhdGhzID0gQVBJQmFzZWRUZXN0RmlsZUNvbXBpbGVyQmFzZS5fZ2V0Tm9kZU1vZHVsZXNMb29rdXBQYXRoKGZpbGVuYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICBtb2QuX2NvbXBpbGUoY29tcGlsZWRDb2RlLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkR2xvYmFsQVBJKHRlc3RGaWxlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9yZW1vdmVSZXF1aXJlSG9vayAoKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMub3JpZ1JlcXVpcmVFeHRlbnNpb25zKS5mb3JFYWNoKGV4dCA9PiB7XG4gICAgICAgICAgICByZXF1aXJlLmV4dGVuc2lvbnNbZXh0XSA9IHRoaXMub3JpZ1JlcXVpcmVFeHRlbnNpb25zW2V4dF07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9jb21waWxlQ29kZUZvclRlc3RGaWxlIChjb2RlLCBmaWxlbmFtZSkge1xuICAgICAgICBsZXQgY29tcGlsZWRDb2RlID0gbnVsbDtcblxuICAgICAgICBzdGFja0NsZWFuaW5nSG9vay5lbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29tcGlsZWRDb2RlID0gdGhpcy5fY29tcGlsZUNvZGUoY29kZSwgZmlsZW5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZXN0Q29tcGlsYXRpb25FcnJvcihzdGFja0NsZWFuaW5nSG9vay5jbGVhbkVycm9yKGVycikpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgc3RhY2tDbGVhbmluZ0hvb2suZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXBpbGVkQ29kZTtcbiAgICB9XG5cbiAgICBfYWRkR2xvYmFsQVBJICh0ZXN0RmlsZSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZ2xvYmFsLCAnZml4dHVyZScsIHtcbiAgICAgICAgICAgIGdldDogICAgICAgICAgKCkgPT4gbmV3IEZpeHR1cmUodGVzdEZpbGUpLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwsICd0ZXN0Jywge1xuICAgICAgICAgICAgZ2V0OiAgICAgICAgICAoKSA9PiBuZXcgVGVzdCh0ZXN0RmlsZSksXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX3JlbW92ZUdsb2JhbEFQSSAoKSB7XG4gICAgICAgIGRlbGV0ZSBnbG9iYWwuZml4dHVyZTtcbiAgICAgICAgZGVsZXRlIGdsb2JhbC50ZXN0O1xuICAgIH1cblxuICAgIGNvbXBpbGUgKGNvZGUsIGZpbGVuYW1lKSB7XG4gICAgICAgIGNvbnN0IGNvbXBpbGVkQ29kZSA9IHRoaXMuX2NvbXBpbGVDb2RlRm9yVGVzdEZpbGUoY29kZSwgZmlsZW5hbWUpO1xuICAgICAgICBjb25zdCB0ZXN0RmlsZSAgICAgPSBuZXcgVGVzdEZpbGUoZmlsZW5hbWUpO1xuXG4gICAgICAgIHRoaXMuX2FkZEdsb2JhbEFQSSh0ZXN0RmlsZSk7XG5cbiAgICAgICAgc3RhY2tDbGVhbmluZ0hvb2suZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fc2V0dXBSZXF1aXJlSG9vayh0ZXN0RmlsZSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIEFQSUJhc2VkVGVzdEZpbGVDb21waWxlckJhc2UuX2V4ZWNBc01vZHVsZShjb21waWxlZENvZGUsIGZpbGVuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBIQUNLOiB3b3JrYXJvdW5kIGZvciB0aGUgYGluc3RhbmNlb2ZgIHByb2JsZW1cbiAgICAgICAgICAgIC8vIChzZWU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzM4NzA2ODQvd2h5LWRvZXNudC1pbnN0YW5jZW9mLXdvcmstb24taW5zdGFuY2VzLW9mLWVycm9yLXN1YmNsYXNzZXMtdW5kZXItYmFiZWwtbm9kZSlcbiAgICAgICAgICAgIGlmIChlcnIuY29uc3RydWN0b3IgIT09IEFQSUVycm9yKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZXN0Q29tcGlsYXRpb25FcnJvcihzdGFja0NsZWFuaW5nSG9vay5jbGVhbkVycm9yKGVycikpO1xuXG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVSZXF1aXJlSG9vaygpO1xuICAgICAgICAgICAgc3RhY2tDbGVhbmluZ0hvb2suZW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVHbG9iYWxBUEkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXN0RmlsZS5nZXRUZXN0cygpO1xuICAgIH1cblxuICAgIF9oYXNUZXN0cyAoY29kZSkge1xuICAgICAgICByZXR1cm4gRklYVFVSRV9SRS50ZXN0KGNvZGUpICYmIFRFU1RfUkUudGVzdChjb2RlKTtcbiAgICB9XG5cbiAgICBjbGVhblVwICgpIHtcbiAgICAgICAgdGhpcy5jYWNoZSA9IHt9O1xuICAgIH1cbn1cbiJdfQ==
