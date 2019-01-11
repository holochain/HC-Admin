'use strict';

exports.__esModule = true;

var _callsite = require('callsite');

var _callsite2 = _interopRequireDefault(_callsite);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TRACKING_MARK_RE = /^\$\$testcafe_test_run\$\$(\S+)\$\$$/;
const STACK_CAPACITY = 5000;

// Tracker
exports.default = {
    enabled: false,

    activeTestRuns: {},

    _createContextSwitchingFunctionHook(ctxSwitchingFn, patchedArgsCount) {
        const tracker = this;

        return function () {
            const testRunId = tracker.getContextTestRunId();

            if (testRunId) {
                for (let i = 0; i < patchedArgsCount; i++) {
                    if (typeof arguments[i] === 'function') arguments[i] = tracker.addTrackingMarkerToFunction(testRunId, arguments[i]);
                }
            }

            return ctxSwitchingFn.apply(this, arguments);
        };
    },

    _getStackFrames() {
        // NOTE: increase stack capacity to seek deep stack entries
        const savedLimit = Error.stackTraceLimit;

        Error.stackTraceLimit = STACK_CAPACITY;

        const frames = (0, _callsite2.default)();

        Error.stackTraceLimit = savedLimit;

        return frames;
    },

    ensureEnabled() {
        if (!this.enabled) {
            global.setTimeout = this._createContextSwitchingFunctionHook(global.setTimeout, 1);
            global.setInterval = this._createContextSwitchingFunctionHook(global.setInterval, 1);
            global.setImmediate = this._createContextSwitchingFunctionHook(global.setImmediate, 1);
            process.nextTick = this._createContextSwitchingFunctionHook(process.nextTick, 1);

            _promise2.default.prototype.then = this._createContextSwitchingFunctionHook(_promise2.default.prototype.then, 2);
            _promise2.default.prototype.catch = this._createContextSwitchingFunctionHook(_promise2.default.prototype.catch, 1);

            if (global.Promise) {
                global.Promise.prototype.then = this._createContextSwitchingFunctionHook(global.Promise.prototype.then, 2);
                global.Promise.prototype.catch = this._createContextSwitchingFunctionHook(global.Promise.prototype.catch, 1);
            }

            this.enabled = true;
        }
    },

    addTrackingMarkerToFunction(testRunId, fn) {
        const markerFactoryBody = `
            return function $$testcafe_test_run$$${testRunId}$$ () {
                switch (arguments.length) {
                    case 0: return fn.call(this);
                    case 1: return fn.call(this, arguments[0]);
                    case 2: return fn.call(this, arguments[0], arguments[1]);
                    case 3: return fn.call(this, arguments[0], arguments[1], arguments[2]);
                    case 4: return fn.call(this, arguments[0], arguments[1], arguments[2], arguments[3]);
                    default: return fn.apply(this, arguments);
                }
            };
        `;

        return new Function('fn', markerFactoryBody)(fn);
    },

    getContextTestRunId() {
        const frames = this._getStackFrames();

        // OPTIMIZATION: we start traversing from the bottom of the stack,
        // because we'll more likely encounter a marker there.
        // Async/await and Promise machinery executes lots of intrinsics
        // on timers (where we have a marker). And, since a timer initiates a new
        // stack, the marker will be at the very bottom of it.
        for (let i = frames.length - 1; i >= 0; i--) {
            const fnName = frames[i].getFunctionName();
            const match = fnName && fnName.match(TRACKING_MARK_RE);

            if (match) return match[1];
        }

        return null;
    },

    resolveContextTestRun() {
        const testRunId = this.getContextTestRunId();

        return this.activeTestRuns[testRunId];
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvdGVzdC1ydW4tdHJhY2tlci5qcyJdLCJuYW1lcyI6WyJUUkFDS0lOR19NQVJLX1JFIiwiU1RBQ0tfQ0FQQUNJVFkiLCJlbmFibGVkIiwiYWN0aXZlVGVzdFJ1bnMiLCJfY3JlYXRlQ29udGV4dFN3aXRjaGluZ0Z1bmN0aW9uSG9vayIsImN0eFN3aXRjaGluZ0ZuIiwicGF0Y2hlZEFyZ3NDb3VudCIsInRyYWNrZXIiLCJ0ZXN0UnVuSWQiLCJnZXRDb250ZXh0VGVzdFJ1bklkIiwiaSIsImFyZ3VtZW50cyIsImFkZFRyYWNraW5nTWFya2VyVG9GdW5jdGlvbiIsImFwcGx5IiwiX2dldFN0YWNrRnJhbWVzIiwic2F2ZWRMaW1pdCIsIkVycm9yIiwic3RhY2tUcmFjZUxpbWl0IiwiZnJhbWVzIiwiZW5zdXJlRW5hYmxlZCIsImdsb2JhbCIsInNldFRpbWVvdXQiLCJzZXRJbnRlcnZhbCIsInNldEltbWVkaWF0ZSIsInByb2Nlc3MiLCJuZXh0VGljayIsIkJhYmVsUHJvbWlzZSIsInByb3RvdHlwZSIsInRoZW4iLCJjYXRjaCIsIlByb21pc2UiLCJmbiIsIm1hcmtlckZhY3RvcnlCb2R5IiwiRnVuY3Rpb24iLCJsZW5ndGgiLCJmbk5hbWUiLCJnZXRGdW5jdGlvbk5hbWUiLCJtYXRjaCIsInJlc29sdmVDb250ZXh0VGVzdFJ1biJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLG1CQUFtQixzQ0FBekI7QUFDQSxNQUFNQyxpQkFBbUIsSUFBekI7O0FBRUE7a0JBQ2U7QUFDWEMsYUFBUyxLQURFOztBQUdYQyxvQkFBZ0IsRUFITDs7QUFLWEMsd0NBQXFDQyxjQUFyQyxFQUFxREMsZ0JBQXJELEVBQXVFO0FBQ25FLGNBQU1DLFVBQVUsSUFBaEI7O0FBRUEsZUFBTyxZQUFZO0FBQ2Ysa0JBQU1DLFlBQVlELFFBQVFFLG1CQUFSLEVBQWxCOztBQUVBLGdCQUFJRCxTQUFKLEVBQWU7QUFDWCxxQkFBSyxJQUFJ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QXhGVTs7QUEwRlhDLDRCQUF5QjtBQUNyQixjQUFNOUIsWUFBWSxLQUFLQyxtQkFBTCxFQUFsQjs7QUFFQSxlQUFPLEtBQUtOLGNBQUwsQ0FBb0JLLFNBQXBCLENBQVA7QUFDSDtBQTlGVSxDIiwiZmlsZSI6ImFwaS90ZXN0LXJ1bi10cmFja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdldFN0YWNrRnJhbWVzIGZyb20gJ2NhbGxzaXRlJztcbmltcG9ydCBCYWJlbFByb21pc2UgZnJvbSAnYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2UnO1xuXG5jb25zdCBUUkFDS0lOR19NQVJLX1JFID0gL15cXCRcXCR0ZXN0Y2FmZV90ZXN0X3J1blxcJFxcJChcXFMrKVxcJFxcJCQvO1xuY29uc3QgU1RBQ0tfQ0FQQUNJVFkgICA9IDUwMDA7XG5cbi8vIFRyYWNrZXJcbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBlbmFibGVkOiBmYWxzZSxcblxuICAgIGFjdGl2ZVRlc3RSdW5zOiB7fSxcblxuICAgIF9jcmVhdGVDb250ZXh0U3dpdGNoaW5nRnVuY3Rpb25Ib29rIChjdHhTd2l0Y2hpbmdGbiwgcGF0Y2hlZEFyZ3NDb3VudCkge1xuICAgICAgICBjb25zdCB0cmFja2VyID0gdGhpcztcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgdGVzdFJ1bklkID0gdHJhY2tlci5nZXRDb250ZXh0VGVzdFJ1bklkKCk7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0UnVuSWQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGNoZWRBcmdzQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50c1tpXSA9IHRyYWNrZXIuYWRkVHJhY2tpbmdNYXJrZXJUb0Z1bmN0aW9uKHRlc3RSdW5JZCwgYXJndW1lbnRzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdHhTd2l0Y2hpbmdGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfZ2V0U3RhY2tGcmFtZXMgKCkge1xuICAgICAgICAvLyBOT1RFOiBpbmNyZWFzZSBzdGFjayBjYXBhY2l0eSB0byBzZWVrIGRlZXAgc3RhY2sgZW50cmllc1xuICAgICAgICBjb25zdCBzYXZlZExpbWl0ID0gRXJyb3Iuc3RhY2tUcmFjZUxpbWl0O1xuXG4gICAgICAgIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IFNUQUNLX0NBUEFDSVRZO1xuXG4gICAgICAgIGNvbnN0IGZyYW1lcyA9IGdldFN0YWNrRnJhbWVzKCk7XG5cbiAgICAgICAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gc2F2ZWRMaW1pdDtcblxuICAgICAgICByZXR1cm4gZnJhbWVzO1xuICAgIH0sXG5cbiAgICBlbnN1cmVFbmFibGVkICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGdsb2JhbC5zZXRUaW1lb3V0ICAgPSB0aGlzLl9jcmVhdGVDb250ZXh0U3dpdGNoaW5nRnVuY3Rpb25Ib29rKGdsb2JhbC5zZXRUaW1lb3V0LCAxKTtcbiAgICAgICAgICAgIGdsb2JhbC5zZXRJbnRlcnZhbCAgPSB0aGlzLl9jcmVhdGVDb250ZXh0U3dpdGNoaW5nRnVuY3Rpb25Ib29rKGdsb2JhbC5zZXRJbnRlcnZhbCwgMSk7XG4gICAgICAgICAgICBnbG9iYWwuc2V0SW1tZWRpYXRlID0gdGhpcy5fY3JlYXRlQ29udGV4dFN3aXRjaGluZ0Z1bmN0aW9uSG9vayhnbG9iYWwuc2V0SW1tZWRpYXRlLCAxKTtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2sgICAgPSB0aGlzLl9jcmVhdGVDb250ZXh0U3dpdGNoaW5nRnVuY3Rpb25Ib29rKHByb2Nlc3MubmV4dFRpY2ssIDEpO1xuXG4gICAgICAgICAgICBCYWJlbFByb21pc2UucHJvdG90eXBlLnRoZW4gID0gdGhpcy5fY3JlYXRlQ29udGV4dFN3aXRjaGluZ0Z1bmN0aW9uSG9vayhCYWJlbFByb21pc2UucHJvdG90eXBlLnRoZW4sIDIpO1xuICAgICAgICAgICAgQmFiZWxQcm9taXNlLnByb3RvdHlwZS5jYXRjaCA9IHRoaXMuX2NyZWF0ZUNvbnRleHRTd2l0Y2hpbmdGdW5jdGlvbkhvb2soQmFiZWxQcm9taXNlLnByb3RvdHlwZS5jYXRjaCwgMSk7XG5cbiAgICAgICAgICAgIGlmIChnbG9iYWwuUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIGdsb2JhbC5Qcm9taXNlLnByb3RvdHlwZS50aGVuICA9IHRoaXMuX2NyZWF0ZUNvbnRleHRTd2l0Y2hpbmdGdW5jdGlvbkhvb2soZ2xvYmFsLlByb21pc2UucHJvdG90eXBlLnRoZW4sIDIpO1xuICAgICAgICAgICAgICAgIGdsb2JhbC5Qcm9taXNlLnByb3RvdHlwZS5jYXRjaCA9IHRoaXMuX2NyZWF0ZUNvbnRleHRTd2l0Y2hpbmdGdW5jdGlvbkhvb2soZ2xvYmFsLlByb21pc2UucHJvdG90eXBlLmNhdGNoLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGRUcmFja2luZ01hcmtlclRvRnVuY3Rpb24gKHRlc3RSdW5JZCwgZm4pIHtcbiAgICAgICAgY29uc3QgbWFya2VyRmFjdG9yeUJvZHkgPSBgXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gJCR0ZXN0Y2FmZV90ZXN0X3J1biQkJHt0ZXN0UnVuSWR9JCQgKCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBmbi5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6IHJldHVybiBmbi5jYWxsKHRoaXMsIGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIGZuLmNhbGwodGhpcywgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6IHJldHVybiBmbi5jYWxsKHRoaXMsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBmbi5jYWxsKHRoaXMsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXSk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIGA7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbignZm4nLCBtYXJrZXJGYWN0b3J5Qm9keSkoZm4pO1xuICAgIH0sXG5cbiAgICBnZXRDb250ZXh0VGVzdFJ1bklkICgpIHtcbiAgICAgICAgY29uc3QgZnJhbWVzID0gdGhpcy5fZ2V0U3RhY2tGcmFtZXMoKTtcblxuICAgICAgICAvLyBPUFRJTUlaQVRJT046IHdlIHN0YXJ0IHRyYXZlcnNpbmcgZnJvbSB0aGUgYm90dG9tIG9mIHRoZSBzdGFjayxcbiAgICAgICAgLy8gYmVjYXVzZSB3ZSdsbCBtb3JlIGxpa2VseSBlbmNvdW50ZXIgYSBtYXJrZXIgdGhlcmUuXG4gICAgICAgIC8vIEFzeW5jL2F3YWl0IGFuZCBQcm9taXNlIG1hY2hpbmVyeSBleGVjdXRlcyBsb3RzIG9mIGludHJpbnNpY3NcbiAgICAgICAgLy8gb24gdGltZXJzICh3aGVyZSB3ZSBoYXZlIGEgbWFya2VyKS4gQW5kLCBzaW5jZSBhIHRpbWVyIGluaXRpYXRlcyBhIG5ld1xuICAgICAgICAvLyBzdGFjaywgdGhlIG1hcmtlciB3aWxsIGJlIGF0IHRoZSB2ZXJ5IGJvdHRvbSBvZiBpdC5cbiAgICAgICAgZm9yIChsZXQgaSA9IGZyYW1lcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgZm5OYW1lID0gZnJhbWVzW2ldLmdldEZ1bmN0aW9uTmFtZSgpO1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggID0gZm5OYW1lICYmIGZuTmFtZS5tYXRjaChUUkFDS0lOR19NQVJLX1JFKTtcblxuICAgICAgICAgICAgaWYgKG1hdGNoKVxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICByZXNvbHZlQ29udGV4dFRlc3RSdW4gKCkge1xuICAgICAgICBjb25zdCB0ZXN0UnVuSWQgPSB0aGlzLmdldENvbnRleHRUZXN0UnVuSWQoKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVUZXN0UnVuc1t0ZXN0UnVuSWRdO1xuICAgIH1cbn07XG4iXX0=
