'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _indentString = require('indent-string');

var _indentString2 = _interopRequireDefault(_indentString);

var _lodash = require('lodash');

var _momentLoader = require('../utils/moment-loader');

var _momentLoader2 = _interopRequireDefault(_momentLoader);

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _string = require('../utils/string');

var _getViewportWidth = require('../utils/get-viewport-width');

var _getViewportWidth2 = _interopRequireDefault(_getViewportWidth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: we should not expose internal state to
// the plugin, to avoid accidental rewrites.
// Therefore we use symbols to store them.

/*global Symbol*/
const stream = (0, _symbol2.default)();
const wordWrapEnabled = (0, _symbol2.default)();
const indent = (0, _symbol2.default)();
const errorDecorator = (0, _symbol2.default)();

class ReporterPluginHost {
    constructor(plugin, outStream) {
        this[stream] = outStream || process.stdout;
        this[wordWrapEnabled] = false;
        this[indent] = 0;

        const useColors = this[stream] === process.stdout && _chalk2.default.enabled && !plugin.noColors;

        this.chalk = new _chalk2.default.constructor({ enabled: useColors });
        this.moment = _momentLoader2.default;
        this.viewportWidth = (0, _getViewportWidth2.default)(this[stream]);

        this.symbols = _osFamily2.default.win ? { ok: '√', err: '×' } : { ok: '✓', err: '✖' };

        (0, _lodash.assignIn)(this, plugin);

        this[errorDecorator] = this.createErrorDecorator();
    }

    // Error decorator
    createErrorDecorator() {
        return {
            'span user-agent': str => this.chalk.grey(str),

            'span subtitle': str => `- ${this.chalk.bold.red(str)} -`,
            'div message': str => this.chalk.bold.red(str),

            'div screenshot-info': _lodash.identity,
            'a screenshot-path': str => this.chalk.grey.underline(str),

            'code': _lodash.identity,

            'span syntax-string': str => this.chalk.green(str),
            'span syntax-punctuator': str => this.chalk.grey(str),
            'span syntax-keyword': str => this.chalk.cyan(str),
            'span syntax-number': str => this.chalk.magenta(str),
            'span syntax-regex': str => this.chalk.magenta(str),
            'span syntax-comment': str => this.chalk.grey.bold(str),
            'span syntax-invalid': str => this.chalk.inverse(str),

            'div code-frame': _lodash.identity,
            'div code-line': str => str + '\n',
            'div code-line-last': _lodash.identity,
            'div code-line-num': str => `   ${str} |`,
            'div code-line-num-base': str => this.chalk.bgRed(` > ${str} `) + '|',
            'div code-line-src': _lodash.identity,

            'div stack': str => '\n\n' + str,
            'div stack-line': str => str + '\n',
            'div stack-line-last': _lodash.identity,
            'div stack-line-name': str => `   at ${this.chalk.bold(str)}`,
            'div stack-line-location': str => ` (${this.chalk.grey.underline(str)})`,

            'strong': str => this.chalk.bold(str),
            'a': str => `"${this.chalk.underline(str)}"`
        };
    }

    // String helpers
    indentString(str, indentVal) {
        return (0, _indentString2.default)(str, ' ', indentVal);
    }

    wordWrap(str, indentVal, width) {
        return (0, _string.wordWrap)(str, indentVal, width);
    }

    escapeHtml(str) {
        return (0, _lodash.escape)(str);
    }

    formatError(err, prefix = '') {
        const prefixLengthWithoutColors = (0, _string.removeTTYColors)(prefix).length;
        const maxMsgLength = this.viewportWidth - this[indent] - prefixLengthWithoutColors;
        let msg = err.formatMessage(this[errorDecorator], maxMsgLength);

        if (this[wordWrapEnabled]) msg = this.wordWrap(msg, prefixLengthWithoutColors, maxMsgLength);else msg = this.indentString(msg, prefixLengthWithoutColors);

        return prefix + msg.substr(prefixLengthWithoutColors);
    }

    // Writing helpers
    newline() {
        this[stream].write('\n');

        return this;
    }

    write(text) {
        if (this[wordWrapEnabled]) text = this.wordWrap(text, this[indent], this.viewportWidth);else text = this.indentString(text, this[indent]);

        this[stream].write(text);

        return this;
    }

    useWordWrap(use) {
        this[wordWrapEnabled] = use;

        return this;
    }

    setIndent(val) {
        this[indent] = val;

        return this;
    }

    // Abstract methods implemented in plugin
    reportTaskStart() /* startTime, userAgents, testCount */{
        return (0, _asyncToGenerator3.default)(function* () {
            throw new Error('Not implemented');
        })();
    }

    reportFixtureStart() /* name, path */{
        return (0, _asyncToGenerator3.default)(function* () {
            throw new Error('Not implemented');
        })();
    }

    reportTestDone() /* name, testRunInfo */{
        return (0, _asyncToGenerator3.default)(function* () {
            throw new Error('Not implemented');
        })();
    }

    reportTaskDone() /* endTime, passed, warnings */{
        return (0, _asyncToGenerator3.default)(function* () {
            throw new Error('Not implemented');
        })();
    }
}
exports.default = ReporterPluginHost;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvcnRlci9wbHVnaW4taG9zdC5qcyJdLCJuYW1lcyI6WyJzdHJlYW0iLCJ3b3JkV3JhcEVuYWJsZWQiLCJpbmRlbnQiLCJlcnJvckRlY29yYXRvciIsIlJlcG9ydGVyUGx1Z2luSG9zdCIsImNvbnN0cnVjdG9yIiwicGx1Z2luIiwib3V0U3RyZWFtIiwicHJvY2VzcyIsInN0ZG91dCIsInVzZUNvbG9ycyIsImNoYWxrIiwiZW5hYmxlZCIsIm5vQ29sb3JzIiwibW9tZW50Iiwidmlld3BvcnRXaWR0aCIsInN5bWJvbHMiLCJPUyIsIndpbiIsIm9rIiwiZXJyIiwiY3JlYXRlRXJyb3JEZWNvcmF0b3IiLCJzdHIiLCJncmV5IiwiYm9sZCIsInJlZCIsImlkZW50aXR5IiwidW5kZXJsaW5lIiwiZ3JlZW4iLCJjeWFuIiwibWFnZW50YSIsImludmVyc2UiLCJiZ1JlZCIsImluZGVudFN0cmluZyIsImluZGVudFZhbCIsIndvcmRXcmFwIiwid2lkdGgiLCJlc2NhcGVIdG1sIiwiZm9ybWF0RXJyb3IiLCJwcmVmaXgiLCJwcmVmaXhMZW5ndGhXaXRob3V0Q29sb3JzIiwibGVuZ3RoIiwibWF4TXNnTGVuZ3RoIiwibXNnIiwiZm9ybWF0TWVzc2FnZSIsInN1YnN0ciIsIm5ld2xpbmUiLCJ3cml0ZSIsInRleHQiLCJ1c2VXb3JkV3JhcCIsInVzZSIsInNldEluZGVudCIsInZhbCIsInJlcG9ydFRhc2tTdGFydCIsIkVycm9yIiwicmVwb3J0Rml4dHVyZVN0YXJ0IiwicmVwb3J0VGVzdERvbmUiLCJyZXBvcnRUYXNrRG9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTUEsU0FBa0IsdUJBQXhCO0FBQ0EsTUFBTUMsa0JBQWtCLHVCQUF4QjtBQUNBLE1BQU1DLFNBQWtCLHVCQUF4QjtBQUNBLE1B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c291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCBpbmRlbnRTdHJpbmcgZnJvbSAnaW5kZW50LXN0cmluZyc7XG5pbXBvcnQgeyBpZGVudGl0eSwgZXNjYXBlIGFzIGVzY2FwZUh0bWwsIGFzc2lnbkluIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBtb21lbnQgZnJvbSAnLi4vdXRpbHMvbW9tZW50LWxvYWRlcic7XG5pbXBvcnQgT1MgZnJvbSAnb3MtZmFtaWx5JztcbmltcG9ydCB7IHdvcmRXcmFwLCByZW1vdmVUVFlDb2xvcnMgfSBmcm9tICcuLi91dGlscy9zdHJpbmcnO1xuaW1wb3J0IGdldFZpZXdwb3J0V2lkdGggZnJvbSAnLi4vdXRpbHMvZ2V0LXZpZXdwb3J0LXdpZHRoJztcblxuLy8gTk9URTogd2Ugc2hvdWxkIG5vdCBleHBvc2UgaW50ZXJuYWwgc3RhdGUgdG9cbi8vIHRoZSBwbHVnaW4sIHRvIGF2b2lkIGFjY2lkZW50YWwgcmV3cml0ZXMuXG4vLyBUaGVyZWZvcmUgd2UgdXNlIHN5bWJvbHMgdG8gc3RvcmUgdGhlbS5cblxuLypnbG9iYWwgU3ltYm9sKi9cbmNvbnN0IHN0cmVhbSAgICAgICAgICA9IFN5bWJvbCgpO1xuY29uc3Qgd29yZFdyYXBFbmFibGVkID0gU3ltYm9sKCk7XG5jb25zdCBpbmRlbnQgICAgICAgICAgPSBTeW1ib2woKTtcbmNvbnN0IGVycm9yRGVjb3JhdG9yICA9IFN5bWJvbCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXBvcnRlclBsdWdpbkhvc3Qge1xuICAgIGNvbnN0cnVjdG9yIChwbHVnaW4sIG91dFN0cmVhbSkge1xuICAgICAgICB0aGlzW3N0cmVhbV0gICAgICAgICAgPSBvdXRTdHJlYW0gfHwgcHJvY2Vzcy5zdGRvdXQ7XG4gICAgICAgIHRoaXNbd29yZFdyYXBFbmFibGVkXSA9IGZhbHNlO1xuICAgICAgICB0aGlzW2luZGVudF0gICAgICAgICAgPSAwO1xuXG4gICAgICAgIGNvbnN0IHVzZUNvbG9ycyA9IHRoaXNbc3RyZWFtXSA9PT0gcHJvY2Vzcy5zdGRvdXQgJiYgY2hhbGsuZW5hYmxlZCAmJiAhcGx1Z2luLm5vQ29sb3JzO1xuXG4gICAgICAgIHRoaXMuY2hhbGsgICAgICAgICA9IG5ldyBjaGFsay5jb25zdHJ1Y3Rvcih7IGVuYWJsZWQ6IHVzZUNvbG9ycyB9KTtcbiAgICAgICAgdGhpcy5tb21lbnQgICAgICAgID0gbW9tZW50O1xuICAgICAgICB0aGlzLnZpZXdwb3J0V2lkdGggPSBnZXRWaWV3cG9ydFdpZHRoKHRoaXNbc3RyZWFtXSk7XG5cbiAgICAgICAgdGhpcy5zeW1ib2xzID0gT1Mud2luID9cbiAgICAgICAgICAgIHsgb2s6ICfiiJonLCBlcnI6ICfDlycgfSA6XG4gICAgICAgICAgICB7IG9rOiAn4pyTJywgZXJyOiAn4pyWJyB9O1xuXG4gICAgICAgIGFzc2lnbkluKHRoaXMsIHBsdWdpbik7XG5cbiAgICAgICAgdGhpc1tlcnJvckRlY29yYXRvcl0gPSB0aGlzLmNyZWF0ZUVycm9yRGVjb3JhdG9yKCk7XG4gICAgfVxuXG4gICAgLy8gRXJyb3IgZGVjb3JhdG9yXG4gICAgY3JlYXRlRXJyb3JEZWNvcmF0b3IgKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3NwYW4gdXNlci1hZ2VudCc6IHN0ciA9PiB0aGlzLmNoYWxrLmdyZXkoc3RyKSxcblxuICAgICAgICAgICAgJ3NwYW4gc3VidGl0bGUnOiBzdHIgPT4gYC0gJHt0aGlzLmNoYWxrLmJvbGQucmVkKHN0cil9IC1gLFxuICAgICAgICAgICAgJ2RpdiBtZXNzYWdlJzogICBzdHIgPT4gdGhpcy5jaGFsay5ib2xkLnJlZChzdHIpLFxuXG4gICAgICAgICAgICAnZGl2IHNjcmVlbnNob3QtaW5mbyc6IGlkZW50aXR5LFxuICAgICAgICAgICAgJ2Egc2NyZWVuc2hvdC1wYXRoJzogICBzdHIgPT4gdGhpcy5jaGFsay5ncmV5LnVuZGVybGluZShzdHIpLFxuXG4gICAgICAgICAgICAnY29kZSc6IGlkZW50aXR5LFxuXG4gICAgICAgICAgICAnc3BhbiBzeW50YXgtc3RyaW5nJzogICAgIHN0ciA9PiB0aGlzLmNoYWxrLmdyZWVuKHN0ciksXG4gICAgICAgICAgICAnc3BhbiBzeW50YXgtcHVuY3R1YXRvcic6IHN0ciA9PiB0aGlzLmNoYWxrLmdyZXkoc3RyKSxcbiAgICAgICAgICAgICdzcGFuIHN5bnRheC1rZXl3b3JkJzogICAgc3RyID0+IHRoaXMuY2hhbGsuY3lhbihzdHIpLFxuICAgICAgICAgICAgJ3NwYW4gc3ludGF4LW51bWJlcic6ICAgICBzdHIgPT4gdGhpcy5jaGFsay5tYWdlbnRhKHN0ciksXG4gICAgICAgICAgICAnc3BhbiBzeW50YXgtcmVnZXgnOiAgICAgIHN0ciA9PiB0aGlzLmNoYWxrLm1hZ2VudGEoc3RyKSxcbiAgICAgICAgICAgICdzcGFuIHN5bnRheC1jb21tZW50JzogICAgc3RyID0+IHRoaXMuY2hhbGsuZ3JleS5ib2xkKHN0ciksXG4gICAgICAgICAgICAnc3BhbiBzeW50YXgtaW52YWxpZCc6ICAgIHN0ciA9PiB0aGlzLmNoYWxrLmludmVyc2Uoc3RyKSxcblxuICAgICAgICAgICAgJ2RpdiBjb2RlLWZyYW1lJzogICAgICAgICBpZGVudGl0eSxcbiAgICAgICAgICAgICdkaXYgY29kZS1saW5lJzogICAgICAgICAgc3RyID0+IHN0ciArICdcXG4nLFxuICAgICAgICAgICAgJ2RpdiBjb2RlLWxpbmUtbGFzdCc6ICAgICBpZGVudGl0eSxcbiAgICAgICAgICAgICdkaXYgY29kZS1saW5lLW51bSc6ICAgICAgc3RyID0+IGAgICAke3N0cn0gfGAsXG4gICAgICAgICAgICAnZGl2IGNvZGUtbGluZS1udW0tYmFzZSc6IHN0ciA9PiB0aGlzLmNoYWxrLmJnUmVkKGAgPiAke3N0cn0gYCkgKyAnfCcsXG4gICAgICAgICAgICAnZGl2IGNvZGUtbGluZS1zcmMnOiAgICAgIGlkZW50aXR5LFxuXG4gICAgICAgICAgICAnZGl2IHN0YWNrJzogICAgICAgICAgICAgICBzdHIgPT4gJ1xcblxcbicgKyBzdHIsXG4gICAgICAgICAgICAnZGl2IHN0YWNrLWxpbmUnOiAgICAgICAgICBzdHIgPT4gc3RyICsgJ1xcbicsXG4gICAgICAgICAgICAnZGl2IHN0YWNrLWxpbmUtbGFzdCc6ICAgICBpZGVudGl0eSxcbiAgICAgICAgICAgICdkaXYgc3RhY2stbGluZS1uYW1lJzogICAgIHN0ciA9PiBgICAgYXQgJHt0aGlzLmNoYWxrLmJvbGQoc3RyKX1gLFxuICAgICAgICAgICAgJ2RpdiBzdGFjay1saW5lLWxvY2F0aW9uJzogc3RyID0+IGAgKCR7dGhpcy5jaGFsay5ncmV5LnVuZGVybGluZShzdHIpfSlgLFxuXG4gICAgICAgICAgICAnc3Ryb25nJzogc3RyID0+IHRoaXMuY2hhbGsuYm9sZChzdHIpLFxuICAgICAgICAgICAgJ2EnOiAgICAgIHN0ciA9PiBgXCIke3RoaXMuY2hhbGsudW5kZXJsaW5lKHN0cil9XCJgXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gU3RyaW5nIGhlbHBlcnNcbiAgICBpbmRlbnRTdHJpbmcgKHN0ciwgaW5kZW50VmFsKSB7XG4gICAgICAgIHJldHVybiBpbmRlbnRTdHJpbmcoc3RyLCAnICcsIGluZGVudFZhbCk7XG4gICAgfVxuXG4gICAgd29yZFdyYXAgKHN0ciwgaW5kZW50VmFsLCB3aWR0aCkge1xuICAgICAgICByZXR1cm4gd29yZFdyYXAoc3RyLCBpbmRlbnRWYWwsIHdpZHRoKTtcbiAgICB9XG5cbiAgICBlc2NhcGVIdG1sIChzdHIpIHtcbiAgICAgICAgcmV0dXJuIGVzY2FwZUh0bWwoc3RyKTtcbiAgICB9XG5cbiAgICBmb3JtYXRFcnJvciAoZXJyLCBwcmVmaXggPSAnJykge1xuICAgICAgICBjb25zdCBwcmVmaXhMZW5ndGhXaXRob3V0Q29sb3JzID0gcmVtb3ZlVFRZQ29sb3JzKHByZWZpeCkubGVuZ3RoO1xuICAgICAgICBjb25zdCBtYXhNc2dMZW5ndGggICAgICAgICAgICAgID0gdGhpcy52aWV3cG9ydFdpZHRoIC0gdGhpc1tpbmRlbnRdIC0gcHJlZml4TGVuZ3RoV2l0aG91dENvbG9ycztcbiAgICAgICAgbGV0IG1zZyAgICAgICAgICAgICAgICAgICAgICAgICA9IGVyci5mb3JtYXRNZXNzYWdlKHRoaXNbZXJyb3JEZWNvcmF0b3JdLCBtYXhNc2dMZW5ndGgpO1xuXG4gICAgICAgIGlmICh0aGlzW3dvcmRXcmFwRW5hYmxlZF0pXG4gICAgICAgICAgICBtc2cgPSB0aGlzLndvcmRXcmFwKG1zZywgcHJlZml4TGVuZ3RoV2l0aG91dENvbG9ycywgbWF4TXNnTGVuZ3RoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbXNnID0gdGhpcy5pbmRlbnRTdHJpbmcobXNnLCBwcmVmaXhMZW5ndGhXaXRob3V0Q29sb3JzKTtcblxuICAgICAgICByZXR1cm4gcHJlZml4ICsgbXNnLnN1YnN0cihwcmVmaXhMZW5ndGhXaXRob3V0Q29sb3JzKTtcbiAgICB9XG5cblxuICAgIC8vIFdyaXRpbmcgaGVscGVyc1xuICAgIG5ld2xpbmUgKCkge1xuICAgICAgICB0aGlzW3N0cmVhbV0ud3JpdGUoJ1xcbicpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHdyaXRlICh0ZXh0KSB7XG4gICAgICAgIGlmICh0aGlzW3dvcmRXcmFwRW5hYmxlZF0pXG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy53b3JkV3JhcCh0ZXh0LCB0aGlzW2luZGVudF0sIHRoaXMudmlld3BvcnRXaWR0aCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLmluZGVudFN0cmluZyh0ZXh0LCB0aGlzW2luZGVudF0pO1xuXG4gICAgICAgIHRoaXNbc3RyZWFtXS53cml0ZSh0ZXh0KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1c2VXb3JkV3JhcCAodXNlKSB7XG4gICAgICAgIHRoaXNbd29yZFdyYXBFbmFibGVkXSA9IHVzZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRJbmRlbnQgKHZhbCkge1xuICAgICAgICB0aGlzW2luZGVudF0gPSB2YWw7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG5cbiAgICAvLyBBYnN0cmFjdCBtZXRob2RzIGltcGxlbWVudGVkIGluIHBsdWdpblxuICAgIGFzeW5jIHJlcG9ydFRhc2tTdGFydCAoLyogc3RhcnRUaW1lLCB1c2VyQWdlbnRzLCB0ZXN0Q291bnQgKi8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBhc3luYyByZXBvcnRGaXh0dXJlU3RhcnQgKC8qIG5hbWUsIHBhdGggKi8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBhc3luYyByZXBvcnRUZXN0RG9uZSAoLyogbmFtZSwgdGVzdFJ1bkluZm8gKi8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBhc3luYyByZXBvcnRUYXNrRG9uZSAoLyogZW5kVGltZSwgcGFzc2VkLCB3YXJuaW5ncyAqLykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cbn1cbiJdfQ==
