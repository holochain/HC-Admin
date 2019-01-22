'use strict';

exports.__esModule = true;

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
        throw new Error('Not implemented');
    }

    reportFixtureStart() /* name, path */{
        throw new Error('Not implemented');
    }

    reportTestDone() /* name, testRunInfo */{
        throw new Error('Not implemented');
    }

    reportTaskDone() /* endTime, passed, warnings */{
        throw new Error('Not implemented');
    }
}
exports.default = ReporterPluginHost;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvcnRlci9wbHVnaW4taG9zdC5qcyJdLCJuYW1lcyI6WyJzdHJlYW0iLCJ3b3JkV3JhcEVuYWJsZWQiLCJpbmRlbnQiLCJlcnJvckRlY29yYXRvciIsIlJlcG9ydGVyUGx1Z2luSG9zdCIsImNvbnN0cnVjdG9yIiwicGx1Z2luIiwib3V0U3RyZWFtIiwicHJvY2VzcyIsInN0ZG91dCIsInVzZUNvbG9ycyIsImNoYWxrIiwiZW5hYmxlZCIsIm5vQ29sb3JzIiwibW9tZW50Iiwidmlld3BvcnRXaWR0aCIsInN5bWJvbHMiLCJPUyIsIndpbiIsIm9rIiwiZXJyIiwiY3JlYXRlRXJyb3JEZWNvcmF0b3IiLCJzdHIiLCJncmV5IiwiYm9sZCIsInJlZCIsImlkZW50aXR5IiwidW5kZXJsaW5lIiwiZ3JlZW4iLCJjeWFuIiwibWFnZW50YSIsImludmVyc2UiLCJiZ1JlZCIsImluZGVudFN0cmluZyIsImluZGVudFZhbCIsIndvcmRXcmFwIiwid2lkdGgiLCJlc2NhcGVIdG1sIiwiZm9ybWF0RXJyb3IiLCJwcmVmaXgiLCJwcmVmaXhMZW5ndGhXaXRob3V0Q29sb3JzIiwibGVuZ3RoIiwibWF4TXNnTGVuZ3RoIiwibXNnIiwiZm9ybWF0TWVzc2FnZSIsInN1YnN0ciIsIm5ld2xpbmUiLCJ3cml0ZSIsInRleHQiLCJ1c2VXb3JkV3JhcCIsInVzZSIsInNldEluZGVudCIsInZhbCIsInJlcG9ydFRhc2tTdGFydCIsIkVycm9yIiwicmVwb3J0Rml4dHVyZVN0YXJ0IiwicmVwb3J0VGVzdERvbmUiLCJyZXBvcnRUYXNrRG9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNQSxTQUFrQix1QkFBeEI7QUFDQSxNQUFNQyxrQkFBa0IsdUJBQXhCO0FBQ0EsTUFBTUMsU0FBa0IsdUJBQXhCO0FBQ0EsTUFBTUMs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QUFYLENBQWhCO0FBQ0g7O0FBR0Q7QUFDQU0sY0FBVztBQUNQLGFBQUs5QyxNQUFMLEVBQWErQyxLQUFiLENBQW1CLElBQW5COztBQUVBLGVBQU8sSUFBUDtBQUNIOztBQUVEQSxVQUFPQyxJQUFQLEVBQWE7QUFDVCxZQUFJLEtBQUsvQyxlQUFMLENBQUosRUFDSStDLE9BQU8sS0FBS2IsUUFBTCxDQUFjYSxJQUFkLEVBQW9CLEtBQUs5QyxNQUFMLENBQXBCLEVBQWtDLEtBQUthLGFBQXZDLENBQVAsQ0FESixLQUdJaUMsT0FBTyxLQUFLZixZQUFMLENBQWtCZSxJQUFsQixFQUF3QixLQUFLOUMsTUFBTCxDQUF4QixDQUFQOztBQUVKLGFBQUtGLE1BQUwsRUFBYStDLEtBQWIsQ0FBbUJDLElBQW5COztBQUVBLGVBQU8sSUFBUDtBQUNIOztBQUVEQyxnQkFBYUMsR0FBYixFQUFrQjtBQUNkLGFBQUtqRCxlQUFMLElBQXdCaUQsR0FBeEI7O0FBRUEsZUFBTyxJQUFQO0FBQ0g7O0FBRURDLGNBQVdDLEdBQVgsRUFBZ0I7QUFDWixhQUFLbEQsTUFBTCxJQUFla0QsR0FBZjs7QUFFQSxlQUFPLElBQVA7QUFDSDs7QUFHRDtBQUNBQyxzQkFBaUIsc0NBQXdDO0FBQ3JELGNBQU0sSUFBSUMsS0FBSixDQUFVLGlCQUFWLENBQU47QUFDSDs7QUFFREMseUJBQW9CLGdCQUFrQjtBQUNsQyxjQUFNLElBQUlELEtBQUosQ0FBVSxpQkFBVixDQUFOO0FBQ0g7O0FBRURFLHFCQUFnQix1QkFBeUI7QUFDckMsY0FBTSxJQUFJRixLQUFKLENBQVUsaUJBQVYsQ0FBTjtBQUNIOztBQUVERyxxQkFBZ0IsK0JBQWlDO0FBQzdDLGNBQU0sSUFBSUgsS0FBSixDQUFVLGlCQUFWLENBQU47QUFDSDtBQXJJbUM7a0JBQW5CbEQsa0IiLCJmaWxlIjoicmVwb3J0ZXIvcGx1Z2luLWhvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IGluZGVudFN0cmluZyBmcm9tICdpbmRlbnQtc3RyaW5nJztcbmltcG9ydCB7IGlkZW50aXR5LCBlc2NhcGUgYXMgZXNjYXBlSHRtbCwgYXNzaWduSW4gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IG1vbWVudCBmcm9tICcuLi91dGlscy9tb21lbnQtbG9hZGVyJztcbmltcG9ydCBPUyBmcm9tICdvcy1mYW1pbHknO1xuaW1wb3J0IHsgd29yZFdyYXAsIHJlbW92ZVRUWUNvbG9ycyB9IGZyb20gJy4uL3V0aWxzL3N0cmluZyc7XG5pbXBvcnQgZ2V0Vmlld3BvcnRXaWR0aCBmcm9tICcuLi91dGlscy9nZXQtdmlld3BvcnQtd2lkdGgnO1xuXG4vLyBOT1RFOiB3ZSBzaG91bGQgbm90IGV4cG9zZSBpbnRlcm5hbCBzdGF0ZSB0b1xuLy8gdGhlIHBsdWdpbiwgdG8gYXZvaWQgYWNjaWRlbnRhbCByZXdyaXRlcy5cbi8vIFRoZXJlZm9yZSB3ZSB1c2Ugc3ltYm9scyB0byBzdG9yZSB0aGVtLlxuXG4vKmdsb2JhbCBTeW1ib2wqL1xuY29uc3Qgc3RyZWFtICAgICAgICAgID0gU3ltYm9sKCk7XG5jb25zdCB3b3JkV3JhcEVuYWJsZWQgPSBTeW1ib2woKTtcbmNvbnN0IGluZGVudCAgICAgICAgICA9IFN5bWJvbCgpO1xuY29uc3QgZXJyb3JEZWNvcmF0b3IgID0gU3ltYm9sKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcG9ydGVyUGx1Z2luSG9zdCB7XG4gICAgY29uc3RydWN0b3IgKHBsdWdpbiwgb3V0U3RyZWFtKSB7XG4gICAgICAgIHRoaXNbc3RyZWFtXSAgICAgICAgICA9IG91dFN0cmVhbSB8fCBwcm9jZXNzLnN0ZG91dDtcbiAgICAgICAgdGhpc1t3b3JkV3JhcEVuYWJsZWRdID0gZmFsc2U7XG4gICAgICAgIHRoaXNbaW5kZW50XSAgICAgICAgICA9IDA7XG5cbiAgICAgICAgY29uc3QgdXNlQ29sb3JzID0gdGhpc1tzdHJlYW1dID09PSBwcm9jZXNzLnN0ZG91dCAmJiBjaGFsay5lbmFibGVkICYmICFwbHVnaW4ubm9Db2xvcnM7XG5cbiAgICAgICAgdGhpcy5jaGFsayAgICAgICAgID0gbmV3IGNoYWxrLmNvbnN0cnVjdG9yKHsgZW5hYmxlZDogdXNlQ29sb3JzIH0pO1xuICAgICAgICB0aGlzLm1vbWVudCAgICAgICAgPSBtb21lbnQ7XG4gICAgICAgIHRoaXMudmlld3BvcnRXaWR0aCA9IGdldFZpZXdwb3J0V2lkdGgodGhpc1tzdHJlYW1dKTtcblxuICAgICAgICB0aGlzLnN5bWJvbHMgPSBPUy53aW4gP1xuICAgICAgICAgICAgeyBvazogJ+KImicsIGVycjogJ8OXJyB9IDpcbiAgICAgICAgICAgIHsgb2s6ICfinJMnLCBlcnI6ICfinJYnIH07XG5cbiAgICAgICAgYXNzaWduSW4odGhpcywgcGx1Z2luKTtcblxuICAgICAgICB0aGlzW2Vycm9yRGVjb3JhdG9yXSA9IHRoaXMuY3JlYXRlRXJyb3JEZWNvcmF0b3IoKTtcbiAgICB9XG5cbiAgICAvLyBFcnJvciBkZWNvcmF0b3JcbiAgICBjcmVhdGVFcnJvckRlY29yYXRvciAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnc3BhbiB1c2VyLWFnZW50Jzogc3RyID0+IHRoaXMuY2hhbGsuZ3JleShzdHIpLFxuXG4gICAgICAgICAgICAnc3BhbiBzdWJ0aXRsZSc6IHN0ciA9PiBgLSAke3RoaXMuY2hhbGsuYm9sZC5yZWQoc3RyKX0gLWAsXG4gICAgICAgICAgICAnZGl2IG1lc3NhZ2UnOiAgIHN0ciA9PiB0aGlzLmNoYWxrLmJvbGQucmVkKHN0ciksXG5cbiAgICAgICAgICAgICdkaXYgc2NyZWVuc2hvdC1pbmZvJzogaWRlbnRpdHksXG4gICAgICAgICAgICAnYSBzY3JlZW5zaG90LXBhdGgnOiAgIHN0ciA9PiB0aGlzLmNoYWxrLmdyZXkudW5kZXJsaW5lKHN0ciksXG5cbiAgICAgICAgICAgICdjb2RlJzogaWRlbnRpdHksXG5cbiAgICAgICAgICAgICdzcGFuIHN5bnRheC1zdHJpbmcnOiAgICAgc3RyID0+IHRoaXMuY2hhbGsuZ3JlZW4oc3RyKSxcbiAgICAgICAgICAgICdzcGFuIHN5bnRheC1wdW5jdHVhdG9yJzogc3RyID0+IHRoaXMuY2hhbGsuZ3JleShzdHIpLFxuICAgICAgICAgICAgJ3NwYW4gc3ludGF4LWtleXdvcmQnOiAgICBzdHIgPT4gdGhpcy5jaGFsay5jeWFuKHN0ciksXG4gICAgICAgICAgICAnc3BhbiBzeW50YXgtbnVtYmVyJzogICAgIHN0ciA9PiB0aGlzLmNoYWxrLm1hZ2VudGEoc3RyKSxcbiAgICAgICAgICAgICdzcGFuIHN5bnRheC1yZWdleCc6ICAgICAgc3RyID0+IHRoaXMuY2hhbGsubWFnZW50YShzdHIpLFxuICAgICAgICAgICAgJ3NwYW4gc3ludGF4LWNvbW1lbnQnOiAgICBzdHIgPT4gdGhpcy5jaGFsay5ncmV5LmJvbGQoc3RyKSxcbiAgICAgICAgICAgICdzcGFuIHN5bnRheC1pbnZhbGlkJzogICAgc3RyID0+IHRoaXMuY2hhbGsuaW52ZXJzZShzdHIpLFxuXG4gICAgICAgICAgICAnZGl2IGNvZGUtZnJhbWUnOiAgICAgICAgIGlkZW50aXR5LFxuICAgICAgICAgICAgJ2RpdiBjb2RlLWxpbmUnOiAgICAgICAgICBzdHIgPT4gc3RyICsgJ1xcbicsXG4gICAgICAgICAgICAnZGl2IGNvZGUtbGluZS1sYXN0JzogICAgIGlkZW50aXR5LFxuICAgICAgICAgICAgJ2RpdiBjb2RlLWxpbmUtbnVtJzogICAgICBzdHIgPT4gYCAgICR7c3RyfSB8YCxcbiAgICAgICAgICAgICdkaXYgY29kZS1saW5lLW51bS1iYXNlJzogc3RyID0+IHRoaXMuY2hhbGsuYmdSZWQoYCA+ICR7c3RyfSBgKSArICd8JyxcbiAgICAgICAgICAgICdkaXYgY29kZS1saW5lLXNyYyc6ICAgICAgaWRlbnRpdHksXG5cbiAgICAgICAgICAgICdkaXYgc3RhY2snOiAgICAgICAgICAgICAgIHN0ciA9PiAnXFxuXFxuJyArIHN0cixcbiAgICAgICAgICAgICdkaXYgc3RhY2stbGluZSc6ICAgICAgICAgIHN0ciA9PiBzdHIgKyAnXFxuJyxcbiAgICAgICAgICAgICdkaXYgc3RhY2stbGluZS1sYXN0JzogICAgIGlkZW50aXR5LFxuICAgICAgICAgICAgJ2RpdiBzdGFjay1saW5lLW5hbWUnOiAgICAgc3RyID0+IGAgICBhdCAke3RoaXMuY2hhbGsuYm9sZChzdHIpfWAsXG4gICAgICAgICAgICAnZGl2IHN0YWNrLWxpbmUtbG9jYXRpb24nOiBzdHIgPT4gYCAoJHt0aGlzLmNoYWxrLmdyZXkudW5kZXJsaW5lKHN0cil9KWAsXG5cbiAgICAgICAgICAgICdzdHJvbmcnOiBzdHIgPT4gdGhpcy5jaGFsay5ib2xkKHN0ciksXG4gICAgICAgICAgICAnYSc6ICAgICAgc3RyID0+IGBcIiR7dGhpcy5jaGFsay51bmRlcmxpbmUoc3RyKX1cImBcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBTdHJpbmcgaGVscGVyc1xuICAgIGluZGVudFN0cmluZyAoc3RyLCBpbmRlbnRWYWwpIHtcbiAgICAgICAgcmV0dXJuIGluZGVudFN0cmluZyhzdHIsICcgJywgaW5kZW50VmFsKTtcbiAgICB9XG5cbiAgICB3b3JkV3JhcCAoc3RyLCBpbmRlbnRWYWwsIHdpZHRoKSB7XG4gICAgICAgIHJldHVybiB3b3JkV3JhcChzdHIsIGluZGVudFZhbCwgd2lkdGgpO1xuICAgIH1cblxuICAgIGVzY2FwZUh0bWwgKHN0cikge1xuICAgICAgICByZXR1cm4gZXNjYXBlSHRtbChzdHIpO1xuICAgIH1cblxuICAgIGZvcm1hdEVycm9yIChlcnIsIHByZWZpeCA9ICcnKSB7XG4gICAgICAgIGNvbnN0IHByZWZpeExlbmd0aFdpdGhvdXRDb2xvcnMgPSByZW1vdmVUVFlDb2xvcnMocHJlZml4KS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IG1heE1zZ0xlbmd0aCAgICAgICAgICAgICAgPSB0aGlzLnZpZXdwb3J0V2lkdGggLSB0aGlzW2luZGVudF0gLSBwcmVmaXhMZW5ndGhXaXRob3V0Q29sb3JzO1xuICAgICAgICBsZXQgbXNnICAgICAgICAgICAgICAgICAgICAgICAgID0gZXJyLmZvcm1hdE1lc3NhZ2UodGhpc1tlcnJvckRlY29yYXRvcl0sIG1heE1zZ0xlbmd0aCk7XG5cbiAgICAgICAgaWYgKHRoaXNbd29yZFdyYXBFbmFibGVkXSlcbiAgICAgICAgICAgIG1zZyA9IHRoaXMud29yZFdyYXAobXNnLCBwcmVmaXhMZW5ndGhXaXRob3V0Q29sb3JzLCBtYXhNc2dMZW5ndGgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBtc2cgPSB0aGlzLmluZGVudFN0cmluZyhtc2csIHByZWZpeExlbmd0aFdpdGhvdXRDb2xvcnMpO1xuXG4gICAgICAgIHJldHVybiBwcmVmaXggKyBtc2cuc3Vic3RyKHByZWZpeExlbmd0aFdpdGhvdXRDb2xvcnMpO1xuICAgIH1cblxuXG4gICAgLy8gV3JpdGluZyBoZWxwZXJzXG4gICAgbmV3bGluZSAoKSB7XG4gICAgICAgIHRoaXNbc3RyZWFtXS53cml0ZSgnXFxuJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgd3JpdGUgKHRleHQpIHtcbiAgICAgICAgaWYgKHRoaXNbd29yZFdyYXBFbmFibGVkXSlcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLndvcmRXcmFwKHRleHQsIHRoaXNbaW5kZW50XSwgdGhpcy52aWV3cG9ydFdpZHRoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGV4dCA9IHRoaXMuaW5kZW50U3RyaW5nKHRleHQsIHRoaXNbaW5kZW50XSk7XG5cbiAgICAgICAgdGhpc1tzdHJlYW1dLndyaXRlKHRleHQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVzZVdvcmRXcmFwICh1c2UpIHtcbiAgICAgICAgdGhpc1t3b3JkV3JhcEVuYWJsZWRdID0gdXNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldEluZGVudCAodmFsKSB7XG4gICAgICAgIHRoaXNbaW5kZW50XSA9IHZhbDtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cblxuICAgIC8vIEFic3RyYWN0IG1ldGhvZHMgaW1wbGVtZW50ZWQgaW4gcGx1Z2luXG4gICAgcmVwb3J0VGFza1N0YXJ0ICgvKiBzdGFydFRpbWUsIHVzZXJBZ2VudHMsIHRlc3RDb3VudCAqLykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIHJlcG9ydEZpeHR1cmVTdGFydCAoLyogbmFtZSwgcGF0aCAqLykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIHJlcG9ydFRlc3REb25lICgvKiBuYW1lLCB0ZXN0UnVuSW5mbyAqLykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIHJlcG9ydFRhc2tEb25lICgvKiBlbmRUaW1lLCBwYXNzZWQsIHdhcm5pbmdzICovKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gICAgfVxufVxuIl19
