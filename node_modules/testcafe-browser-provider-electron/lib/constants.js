'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    configFileName: '.testcafe-electron-rc',
    mainMenuType: 'mainMenu',
    contextMenuType: 'contextMenu',
    menuPathProperty: '%menuPath%',
    connectionRetryDelay: 300,
    maxConnectionRetryCount: 10,
    loadingTimeout: 30000,

    menuItemSerializableProperties: ['label', 'type', 'role', 'accelerator', 'icon', 'sublabel', 'enabled', 'visible', 'checked', 'commandId']
};
module.exports = exports['default'];