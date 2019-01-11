'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Client = exports.Server = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _lodash = require('lodash');

var _nodeIpc = require('node-ipc');

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Server = exports.Server = function () {
    function Server(config) {
        (0, _classCallCheck3.default)(this, Server);

        this.id = config.serverId;
        this.ipc = new _nodeIpc.IPC();
        this.server = null;
        this.socket = null;
        this.socketPromise = null;
        this.injectingStatus = null;
        this.injectingStatusPromise = null;
    }

    (0, _createClass3.default)(Server, [{
        key: '_emitWithResponse',
        value: function _emitWithResponse(event, data) {
            var _this = this;

            return new _pinkie2.default(function (resolve) {
                _this.server.on(event + _messages2.default.responsePostfix, function (result) {
                    _this.server.off(event + _messages2.default.responsePostfix, '*');
                    resolve(result);
                });

                _this.server.emit(_this.socket, event, data);
            });
        }
    }, {
        key: '_startIpcServer',
        value: function _startIpcServer() {
            var _this2 = this;

            return new _pinkie2.default(function (resolve) {
                _this2.ipc.serve(function () {
                    return resolve(_this2.ipc.server);
                });

                _this2.ipc.server.start();
            });
        }
    }, {
        key: '_getIpcSocket',
        value: function _getIpcSocket() {
            var _this3 = this;

            return new _pinkie2.default(function (resolve) {
                return _this3.server.on('connect', resolve);
            });
        }
    }, {
        key: '_getInjectingStatusPromise',
        value: function _getInjectingStatusPromise() {
            var _this4 = this;

            return new _pinkie2.default(function (resolve) {
                _this4.server.on(_messages2.default.getInjectingStatus, function (data) {
                    _this4.server.off(_messages2.default.getInjectingStatus, '*');
                    resolve(data);
                });
            });
        }
    }, {
        key: 'start',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.ipc.config.id = this.id;
                                this.ipc.config.silent = true;

                                _context.next = 4;
                                return this._startIpcServer();

                            case 4:
                                this.server = _context.sent;


                                if (!this.socketPromise) this.socketPromise = this._getIpcSocket();

                                return _context.abrupt('return', this.server);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function start() {
                return _ref.apply(this, arguments);
            }

            return start;
        }()
    }, {
        key: 'connect',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!this.socket) {
                                    _context2.next = 2;
                                    break;
                                }

                                return _context2.abrupt('return');

                            case 2:

                                if (!this.socketPromise) this.socketPromise = this._getIpcSocket();

                                if (!this.injectingStatusPromise) this.injectingStatusPromise = this._getInjectingStatusPromise();

                                _context2.next = 6;
                                return this.socketPromise;

                            case 6:
                                this.socket = _context2.sent;

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function connect() {
                return _ref2.apply(this, arguments);
            }

            return connect;
        }()
    }, {
        key: 'stop',
        value: function stop() {
            this.server.stop();
        }
    }, {
        key: 'setDialogHandler',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(fn, context) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this._emitWithResponse(_messages2.default.setDialogHandler, [fn && fn.toString() || null, context]);

                            case 2:
                                return _context3.abrupt('return', _context3.sent);

                            case 3:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function setDialogHandler(_x, _x2) {
                return _ref3.apply(this, arguments);
            }

            return setDialogHandler;
        }()
    }, {
        key: 'getMenuItems',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(menuType) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this._emitWithResponse(_messages2.default.getMenuItems, [menuType]);

                            case 2:
                                return _context4.abrupt('return', _context4.sent);

                            case 3:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getMenuItems(_x3) {
                return _ref4.apply(this, arguments);
            }

            return getMenuItems;
        }()
    }, {
        key: 'clickOnMenuItem',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(menuType, menuItemProperties, modifiers) {
                var descriptiveProperties;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                descriptiveProperties = (0, _lodash.pick)(menuItemProperties, [_constants2.default.menuPathProperty, 'commandId']);
                                _context5.next = 3;
                                return this._emitWithResponse(_messages2.default.clickOnMenuItem, [menuType, descriptiveProperties, modifiers]);

                            case 3:
                                return _context5.abrupt('return', _context5.sent);

                            case 4:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function clickOnMenuItem(_x4, _x5, _x6) {
                return _ref5.apply(this, arguments);
            }

            return clickOnMenuItem;
        }()
    }, {
        key: 'getInjectingStatus',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (!this.injectingStatus) {
                                    _context6.next = 2;
                                    break;
                                }

                                return _context6.abrupt('return', this.injectingStatus);

                            case 2:

                                if (!this.injectingStatusPromise) this.injectingStatusPromise = this._getInjectingStatusPromise();

                                _context6.next = 5;
                                return this.injectingStatusPromise;

                            case 5:
                                return _context6.abrupt('return', _context6.sent);

                            case 6:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function getInjectingStatus() {
                return _ref6.apply(this, arguments);
            }

            return getInjectingStatus;
        }()
    }, {
        key: 'terminateProcess',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this._emitWithResponse(_messages2.default.terminateProcess);

                            case 2:
                                return _context7.abrupt('return', _context7.sent);

                            case 3:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function terminateProcess() {
                return _ref7.apply(this, arguments);
            }

            return terminateProcess;
        }()
    }]);
    return Server;
}();

