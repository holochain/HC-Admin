'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var injectHookCode = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(client, code) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return client.connect();

                    case 2:
                        _context.next = 4;
                        return client.evaluate(code);

                    case 4:

                        client.dispose();

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function injectHookCode(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _child_process = require('child_process');

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _endpointUtils = require('endpoint-utils');

var _nodeDebug = require('./node-debug');

var _nodeDebug2 = _interopRequireDefault(_nodeDebug);

var _nodeInspect = require('./node-inspect');

var _nodeInspect2 = _interopRequireDefault(_nodeInspect);

var _isAbsolute = require('./utils/is-absolute');

var _isAbsolute2 = _interopRequireDefault(_isAbsolute);

var _getConfig = require('./utils/get-config');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _hook = require('./hook');

var _hook2 = _interopRequireDefault(_hook);

var _ipc = require('./ipc');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

var _testRunTracker = require('testcafe/lib/api/test-run-tracker');

var _testRunTracker2 = _interopRequireDefault(_testRunTracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startElectron(config, ports) {
    var cmd = '';
    var args = null;
    var debugPortsArgs = ['--debug-brk=' + ports[0], '--inspect-brk=' + ports[1]];
    var extraArgs = config.appArgs || [];

    if (_osFamily2.default.mac && (0, _fs.statSync)(config.electronPath).isDirectory()) {
        cmd = 'open';
        args = ['-naW', '"' + config.electronPath + '"', '--args'].concat(debugPortsArgs, extraArgs);
    } else {
        cmd = config.electronPath;
        args = debugPortsArgs.concat(extraArgs);
    }

    (0, _child_process.spawn)(cmd, args, { stdio: 'ignore' });
}

var ElectronBrowserProvider = {
    isMultiBrowser: true,
    openedBrowsers: {},

    _getBrowserHelpers: function _getBrowserHelpers() {
        var testRun = _testRunTracker2.default.resolveContextTestRun();
        var id = testRun.browserConnection.id;

        return ElectronBrowserProvider.openedBrowsers[id].helpers;
    },
    isLocalBrowser: function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            return _context2.abrupt('return', true);

                        case 1:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function isLocalBrowser() {
            return _ref2.apply(this, arguments);
        }

        return isLocalBrowser;
    }(),
    openBrowser: function () {
        var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id, pageUrl, mainPath) {
            var config, ipcServer, ports, hookCode, debugClient, inspectClient, injectingStatus;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            if (!(0, _isAbsolute2.default)(mainPath)) mainPath = _path2.default.join(process.cwd(), mainPath);

                            config = (0, _getConfig2.default)(id, mainPath);
                            ipcServer = new _ipc.Server(config);
                            _context3.next = 5;
                            return ipcServer.start();

                        case 5:
                            _context3.next = 7;
                            return (0, _endpointUtils.getFreePorts)(2);

                        case 7:
                            ports = _context3.sent;


                            startElectron(config, ports);

                            hookCode = (0, _hook2.default)(config, pageUrl);
                            debugClient = new _nodeDebug2.default(ports[0]);
                            inspectClient = new _nodeInspect2.default(ports[1]);
                            _context3.next = 14;
                            return _pinkie2.default.race([injectHookCode(debugClient, hookCode), injectHookCode(inspectClient, hookCode)]);

                        case 14:
                            _context3.next = 16;
                            return ipcServer.connect();

                        case 16:
                            _context3.next = 18;
                            return ipcServer.getInjectingStatus();

                        case 18:
                            injectingStatus = _context3.sent;

                            if (injectingStatus.completed) {
                                _context3.next = 24;
                                break;
                            }

                            _context3.next = 22;
                            return ipcServer.terminateProcess();

                        case 22:

                            ipcServer.stop();

                            throw new Error(_errors2.default.render(_errors2.default.mainUrlWasNotLoaded, {
                                mainWindowUrl: config.mainWindowUrl,
                                openedUrls: injectingStatus.openedUrls
                            }));

                        case 24:

                            this.openedBrowsers[id] = {
                                config: config,
                                ipc: ipcServer,
                                helpers: new _helpers2.default(ipcServer)
                            };

                        case 25:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        function openBrowser(_x3, _x4, _x5) {
            return _ref3.apply(this, arguments);
        }

        return openBrowser;
    }(),
    closeBrowser: function () {
        var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(id) {
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return this.openedBrowsers[id].ipc.terminateProcess();

                        case 2:

                            this.openedBrowsers[id].ipc.stop();

                            delete this.openedBrowsers[id];

                        case 4:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function closeBrowser(_x6) {
            return _ref4.apply(this, arguments);
        }

        return closeBrowser;
    }(),
    getBrowserList: function () {
        var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            return _context5.abrupt('return', ['${PATH_TO_ELECTRON_APP}']);

                        case 1:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function getBrowserList() {
            return _ref5.apply(this, arguments);
        }

        return getBrowserList;
    }(),


    // TODO: implement validation ?
    isValidBrowserName: function () {
        var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            return _context6.abrupt('return', true);

                        case 1:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function isValidBrowserName() {
            return _ref6.apply(this, arguments);
        }

        return isValidBrowserName;
    }(),


    //Helpers
    getMainMenuItems: function () {
        var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
            return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            return _context7.abrupt('return', ElectronBrowserProvider._getBrowserHelpers().getMainMenuItems());

                        case 1:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        function getMainMenuItems() {
            return _ref7.apply(this, arguments);
        }

        return getMainMenuItems;
    }(),
    getContextMenuItems: function () {
        var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
            return _regenerator2.default.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            return _context8.abrupt('return', ElectronBrowserProvider._getBrowserHelpers().getContextMenuItems());

                        case 1:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        function getContextMenuItems() {
            return _ref8.apply(this, arguments);
        }

        return getContextMenuItems;
    }(),
    clickOnMainMenuItem: function () {
        var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(menuItem) {
            var modifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            return _regenerator2.default.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            return _context9.abrupt('return', ElectronBrowserProvider._getBrowserHelpers().clickOnMainMenuItem(menuItem, modifiers));

                        case 1:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, this);
        }));

        function clickOnMainMenuItem(_x8) {
            return _ref9.apply(this, arguments);
        }

        return clickOnMainMenuItem;
    }(),
    clickOnContextMenuItem: function () {
        var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(menuItem) {
            var modifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            return _regenerator2.default.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            return _context10.abrupt('return', ElectronBrowserProvider._getBrowserHelpers().clickOnContextMenuItem(menuItem, modifiers));

                        case 1:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, this);
        }));

        function clickOnContextMenuItem(_x10) {
            return _ref10.apply(this, arguments);
        }

        return clickOnContextMenuItem;
    }(),
    setElectronDialogHandler: function () {
        var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(fn, context) {
            return _regenerator2.default.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            return _context11.abrupt('return', ElectronBrowserProvider._getBrowserHelpers().setElectronDialogHandler(fn, context));

                        case 1:
                        case 'end':
                            return _context11.stop();
                    }
                }
            }, _callee11, this);
        }));

        function setElectronDialogHandler(_x11, _x12) {
            return _ref11.apply(this, arguments);
        }

        return setElectronDialogHandler;
    }(),
    getMainMenuItem: function () {
        var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(menuItemSelector) {
            return _regenerator2.default.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            return _context12.abrupt('return', ElectronBrowserProvider._getBrowserHelpers().getMainMenuItem(menuItemSelector));

                        case 1:
                        case 'end':
                            return _context12.stop();
                    }
                }
            }, _callee12, this);
        }));

        function getMainMenuItem(_x13) {
            return _ref12.apply(this, arguments);
        }

        return getMainMenuItem;
    }(),
    getContextMenuItem: function () {
        var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(menuItemSelector) {
            return _regenerator2.default.wrap(function _callee13$(_context13) {
                while (1) {
                    switch (_context13.prev = _context13.next) {
                        case 0:
                            return _context13.abrupt('return', ElectronBrowserProvider._getBrowserHelpers().getContextMenuItem(menuItemSelector));

                        case 1:
                        case 'end':
                            return _context13.stop();
                    }
                }
            }, _callee13, this);
        }));

        function getContextMenuItem(_x14) {
            return _ref13.apply(this, arguments);
        }

        return getContextMenuItem;
    }()
};

exports.default = ElectronBrowserProvider;
module.exports = exports['default'];