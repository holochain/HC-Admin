'use strict';

exports.__esModule = true;
exports.removeTTYColors = removeTTYColors;
exports.wordWrap = wordWrap;
exports.splitQuotedText = splitQuotedText;
exports.replaceLeadingSpacesWithNbsp = replaceLeadingSpacesWithNbsp;

var _indentString = require('indent-string');

var _indentString2 = _interopRequireDefault(_indentString);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rtrim(str) {
    return str.replace(/\s+$/, '');
}

function removeTTYColors(str) {
    return str.replace(/\033\[[0-9;]*m/g, '');
}

function wordWrap(str, indent, width) {
    let curStr = '';
    let wrappedMsg = '';

    if (removeTTYColors(str).length <= width - indent) return (0, _indentString2.default)(str, ' ', indent);

    str = str.replace(/(\r\n)/gm, '\n').split(/(\S+[ \t]+)|(\S+(?:\n))|(\n)/m)
    //NOTE: cut empty elements
    .filter(elm => !!elm);

    str.forEach(word => {
        const newStr = curStr + word;

        if (removeTTYColors(newStr).length > width - indent) {
            wrappedMsg += `${rtrim(curStr)}\n`;
            curStr = word;
        } else {
            if (curStr[curStr.length - 1] === '\n') {
                wrappedMsg += `${rtrim(curStr)}\n`;
                curStr = '';
            }

            curStr += word;
        }
    });

    return (0, _indentString2.default)(wrappedMsg + curStr, ' ', indent);
}

function splitQuotedText(str, splitChar, quotes = '"\'') {
    let currentPart = '';
    const parts = [];
    let quoteChar = null;

    for (let i = 0; i < str.length; i++) {
        const currentChar = str[i];

        if (currentChar === splitChar) {
            if (quoteChar) currentPart += currentChar;else {
                parts.push(currentPart);
                currentPart = '';
            }
        } else if (quotes.indexOf(currentChar) > -1) {
            if (quoteChar === currentChar) quoteChar = null;else if (!quoteChar) quoteChar = currentChar;else currentPart += currentChar;
        } else currentPart += currentChar;
    }

    if (currentPart) parts.push(currentPart);

    return parts;
}

function replaceLeadingSpacesWithNbsp(str) {
    return str.replace(/^ +/mg, match => {
        return (0, _lodash.repeat)('&nbsp;', match.length);
    });
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zdHJpbmcuanMiXSwibmFtZXMiOlsicmVtb3ZlVFRZQ29sb3JzIiwid29yZFdyYXAiLCJzcGxpdFF1b3RlZFRleHQiLCJyZXBsYWNlTGVhZGluZ1NwYWNlc1dpdGhOYnNwIiwicnRyaW0iLCJzdHIiLCJyZXBsYWNlIiwiaW5kZW50Iiwid2lkdGgiLCJjdXJTdHIiLCJ3cmFwcGVkTXNnIiwibGVuZ3RoIiwic3BsaXQiLCJmaWx0ZXIiLCJlbG0iLCJmb3JFYWNoIiwid29yZCIsIm5ld1N0ciIsInNwbGl0Q2hhciIsInF1b3RlcyIsImN1cnJlbnRQYXJ0IiwicGFydHMiLCJxdW90ZUNoYXIiLCJpIiwiY3VycmVudENoYXIiLCJwdXNoIiwiaW5kZXhPZiIsIm1hdGNoIl0sIm1hcHBpbmdzIjoiOzs7UUFPZ0JBLGUsR0FBQUEsZTtRQUlBQyxRLEdBQUFBLFE7UUFnQ0FDLGUsR0FBQUEsZTtRQWtDQUMsNEIsR0FBQUEsNEI7O0FBN0VoQjs7OztBQUNBOzs7O0FBRUEsU0FBU0MsS0FBVCxDQUFnQkMsR0FBaEIsRUFBcUI7QUFDakIsV0FBT0EsSUFBSUMsT0FBSixDQUFZLE1BQVosRUFBb0IsRUFBcEIsQ0FBUDtBQUNIOztBQUVNLFNBQVNOLGVBQVQsQ0FBMEJLLEdBQTFCLEVBQStCO0FBQ2xDLFdBQU9BLElBQUlDLE9BQUosQ0FBWSxpQkFBWixFQUErQixFQUEvQixDQUFQO0FBQ0g7O0FBRU0sU0FBU0wsUUFBVCxDQUFtQkksR0FBbkIsRUFBd0JFLE1BQXhCLEVBQWdDQyxLQUFoQyxFQUF1QztBQUMxQyxRQUFJQyxTQUFhLEVBQWpCO0FBQ0EsUUFBSUMsYUFBYSxFQUFqQjs7QUFFQSxRQUFJVixnQkFBZ0JLLEdBQWhCLEVBQXFCTSxNQUFyQixJQUErQkgsUUFBUUQsTUFBM0MsRUFDSSxPQUFPLDRCQUFhRixHQUFiLEVBQWtCLEdBQWxCLEVBQXVCRSxNQUF2QixDQUFQOztBQUVKRixVQUFNQSxJQUFJQyxPQUFKLENBQVksVUFBWixFQUF3QixJQUF4QixFQUNETSxLQURDLENBQ0ssK0JBREw7QUFFRjtBQUZFLEtBR0RDLE1BSEMsQ0FHTUMsT0FBTyxDQUFDLENBQUNBLEdBSGYsQ0FBTjs7QUFLQVQsUUFBSVUsT0FBSixDQUFZQyxRQUFRO0FBQ2hCLGNBQU1DLFNBQVNSLFNBQVNPLElBQXhCOztBQUVBLFlBQUloQixnQkFBZ0JpQixNQUFoQixFQUF3Qk4sTUFBeEIsR0FBaUNILFFBQVFELE1BQTdDLEVBQXFEO0FBQ2pERywwQkFBZSxHQUFFTixNQUFNSyxNQUFOLENBQWMsSUFBL0I7QUFDQUEscUJBQVNPLElBQVQ7QUFDSCxTQUhELE1BSUs7QUFDRCxnQkFBSVAsT0FBT0EsT0FBT0UsTUFBUCxHQUFnQixDQUF2QixNQUE4QixJQUFsQyxFQUF3QztBQUNwQ0QsOEJBQWUsR0FBRU4sTUFBTUssTUFBTixDQUFjLElBQS9CO0FBQ0FBLHlCQUFTLEVBQVQ7QUFDSDs7QUFFREEsc0JBQVVPLElBQVY7QUFDSDtBQUNKLEtBZkQ7O0FBaUJBLFdBQU8sNEJBQWFOLGFBQWFELE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDRixNQUF2QyxDQUFQO0FBQ0g7O0FBRU0sU0FBU0wsZUFBVCxDQUEwQkcsR0FBMUIsRUFBK0JhLFNBQS9CLEVBQTBDQyxTQUFTLEtBQW5ELEVBQTBEO0FBQzdELFFBQUlDLGNBQWMsRUFBbEI7QUFDQSxVQUFNQyxRQUFjLEVBQXBCO0FBQ0EsUUFBSUMsWUFBYyxJQUFsQjs7QUFFQSxTQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSWxCLElBQUlNLE1BQXhCLEVBQWdDWSxHQUFoQyxFQUFxQztBQUNqQyxjQUFNQyxjQUFjbkIsSUFBSWtCLENBQUosQ0FBcEI7O0FBRUEsWUFBSUMsZ0JBQWdCTixTQUFwQixFQUErQjtBQUMzQixnQkFBSUksU0FBSixFQUNJRixlQUFlSSxXQUFmLENBREosS0FFSztBQUNESCxzQkFBTUksSUFBTixDQUFXTCxXQUFYO0FBQ0FBLDhCQUFjLEVBQWQ7QUFDSDtBQUNKLFNBUEQsTUFRSyxJQUFJRCxPQUFPTyxPQUFQLENBQWVGLFdBQWYsSUFBOEIsQ0FBQyxDQUFuQyxFQUFzQztBQUN2QyxnQkFBSUYsY0FBY0UsV0FBbEIsRUFDSUYsWUFBWSxJQUFaLENBREosS0FFSyxJQUFJLENBQUNBLFNBQUwsRUFDREEsWUFBWUUsV0FBWixDQURDLEtBR0RKLGVBQWVJLFdBQWY7QUFDUCxTQVBJLE1BU0RKLGVBQWVJLFdBQWY7QUFDUDs7QUFFRCxRQUFJSixXQUFKLEVBQ0lDLE1BQU1JLElBQU4sQ0FBV0wsV0FBWDs7QUFFSixXQUFPQyxLQUFQO0FBQ0g7O0FBRU0sU0FBU2xCLDRCQUFULENBQXVDRSxHQUF2QyxFQUE0QztBQUMvQyxXQUFPQSxJQUFJQyxPQUFKLENBQVksT0FBWixFQUFxQnFCLFNBQVM7QUFDakMsZUFBTyxvQkFBTyxRQUFQLEVBQWlCQSxNQUFNaEIsTUFBdkIsQ0FBUDtBQUNILEtBRk0sQ0FBUDtBQUdIIiwiZmlsZSI6InV0aWxzL3N0cmluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbmRlbnRTdHJpbmcgZnJvbSAnaW5kZW50LXN0cmluZyc7XG5pbXBvcnQgeyByZXBlYXQgfSBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBydHJpbSAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMrJC8sICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVRUWUNvbG9ycyAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXDAzM1xcW1swLTk7XSptL2csICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdvcmRXcmFwIChzdHIsIGluZGVudCwgd2lkdGgpIHtcbiAgICBsZXQgY3VyU3RyICAgICA9ICcnO1xuICAgIGxldCB3cmFwcGVkTXNnID0gJyc7XG5cbiAgICBpZiAocmVtb3ZlVFRZQ29sb3JzKHN0cikubGVuZ3RoIDw9IHdpZHRoIC0gaW5kZW50KVxuICAgICAgICByZXR1cm4gaW5kZW50U3RyaW5nKHN0ciwgJyAnLCBpbmRlbnQpO1xuXG4gICAgc3RyID0gc3RyLnJlcGxhY2UoLyhcXHJcXG4pL2dtLCAnXFxuJylcbiAgICAgICAgLnNwbGl0KC8oXFxTK1sgXFx0XSspfChcXFMrKD86XFxuKSl8KFxcbikvbSlcbiAgICAgICAgLy9OT1RFOiBjdXQgZW1wdHkgZWxlbWVudHNcbiAgICAgICAgLmZpbHRlcihlbG0gPT4gISFlbG0pO1xuXG4gICAgc3RyLmZvckVhY2god29yZCA9PiB7XG4gICAgICAgIGNvbnN0IG5ld1N0ciA9IGN1clN0ciArIHdvcmQ7XG5cbiAgICAgICAgaWYgKHJlbW92ZVRUWUNvbG9ycyhuZXdTdHIpLmxlbmd0aCA+IHdpZHRoIC0gaW5kZW50KSB7XG4gICAgICAgICAgICB3cmFwcGVkTXNnICs9IGAke3J0cmltKGN1clN0cil9XFxuYDtcbiAgICAgICAgICAgIGN1clN0ciA9IHdvcmQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY3VyU3RyW2N1clN0ci5sZW5ndGggLSAxXSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICB3cmFwcGVkTXNnICs9IGAke3J0cmltKGN1clN0cil9XFxuYDtcbiAgICAgICAgICAgICAgICBjdXJTdHIgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3VyU3RyICs9IHdvcmQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpbmRlbnRTdHJpbmcod3JhcHBlZE1zZyArIGN1clN0ciwgJyAnLCBpbmRlbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRRdW90ZWRUZXh0IChzdHIsIHNwbGl0Q2hhciwgcXVvdGVzID0gJ1wiXFwnJykge1xuICAgIGxldCBjdXJyZW50UGFydCA9ICcnO1xuICAgIGNvbnN0IHBhcnRzICAgICAgID0gW107XG4gICAgbGV0IHF1b3RlQ2hhciAgID0gbnVsbDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gc3RyW2ldO1xuXG4gICAgICAgIGlmIChjdXJyZW50Q2hhciA9PT0gc3BsaXRDaGFyKSB7XG4gICAgICAgICAgICBpZiAocXVvdGVDaGFyKVxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJ0ICs9IGN1cnJlbnRDaGFyO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFydHMucHVzaChjdXJyZW50UGFydCk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhcnQgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChxdW90ZXMuaW5kZXhPZihjdXJyZW50Q2hhcikgPiAtMSkge1xuICAgICAgICAgICAgaWYgKHF1b3RlQ2hhciA9PT0gY3VycmVudENoYXIpXG4gICAgICAgICAgICAgICAgcXVvdGVDaGFyID0gbnVsbDtcbiAgICAgICAgICAgIGVsc2UgaWYgKCFxdW90ZUNoYXIpXG4gICAgICAgICAgICAgICAgcXVvdGVDaGFyID0gY3VycmVudENoYXI7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY3VycmVudFBhcnQgKz0gY3VycmVudENoYXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY3VycmVudFBhcnQgKz0gY3VycmVudENoYXI7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnRQYXJ0KVxuICAgICAgICBwYXJ0cy5wdXNoKGN1cnJlbnRQYXJ0KTtcblxuICAgIHJldHVybiBwYXJ0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VMZWFkaW5nU3BhY2VzV2l0aE5ic3AgKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXiArL21nLCBtYXRjaCA9PiB7XG4gICAgICAgIHJldHVybiByZXBlYXQoJyZuYnNwOycsIG1hdGNoLmxlbmd0aCk7XG4gICAgfSk7XG59XG4iXX0=
