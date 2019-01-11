'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _net = require('net');

var _promisifyEvent = require('promisify-event');

var _promisifyEvent2 = _interopRequireDefault(_promisifyEvent);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _delay = require('./utils/delay');

var _delay2 = _interopRequireDefault(_delay);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HEADER_SEPARATOR = '\r\n\r\n';
var HEADER_LINE_RE = /^([^:]+):\s+(.*)$/;

var NodeDebug = function () {
    function NodeDebug() {
        var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5858;
        var host = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '127.0.0.1';
        (0, _classCallCheck3.default)(this, NodeDebug);

        this.currentPacketNumber = 1;
        this.events = new _events2.default();
        this.port = port;
        this.host = host;
        this.socket = new _net.Socket();
        this.buffer = Buffer.alloc(0);
        this.getPacketPromise = _pinkie2.default.resolve();
        this.sendPacketPromise = _pinkie2.default.resolve();

        this.nodeInfo = {
            v8Version: '',
            protocolVersion: '',
            embeddingHost: ''
        };
    }

    (0, _createClass3.default)(NodeDebug, [{
        key: '_attemptToConnect',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(port, host) {
                var _this = this;

                var connectionPromise;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.socket.connect(port, host);

                                connectionPromise = _pinkie2.default.race([(0, _promisifyEvent2.default)(this.socket, 'connect'), (0, _promisifyEvent2.default)(this.socket, 'error')]);
                                _context.next = 4;
                                return connectionPromise.then(function () {
                                    return true;
                                }).catch(function () {
                                    _this.socket.removeAllListeners('connect');
                                    return (0, _delay2.default)(_constants.connectionRetryDelay);
                                });

                            case 4:
                                return _context.abrupt('return', _context.sent);

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _attemptToConnect(_x3, _x4) {
                return _ref.apply(this, arguments);
            }

            return _attemptToConnect;
        }()
    }, {
        key: '_connectSocket',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(port, host) {
                var _this2 = this;

                var connected, i;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this._attemptToConnect(port, host);

                            case 2:
                                connected = _context2.sent;
                                i = 0;

                            case 4:
                                if (!(!connected && i < _constants.maxConnectionRetryCount)) {
                                    _context2.next = 11;
                                    break;
                                }

                                _context2.next = 7;
                                return this._attemptToConnect(port, host);

                            case 7:
                                connected = _context2.sent;

                            case 8:
                                i++;
                                _context2.next = 4;
                                break;

                            case 11:
                                if (connected) {
                                    _context2.next = 13;
                                    break;
                                }

                                throw new Error('Unable to connect');

                            case 13:

                                this.socket.on('data', function (data) {
                                    return _this2._handleNewData(data);
                                });

                            case 14:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _connectSocket(_x5, _x6) {
                return _ref2.apply(this, arguments);
            }

            return _connectSocket;
        }()
    }, {
        key: '_writeSocket',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(message) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (this.socket.write(message)) {
                                    _context3.next = 3;
                                    break;
                                }

                                _context3.next = 3;
                                return (0, _promisifyEvent2.default)(this.socket, 'drain');

                            case 3:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _writeSocket(_x7) {
                return _ref3.apply(this, arguments);
            }

            return _writeSocket;
        }()
    }, {
        key: '_handleNewData',
        value: function _handleNewData(data) {
            if (!data) return;

            this.buffer = Buffer.concat([this.buffer, data]);

            this.events.emit('new-data');
        }
    }, {
        key: '_getPacket',
        value: function _getPacket() {
            var _this3 = this;

            this.getPacketPromise = this.getPacketPromise.then((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var headerEndIndex, packet, contentLengthHeader, contentLength, bodyStartIndex, bodyEndIndex;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                headerEndIndex = _this3.buffer.indexOf(HEADER_SEPARATOR);

                            case 1:
                                if (!(headerEndIndex < 0)) {
                                    _context4.next = 7;
                                    break;
                                }

                                _context4.next = 4;
                                return (0, _promisifyEvent2.default)(_this3.events, 'new-data');

                            case 4:

                                headerEndIndex = _this3.buffer.indexOf('\r\n\r\n');
                                _context4.next = 1;
                                break;

                            case 7:
                                packet = {
                                    headers: null,
                                    body: null
                                };


                                packet.headers = _this3.buffer.toString('utf8', 0, headerEndIndex).split('\r\n').map(function (line) {
                                    return line.match(HEADER_LINE_RE);
                                }).reduce(function (obj, match) {
                                    obj[match[1].toLowerCase()] = match[2];

                                    return obj;
                                }, {});

                                contentLengthHeader = packet.headers['content-length'];
                                contentLength = contentLengthHeader && parseInt(contentLengthHeader, 10) || 0;
                                bodyStartIndex = headerEndIndex + HEADER_SEPARATOR.length;
                                bodyEndIndex = bodyStartIndex + contentLength;

                                if (!contentLength) {
                                    _context4.next = 20;
                                    break;
                                }

                            case 14:
                                if (!(_this3.buffer.length < bodyEndIndex)) {
                                    _context4.next = 19;
                                    break;
                                }

                                _context4.next = 17;
                                return (0, _promisifyEvent2.default)(_this3.events, 'new-data');

                            case 17:
                                _context4.next = 14;
                                break;

                            case 19:

                                packet.body = JSON.parse(_this3.buffer.toString('utf8', bodyStartIndex, bodyEndIndex));

                            case 20:

                                _this3.buffer = _this3.buffer.slice(bodyEndIndex);

                                return _context4.abrupt('return', packet);

                            case 22:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, _this3);
            })));

            return this.getPacketPromise;
        }
    }, {
        key: '_sendPacket',
        value: function _sendPacket(payload) {
            var _this4 = this;

            this.sendPacketPromise = this.sendPacketPromise.then((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var body, serialized, message;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                body = (0, _assign2.default)({}, payload, { seq: _this4.currentPacketNumber++, type: 'request' });
                                serialized = (0, _stringify2.default)(body);
                                message = 'Content-Length: ' + Buffer.byteLength(serialized, 'utf8') + HEADER_SEPARATOR + serialized;


                                _this4._writeSocket(message);

                            case 4:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, _this4);
            })));

            return this.sendPacketPromise;
        }
    }, {
        key: 'connect',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                var infoPacket;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this._connectSocket(this.port, this.host);

                            case 2:
                                _context6.next = 4;
                                return this._getPacket();

                            case 4:
                                infoPacket = _context6.sent;


                                this.nodeInfo = {
                                    v8Version: infoPacket.headers['v8-version'],
                                    protocolVersion: infoPacket.headers['protocol-version'],
                                    embeddingHost: infoPacket.headers['embedding-host']
                                };

                            case 6:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function connect() {
                return _ref6.apply(this, arguments);
            }

            return connect;
        }()
    }, {
        key: 'dispose',
        value: function dispose() {
            this.socket.end();
            this.buffer = null;
        }
    }, {
        key: 'evaluate',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(expression) {
                var packetNumber, responsePacket;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                packetNumber = this.currentPacketNumber;
                                _context7.next = 3;
                                return this._sendPacket({ command: 'evaluate', arguments: { expression: expression, 'disable_break': true } });

                            case 3:
                                _context7.next = 5;
                                return this._getPacket();

                            case 5:
                                responsePacket = _context7.sent;

                            case 6:
                                if (!(!responsePacket.body || responsePacket.body['request_seq'] !== packetNumber)) {
                                    _context7.next = 12;
                                    break;
                                }

                                _context7.next = 9;
                                return this._getPacket();

                            case 9:
                                responsePacket = _context7.sent;
                                _context7.next = 6;
                                break;

                            case 12:
                                return _context7.abrupt('return', responsePacket);

                            case 13:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function evaluate(_x8) {
                return _ref7.apply(this, arguments);
            }

            return evaluate;
        }()
    }]);
    return NodeDebug;
}();

exports.default = NodeDebug;
module.exports = exports['default'];