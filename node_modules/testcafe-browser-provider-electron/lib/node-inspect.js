'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _chromeRemoteInterface = require('chrome-remote-interface');

var _chromeRemoteInterface2 = _interopRequireDefault(_chromeRemoteInterface);

var _promisifyEvent = require('promisify-event');

var _promisifyEvent2 = _interopRequireDefault(_promisifyEvent);

var _delay = require('./utils/delay');

var _delay2 = _interopRequireDefault(_delay);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NodeInspect = function () {
    function NodeInspect(port, host) {
        (0, _classCallCheck3.default)(this, NodeInspect);

        this.port = port;
        this.host = host;
        this.client = null;
        this.callFrameId = null;
    }

    (0, _createClass3.default)(NodeInspect, [{
        key: '_attemptToConnect',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(port, host) {
                var _this = this;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _chromeRemoteInterface2.default)({ host: host, port: port }).then(function (client) {
                                    _this.client = client;
                                    return true;
                                }).catch(function () {
                                    return (0, _delay2.default)(_constants.connectionRetryDelay);
                                });

                            case 2:
                                return _context.abrupt('return', _context.sent);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _attemptToConnect(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return _attemptToConnect;
        }()
    }, {
        key: '_connectRemoteInterface',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(port, host) {
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
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _connectRemoteInterface(_x3, _x4) {
                return _ref2.apply(this, arguments);
            }

            return _connectRemoteInterface;
        }()
    }, {
        key: '_setupRemoteInterface',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var pausedEvent, _ref4, callFrames;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.client.Debugger.enable();

                                pausedEvent = (0, _promisifyEvent2.default)(this.client, 'Debugger.paused');
                                _context3.next = 4;
                                return this.client.Runtime.runIfWaitingForDebugger();

                            case 4:
                                _context3.next = 6;
                                return pausedEvent;

                            case 6:
                                _ref4 = _context3.sent;
                                callFrames = _ref4.callFrames;


                                this.callFrameId = callFrames[0].callFrameId;

                            case 9:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _setupRemoteInterface() {
                return _ref3.apply(this, arguments);
            }

            return _setupRemoteInterface;
        }()
    }, {
        key: 'connect',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this._connectRemoteInterface(this.port, this.host);

                            case 2:
                                _context4.next = 4;
                                return this._setupRemoteInterface();

                            case 4:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function connect() {
                return _ref5.apply(this, arguments);
            }

            return connect;
        }()
    }, {
        key: 'evaluate',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(expression) {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.client.Debugger.evaluateOnCallFrame({ callFrameId: this.callFrameId, expression: expression });

                            case 2:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function evaluate(_x5) {
                return _ref6.apply(this, arguments);
            }

            return evaluate;
        }()
    }, {
        key: 'dispose',
        value: function dispose() {
            this.client.close();
        }
    }]);
    return NodeInspect;
}();

exports.default = NodeInspect;
module.exports = exports['default'];