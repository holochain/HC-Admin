'use strict';

exports.__esModule = true;

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _apiBased = require('../../api-based');

var _apiBased2 = _interopRequireDefault(_apiBased);

var _compiler = require('../es-next/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RENAMED_DEPENDENCIES_MAP = new _map2.default([['testcafe', _apiBased2.default.EXPORTABLE_LIB_PATH]]);

class TypeScriptTestFileCompiler extends _apiBased2.default {
    static _getTypescriptOptions() {
        // NOTE: lazy load the compiler
        const ts = require('typescript');

        return {
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            allowJs: true,
            pretty: true,
            inlineSourceMap: true,
            noImplicitAny: false,
            module: ts.ModuleKind.CommonJS,
            target: 2 /* ES6 */
            , lib: ['lib.es6.d.ts'],
            baseUrl: __dirname,
            paths: { testcafe: ['../../../../../ts-defs/index.d.ts'] },
            suppressOutputPathCheck: true,
            skipLibCheck: true
        };
    }

    static _reportErrors(diagnostics) {
        // NOTE: lazy load the compiler
        const ts = require('typescript');
        let errMsg = 'TypeScript compilation failed.\n';

        diagnostics.forEach(d => {
            const file = d.file;

            var _file$getLineAndChara = file.getLineAndCharacterOfPosition(d.start);

            const line = _file$getLineAndChara.line,
                  character = _file$getLineAndChara.character;

            const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');

            errMsg += `${file.fileName} (${line + 1}, ${character + 1}): ${message}\n`;
        });

        throw new Error(errMsg);
    }

    static _normalizeFilename(filename) {
        filename = _path2.default.resolve(filename);

        if (_osFamily2.default.win) filename = filename.toLowerCase();

        return filename;
    }

    _compileCode(code, filename) {
        // NOTE: lazy load the compiler
        const ts = require('typescript');

        const normalizedFilename = TypeScriptTestFileCompiler._normalizeFilename(filename);

        if (this.cache[normalizedFilename]) return this.cache[normalizedFilename];

        const opts = TypeScriptTestFileCompiler._getTypescriptOptions();
        const program = ts.createProgram([filename], opts);

        program.getSourceFiles().forEach(sourceFile => {
            sourceFile.renamedDependencies = RENAMED_DEPENDENCIES_MAP;
        });

        const diagnostics = ts.getPreEmitDiagnostics(program);

        if (diagnostics.length) TypeScriptTestFileCompiler._reportErrors(diagnostics);

        // NOTE: The first argument of emit() is a source file to be compiled. If it's undefined, all files in
        // <program> will be compiled. <program> contains a file specified in createProgram() plus all its dependencies.
        // This mode is much faster than compiling files one-by-one, and it is used in the tsc CLI compiler.
        program.emit(void 0, (outputName, result, writeBOM, onError, sources) => {
            const sourcePath = TypeScriptTestFileCompiler._normalizeFilename(sources[0].fileName);

            this.cache[sourcePath] = result;
        });

        return this.cache[normalizedFilename];
    }

    _getRequireCompilers() {
        return {
            '.ts': (code, filename) => this._compileCode(code, filename),
            '.js': (code, filename) => _compiler2.default.prototype._compileCode.call(this, code, filename)
        };
    }

    getSupportedExtension() {
        return '.ts';
    }
}
exports.default = TypeScriptTestFileCompiler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlci90ZXN0LWZpbGUvZm9ybWF0cy90eXBlc2NyaXB0L2NvbXBpbGVyLmpzIl0sIm5hbWVzIjpbIlJFTkFNRURfREVQRU5ERU5DSUVTX01BUCIsIkFQSUJhc2VkVGVzdEZpbGVDb21waWxlckJhc2UiLCJFWFBPUlRBQkxFX0xJQl9QQVRIIiwiVHlwZVNjcmlwdFRlc3RGaWxlQ29tcGlsZXIiLCJfZ2V0VHlwZXNjcmlwdE9wdGlvbnMiLCJ0cyIsInJlcXVpcmUiLCJleHBlcmltZW50YWxEZWNvcmF0b3JzIiwiZW1pdERlY29yYXRvck1ldGFkYXRhIiwiYWxsb3dKcyIsInByZXR0eSIsImlubGluZVNvdXJjZU1hcCIsIm5vSW1wbGljaXRBbnkiLCJtb2R1bGUiLCJNb2R1bGVLaW5kIiwiQ29tbW9uSlMiLCJ0YXJnZXQiLCJsaWIiLCJiYXNlVXJsIiwiX19kaXJuYW1lIiwicGF0aHMiLCJ0ZXN0Y2FmZSIsInN1cHByZXNzT3V0cHV0UGF0aENoZWNrIiwic2tpcExpYkNoZWNrIiwiX3JlcG9ydEVycm9ycyIsImRpYWdub3N0aWNzIiwiZXJyTXNnIiwiZm9yRWFjaCIsImQiLCJmaWxlIiwiZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24iLCJzdGFydCIsImxpbmUiLCJjaGFyYWN0ZXIiLCJtZXNzYWdlIiwiZmxhdHRlbkRpYWdub3N0aWNNZXNzYWdlVGV4dCIsIm1lc3NhZ2VUZXh0IiwiZmlsZU5hbWUiLCJFcnJvciIsIl9ub3JtYWxpemVGaWxlbmFtZSIsImZpbGVuYW1lIiwicGF0aCIsInJlc29sdmUiLCJPUyIsIndpbiIsInRvTG93ZXJDYXNlIiwiX2NvbXBpbGVDb2RlIiwiY29kZSIsIm5vcm1hbGl6ZWRGaWxlbmFtZSIsImNhY2hlIiwib3B0cyIsInByb2dyYW0iLCJjcmVhdGVQcm9ncmFtIiwiZ2V0U291cmNlRmlsZXMiLCJzb3VyY2VGaWxlIiwicmVuYW1lZERlcGVuZGVuY2llcyIsImdldFByZUVtaXREaWFnbm9zdGljcyIsImxlbmd0aCIsImVtaXQiLCJvdXRwdXROYW1lIiwicmVzdWx0Iiwid3JpdGVCT00iLCJvbkVycm9yIiwic291cmNlcyIsInNvdXJjZVBhdGgiLCJfZ2V0UmVxdWlyZUNvbXBpbGVycyIsIkVTTmV4dFRlc3RGaWxlQ29tcGlsZXIiLCJwcm90b3R5cGUiLCJjYWxsIiwiZ2V0U3VwcG9ydGVkRXh0ZW5zaW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxNQUFNQSwyQkFBMkIsa0JBQVEsQ0FBQyxDQUFDLFVBQUQsRUFBYUMsbUJBQTZCQyxtQkFBMUMsQ0FBRCxDQUFSLENBQWpDOztBQUVlLE1BQU1DLDBCQUFOLFNBQXlDRixrQkFBekMsQ0FBc0U7QUFDakYsV0FBT0cscUJBQVAsR0FBZ0M7QUFDNUI7QUFDQSxjQUFNQyxLQUFLQyxRQUFRLFlBQVIsQ0FBWDs7QUFFQSxlQUFPO0FBQ0hDLG9DQUF5QixJQUR0QjtBQUVIQyxtQ0FBeUIsSUFGdEI7QUFHSEMscUJBQXlCLElBSHRCO0FBSUhDLG9CQUF5QixJQUp0QjtBQUtIQyw2QkFBeUIsSUFMdEI7QUFNSEMsMkJBQXlCLEtBTnRCO0FBT0hDLG9CQUF5QlIsR0FBR1MsVUFBSCxDQUFjQyxRQVBwQztBQVFIQyxvQkFBeUIsQ0FSdEIsQ0FRd0I7QUFSeEIsY0FTSEMsS0FBeUIsQ0FBQyxjQUFELENBVHRCO0FBVUhDLHFCQUF5QkMsU0FWdEI7QUFXSEMsbUJBQXlCLEVBQUVDLFVBQVUsQ0FBQyxtQ0FBRCxDQUFaLEVBWHRCO0FBWUhDLHFDQUF5QixJQVp0QjtBQWFIQywwQkFBeUI7QUFidEIsU0FBUDtBQWVIOztBQUVELFdBQU9DLGFBQVAsQ0FBc0JDLFdBQXRCLEVBQW1DO0FBQy9CO0FBQ0EsY0FBTXBCLEtBQVNDLFFBQVEsWUFBUixDQUFmO0FBQ0EsWUFBSW9CLFNBQVMsa0NBQWI7O0FBRUFELG9CQUFZRSxPQUFaLENBQW9CQyxLQUFLO0FBQ3JCLGtCQUFNQyxPQUFzQkQsRUFBRUMsSUFBOUI7O0FBRHFCLHdDQUVPQSxLQUFLQyw2QkFBTCxDQUFtQ0YsRUFBRUcsS0FBckMsQ0FGUDs7QUFBQSxrQkFFYkMsSUFGYSx5QkFFYkEsSUFGYTtBQUFBLGtCQUVQQyxTQUZPLHlCQUVQQSxTQUZPOztBQUdyQixrQkFBTUMsVUFBc0I3QixHQUFHOEIsNEJBQUgsQ0FBZ0NQLEVBQUVRLFdBQWxDLEVBQStDLElBQS9DLENBQTVCOztBQUVBVixzQkFBVyxHQUFFRyxLQUFLUSxRQUFTLEtBQUlMLE9BQU8sQ0FBRSxLQUFJQyxZQUFZLENBQUUsTUFBS0MsT0FBUSxJQUF2RTtBQUNILFNBTkQ7O0FBUUEsY0FBTSxJQUFJSSxLQUFKLENBQVVaLE1BQVYsQ0FBTjtBQUNIOztBQUVELFdBQU9hLGtCQUFQLENBQTJCQyxRQUEzQixFQUFxQztBQUNqQ0EsbUJBQVdDLGVBQUtDLE9BQUwsQ0FBYUYsUUFBYixDQUFYOztBQUVBLFlBQUlHLG1CQUFHQyxHQUFQLEVBQ0lKLFdBQVdBLFNBQVNLLFdBQVQsRUFBWDs7QUFFSixlQUFPTCxRQUFQO0FBQ0g7O0FBRURNLGlCQUFjQyxJQUFkLEVBQW9CUCxRQUFwQixFQUE4QjtBQUMxQjtBQUNBLGNBQU1uQyxLQUFLQyxRQUFRLFlBQVIsQ0FBWDs7QUFFQSxjQUFNMEMscUJBQXFCN0MsMkJBQTJCb0Msa0JBQTNCLENBQThDQyxRQUE5QyxDQUEzQjs7QUFFQSxZQUFJLEtBQUtTLEtBQUwsQ0FBV0Qsa0JBQVgsQ0FBSixFQUNJLE9BQU8sS0FBS0MsS0FBTCxDQUFXRCxrQkFBWCxDQUFQOztBQUVKLGNBQU1FLE9BQVUvQywyQkFBMkJDLHFCQUEzQixFQUFoQjtBQUNBLGNBQU0rQyxVQUFVOUMsR0FBRytDLGFBQUgsQ0FBaUIsQ0FBQ1osUUFBRCxDQUFqQixFQUE2QlUsSUFBN0IsQ0FBaEI7O0FBRUFDLGdCQUFRRSxjQUFSLEdBQXlCMUIsT0FBekIsQ0FBaUMyQixjQUFjO0FBQzNDQSx1QkFBV0MsbUJBQVgsR0FBaUN2RCx3QkFBakM7QUFDSCxTQUZEOztBQUlBLGNBQU15QixjQUFjcEIsR0FBR21ELHFCQUFILENBQXlCTCxPQUF6QixDQUFwQjs7QUFFQSxZQUFJMUIsWUFBWWdDLE1BQWhCLEVBQ0l0RCwyQkFBMkJxQixhQUEzQixDQUF5Q0MsV0FBekM7O0FBRUo7QUFDQTtBQUNBO0FBQ0EwQixnQkFBUU8sSUFBUixDQUFhLEtBQUssQ0FBbEIsRUFBcUIsQ0FBQ0MsVUFBRCxFQUFhQyxNQUFiLEVBQXFCQyxRQUFyQixFQUErQkMsT0FBL0IsRUFBd0NDLE9BQXhDLEtBQW9EO0FBQ3JFLGtCQUFNQyxhQUFhN0QsMkJBQTJCb0Msa0JBQTNCLENBQThDd0IsUUFBUSxDQUFSLEVBQVcxQixRQUF6RCxDQUFuQjs7QUFFQSxpQkFBS1ksS0FBTCxDQUFXZSxVQUFYLElBQXlCSixNQUF6QjtBQUNILFNBSkQ7O0FBTUEsZUFBTyxLQUFLWCxLQUFMLENBQVdELGtCQUFYLENBQVA7QUFDSDs7QUFFRGlCLDJCQUF3QjtBQUNwQixlQUFPO0FBQ0gsbUJBQU8sQ0FBQ2xCLElBQUQsRUFBT1AsUUFBUCxLQUFvQixLQUFLTSxZQUFMLENBQWtCQyxJQUFsQixFQUF3QlAsUUFBeEIsQ0FEeEI7QUFFSCxtQkFBTyxDQUFDTyxJQUFELEVBQU9QLFFBQVAsS0FBb0IwQixtQkFBdUJDLFNBQXZCLENBQWlDckIsWUFBakMsQ0FBOENzQixJQUE5QyxDQUFtRCxJQUFuRCxFQUF5RHJCLElBQXpELEVBQStEUCxRQUEvRDtBQUZ4QixTQUFQO0FBSUg7O0FBRUQ2Qiw0QkFBeUI7QUFDckIsZUFBTyxLQUFQO0FBQ0g7QUF6RmdGO2tCQUFoRWxFLDBCIiwiZmlsZSI6ImNvbXBpbGVyL3Rlc3QtZmlsZS9mb3JtYXRzL3R5cGVzY3JpcHQvY29tcGlsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBPUyBmcm9tICdvcy1mYW1pbHknO1xuaW1wb3J0IEFQSUJhc2VkVGVzdEZpbGVDb21waWxlckJhc2UgZnJvbSAnLi4vLi4vYXBpLWJhc2VkJztcbmltcG9ydCBFU05leHRUZXN0RmlsZUNvbXBpbGVyIGZyb20gJy4uL2VzLW5leHQvY29tcGlsZXInO1xuXG5cbmNvbnN0IFJFTkFNRURfREVQRU5ERU5DSUVTX01BUCA9IG5ldyBNYXAoW1sndGVzdGNhZmUnLCBBUElCYXNlZFRlc3RGaWxlQ29tcGlsZXJCYXNlLkVYUE9SVEFCTEVfTElCX1BBVEhdXSk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFR5cGVTY3JpcHRUZXN0RmlsZUNvbXBpbGVyIGV4dGVuZHMgQVBJQmFzZWRUZXN0RmlsZUNvbXBpbGVyQmFzZSB7XG4gICAgc3RhdGljIF9nZXRUeXBlc2NyaXB0T3B0aW9ucyAoKSB7XG4gICAgICAgIC8vIE5PVEU6IGxhenkgbG9hZCB0aGUgY29tcGlsZXJcbiAgICAgICAgY29uc3QgdHMgPSByZXF1aXJlKCd0eXBlc2NyaXB0Jyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRhbERlY29yYXRvcnM6ICB0cnVlLFxuICAgICAgICAgICAgZW1pdERlY29yYXRvck1ldGFkYXRhOiAgIHRydWUsXG4gICAgICAgICAgICBhbGxvd0pzOiAgICAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgIHByZXR0eTogICAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgaW5saW5lU291cmNlTWFwOiAgICAgICAgIHRydWUsXG4gICAgICAgICAgICBub0ltcGxpY2l0QW55OiAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICBtb2R1bGU6ICAgICAgICAgICAgICAgICAgdHMuTW9kdWxlS2luZC5Db21tb25KUyxcbiAgICAgICAgICAgIHRhcmdldDogICAgICAgICAgICAgICAgICAyIC8qIEVTNiAqLyxcbiAgICAgICAgICAgIGxpYjogICAgICAgICAgICAgICAgICAgICBbJ2xpYi5lczYuZC50cyddLFxuICAgICAgICAgICAgYmFzZVVybDogICAgICAgICAgICAgICAgIF9fZGlybmFtZSxcbiAgICAgICAgICAgIHBhdGhzOiAgICAgICAgICAgICAgICAgICB7IHRlc3RjYWZlOiBbJy4uLy4uLy4uLy4uLy4uL3RzLWRlZnMvaW5kZXguZC50cyddIH0sXG4gICAgICAgICAgICBzdXBwcmVzc091dHB1dFBhdGhDaGVjazogdHJ1ZSxcbiAgICAgICAgICAgIHNraXBMaWJDaGVjazogICAgICAgICAgICB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIF9yZXBvcnRFcnJvcnMgKGRpYWdub3N0aWNzKSB7XG4gICAgICAgIC8vIE5PVEU6IGxhenkgbG9hZCB0aGUgY29tcGlsZXJcbiAgICAgICAgY29uc3QgdHMgICAgID0gcmVxdWlyZSgndHlwZXNjcmlwdCcpO1xuICAgICAgICBsZXQgZXJyTXNnID0gJ1R5cGVTY3JpcHQgY29tcGlsYXRpb24gZmFpbGVkLlxcbic7XG5cbiAgICAgICAgZGlhZ25vc3RpY3MuZm9yRWFjaChkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgICAgICAgICAgICAgICAgPSBkLmZpbGU7XG4gICAgICAgICAgICBjb25zdCB7IGxpbmUsIGNoYXJhY3RlciB9ID0gZmlsZS5nZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbihkLnN0YXJ0KTtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgICAgICAgICAgICAgPSB0cy5mbGF0dGVuRGlhZ25vc3RpY01lc3NhZ2VUZXh0KGQubWVzc2FnZVRleHQsICdcXG4nKTtcblxuICAgICAgICAgICAgZXJyTXNnICs9IGAke2ZpbGUuZmlsZU5hbWV9ICgke2xpbmUgKyAxfSwgJHtjaGFyYWN0ZXIgKyAxfSk6ICR7bWVzc2FnZX1cXG5gO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX25vcm1hbGl6ZUZpbGVuYW1lIChmaWxlbmFtZSkge1xuICAgICAgICBmaWxlbmFtZSA9IHBhdGgucmVzb2x2ZShmaWxlbmFtZSk7XG5cbiAgICAgICAgaWYgKE9TLndpbilcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICByZXR1cm4gZmlsZW5hbWU7XG4gICAgfVxuXG4gICAgX2NvbXBpbGVDb2RlIChjb2RlLCBmaWxlbmFtZSkge1xuICAgICAgICAvLyBOT1RFOiBsYXp5IGxvYWQgdGhlIGNvbXBpbGVyXG4gICAgICAgIGNvbnN0IHRzID0gcmVxdWlyZSgndHlwZXNjcmlwdCcpO1xuXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRGaWxlbmFtZSA9IFR5cGVTY3JpcHRUZXN0RmlsZUNvbXBpbGVyLl9ub3JtYWxpemVGaWxlbmFtZShmaWxlbmFtZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuY2FjaGVbbm9ybWFsaXplZEZpbGVuYW1lXSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlW25vcm1hbGl6ZWRGaWxlbmFtZV07XG5cbiAgICAgICAgY29uc3Qgb3B0cyAgICA9IFR5cGVTY3JpcHRUZXN0RmlsZUNvbXBpbGVyLl9nZXRUeXBlc2NyaXB0T3B0aW9ucygpO1xuICAgICAgICBjb25zdCBwcm9ncmFtID0gdHMuY3JlYXRlUHJvZ3JhbShbZmlsZW5hbWVdLCBvcHRzKTtcblxuICAgICAgICBwcm9ncmFtLmdldFNvdXJjZUZpbGVzKCkuZm9yRWFjaChzb3VyY2VGaWxlID0+IHtcbiAgICAgICAgICAgIHNvdXJjZUZpbGUucmVuYW1lZERlcGVuZGVuY2llcyA9IFJFTkFNRURfREVQRU5ERU5DSUVTX01BUDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGlhZ25vc3RpY3MgPSB0cy5nZXRQcmVFbWl0RGlhZ25vc3RpY3MocHJvZ3JhbSk7XG5cbiAgICAgICAgaWYgKGRpYWdub3N0aWNzLmxlbmd0aClcbiAgICAgICAgICAgIFR5cGVTY3JpcHRUZXN0RmlsZUNvbXBpbGVyLl9yZXBvcnRFcnJvcnMoZGlhZ25vc3RpY3MpO1xuXG4gICAgICAgIC8vIE5PVEU6IFRoZSBmaXJzdCBhcmd1bWVudCBvZiBlbWl0KCkgaXMgYSBzb3VyY2UgZmlsZSB0byBiZSBjb21waWxlZC4gSWYgaXQncyB1bmRlZmluZWQsIGFsbCBmaWxlcyBpblxuICAgICAgICAvLyA8cHJvZ3JhbT4gd2lsbCBiZSBjb21waWxlZC4gPHByb2dyYW0+IGNvbnRhaW5zIGEgZmlsZSBzcGVjaWZpZWQgaW4gY3JlYXRlUHJvZ3JhbSgpIHBsdXMgYWxsIGl0cyBkZXBlbmRlbmNpZXMuXG4gICAgICAgIC8vIFRoaXMgbW9kZSBpcyBtdWNoIGZhc3RlciB0aGFuIGNvbXBpbGluZyBmaWxlcyBvbmUtYnktb25lLCBhbmQgaXQgaXMgdXNlZCBpbiB0aGUgdHNjIENMSSBjb21waWxlci5cbiAgICAgICAgcHJvZ3JhbS5lbWl0KHZvaWQgMCwgKG91dHB1dE5hbWUsIHJlc3VsdCwgd3JpdGVCT00sIG9uRXJyb3IsIHNvdXJjZXMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZVBhdGggPSBUeXBlU2NyaXB0VGVzdEZpbGVDb21waWxlci5fbm9ybWFsaXplRmlsZW5hbWUoc291cmNlc1swXS5maWxlTmFtZSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FjaGVbc291cmNlUGF0aF0gPSByZXN1bHQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlW25vcm1hbGl6ZWRGaWxlbmFtZV07XG4gICAgfVxuXG4gICAgX2dldFJlcXVpcmVDb21waWxlcnMgKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJy50cyc6IChjb2RlLCBmaWxlbmFtZSkgPT4gdGhpcy5fY29tcGlsZUNvZGUoY29kZSwgZmlsZW5hbWUpLFxuICAgICAgICAgICAgJy5qcyc6IChjb2RlLCBmaWxlbmFtZSkgPT4gRVNOZXh0VGVzdEZpbGVDb21waWxlci5wcm90b3R5cGUuX2NvbXBpbGVDb2RlLmNhbGwodGhpcywgY29kZSwgZmlsZW5hbWUpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0U3VwcG9ydGVkRXh0ZW5zaW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcudHMnO1xuICAgIH1cbn1cbiJdfQ==
