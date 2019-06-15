'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import log from 'electron-log'

import * as application from './services/system/application'
import * as window from './services/system/window'
import * as config from './configs/config'

import { isWin, isMac } from './utils/assist'
const isDevelopment = process.env.NODE_ENV !== 'production'

log.transports.file.level = 'info'

if (isDevelopment) {
  require('electron-debug')() // eslint-disable-line global-require
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (window.getCount() === 0) {
    application.init()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // 加载vue-devtool插件(使用你的完整路径)
    // https://www.zhihu.com/question/55615518
    BrowserWindow.addDevToolsExtension(
      'D:/MyData/ex_luyun1/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.1.0_0'
    )
  }
  application.init(app)
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (isWin) {
    process.on('message', data => {
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

// Register to global, so renderer can access these with remote.getGlobal
global.services = {
  application,
  window
}

global.configs = {
  config
}
