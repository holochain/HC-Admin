/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */

 // The Electron 'shell' obj' allows for desktop integration (ie: allow Electron(chromium) windows to
 //   access/communicate with the desktop to handle tasks 'outside' of the browser env...).
import { app, BrowserWindow, shell, ipcMain} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

// Imports necessary to support browser target for port opening via ui port link
import * as electronBrowser from "electron-open-link-in-browser";

// in lieu of hot reloader
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}


let mainWindow = null;
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1050,
    height: 800,
    resizable: false,
    // titleBarStyle: 'hidden',
    // titleBarStyle: 'customButtonsOnHover',

    // frame: false
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});

// handle closing window (as menu will no longer be enabled) :
ipcMain.on("window:close", ( event, quit ) => {
  if(quit === 'quit') {
    app.quit()
  }
});

// handle refreshing window (as menu will no longer be enabled) :
ipcMain.on("window:refresh", ( event, refresh ) => {
  if(refresh === 'refresh') {
    mainWindow.webContents.reload();
  }
});

// handle closing window (as menu will no longer be enabled) :
ipcMain.on("browswer:open", ( event, link ) => {
  if(link) {
    event.preventDefault();
    shell.openExternal(link);
  }
});
