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

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODIFIERS_KEYS_MAP = {
    'shift': 'shiftKey',
    'ctrl': 'ctrlKey',
    'alt': 'altKey',
    'meta': 'metaKey'
};

function addMenuPaths(menuItems) {
    var prevPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    menuItems.forEach(function (menuItem) {
        menuItem[_constants2.default.menuPathProperty] = prevPath;

        if (menuItem.submenu) addMenuPaths(menuItem.submenu, prevPath.concat(menuItem.commandId));
    });

    return menuItems;
}

function findMenuItem(menuItems, menuItemSelector) {
    var menuItem = null;

    var _loop = function _loop(i) {
        var index = menuItemSelector[i].index ? menuItemSelector[i].index - 1 : 0;
        var label = typeof menuItemSelector[i] === 'string' ? menuItemSelector[i] : menuItemSelector[i].label;

        menuItem = label ? menuItems.filter(function (item) {
            return item.label === label;
        })[index] : menuItems[index];

        menuItems = menuItem && menuItem.submenu || null;
    };

    for (var i = 0; menuItems && i < menuItemSelector.length; i++) {
        _loop(i);
    }

    return menuItem || null;
}

function ensureModifiers() {
    var srcModifiers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var result = {};

    (0, _keys2.default)(MODIFIERS_KEYS_MAP).forEach(function (mod) {
        return result[MODIFIERS_KEYS_MAP[mod]] = !!srcModifiers[mod];
    });

    return result;
}

var Helpers = function () {
    function Helpers(ipc) {
        (0, _classCallCheck3.default)(this, Helpers);

        this.ipc = ipc;
    }

    (0, _createClass3.default)(Helpers, [{
        key: '_getMenuItems',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(menuType) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.t0 = addMenuPaths;
                                _context.next = 3;
                                return this.ipc.getMenuItems(menuType);

                            case 3:
                                _context.t1 = _context.sent;
                                return _context.abrupt('return', (0, _context.t0)(_context.t1));

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _getMenuItems(_x3) {
                return _ref.apply(this, arguments);
            }

            return _getMenuItems;
        }()
    }, {
        key: '_getMenuItem',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(menuType, menuItemSelector) {
                var menuItems;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this._getMenuItems(menuType);

                            case 2:
                                menuItems = _context2.sent;
                                return _context2.abrupt('return', findMenuItem(menuItems, menuItemSelector));

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _getMenuItem(_x4, _x5) {
                return _ref2.apply(this, arguments);
            }

            return _getMenuItem;
        }()
    }, {
        key: '_clickOnMenuItem',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(menuType, menuItem, modifiers) {
                var menuItemSnapshot;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!menuItem.commandId) {
                                    _context3.next = 4;
                                    break;
                                }

                                _context3.t0 = menuItem;
                                _context3.next = 7;
                                break;

                            case 4:
                                _context3.next = 6;
                                return this._getMenuItem(menuType, menuItem);

                            case 6:
                                _context3.t0 = _context3.sent;

                            case 7:
                                menuItemSnapshot = _context3.t0;

                                if (menuItemSnapshot) {
                                    _context3.next = 10;
                                    break;
                                }

                                throw new Error(_errors2.default.invalidMenuItemArgument);

                            case 10:
                                _context3.next = 12;
                                return this.ipc.clickOnMenuItem(menuType, menuItemSnapshot, ensureModifiers(modifiers));

                            case 12:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _clickOnMenuItem(_x6, _x7, _x8) {
                return _ref3.apply(this, arguments);
            }

            return _clickOnMenuItem;
        }()
    }, {
        key: 'getMainMenuItems',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this._getMenuItems(_constants2.default.mainMenuType);

                            case 2:
                                return _context4.abrupt('return', _context4.sent);

                            case 3:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getMainMenuItems() {
                return _ref4.apply(this, arguments);
            }

            return getMainMenuItems;
        }()
    }, {
        key: 'getContextMenuItems',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this._getMenuItems(_constants2.default.contextMenuType);

                            case 2:
                                return _context5.abrupt('return', _context5.sent);

                            case 3:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function getContextMenuItems() {
                return _ref5.apply(this, arguments);
            }

            return getContextMenuItems;
        }()
    }, {
        key: 'getMainMenuItem',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(menuItemSelector) {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this._getMenuItem(_constants2.default.mainMenuType, menuItemSelector);

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function getMainMenuItem(_x9) {
                return _ref6.apply(this, arguments);
            }

            return getMainMenuItem;
        }()
    }, {
        key: 'getContextMenuItem',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(menuItemSelector) {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this._getMenuItem(_constants2.default.contextMenuType, menuItemSelector);

                            case 2:
                                return _context7.abrupt('return', _context7.sent);

                            case 3:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function getContextMenuItem(_x10) {
                return _ref7.apply(this, arguments);
            }

            return getContextMenuItem;
        }()
    }, {
        key: 'clickOnMainMenuItem',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(menuItem) {
                var modifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this._clickOnMenuItem(_constants2.default.mainMenuType, menuItem, modifiers);

                            case 2:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function clickOnMainMenuItem(_x12) {
                return _ref8.apply(this, arguments);
            }

            return clickOnMainMenuItem;
        }()
    }, {
        key: 'clickOnContextMenuItem',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(menuItem) {
                var modifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this._clickOnMenuItem(_constants2.default.contextMenuType, menuItem, modifiers);

                            case 2:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function clickOnContextMenuItem(_x14) {
                return _ref9.apply(this, arguments);
            }

            return clickOnContextMenuItem;
        }()
    }, {
        key: 'setElectronDialogHandler',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(fn, context) {
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.ipc.setDialogHandler(fn, context);

                            case 2:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function setElectronDialogHandler(_x15, _x16) {
                return _ref10.apply(this, arguments);
            }

            return setElectronDialogHandler;
        }()
    }]);
    return Helpers;
}();

exports.default = Helpers;
module.exports = exports['default'];