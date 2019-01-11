'use strict';

exports.__esModule = true;

var _loadBabelLibs3 = require('../../../load-babel-libs');

var _loadBabelLibs4 = _interopRequireDefault(_loadBabelLibs3);

var _apiBased = require('../../api-based');

var _apiBased2 = _interopRequireDefault(_apiBased);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BABEL_RUNTIME_RE = /^babel-runtime(\\|\/|$)/;
const FLOW_MARKER_RE = /^\s*\/\/\s*@flow\s*\n|^\s*\/\*\s*@flow\s*\*\//;

class ESNextTestFileCompiler extends _apiBased2.default {
    static getBabelOptions(filename, code) {
        var _loadBabelLibs = (0, _loadBabelLibs4.default)();

        const presetStage2 = _loadBabelLibs.presetStage2,
              presetFlow = _loadBabelLibs.presetFlow,
              transformRuntime = _loadBabelLibs.transformRuntime,
              transformClassProperties = _loadBabelLibs.transformClassProperties,
              presetEnv = _loadBabelLibs.presetEnv;

        // NOTE: passPrePreset and complex presets is a workaround for https://github.com/babel/babel/issues/2877
        // Fixes https://github.com/DevExpress/testcafe/issues/969

        return {
            passPerPreset: true,
            presets: [{
                passPerPreset: false,
                presets: [{ plugins: [transformRuntime] }, presetStage2, presetEnv]
            }, FLOW_MARKER_RE.test(code) ? {
                passPerPreset: false,
                presets: [{ plugins: [transformClassProperties] }, presetFlow]
            } : {}],
            filename: filename,
            retainLines: true,
            sourceMaps: 'inline',
            ast: false,
            babelrc: false,
            highlightCode: false,

            resolveModuleSource: source => {
                if (source === 'testcafe') return _apiBased2.default.EXPORTABLE_LIB_PATH;

                if (BABEL_RUNTIME_RE.test(source)) {
                    try {
                        return require.resolve(source);
                    } catch (err) {
                        return source;
                    }
                }

                return source;
            }
        };
    }

    _compileCode(code, filename) {
        var _loadBabelLibs2 = (0, _loadBabelLibs4.default)();

        const babel = _loadBabelLibs2.babel;


        if (this.cache[filename]) return this.cache[filename];

        const opts = ESNextTestFileCompiler.getBabelOptions(filename, code);
        const compiled = babel.transform(code, opts);

        this.cache[filename] = compiled.code;

        return compiled.code;
    }

    _getRequireCompilers() {
        return { '.js': (code, filename) => this._compileCode(code, filename) };
    }

