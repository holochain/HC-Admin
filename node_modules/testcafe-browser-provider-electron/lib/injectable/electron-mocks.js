'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _ipc = require('../ipc');

var _resolveFileUrl = require('../utils/resolve-file-url');

var _resolveFileUrl2 = _interopRequireDefault(_resolveFileUrl);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var URL_QUERY_RE = /\?.*$/;
var NAVIGATION_EVENTS = ['will-navigate', 'did-navigate'];

var ipc = null;
var loadingTimeout = null;
var openedUrls = [];
var contextMenuHandler = { menu: null };
var windowHandler = { window: null };

var dialogHandler = {
    fn: null,
    handledDialog: false,
    hadUnexpectedDialogs: false,
    hadNoExpectedDialogs: false
};

function startLoadingTimeout() {
    if (loadingTimeout) return;

    loadingTimeout = setTimeout(function () {
        ipc.sendInjectingStatus({ completed: false, openedUrls: openedUrls });
    }, _constants2.default.loadingTimeout);
}

function stopLoadingTimeout() {
    clearTimeout(loadingTimeout);

    loadingTimeout = 0;
}

function handleDialog(type, args) {
    if (!dialogHandler.fn) {
        dialogHandler.hadUnexpectedDialogs = true;
        return void 0;
    }

    dialogHandler.handledDialog = true;

    var handlerFunction = dialogHandler.fn;
    var handlerResult = handlerFunction.apply(undefined, [type].concat((0, _toConsumableArray3.default)(args)));
    var lastArg = args.length ? args[args.length - 1] : null;

    if (typeof lastArg === 'function') lastArg(handlerResult);

    return handlerResult;
}

module.exports = function install(config, testPageUrl) {
    ipc = new _ipc.Client(config, { dialogHandler: dialogHandler, contextMenuHandler: contextMenuHandler, windowHandler: windowHandler });

    ipc.connect();

    var _require = require('electron'),
        BrowserWindow = _require.BrowserWindow,
        Menu = _require.Menu,
        dialog = _require.dialog;

    var _process$atomBinding = process.atomBinding('web_contents'),
        WebContents = _process$atomBinding.WebContents;

    var origLoadURL = BrowserWindow.prototype.loadURL;

    function stripQuery(url) {
        return url.replace(URL_QUERY_RE, '');
    }

    BrowserWindow.prototype.loadURL = function (url) {
        startLoadingTimeout(config.mainWindowUrl);

        var testUrl = stripQuery(url);

        if (url.indexOf('file:') === 0) testUrl = (0, _resolveFileUrl2.default)(config.appPath, testUrl);

        openedUrls.push(testUrl);

        if (testUrl.toLowerCase() === config.mainWindowUrl.toLowerCase()) {
            stopLoadingTimeout();

            ipc.sendInjectingStatus({ completed: true });

            BrowserWindow.prototype.loadURL = origLoadURL;

            url = testPageUrl;

            windowHandler.window = this;

            if (config.openDevTools) this.webContents.openDevTools();
        }

        return origLoadURL.call(this, url);
    };

    Menu.prototype.popup = function () {
        contextMenuHandler.menu = this;
    };

    Menu.prototype.closePopup = function () {
        contextMenuHandler.menu = null;
    };

    if (!config.enableNavigateEvents) {
        var origOn = WebContents.prototype.on;

        WebContents.prototype.on = function (event, listener) {
            if (NAVIGATION_EVENTS.indexOf(event) > -1) return;

            origOn.call(this, event, listener);
        };
    }

    dialog.showOpenDialog = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return handleDialog('open-dialog', args);
    };

    dialog.showSaveDialog = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return handleDialog('save-dialog', args);
    };

    dialog.showMessageBox = function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        return handleDialog('message-box', args);
    };

    dialog.showErrorBox = function () {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
        }

        return handleDialog('error-box', args);
    };

    dialog.showCertificateTrustDialog = function () {
        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
        }

        return handleDialog('certificate-trust-dialog', args);
    };

    process.argv.splice(1, 2);
};