'use strict';

exports.__esModule = true;
exports.default = selectorAttributeFilter;
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/* eslint-disable no-undef */
function selectorAttributeFilter(node, index, originNode, attrName, attrValue) {
    if (node.nodeType !== 1) return false;

    const attributes = node.attributes;
    let attr = null;

    const check = (actual, expect) => typeof expect === 'string' ? expect === actual : expect.test(actual);

    for (let i = 0; i < attributes.length; i++) {
        attr = attributes[i];

        if (check(attr.nodeName, attrName) && (!attrValue || check(attr.nodeValue, attrValue))) return true;
    }

    return false;
}
/* eslint-enable no-undef */

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGllbnQtZnVuY3Rpb25zL3NlbGVjdG9ycy9zZWxlY3Rvci1hdHRyaWJ1dGUtZmlsdGVyLmpzIl0sIm5hbWVzIjpbInNlbGVjdG9yQXR0cmlidXRlRmlsdGVyIiwibm9kZSIsImluZGV4Iiwib3JpZ2luTm9kZSIsImF0dHJOYW1lIiwiYXR0clZhbHVlIiwibm9kZVR5cGUiLCJhdHRyaWJ1dGVzIiwiYXR0ciIsImNoZWNrIiwiYWN0dWFsIiwiZXhwZWN0IiwidGVzdCIsImkiLCJsZW5ndGgiLCJub2RlTmFtZSIsIm5vZGVWYWx1ZSJdLCJtYXBwaW5ncyI6Ijs7O2tCQU13QkEsdUI7QUFOeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDZSxTQUFTQSx1QkFBVCxDQUFrQ0MsSUFBbEMsRUFBd0NDLEtBQXhDLEVBQStDQyxVQUEvQyxFQUEyREMsUUFBM0QsRUFBcUVDLFNBQXJFLEVBQWdGO0FBQzNGLFFBQUlKLEtBQUtLLFFBQUwsS0FBa0IsQ0FBdEIsRUFDSSxPQUFPLEtBQVA7O0FBRUosVUFBTUMsYUFBYU4sS0FBS00sVUFBeEI7QUFDQSxRQUFJQyxPQUFhLElBQWpCOztBQUVBLFVBQU1DLFFBQVEsQ0FBQ0MsTUFBRCxFQUFTQyxNQUFULEtBQW9CLE9BQU9BLE1BQVAsS0FBa0IsUUFBbEIsR0FBNkJBLFdBQVdELE1BQXhDLEdBQWlEQyxPQUFPQyxJQUFQLENBQVlGLE1BQVosQ0FBbkY7O0FBRUEsU0FBSyxJQUFJRyxJQUFJLENBQWIsRUFBZ0JBLElBQUlOLFdBQVdPLE1BQS9CLEVBQXVDRCxHQUF2QyxFQUE0QztBQUN4Q0wsZUFBT0QsV0FBV00sQ0FBWCxDQUFQOztBQUVBLFlBQUlKLE1BQU1ELEtBQUtPLFFBQVgsRUFBcUJYLFFBQXJCLE1BQW1DLENBQUNDLFNBQUQsSUFBY0ksTUFBTUQsS0FBS1EsU0FBWCxFQUFzQlgsU0FBdEIsQ0FBakQsQ0FBSixFQUNJLE9BQU8sSUFBUDtBQUNQOztBQUVELFdBQU8sS0FBUDtBQUNIO0FBQ0QiLCJmaWxlIjoiY2xpZW50LWZ1bmN0aW9ucy9zZWxlY3RvcnMvc2VsZWN0b3ItYXR0cmlidXRlLWZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFdBUk5JTkc6IHRoaXMgZmlsZSBpcyB1c2VkIGJ5IGJvdGggdGhlIGNsaWVudCBhbmQgdGhlIHNlcnZlci5cbi8vIERvIG5vdCB1c2UgYW55IGJyb3dzZXIgb3Igbm9kZS1zcGVjaWZpYyBBUEkhXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZWxlY3RvckF0dHJpYnV0ZUZpbHRlciAobm9kZSwgaW5kZXgsIG9yaWdpbk5vZGUsIGF0dHJOYW1lLCBhdHRyVmFsdWUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gMSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcbiAgICBsZXQgYXR0ciAgICAgICA9IG51bGw7XG5cbiAgICBjb25zdCBjaGVjayA9IChhY3R1YWwsIGV4cGVjdCkgPT4gdHlwZW9mIGV4cGVjdCA9PT0gJ3N0cmluZycgPyBleHBlY3QgPT09IGFjdHVhbCA6IGV4cGVjdC50ZXN0KGFjdHVhbCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXR0ciA9IGF0dHJpYnV0ZXNbaV07XG5cbiAgICAgICAgaWYgKGNoZWNrKGF0dHIubm9kZU5hbWUsIGF0dHJOYW1lKSAmJiAoIWF0dHJWYWx1ZSB8fCBjaGVjayhhdHRyLm5vZGVWYWx1ZSwgYXR0clZhbHVlKSkpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVuZGVmICovXG4iXX0=