    getSupportedExtension() {
        return '.js';
    }
}
exports.default = ESNextTestFileCompiler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlci90ZXN0LWZpbGUvZm9ybWF0cy9lcy1uZXh0L2NvbXBpbGVyLmpzIl0sIm5hbWVzIjpbIkJBQkVMX1JVTlRJTUVfUkUiLCJGTE9XX01BUktFUl9SRSIsIkVTTmV4dFRlc3RGaWxlQ29tcGlsZXIiLCJBUElCYXNlZFRlc3RGaWxlQ29tcGlsZXJCYXNlIiwiZ2V0QmFiZWxPcHRpb25zIiwiZmlsZW5hbWUiLCJjb2RlIiwicHJlc2V0U3RhZ2UyIiwicHJlc2V0RmxvdyIsInRyYW5zZm9ybVJ1bnRpbWUiLCJ0cmFuc2Zvcm1DbGFzc1Byb3BlcnRpZXMiLCJwcmVzZXRFbnYiLCJwYXNzUGVyUHJlc2V0IiwicHJlc2V0cyIsInBsdWdpbnMiLCJ0ZXN0IiwicmV0YWluTGluZXMiLCJzb3VyY2VNYXBzIiwiYXN0IiwiYmFiZWxyYyIsImhpZ2hsaWdodENvZGUiLCJyZXNvbHZlTW9kdWxlU291cmNlIiwic291cmNlIiwiRVhQT1JUQUJMRV9MSUJfUEFUSCIsInJlcXVpcmUiLCJyZXNvbHZlIiwiZXJyIiwiX2NvbXBpbGVDb2RlIiwiYmFiZWwiLCJjYWNoZSIsIm9wdHMiLCJjb21waWxlZCIsInRyYW5zZm9ybSIsIl9nZXRSZXF1aXJlQ29tcGlsZXJzIiwiZ2V0U3VwcG9ydGVkRXh0ZW5zaW9uIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTUEsbUJBQW1CLHlCQUF6QjtBQUNBLE1BQU1DLGlCQUFtQiwrQ0FBekI7O0FBRWUsTUFBTUMsc0JBQU4sU0FBcUNDLGtCQUFyQyxDQUFrRTtBQUM3RSxXQUFPQyxlQUFQLENBQXdCQyxRQUF4QixFQUFrQ0MsSUFBbEMsRUFBd0M7QUFBQSw2QkFDd0QsOEJBRHhEOztBQUFBLGNBQzVCQyxZQUQ0QixrQkFDNUJBLFlBRDRCO0FBQUEsY0FDZEMsVUFEYyxrQkFDZEEsVUFEYztBQUFBLGNBQ0ZDLGdCQURFLGtCQUNGQSxnQkFERTtBQUFBLGNBQ2dCQyx3QkFEaEIsa0JBQ2dCQSx3QkFEaEI7QUFBQSxjQUMwQ0MsU0FEMUMsa0JBQzBDQSxTQUQxQzs7QUFHcEM7QUFDQTs7QUFDQSxlQUFPO0FBQ0hDLDJCQUFlLElBRFo7QUFFSEMscUJBQWUsQ0FDWDtBQUNJRCwrQkFBZSxLQURuQjtBQUVJQyx5QkFBZSxDQUFDLEVBQUVDLFNBQVMsQ0FBQ0wsZ0JBQUQsQ0FBWCxFQUFELEVBQWtDRixZQUFsQyxFQUFnREksU0FBaEQ7QUFGbkIsYUFEVyxFQUtYVixlQUFlYyxJQUFmLENBQW9CVCxJQUFwQixJQUE0QjtBQUN4Qk0sK0JBQWUsS0FEUztBQUV4QkMseUJBQWUsQ0FBQyxFQUFFQyxTQUFTLENBQUNKLHdCQUFELENBQVgsRUFBRCxFQUEwQ0YsVUFBMUM7QUFGUyxhQUE1QixHQUdJLEVBUk8sQ0FGWjtBQVlISCxzQkFBZUEsUUFaWjtBQWFIVyx5QkFBZSxJQWJaO0FBY0hDLHdCQUFlLFFBZFo7QUFlSEMsaUJBQWUsS0FmWjtBQWdCSEMscUJBQWUsS0FoQlo7QUFpQkhDLDJCQUFlLEtBakJaOztBQW1CSEMsaUNBQXFCQyxVQUFVO0FBQzNCLG9CQUFJQSxXQUFXLFVBQWYsRUFDSSxPQUFPbkIsbUJBQTZCb0IsbUJBQXBDOztBQUVKLG9CQUFJdkIsaUJBQWlCZSxJQUFqQixDQUFzQk8sTUFBdEIsQ0FBSixFQUFtQztBQUMvQix3QkFBSTtBQUNBLCtCQUFPRSxRQUFRQyxPQUFSLENBQWdCSCxNQUFoQixDQUFQO0FBQ0gscUJBRkQsQ0FHQSxPQUFPSSxHQUFQLEVBQVk7QUFDUiwrQkFBT0osTUFBUDtBQUNIO0FBQ0o7O0FBRUQsdUJBQU9BLE1BQVA7QUFDSDtBQWpDRSxTQUFQO0FBbUNIOztBQUVESyxpQkFBY3JCLElBQWQsRUFBb0JELFFBQXBCLEVBQThCO0FBQUEsOEJBQ1IsOEJBRFE7O0FBQUEsY0FDbEJ1QixLQURrQixtQkFDbEJBLEtBRGtCOzs7QUFHMUIsWUFBSSxLQUFLQyxLQUFMLENBQVd4QixRQUFYLENBQUosRUFDSSxPQUFPLEtBQUt3QixLQUFMLENBQVd4QixRQUFYLENBQVA7O0FBRUosY0FBTXlCLE9BQVc1Qix1QkFBdUJFLGVBQXZCLENBQXVDQyxRQUF2QyxFQUFpREMsSUFBakQsQ0FBakI7QUFDQSxjQUFNeUIsV0FBV0gsTUFBTUksU0FBTixDQUFnQjFCLElBQWhCLEVBQXNCd0IsSUFBdEIsQ0FBakI7O0FBRUEsYUFBS0QsS0FBTCxDQUFXeEIsUUFBWCxJQUF1QjBCLFNBQVN6QixJQUFoQzs7QUFFQSxlQUFPeUIsU0FBU3pCLElBQWhCO0FBQ0g7O0FBRUQyQiwyQkFBd0I7QUFDcEIsZUFBTyxFQUFFLE9BQU8sQ0FBQzNCLElBQUQsRUFBT0QsUUFBUCxLQUFvQixLQUFLc0IsWUFBTCxDQUFrQnJCLElBQWxCLEVBQXdCRCxRQUF4QixDQUE3QixFQUFQO0FBQ0g7O0FBRUQ2Qiw0QkFBeUI7QUFDckIsZUFBTyxLQUFQO0FBQ0g7QUEvRDRFO2tCQUE1RGhDLHNCIiwiZmlsZSI6ImNvbXBpbGVyL3Rlc3QtZmlsZS9mb3JtYXRzL2VzLW5leHQvY29tcGlsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9hZEJhYmVsTGlicyBmcm9tICcuLi8uLi8uLi9sb2FkLWJhYmVsLWxpYnMnO1xuaW1wb3J0IEFQSUJhc2VkVGVzdEZpbGVDb21waWxlckJhc2UgZnJvbSAnLi4vLi4vYXBpLWJhc2VkJztcblxuY29uc3QgQkFCRUxfUlVOVElNRV9SRSA9IC9eYmFiZWwtcnVudGltZShcXFxcfFxcL3wkKS87XG5jb25zdCBGTE9XX01BUktFUl9SRSAgID0gL15cXHMqXFwvXFwvXFxzKkBmbG93XFxzKlxcbnxeXFxzKlxcL1xcKlxccypAZmxvd1xccypcXCpcXC8vO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFU05leHRUZXN0RmlsZUNvbXBpbGVyIGV4dGVuZHMgQVBJQmFzZWRUZXN0RmlsZUNvbXBpbGVyQmFzZSB7XG4gICAgc3RhdGljIGdldEJhYmVsT3B0aW9ucyAoZmlsZW5hbWUsIGNvZGUpIHtcbiAgICAgICAgY29uc3QgeyBwcmVzZXRTdGFnZTIsIHByZXNldEZsb3csIHRyYW5zZm9ybVJ1bnRpbWUsIHRyYW5zZm9ybUNsYXNzUHJvcGVydGllcywgcHJlc2V0RW52IH0gPSBsb2FkQmFiZWxMaWJzKCk7XG5cbiAgICAgICAgLy8gTk9URTogcGFzc1ByZVByZXNldCBhbmQgY29tcGxleCBwcmVzZXRzIGlzIGEgd29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL2lzc3Vlcy8yODc3XG4gICAgICAgIC8vIEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9EZXZFeHByZXNzL3Rlc3RjYWZlL2lzc3Vlcy85NjlcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhc3NQZXJQcmVzZXQ6IHRydWUsXG4gICAgICAgICAgICBwcmVzZXRzOiAgICAgICBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwYXNzUGVyUHJlc2V0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcHJlc2V0czogICAgICAgW3sgcGx1Z2luczogW3RyYW5zZm9ybVJ1bnRpbWVdIH0sIHByZXNldFN0YWdlMiwgcHJlc2V0RW52XVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgRkxPV19NQVJLRVJfUkUudGVzdChjb2RlKSA/IHtcbiAgICAgICAgICAgICAgICAgICAgcGFzc1BlclByZXNldDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHByZXNldHM6ICAgICAgIFt7IHBsdWdpbnM6IFt0cmFuc2Zvcm1DbGFzc1Byb3BlcnRpZXNdIH0sIHByZXNldEZsb3ddXG4gICAgICAgICAgICAgICAgfSA6IHt9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZmlsZW5hbWU6ICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgICByZXRhaW5MaW5lczogICB0cnVlLFxuICAgICAgICAgICAgc291cmNlTWFwczogICAgJ2lubGluZScsXG4gICAgICAgICAgICBhc3Q6ICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIGJhYmVscmM6ICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgaGlnaGxpZ2h0Q29kZTogZmFsc2UsXG5cbiAgICAgICAgICAgIHJlc29sdmVNb2R1bGVTb3VyY2U6IHNvdXJjZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZSA9PT0gJ3Rlc3RjYWZlJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFQSUJhc2VkVGVzdEZpbGVDb21waWxlckJhc2UuRVhQT1JUQUJMRV9MSUJfUEFUSDtcblxuICAgICAgICAgICAgICAgIGlmIChCQUJFTF9SVU5USU1FX1JFLnRlc3Qoc291cmNlKSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmUucmVzb2x2ZShzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9jb21waWxlQ29kZSAoY29kZSwgZmlsZW5hbWUpIHtcbiAgICAgICAgY29uc3QgeyBiYWJlbCB9ID0gbG9hZEJhYmVsTGlicygpO1xuXG4gICAgICAgIGlmICh0aGlzLmNhY2hlW2ZpbGVuYW1lXSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlW2ZpbGVuYW1lXTtcblxuICAgICAgICBjb25zdCBvcHRzICAgICA9IEVTTmV4dFRlc3RGaWxlQ29tcGlsZXIuZ2V0QmFiZWxPcHRpb25zKGZpbGVuYW1lLCBjb2RlKTtcbiAgICAgICAgY29uc3QgY29tcGlsZWQgPSBiYWJlbC50cmFuc2Zvcm0oY29kZSwgb3B0cyk7XG5cbiAgICAgICAgdGhpcy5jYWNoZVtmaWxlbmFtZV0gPSBjb21waWxlZC5jb2RlO1xuXG4gICAgICAgIHJldHVybiBjb21waWxlZC5jb2RlO1xuICAgIH1cblxuICAgIF9nZXRSZXF1aXJlQ29tcGlsZXJzICgpIHtcbiAgICAgICAgcmV0dXJuIHsgJy5qcyc6IChjb2RlLCBmaWxlbmFtZSkgPT4gdGhpcy5fY29tcGlsZUNvZGUoY29kZSwgZmlsZW5hbWUpIH07XG4gICAgfVxuXG4gICAgZ2V0U3VwcG9ydGVkRXh0ZW5zaW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcuanMnO1xuICAgIH1cbn1cbiJdfQ==