var Client = exports.Client = function () {
    function Client(config, _ref8) {
        var dialogHandler = _ref8.dialogHandler,
            contextMenuHandler = _ref8.contextMenuHandler,
            windowHandler = _ref8.windowHandler;
        (0, _classCallCheck3.default)(this, Client);

        this.id = config.clientId;
        this.serverId = config.serverId;
        this.ipc = new _nodeIpc.IPC();
        this.client = null;

        this.dialogHandler = dialogHandler;
        this.contextMenuHandler = contextMenuHandler;
        this.windowHandler = windowHandler;
    }

    (0, _createClass3.default)(Client, [{
        key: '_connectToIpcServer',
        value: function _connectToIpcServer() {
            var _this5 = this;

            return new _pinkie2.default(function (resolve) {
                _this5.ipc.connectTo(_this5.serverId, resolve);
            });
        }
    }, {
        key: '_updateDialogHandlerStatus',
        value: function _updateDialogHandlerStatus() {
            if (this.dialogHandler.fn && !this.dialogHandler.handledDialog) this.dialogHandler.hadNoExpectedDialogs = true;
        }
    }, {
        key: '_setupHandler',
        value: function _setupHandler(event, handler) {
            var _this6 = this;

            this.client.on(event, function () {
                var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(args) {
                    var result;
                    return _regenerator2.default.wrap(function _callee8$(_context8) {
                        while (1) {
                            switch (_context8.prev = _context8.next) {
                                case 0:
                                    _context8.next = 2;
                                    return handler.apply(_this6, args);

                                case 2:
                                    result = _context8.sent;


                                    _this6.client.emit(event + _messages2.default.responsePostfix, result);

                                case 4:
                                case 'end':
                                    return _context8.stop();
                            }
                        }
                    }, _callee8, _this6);
                }));

                return function (_x7) {
                    return _ref9.apply(this, arguments);
                };
            }());

            require('electron').ipcMain.on(event, function () {
                var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(e, args) {
                    var result;
                    return _regenerator2.default.wrap(function _callee9$(_context9) {
                        while (1) {
                            switch (_context9.prev = _context9.next) {
                                case 0:
                                    _context9.next = 2;
                                    return handler.apply(_this6, args);

                                case 2:
                                    result = _context9.sent;


                                    e.sender.send(event + _messages2.default.responsePostfix, result);

                                case 4:
                                case 'end':
                                    return _context9.stop();
                            }
                        }
                    }, _callee9, _this6);
                }));

                return function (_x8, _x9) {
                    return _ref10.apply(this, arguments);
                };
            }());
        }
    }, {
        key: '_serializeMenuItems',
        value: function _serializeMenuItems(menuItems) {
            var _this7 = this;

            return menuItems.map(function (menuItem) {
                return (0, _lodash.transform)(menuItem, function (result, value, key) {
                    if (_constants2.default.menuItemSerializableProperties.indexOf(key) >= 0) result[key] = value;

                    if (key === 'submenu' && value) result[key] = _this7._serializeMenuItems(value.items);
                }, {});
            });
        }
    }, {
        key: '_getMenu',
        value: function _getMenu(menuType) {
            if (menuType === _constants2.default.mainMenuType) return require('electron').Menu.getApplicationMenu();

            return menuType === _constants2.default.contextMenuType ? this.contextMenuHandler.menu : null;
        }
    }, {
        key: 'setDialogHandler',
        value: function setDialogHandler(fn, context) {
            this._updateDialogHandlerStatus();

            this.dialogHandler.handledDialog = false;

            if (!fn) {
                this.dialogHandler.fn = null;
                return;
            }

            this.dialogHandler.fn = _vm2.default.runInNewContext('(' + fn + ')', context || {});
        }
    }, {
        key: 'getMenuItems',
        value: function getMenuItems(menuType) {
            var menu = this._getMenu(menuType);

            return this._serializeMenuItems(menu.items);
        }
    }, {
        key: 'clickOnMenuItem',
        value: function clickOnMenuItem(menuType, menuItemProperties, modifiers) {
            var menu = this._getMenu(menuType);

            if (!menu) return;

            var parentMenu = menuItemProperties[_constants2.default.menuPathProperty].reduce(function (currentMenu, id) {
                return currentMenu.commandsMap[id].submenu;
            }, menu);
            var menuItem = parentMenu.commandsMap[menuItemProperties.commandId];

            menuItem.click(menuItem, this.windowHandler.window, modifiers);
        }
    }, {
        key: 'sendInjectingStatus',
        value: function sendInjectingStatus(status) {
            this.client.emit(_messages2.default.getInjectingStatus, status);
        }
    }, {
        key: 'terminateProcess',
        value: function terminateProcess() {
            setTimeout(function () {
                return process.exit(0);
            }, 0);
        }
    }, {
        key: 'connect',
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                this.ipc.config.id = this.id;
                                this.ipc.config.silent = true;

                                _context10.next = 4;
                                return this._connectToIpcServer();

                            case 4:

                                this.client = this.ipc.of[this.serverId];

                                this._setupHandler(_messages2.default.setDialogHandler, this.setDialogHandler);
                                this._setupHandler(_messages2.default.getMenuItems, this.getMenuItems);
                                this._setupHandler(_messages2.default.clickOnMenuItem, this.clickOnMenuItem);
                                this._setupHandler(_messages2.default.terminateProcess, this.terminateProcess);

                            case 9:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function connect() {
                return _ref11.apply(this, arguments);
            }

            return connect;
        }()
    }]);
    return Client;
}();