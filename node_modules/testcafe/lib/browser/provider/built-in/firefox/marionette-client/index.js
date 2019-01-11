'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _net = require('net');

var _promisifyEvent = require('promisify-event');

var _promisifyEvent2 = _interopRequireDefault(_promisifyEvent);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _promisifiedFunctions = require('../../../../../utils/promisified-functions');

var _delay = require('../../../../../utils/delay');

var _delay2 = _interopRequireDefault(_delay);

var _clientFunctions = require('../../../utils/client-functions');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CONNECTION_TIMEOUT = 30000;
const CONNECTION_RETRY_DELAY = 300;
const MAX_RESIZE_RETRY_COUNT = 2;
const HEADER_SEPARATOR = ':';

module.exports = class MarionetteClient {
    constructor(port = 2828, host = '127.0.0.1') {
        this.currentPacketNumber = 1;
        this.events = new _events2.default();
        this.port = port;
        this.host = host;
        this.socket = new _net.Socket();
        this.buffer = Buffer.alloc(0);
        this.getPacketPromise = _pinkie2.default.resolve();
        this.sendPacketPromise = _pinkie2.default.resolve();

        this.protocolInfo = {
            applicationType: '',
            marionetteProtocol: ''
        };

        this.sessionInfo = null;
    }

    _attemptToConnect(port, host) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this.socket.connect(port, host);

            const connectionPromise = _pinkie2.default.race([(0, _promisifyEvent2.default)(_this.socket, 'connect'), (0, _promisifyEvent2.default)(_this.socket, 'error')]);

            return yield connectionPromise.then(function () {
                return true;
            }).catch(function () {
                _this.socket.removeAllListeners('connect');
                return (0, _delay2.default)(CONNECTION_RETRY_DELAY);
            });
        })();
    }

    _connectSocket(port, host) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const connectionStartTime = Date.now();

            let connected = yield _this2._attemptToConnect(port, host);

            while (!connected && Date.now() - connectionStartTime < CONNECTION_TIMEOUT) connected = yield _this2._attemptToConnect(port, host);

            if (!connected) throw new Error('Unable to connect');

            _this2.socket.on('data', function (data) {
                return _this2._handleNewData(data);
            });
        })();
    }

    _writeSocket(message) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this3.socket.write(message)) yield (0, _promisifyEvent2.default)(_this3.socket, 'drain');
        })();
    }

    _handleNewData(data) {
        if (!data) return;

        this.buffer = Buffer.concat([this.buffer, data]);

        this.events.emit('new-data');
    }

    _getPacket() {
        var _this4 = this;

        this.getPacketPromise = this.getPacketPromise.then((0, _asyncToGenerator3.default)(function* () {
            let headerEndIndex = _this4.buffer.indexOf(HEADER_SEPARATOR);

            while (headerEndIndex < 0) {
                yield (0, _promisifyEvent2.default)(_this4.events, 'new-data');

                headerEndIndex = _this4.buffer.indexOf(HEADER_SEPARATOR);
            }

            const packet = {
                length: NaN,
                body: null
            };

            packet.length = parseInt(_this4.buffer.toString('utf8', 0, headerEndIndex), 10) || 0;

            const bodyStartIndex = headerEndIndex + HEADER_SEPARATOR.length;
            const bodyEndIndex = bodyStartIndex + packet.length;

            if (packet.length) {
                while (_this4.buffer.length < bodyEndIndex) yield (0, _promisifyEvent2.default)(_this4.events, 'new-data');

                packet.body = JSON.parse(_this4.buffer.toString('utf8', bodyStartIndex, bodyEndIndex));
            }

            _this4.buffer = _this4.buffer.slice(bodyEndIndex);

            return packet;
        }));

        return this.getPacketPromise;
    }

    _sendPacket(payload) {
        var _this5 = this;

        this.sendPacketPromise = this.sendPacketPromise.then((0, _asyncToGenerator3.default)(function* () {
            const body = [0, _this5.currentPacketNumber++, payload.command, payload.parameters];
            const serialized = (0, _stringify2.default)(body);
            const message = Buffer.byteLength(serialized, 'utf8') + HEADER_SEPARATOR + serialized;

            _this5._writeSocket(message);
        }));

        return this.sendPacketPromise;
    }

    _throwMarionetteError(error) {
        throw new Error(`${error.error}${error.message ? ': ' + error.message : ''}`);
    }

    _getResponse(packet) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const packetNumber = _this6.currentPacketNumber;

            yield _this6._sendPacket(packet);

            let responsePacket = yield _this6._getPacket();

            while (!responsePacket.body || responsePacket.body[1] !== packetNumber) responsePacket = yield _this6._getPacket();

            if (responsePacket.body[2]) _this6._throwMarionetteError(responsePacket.body[2]);

            return responsePacket.body[3];
        })();
    }

    connect() {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this7._connectSocket(_this7.port, _this7.host);

            const infoPacket = yield _this7._getPacket();

            _this7.protocolInfo = {
                applicationType: infoPacket.body.applicationType,
                marionetteProtocol: infoPacket.body.marionetteProtocol
            };

            _this7.sessionInfo = yield _this7._getResponse({ command: _commands2.default.newSession });
        })();
    }

    dispose() {
        this.socket.end();
        this.buffer = null;
    }

    executeScript(code) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this8._getResponse({
                command: _commands2.default.executeScript,
                parameters: { script: `return (${code})()` }
            });
        })();
    }

    takeScreenshot(path) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const screenshot = yield _this9._getResponse({ command: _commands2.default.takeScreenshot });

            yield (0, _promisifiedFunctions.writeFile)(path, screenshot.value, { encoding: 'base64' });
        })();
    }

    setWindowSize(width, height) {
        var _this10 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var _ref3 = yield _this10.executeScript(_clientFunctions.GET_WINDOW_DIMENSIONS_INFO_SCRIPT);

            let pageRect = _ref3.value;

            let attemptCounter = 0;

            while (attemptCounter++ < MAX_RESIZE_RETRY_COUNT && (pageRect.width !== width || pageRect.height !== height)) {
                const currentRect = yield _this10._getResponse({ command: _commands2.default.getWindowRect });

                yield _this10._getResponse({
                    command: _commands2.default.setWindowRect,

                    parameters: {
                        x: currentRect.x,
                        y: currentRect.y,
                        width: width + (currentRect.width - pageRect.width),
                        height: height + (currentRect.height - pageRect.height)
                    }
                });

                var _ref4 = yield _this10.executeScript(_clientFunctions.GET_WINDOW_DIMENSIONS_INFO_SCRIPT);

                pageRect = _ref4.value;
            }
        })();
    }

    quit() {
        var _this11 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this11._getResponse({ command: _commands2.default.quit });
        })();
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2ZpcmVmb3gvbWFyaW9uZXR0ZS1jbGllbnQvaW5kZXguanMiXSwibmFtZXMiOlsiQ09OTkVDVElPTl9USU1FT1VUIiwiQ09OTkVDVElPTl9SRVRSWV9ERUxBWSIsIk1BWF9SRVNJWkVfUkVUUllfQ09VTlQiLCJIRUFERVJfU0VQQVJBVE9SIiwibW9kdWxlIiwiZXhwb3J0cyIsIk1hcmlvbmV0dGVDbGllbnQiLCJjb25zdHJ1Y3RvciIsInBvcnQiLCJob3N0IiwiY3VycmVudFBhY2tldE51bWJlciIsImV2ZW50cyIsIkV2ZW50RW1pdHRlciIsInNvY2tldCIsIlNvY2tldCIsImJ1ZmZlciIsIkJ1ZmZlciIsImFsbG9jIiwiZ2V0UGFja2V0UHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwic2VuZFBhY2tldFByb21pc2UiLCJwcm90b2NvbEluZm8iLCJhcHBsaWNhdGlvblR5cGUiLCJtYXJpb25ldHRlUHJvdG9jb2wiLCJzZXNzaW9uSW5mbyIsIl9hdHRlbXB0VG9Db25uZWN0IiwiY29ubmVjdCIsImNvbm5lY3Rpb25Qcm9taXNlIiwicmFjZSIsInRoZW4iLCJjYXRjaCIsInJlbW92ZUFsbExpc3RlbmVycyIsIl9jb25uZWN0U29ja2V0IiwiY29ubmVjdGlvblN0YXJ0VGltZSIsIkRhdGUiLCJub3ciLCJjb25uZWN0ZWQiLCJFcnJvciIsIm9uIiwiX2hhbmRsZU5ld0RhdGEiLCJkYXRhIiwiX3dyaXRlU29ja2V0IiwibWVzc2FnZSIsIndyaXRlIiwiY29uY2F0IiwiZW1pdCIsIl9nZXRQYWNrZXQiLCJoZWFkZXJFbmRJbmRleCIsImluZGV4T2YiLCJwYWNrZXQiLCJsZW5ndGgiLCJOYU4iLCJib2R5IiwicGFyc2VJbnQiLCJ0b1N0cmluZyIsImJvZHlTdGFydEluZGV4IiwiYm9keUVuZEluZGV4IiwiSlNPTiIsInBhcnNlIiwic2xpY2UiLCJfc2VuZFBhY2tldCIsInBheWxvYWQiLCJjb21tYW5kIiwicGFyYW1ldGVycyIsInNlcmlhbGl6ZWQiLCJieXRlTGVuZ3RoIiwiX3Rocm93TWFyaW9uZXR0ZUVycm9yIiwiZXJyb3IiLCJfZ2V0UmVzcG9uc2UiLCJwYWNrZXROdW1iZXIiLCJyZXNwb25zZVBhY2tldCIsImluZm9QYWNrZXQiLCJDT01NQU5EUyIsIm5ld1Nlc3Npb24iLCJkaXNwb3NlIiwiZW5kIiwiZXhlY3V0ZVNjcmlwdCIsImNvZGUiLCJzY3JpcHQiLCJ0YWtlU2NyZWVuc2hvdCIsInBhdGgiLCJzY3JlZW5zaG90IiwidmFsdWUiLCJlbmNvZGluZyIsInNldFdpbmRvd1NpemUiLCJ3aWR0aCIsImhlaWdodCIsIkdFVF9XSU5ET1dfRElNRU5TSU9OU19JTkZPX1NDUklQVCIsInBhZ2VSZWN0IiwiYXR0ZW1wdENvdW50ZXIiLCJjdXJyZW50UmVjdCIsImdldFdpbmRvd1JlY3QiLCJzZXRXaW5kb3dSZWN0IiwieCIsInkiLCJxdWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBR0EsTUFBTUEscUJBQXlCLEtBQS9CO0FBQ0EsTUFBTUMseUJBQXlCLEdBQS9CO0FBQ0EsTUFBTUMseUJBQXlCLENBQS9CO0FBQ0EsTUFBTUMsbUJBQXlCLEdBQS9COztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLE1BQU1DLGdCQUFOLENBQXVCO0FBQ3BDQyxnQkFBYUMsT0FBTyxJQUFwQixFQUEwQkMsT0FBTyxXQUFqQyxFQUE4QztBQUMxQyxhQUFLQyxtQkFBTCxHQUEyQixDQUEzQjtBQUNBLGFBQUtDLE1BQUwsR0FBMkIsSUFBSUMsZ0JBQUosRUFBM0I7QUFDQSxhQUFLSixJQUFMLEdBQTJCQSxJQUEzQjtBQUNBLGFBQUtDLElBQUwsR0FBMkJBLElBQTNCO0FBQ0EsYUFBS0ksTUFBTCxHQUEyQixJQUFJQyxXQUFKLEVBQTNCO0FBQ0EsYUFBS0MsTUFBTCxHQUEyQkMsT0FBT0Ms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LFlBQUwsQ0FBa0I7QUFDcEJOLDZCQUFTVSxtQkFBU29CLGFBREU7O0FBR3BCN0IsZ0NBQVk7QUFDUjhCLDJCQUFRSCxZQUFZRyxDQURaO0FBRVJDLDJCQUFRSixZQUFZSSxDQUZaO0FBR1JULCtCQUFRQSxTQUFTSyxZQUFZTCxLQUFaLEdBQW9CRyxTQUFTSCxLQUF0QyxDQUhBO0FBSVJDLGdDQUFRQSxVQUFVSSxZQUFZSixNQUFaLEdBQXFCRSxTQUFTRixNQUF4QztBQUpBO0FBSFEsaUJBQWxCLENBQU47O0FBSDBHLDRCQWNuRixNQUFNLFFBQUtWLGFBQUwsQ0FBbUJXLGtEQUFuQixDQWQ2RTs7QUFjaEdDLHdCQWRnRyxTQWN2R04sS0FkdUc7QUFlN0c7QUFuQitCO0FBb0JuQzs7QUFFS2EsUUFBTixHQUFjO0FBQUE7O0FBQUE7QUFDVixrQkFBTSxRQUFLM0IsWUFBTCxDQUFrQixFQUFFTixTQUFTVSxtQkFBU3VCLElBQXBCLEVBQWxCLENBQU47QUFEVTtBQUViO0FBekxtQyxDQUF4QyIsImZpbGUiOiJicm93c2VyL3Byb3ZpZGVyL2J1aWx0LWluL2ZpcmVmb3gvbWFyaW9uZXR0ZS1jbGllbnQvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdwaW5raWUnO1xuaW1wb3J0IHsgU29ja2V0IH0gZnJvbSAnbmV0JztcbmltcG9ydCBwcm9taXNpZnlFdmVudCBmcm9tICdwcm9taXNpZnktZXZlbnQnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuaW1wb3J0IHsgd3JpdGVGaWxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbHMvcHJvbWlzaWZpZWQtZnVuY3Rpb25zJztcbmltcG9ydCBkZWxheSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlscy9kZWxheSc7XG5pbXBvcnQgeyBHRVRfV0lORE9XX0RJTUVOU0lPTlNfSU5GT19TQ1JJUFQgfSBmcm9tICcuLi8uLi8uLi91dGlscy9jbGllbnQtZnVuY3Rpb25zJztcbmltcG9ydCBDT01NQU5EUyBmcm9tICcuL2NvbW1hbmRzJztcblxuXG5jb25zdCBDT05ORUNUSU9OX1RJTUVPVVQgICAgID0gMzAwMDA7XG5jb25zdCBDT05ORUNUSU9OX1JFVFJZX0RFTEFZID0gMzAwO1xuY29uc3QgTUFYX1JFU0laRV9SRVRSWV9DT1VOVCA9IDI7XG5jb25zdCBIRUFERVJfU0VQQVJBVE9SICAgICAgID0gJzonO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIE1hcmlvbmV0dGVDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yIChwb3J0ID0gMjgyOCwgaG9zdCA9ICcxMjcuMC4wLjEnKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFBhY2tldE51bWJlciA9IDE7XG4gICAgICAgIHRoaXMuZXZlbnRzICAgICAgICAgICAgICA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5wb3J0ICAgICAgICAgICAgICAgID0gcG9ydDtcbiAgICAgICAgdGhpcy5ob3N0ICAgICAgICAgICAgICAgID0gaG9zdDtcbiAgICAgICAgdGhpcy5zb2NrZXQgICAgICAgICAgICAgID0gbmV3IFNvY2tldCgpO1xuICAgICAgICB0aGlzLmJ1ZmZlciAgICAgICAgICAgICAgPSBCdWZmZXIuYWxsb2MoMCk7XG4gICAgICAgIHRoaXMuZ2V0UGFja2V0UHJvbWlzZSAgICA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB0aGlzLnNlbmRQYWNrZXRQcm9taXNlICAgPSBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgICAgICB0aGlzLnByb3RvY29sSW5mbyA9IHtcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uVHlwZTogICAgJycsXG4gICAgICAgICAgICBtYXJpb25ldHRlUHJvdG9jb2w6ICcnLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8gPSBudWxsO1xuICAgIH1cblxuICAgIGFzeW5jIF9hdHRlbXB0VG9Db25uZWN0IChwb3J0LCBob3N0KSB7XG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QocG9ydCwgaG9zdCk7XG5cbiAgICAgICAgY29uc3QgY29ubmVjdGlvblByb21pc2UgPSBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgICAgcHJvbWlzaWZ5RXZlbnQodGhpcy5zb2NrZXQsICdjb25uZWN0JyksXG4gICAgICAgICAgICBwcm9taXNpZnlFdmVudCh0aGlzLnNvY2tldCwgJ2Vycm9yJylcbiAgICAgICAgXSk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGNvbm5lY3Rpb25Qcm9taXNlXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0cnVlKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2Nvbm5lY3QnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsYXkoQ09OTkVDVElPTl9SRVRSWV9ERUxBWSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBfY29ubmVjdFNvY2tldCAocG9ydCwgaG9zdCkge1xuICAgICAgICBjb25zdCBjb25uZWN0aW9uU3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgICBsZXQgY29ubmVjdGVkID0gYXdhaXQgdGhpcy5fYXR0ZW1wdFRvQ29ubmVjdChwb3J0LCBob3N0KTtcblxuICAgICAgICB3aGlsZSAoIWNvbm5lY3RlZCAmJiBEYXRlLm5vdygpIC0gY29ubmVjdGlvblN0YXJ0VGltZSA8IENPTk5FQ1RJT05fVElNRU9VVClcbiAgICAgICAgICAgIGNvbm5lY3RlZCA9IGF3YWl0IHRoaXMuX2F0dGVtcHRUb0Nvbm5lY3QocG9ydCwgaG9zdCk7XG5cbiAgICAgICAgaWYgKCFjb25uZWN0ZWQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjb25uZWN0Jyk7XG5cbiAgICAgICAgdGhpcy5zb2NrZXQub24oJ2RhdGEnLCBkYXRhID0+IHRoaXMuX2hhbmRsZU5ld0RhdGEoZGF0YSkpO1xuICAgIH1cblxuICAgIGFzeW5jIF93cml0ZVNvY2tldCAobWVzc2FnZSkge1xuICAgICAgICBpZiAoIXRoaXMuc29ja2V0LndyaXRlKG1lc3NhZ2UpKVxuICAgICAgICAgICAgYXdhaXQgcHJvbWlzaWZ5RXZlbnQodGhpcy5zb2NrZXQsICdkcmFpbicpO1xuICAgIH1cblxuICAgIF9oYW5kbGVOZXdEYXRhIChkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLmJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW3RoaXMuYnVmZmVyLCBkYXRhXSk7XG5cbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCgnbmV3LWRhdGEnKTtcbiAgICB9XG5cbiAgICBfZ2V0UGFja2V0ICgpIHtcbiAgICAgICAgdGhpcy5nZXRQYWNrZXRQcm9taXNlID0gdGhpcy5nZXRQYWNrZXRQcm9taXNlLnRoZW4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGhlYWRlckVuZEluZGV4ID0gdGhpcy5idWZmZXIuaW5kZXhPZihIRUFERVJfU0VQQVJBVE9SKTtcblxuICAgICAgICAgICAgd2hpbGUgKGhlYWRlckVuZEluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHByb21pc2lmeUV2ZW50KHRoaXMuZXZlbnRzLCAnbmV3LWRhdGEnKTtcblxuICAgICAgICAgICAgICAgIGhlYWRlckVuZEluZGV4ID0gdGhpcy5idWZmZXIuaW5kZXhPZihIRUFERVJfU0VQQVJBVE9SKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcGFja2V0ID0ge1xuICAgICAgICAgICAgICAgIGxlbmd0aDogTmFOLFxuICAgICAgICAgICAgICAgIGJvZHk6ICAgbnVsbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcGFja2V0Lmxlbmd0aCA9IHBhcnNlSW50KHRoaXMuYnVmZmVyLnRvU3RyaW5nKCd1dGY4JywgMCwgaGVhZGVyRW5kSW5kZXgpLCAxMCkgfHwgMDtcblxuICAgICAgICAgICAgY29uc3QgYm9keVN0YXJ0SW5kZXggPSBoZWFkZXJFbmRJbmRleCArIEhFQURFUl9TRVBBUkFUT1IubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgYm9keUVuZEluZGV4ICAgPSBib2R5U3RhcnRJbmRleCArIHBhY2tldC5sZW5ndGg7XG5cbiAgICAgICAgICAgIGlmIChwYWNrZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuYnVmZmVyLmxlbmd0aCA8IGJvZHlFbmRJbmRleClcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgcHJvbWlzaWZ5RXZlbnQodGhpcy5ldmVudHMsICduZXctZGF0YScpO1xuXG4gICAgICAgICAgICAgICAgcGFja2V0LmJvZHkgPSBKU09OLnBhcnNlKHRoaXMuYnVmZmVyLnRvU3RyaW5nKCd1dGY4JywgYm9keVN0YXJ0SW5kZXgsIGJvZHlFbmRJbmRleCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IHRoaXMuYnVmZmVyLnNsaWNlKGJvZHlFbmRJbmRleCk7XG5cbiAgICAgICAgICAgIHJldHVybiBwYWNrZXQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmdldFBhY2tldFByb21pc2U7XG4gICAgfVxuXG4gICAgX3NlbmRQYWNrZXQgKHBheWxvYWQpIHtcbiAgICAgICAgdGhpcy5zZW5kUGFja2V0UHJvbWlzZSA9IHRoaXMuc2VuZFBhY2tldFByb21pc2UudGhlbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBib2R5ICAgICAgID0gWzAsIHRoaXMuY3VycmVudFBhY2tldE51bWJlcisrLCBwYXlsb2FkLmNvbW1hbmQsIHBheWxvYWQucGFyYW1ldGVyc107XG4gICAgICAgICAgICBjb25zdCBzZXJpYWxpemVkID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlICAgID0gQnVmZmVyLmJ5dGVMZW5ndGgoc2VyaWFsaXplZCwgJ3V0ZjgnKSArIEhFQURFUl9TRVBBUkFUT1IgKyBzZXJpYWxpemVkO1xuXG4gICAgICAgICAgICB0aGlzLl93cml0ZVNvY2tldChtZXNzYWdlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VuZFBhY2tldFByb21pc2U7XG4gICAgfVxuXG4gICAgX3Rocm93TWFyaW9uZXR0ZUVycm9yIChlcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3IuZXJyb3J9JHtlcnJvci5tZXNzYWdlID8gJzogJyArIGVycm9yLm1lc3NhZ2UgOiAnJ31gKTtcbiAgICB9XG5cbiAgICBhc3luYyBfZ2V0UmVzcG9uc2UgKHBhY2tldCkge1xuICAgICAgICBjb25zdCBwYWNrZXROdW1iZXIgPSB0aGlzLmN1cnJlbnRQYWNrZXROdW1iZXI7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5fc2VuZFBhY2tldChwYWNrZXQpO1xuXG4gICAgICAgIGxldCByZXNwb25zZVBhY2tldCA9IGF3YWl0IHRoaXMuX2dldFBhY2tldCgpO1xuXG4gICAgICAgIHdoaWxlICghcmVzcG9uc2VQYWNrZXQuYm9keSB8fCByZXNwb25zZVBhY2tldC5ib2R5WzFdICE9PSBwYWNrZXROdW1iZXIpXG4gICAgICAgICAgICByZXNwb25zZVBhY2tldCA9IGF3YWl0IHRoaXMuX2dldFBhY2tldCgpO1xuXG4gICAgICAgIGlmIChyZXNwb25zZVBhY2tldC5ib2R5WzJdKVxuICAgICAgICAgICAgdGhpcy5fdGhyb3dNYXJpb25ldHRlRXJyb3IocmVzcG9uc2VQYWNrZXQuYm9keVsyXSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlUGFja2V0LmJvZHlbM107XG4gICAgfVxuXG4gICAgYXN5bmMgY29ubmVjdCAoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuX2Nvbm5lY3RTb2NrZXQodGhpcy5wb3J0LCB0aGlzLmhvc3QpO1xuXG4gICAgICAgIGNvbnN0IGluZm9QYWNrZXQgPSBhd2FpdCB0aGlzLl9nZXRQYWNrZXQoKTtcblxuICAgICAgICB0aGlzLnByb3RvY29sSW5mbyA9IHtcbiAgICAgICAgICAgIGFwcGxpY2F0aW9uVHlwZTogICAgaW5mb1BhY2tldC5ib2R5LmFwcGxpY2F0aW9uVHlwZSxcbiAgICAgICAgICAgIG1hcmlvbmV0dGVQcm90b2NvbDogaW5mb1BhY2tldC5ib2R5Lm1hcmlvbmV0dGVQcm90b2NvbFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2Vzc2lvbkluZm8gPSBhd2FpdCB0aGlzLl9nZXRSZXNwb25zZSh7IGNvbW1hbmQ6IENPTU1BTkRTLm5ld1Nlc3Npb24gfSk7XG4gICAgfVxuXG4gICAgZGlzcG9zZSAoKSB7XG4gICAgICAgIHRoaXMuc29ja2V0LmVuZCgpO1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZVNjcmlwdCAoY29kZSkge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fZ2V0UmVzcG9uc2Uoe1xuICAgICAgICAgICAgY29tbWFuZDogICAgQ09NTUFORFMuZXhlY3V0ZVNjcmlwdCxcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHsgc2NyaXB0OiBgcmV0dXJuICgke2NvZGV9KSgpYCB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIHRha2VTY3JlZW5zaG90IChwYXRoKSB7XG4gICAgICAgIGNvbnN0IHNjcmVlbnNob3QgPSBhd2FpdCB0aGlzLl9nZXRSZXNwb25zZSh7IGNvbW1hbmQ6IENPTU1BTkRTLnRha2VTY3JlZW5zaG90IH0pO1xuXG4gICAgICAgIGF3YWl0IHdyaXRlRmlsZShwYXRoLCBzY3JlZW5zaG90LnZhbHVlLCB7IGVuY29kaW5nOiAnYmFzZTY0JyB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBzZXRXaW5kb3dTaXplICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGxldCB7IHZhbHVlOiBwYWdlUmVjdCB9ID0gYXdhaXQgdGhpcy5leGVjdXRlU2NyaXB0KEdFVF9XSU5ET1dfRElNRU5TSU9OU19JTkZPX1NDUklQVCk7XG4gICAgICAgIGxldCBhdHRlbXB0Q291bnRlciAgICAgID0gMDtcblxuICAgICAgICB3aGlsZSAoYXR0ZW1wdENvdW50ZXIrKyA8IE1BWF9SRVNJWkVfUkVUUllfQ09VTlQgJiYgKHBhZ2VSZWN0LndpZHRoICE9PSB3aWR0aCB8fCBwYWdlUmVjdC5oZWlnaHQgIT09IGhlaWdodCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSZWN0ID0gYXdhaXQgdGhpcy5fZ2V0UmVzcG9uc2UoeyBjb21tYW5kOiBDT01NQU5EUy5nZXRXaW5kb3dSZWN0IH0pO1xuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9nZXRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogQ09NTUFORFMuc2V0V2luZG93UmVjdCxcblxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgeDogICAgICBjdXJyZW50UmVjdC54LFxuICAgICAgICAgICAgICAgICAgICB5OiAgICAgIGN1cnJlbnRSZWN0LnksXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAgd2lkdGggKyAoY3VycmVudFJlY3Qud2lkdGggLSBwYWdlUmVjdC53aWR0aCksXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0ICsgKGN1cnJlbnRSZWN0LmhlaWdodCAtIHBhZ2VSZWN0LmhlaWdodClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgKHsgdmFsdWU6IHBhZ2VSZWN0IH0gPSBhd2FpdCB0aGlzLmV4ZWN1dGVTY3JpcHQoR0VUX1dJTkRPV19ESU1FTlNJT05TX0lORk9fU0NSSVBUKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBxdWl0ICgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5fZ2V0UmVzcG9uc2UoeyBjb21tYW5kOiBDT01NQU5EUy5xdWl0IH0pO1xuICAgIH1cbn07XG5cbiJdfQ==
