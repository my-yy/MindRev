'use strict'

import {app, protocol, BrowserWindow} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'

const isMacOS = process.platform === 'darwin';
const isDevelopment = process.env.NODE_ENV !== 'production'
const open_url_out = require("@/utils/background/open_url_out")
import * as window_quit_util from "@/utils/background/window_quit_util"


// import * as Sentry from "@sentry/electron";
// Sentry.init({ dsn: "https://a3c7d4313dff4b949f70b2717894a37a@o250184.ingest.sentry.io/4504659039420416" });

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {scheme: 'app', privileges: {secure: true, standard: true}}
])

require('@electron/remote/main').initialize()

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: isDevelopment ? 1500 : 900,
    height: 800,
    // title: "拾忆导图",
    webPreferences: {
      enableRemoteModule: true,
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  // win.setTitle("拾忆导图")
  require("@electron/remote/main").enable(win.webContents)
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  //在浏览器中打开网页
  open_url_out.setUp(win)

  //对于Mac设置关闭窗口时的逻辑:关闭窗口只隐藏窗口
  if (window_quit_util.isMacOS) {
    window_quit_util.setUpOnCloseEvent(win)
  }
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    //有可能是隐藏的，那就显示出来
    BrowserWindow.getAllWindows()[0].show()
  }
  // if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})


import mammoth from "mammoth";

const {convert} = require('html-to-text');
const {ipcMain} = require('electron')
ipcMain.handle('docx2html', async (event, path) => {
  const result = await mammoth.convertToHtml({path: path})
  const html = result.value; // The generated HTML
  // const text = convert(html, {
  //   wordwrap: false,
  //   selectors: [
  //     {selector: 'img', format: 'skip'},
  //     {selector: 'a', options: {ignoreHref: true}}
  //   ]
  // });
  return {html}
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
