'use strict';

exports.__esModule = true;

var _renderTemplate = require('../utils/render-template');

var _renderTemplate2 = _interopRequireDefault(_renderTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WarningLog {
    constructor() {
        this.messages = [];
    }

    addWarning() {
        const msg = _renderTemplate2.default.apply(null, arguments);

        // NOTE: avoid duplicates
        if (this.messages.indexOf(msg) < 0) this.messages.push(msg);
    }
}
exports.default = WarningLog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub3RpZmljYXRpb25zL3dhcm5pbmctbG9nLmpzIl0sIm5hbWVzIjpbIldhcm5pbmdMb2ciLCJjb25zdHJ1Y3RvciIsIm1lc3NhZ2VzIiwiYWRkV2FybmluZyIsIm1zZyIsInJlbmRlclRlbXBsYXRlIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJpbmRleE9mIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Ozs7QUFFZSxNQUFNQSxVQUFOLENBQWlCO0FBQzVCQyxrQkFBZTtBQUNYLGFBQUtDLFFBQUwsR0FBZ0IsRUFBaEI7QUFDSDs7QUFFREMsaUJBQWM7QUFDVixjQUFNQyxNQUFNQyx5QkFBZUMsS0FBZixDQUFxQixJQUFyQixFQUEyQkMsU0FBM0IsQ0FBWjs7QUFFQTtBQUNBLFlBQUksS0FBS0wsUUFBTCxDQUFjTSxPQUFkLENBQXNCSixHQUF0QixJQUE2QixDQUFqQyxFQUNJLEtBQUtGLFFBQUwsQ0FBY08sSUFBZCxDQUFtQkwsR0FBbkI7QUFDUDtBQVgyQjtrQkFBWEosVSIsImZpbGUiOiJub3RpZmljYXRpb25zL3dhcm5pbmctbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlbmRlclRlbXBsYXRlIGZyb20gJy4uL3V0aWxzL3JlbmRlci10ZW1wbGF0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhcm5pbmdMb2cge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcyA9IFtdO1xuICAgIH1cblxuICAgIGFkZFdhcm5pbmcgKCkge1xuICAgICAgICBjb25zdCBtc2cgPSByZW5kZXJUZW1wbGF0ZS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIC8vIE5PVEU6IGF2b2lkIGR1cGxpY2F0ZXNcbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZXMuaW5kZXhPZihtc2cpIDwgMClcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZXMucHVzaChtc2cpO1xuICAgIH1cbn1cbiJdfQ==
