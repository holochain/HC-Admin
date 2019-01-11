'use strict';

exports.__esModule = true;
exports.default = selectorTextFilter;
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/* eslint-disable no-undef */
function selectorTextFilter(node, index, originNode, textFilter) {

    function hasChildrenWithText(parentNode) {
        const cnCount = parentNode.childNodes.length;

        for (let i = 0; i < cnCount; i++) {
            if (selectorTextFilter(parentNode.childNodes[i], index, originNode, textFilter)) return true;
        }

        return false;
    }

    function checkNodeText(text) {
        if (textFilter instanceof RegExp) return textFilter.test(text);
        return textFilter === text.trim();
    }

    // Element
    if (node.nodeType === 1) {
        let text = node.innerText;

        // NOTE: In Firefox, <option> elements don't have `innerText`.
        // So, we fallback to `textContent` in that case (see GH-861).
        if (node.tagName.toLowerCase() === 'option') {
            const textContent = node.textContent;

            if (!text && textContent) text = textContent;
        }

        return checkNodeText(text);
    }

    // Document
    if (node.nodeType === 9) {
        // NOTE: latest version of Edge doesn't have `innerText` for `document`,
        // `html` and `body`. So we check their children instead.
        const head = node.querySelector('head');
        const body = node.querySelector('body');

        return hasChildrenWithText(head, textFilter) || hasChildrenWithText(body, textFilter);
    }

    // DocumentFragment
    if (node.nodeType === 11) return hasChildrenWithText(node, textFilter);

    return checkNodeText(node.textContent);
}
/* eslint-enable no-undef */

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQtZnVuY3Rpb25zL3NlbGVjdG9ycy9zZWxlY3Rvci10ZXh0LWZpbHRlci5qcyJdLCJuYW1lcyI6WyJzZWxlY3RvclRleHRGaWx0ZXIiLCJub2RlIiwiaW5kZXgiLCJvcmlnaW5Ob2RlIiwidGV4dEZpbHRlciIsImhhc0NoaWxkcmVuV2l0aFRleHQiLCJwYXJlbnROb2RlIiwiY25Db3VudCIsImNoaWxkTm9kZXMiLCJsZW5ndGgiLCJpIiwiY2hlY2tOb2RlVGV4dCIsInRleHQiLCJSZWdFeHAiLCJ0ZXN0IiwidHJpbSIsIm5vZGVUeXBlIiwiaW5uZXJUZXh0IiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwidGV4dENvbnRlbnQiLCJoZWFkIiwicXVlcnlTZWxlY3RvciIsImJvZHkiXSwibWFwcGluZ3MiOiI7OztrQkFNd0JBLGtCO0FBTnhCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ2UsU0FBU0Esa0JBQVQsQ0FBNkJDLElBQTdCLEVBQW1DQyxLQUFuQyxFQUEwQ0MsVUFBMUMsRUFBc0RDLFVBQXRELEVBQWtFOztBQUU3RSxhQUFTQyxtQkFBVCxDQUE4QkMsVUFBOUIsRUFBMEM7QUFDdEMsY0FBTUMsVUFBVUQsV0FBV0UsVUFBWCxDQUFzQkMsTUFBdEM7O0FBRUEsYUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE9BQXBCLEVBQTZCRyxHQUE3QixFQUFrQztBQUM5QixnQkFBSVYsbUJBQW1CTSxXQUFXRSxVQUFYLENBQXNCRSxDQUF0QixDQUFuQixFQUE2Q1IsS0FBN0MsRUFBb0RDLFVBQXBELEVBQWdFQyxVQUFoRSxDQUFKLEVBQ0ksT0FBTyxJQUFQO0FBQ1A7O0FBRUQsZUFBTyxLQUFQO0FBQ0g7O0FBRUQsYUFBU08sYUFBVCxDQUF3QkMsSUFBeEIsRUFBOEI7QUFDMUIsWUFBSVIsc0JBQXNCUyxNQUExQixFQUNJLE9BQU9ULFdBQVdVLElBQVgsQ0FBZ0JGLElBQWhCLENBQVA7QUFDSixlQUFPUixlQUFlUSxLQUFLRyxJQUFMLEVBQXRCO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJZCxLQUFLZSxRQUFMLEtBQWtCLENBQXRCLEVBQXlCO0FBQ3JCLFlBQUlKLE9BQU9YLEtBQUtnQixTQUFoQjs7QUFFQTtBQUNBO0FBQ0EsWUFBSWhCLEtBQUtpQixPQUFMLENBQWFDLFdBQWIsT0FBK0IsUUFBbkMsRUFBNkM7QUFDekMsa0JBQU1DLGNBQWNuQixLQUFLbUIsV0FBekI7O0FBRUEsZ0JBQUksQ0FBQ1IsSUFBRCxJQUFTUSxXQUFiLEVBQ0lSLE9BQU9RLFdBQVA7QUFDUDs7QUFFRCxlQUFPVCxjQUFjQyxJQUFkLENBQVA7QUFDSDs7QUFFRDtBQUNBLFFBQUlYLEtBQUtlLFFBQUwsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDckI7QUFDQTtBQUNBLGNBQU1LLE9BQU9wQixLQUFLcUIsYUFBTCxDQUFtQixNQUFuQixDQUFiO0FBQ0EsY0FBTUMsT0FBT3RCLEtBQUtxQixhQUFMLENBQW1CLE1BQW5CLENBQWI7O0FBRUEsZUFBT2pCLG9CQUFvQmdCLElBQXBCLEVBQTBCakIsVUFBMUIsS0FBeUNDLG9CQUFvQmtCLElBQXBCLEVBQTBCbkIsVUFBMUIsQ0FBaEQ7QUFDSDs7QUFFRDtBQUNBLFFBQUlILEtBQUtlLFFBQUwsS0FBa0IsRUFBdEIsRUFDSSxPQUFPWCxvQkFBb0JKLElBQXBCLEVBQTBCRyxVQUExQixDQUFQOztBQUVKLFdBQU9PLGNBQWNWLEtBQUttQixXQUFuQixDQUFQO0FBQ0g7QUFDRCIsImZpbGUiOiJjbGllbnQtZnVuY3Rpb25zL3NlbGVjdG9ycy9zZWxlY3Rvci10ZXh0LWZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFdBUk5JTkc6IHRoaXMgZmlsZSBpcyB1c2VkIGJ5IGJvdGggdGhlIGNsaWVudCBhbmQgdGhlIHNlcnZlci5cbi8vIERvIG5vdCB1c2UgYW55IGJyb3dzZXIgb3Igbm9kZS1zcGVjaWZpYyBBUEkhXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZWxlY3RvclRleHRGaWx0ZXIgKG5vZGUsIGluZGV4LCBvcmlnaW5Ob2RlLCB0ZXh0RmlsdGVyKSB7XG5cbiAgICBmdW5jdGlvbiBoYXNDaGlsZHJlbldpdGhUZXh0IChwYXJlbnROb2RlKSB7XG4gICAgICAgIGNvbnN0IGNuQ291bnQgPSBwYXJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY25Db3VudDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0b3JUZXh0RmlsdGVyKHBhcmVudE5vZGUuY2hpbGROb2Rlc1tpXSwgaW5kZXgsIG9yaWdpbk5vZGUsIHRleHRGaWx0ZXIpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrTm9kZVRleHQgKHRleHQpIHtcbiAgICAgICAgaWYgKHRleHRGaWx0ZXIgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgICAgICByZXR1cm4gdGV4dEZpbHRlci50ZXN0KHRleHQpO1xuICAgICAgICByZXR1cm4gdGV4dEZpbHRlciA9PT0gdGV4dC50cmltKCk7XG4gICAgfVxuXG4gICAgLy8gRWxlbWVudFxuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIGxldCB0ZXh0ID0gbm9kZS5pbm5lclRleHQ7XG5cbiAgICAgICAgLy8gTk9URTogSW4gRmlyZWZveCwgPG9wdGlvbj4gZWxlbWVudHMgZG9uJ3QgaGF2ZSBgaW5uZXJUZXh0YC5cbiAgICAgICAgLy8gU28sIHdlIGZhbGxiYWNrIHRvIGB0ZXh0Q29udGVudGAgaW4gdGhhdCBjYXNlIChzZWUgR0gtODYxKS5cbiAgICAgICAgaWYgKG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnb3B0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgdGV4dENvbnRlbnQgPSBub2RlLnRleHRDb250ZW50O1xuXG4gICAgICAgICAgICBpZiAoIXRleHQgJiYgdGV4dENvbnRlbnQpXG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHRDb250ZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNoZWNrTm9kZVRleHQodGV4dCk7XG4gICAgfVxuXG4gICAgLy8gRG9jdW1lbnRcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOSkge1xuICAgICAgICAvLyBOT1RFOiBsYXRlc3QgdmVyc2lvbiBvZiBFZGdlIGRvZXNuJ3QgaGF2ZSBgaW5uZXJUZXh0YCBmb3IgYGRvY3VtZW50YCxcbiAgICAgICAgLy8gYGh0bWxgIGFuZCBgYm9keWAuIFNvIHdlIGNoZWNrIHRoZWlyIGNoaWxkcmVuIGluc3RlYWQuXG4gICAgICAgIGNvbnN0IGhlYWQgPSBub2RlLnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKTtcbiAgICAgICAgY29uc3QgYm9keSA9IG5vZGUucXVlcnlTZWxlY3RvcignYm9keScpO1xuXG4gICAgICAgIHJldHVybiBoYXNDaGlsZHJlbldpdGhUZXh0KGhlYWQsIHRleHRGaWx0ZXIpIHx8IGhhc0NoaWxkcmVuV2l0aFRleHQoYm9keSwgdGV4dEZpbHRlcik7XG4gICAgfVxuXG4gICAgLy8gRG9jdW1lbnRGcmFnbWVudFxuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxMSlcbiAgICAgICAgcmV0dXJuIGhhc0NoaWxkcmVuV2l0aFRleHQobm9kZSwgdGV4dEZpbHRlcik7XG5cbiAgICByZXR1cm4gY2hlY2tOb2RlVGV4dChub2RlLnRleHRDb250ZW50KTtcbn1cbi8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cbiJdfQ==
