'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _events = require('events');

var _promisifyEvent = require('promisify-event');

var _promisifyEvent2 = _interopRequireDefault(_promisifyEvent);

var _timeLimitPromise = require('time-limit-promise');

var _timeLimitPromise2 = _interopRequireDefault(_timeLimitPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const REMOTE_REDIRECT_TIMEOUT = 10000;
const ADDING_CONNECTION_WAITING_TIMEOUT = 10000;

class RemotesQueue {
    constructor() {
        this.events = new _events.EventEmitter();
        this.shiftingTimeout = _pinkie2.default.resolve();
        this.pendingConnections = {};
    }

    add(remoteConnection) {
        const connectionReadyPromise = (0, _promisifyEvent2.default)(remoteConnection, 'ready').then(() => this.remove(remoteConnection));

        this.pendingConnections[remoteConnection.id] = {
            connection: remoteConnection,
            readyPromise: connectionReadyPromise
        };

        this.events.emit('connection-added', remoteConnection.id);
    }

    remove(remoteConnection) {
        delete this.pendingConnections[remoteConnection.id];
    }

    shift() {
        var _this = this;

        const shiftingPromise = this.shiftingTimeout.then((0, _asyncToGenerator3.default)(function* () {
            let headId = (0, _keys2.default)(_this.pendingConnections)[0];

            if (!headId) headId = yield (0, _timeLimitPromise2.default)((0, _promisifyEvent2.default)(_this.events, 'connection-added'), ADDING_CONNECTION_WAITING_TIMEOUT);

            return headId ? _this.pendingConnections[headId].connection : null;
        }));

        this.shiftingTimeout = shiftingPromise.then(connection => {
            if (!connection) return _pinkie2.default.resolve();

            return (0, _timeLimitPromise2.default)(this.pendingConnections[connection.id].readyPromise, REMOTE_REDIRECT_TIMEOUT);
        });

        return shiftingPromise;
    }
}
exports.default = RemotesQueue;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9icm93c2VyL2Nvbm5lY3Rpb24vcmVtb3Rlcy1xdWV1ZS5qcyJdLCJuYW1lcyI6WyJSRU1PVEVfUkVESVJFQ1RfVElNRU9VVCIsIkFERElOR19DT05ORUNUSU9OX1dBSVRJTkdfVElNRU9VVCIsIlJlbW90ZXNRdWV1ZSIsImNvbnN0cnVjdG9yIiwiZXZlbnRzIiwiRXZlbnRFbWl0dGVyIiwic2hpZnRpbmdUaW1lb3V0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJwZW5kaW5nQ29ubmVjdGlvbnMiLCJhZGQiLCJyZW1vdGVDb25uZWN0aW9uIiwiY29ubmVjdGlvblJlYWR5UHJvbWlzZSIsInRoZW4iLCJyZW1vdmUiLCJpZCIsImNvbm5lY3Rpb24iLCJyZWFkeVByb21pc2UiLCJlbWl0Iiwic2hpZnQiLCJzaGlmdGluZ1Byb21pc2UiLCJoZWFkSWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0EsTUFBTUEsMEJBQW9DLEtBQTFDO0FBQ0EsTUFBTUMsb0NBQW9DLEtBQTFDOztBQUVlLE1BQU1DLFlBQU4sQ0FBbUI7QUFDOUJDLGtCQUFlO0FBQ1gsYUFBS0MsTUFBTCxHQUEwQixJQUFJQyxvQkFBSixFQUExQjtBQUNBLGFBQUtDLGVBQUwsR0FBMEJDLGlCQUFRQyxPQUFSLEVBQTFCO0FBQ0EsYUFBS0Msa0JBQUwsR0FBMEIsRUFBMUI7QUFDSDs7QUFFREMsUUFBS0MsZ0JBQUwsRUFBdUI7QUFDbkIsY0FBTUMseUJBQXlCLDhCQUFlRCxnQkFBZixFQUFpQyxPQUFqQyxFQUMxQkUsSUFEMEIsQ0FDckIsTUFBTSxLQUFLQyxNQUFMLENBQVlILGdCQUFaLENBRGUsQ0FBL0I7O0FBR0EsYUFBS0Ysa0JBQUwsQ0FBd0JFLGlCQUFpQkksRUFBekMsSUFBK0M7QUFDM0NDLHdCQUFjTCxnQkFENkI7QUFFM0NNLDBCQUFjTDtBQUY2QixTQUEvQzs7QUFLQSxhQUFLUixNQUFMLENBQVljLElBQVosQ0FBaUIsa0JBQWpCLEVBQXFDUCxpQkFBaUJJLEVBQXREO0FBQ0g7O0FBRURELFdBQVFILGdCQUFSLEVBQTBCO0FBQ3RCLGVBQU8sS0FBS0Ysa0JBQUwsQ0FBd0JFLGlCQUFpQkksRUFBekMsQ0FBUDtBQUNIOztBQUVESSxZQUFTO0FBQUE7O0FBQ0wsY0FBTUMsa0JBQWtCLEtBQUtkLGVBQUwsQ0FDbkJPLElBRG1CLGlDQUNkLGFBQVk7QUFDZCxnQkFBSVEsU0FBUyxvQkFBWSxNQUFLWixrQkFBakIsRUFBcUMsQ0FBckMsQ0FBYjs7QUFFQSxnQkFBSSxDQUFDWSxNQUFMLEVBQ0lBLFNBQVMsTUFBTSxnQ0FBc0IsOEJBQWUsTUFBS2pCLE1BQXBCLEVBQTRCLGtCQUE1QixDQUF0QixFQUF1RUgsaUNBQXZFLENBQWY7O0FBRUosbUJBQU9vQixTQUFTLE1BQUtaLGtCQUFMLENBQXdCWSxNQUF4QixFQUFnQ0wsVUFBekMsR0FBc0QsSUFBN0Q7QUFDSCxTQVJtQixFQUF4Qjs7QUFVQSxhQUFLVixlQUFMLEdBQXVCYyxnQkFDbEJQLElBRGtCLENBQ2JHLGNBQWM7QUFDaEIsZ0JBQUksQ0FBQ0EsVUFBTCxFQUNJLE9BQU9ULGlCQUFRQyxPQUFSLEVBQVA7O0FBRUosbUJBQU8sZ0NBQXNCLEtBQUtDLGtCQUFMLENBQXdCTyxXQUFXRCxFQUFuQyxFQUF1Q0UsWUFBN0QsRUFBMkVqQix1QkFBM0UsQ0FBUDtBQUNILFNBTmtCLENBQXZCOztBQVFBLGVBQU9vQixlQUFQO0FBQ0g7QUEzQzZCO2tCQUFibEIsWSIsImZpbGUiOiJicm93c2VyL2Nvbm5lY3Rpb24vcmVtb3Rlcy1xdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IHByb21pc2lmeUV2ZW50IGZyb20gJ3Byb21pc2lmeS1ldmVudCc7XG5pbXBvcnQgZ2V0VGltZUxpbWl0ZWRQcm9taXNlIGZyb20gJ3RpbWUtbGltaXQtcHJvbWlzZSc7XG5cblxuY29uc3QgUkVNT1RFX1JFRElSRUNUX1RJTUVPVVQgICAgICAgICAgID0gMTAwMDA7XG5jb25zdCBBRERJTkdfQ09OTkVDVElPTl9XQUlUSU5HX1RJTUVPVVQgPSAxMDAwMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVtb3Rlc1F1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzICAgICAgICAgICAgID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLnNoaWZ0aW5nVGltZW91dCAgICA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB0aGlzLnBlbmRpbmdDb25uZWN0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGFkZCAocmVtb3RlQ29ubmVjdGlvbikge1xuICAgICAgICBjb25zdCBjb25uZWN0aW9uUmVhZHlQcm9taXNlID0gcHJvbWlzaWZ5RXZlbnQocmVtb3RlQ29ubmVjdGlvbiwgJ3JlYWR5JylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMucmVtb3ZlKHJlbW90ZUNvbm5lY3Rpb24pKTtcblxuICAgICAgICB0aGlzLnBlbmRpbmdDb25uZWN0aW9uc1tyZW1vdGVDb25uZWN0aW9uLmlkXSA9IHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb246ICAgcmVtb3RlQ29ubmVjdGlvbixcbiAgICAgICAgICAgIHJlYWR5UHJvbWlzZTogY29ubmVjdGlvblJlYWR5UHJvbWlzZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2Nvbm5lY3Rpb24tYWRkZWQnLCByZW1vdGVDb25uZWN0aW9uLmlkKTtcbiAgICB9XG5cbiAgICByZW1vdmUgKHJlbW90ZUNvbm5lY3Rpb24pIHtcbiAgICAgICAgZGVsZXRlIHRoaXMucGVuZGluZ0Nvbm5lY3Rpb25zW3JlbW90ZUNvbm5lY3Rpb24uaWRdO1xuICAgIH1cblxuICAgIHNoaWZ0ICgpIHtcbiAgICAgICAgY29uc3Qgc2hpZnRpbmdQcm9taXNlID0gdGhpcy5zaGlmdGluZ1RpbWVvdXRcbiAgICAgICAgICAgIC50aGVuKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaGVhZElkID0gT2JqZWN0LmtleXModGhpcy5wZW5kaW5nQ29ubmVjdGlvbnMpWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFoZWFkSWQpXG4gICAgICAgICAgICAgICAgICAgIGhlYWRJZCA9IGF3YWl0IGdldFRpbWVMaW1pdGVkUHJvbWlzZShwcm9taXNpZnlFdmVudCh0aGlzLmV2ZW50cywgJ2Nvbm5lY3Rpb24tYWRkZWQnKSwgQURESU5HX0NPTk5FQ1RJT05fV0FJVElOR19USU1FT1VUKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBoZWFkSWQgPyB0aGlzLnBlbmRpbmdDb25uZWN0aW9uc1toZWFkSWRdLmNvbm5lY3Rpb24gOiBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zaGlmdGluZ1RpbWVvdXQgPSBzaGlmdGluZ1Byb21pc2VcbiAgICAgICAgICAgIC50aGVuKGNvbm5lY3Rpb24gPT4ge1xuICAgICAgICAgICAgICAgIGlmICghY29ubmVjdGlvbilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFRpbWVMaW1pdGVkUHJvbWlzZSh0aGlzLnBlbmRpbmdDb25uZWN0aW9uc1tjb25uZWN0aW9uLmlkXS5yZWFkeVByb21pc2UsIFJFTU9URV9SRURJUkVDVF9USU1FT1VUKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzaGlmdGluZ1Byb21pc2U7XG4gICAgfVxufVxuIl19
