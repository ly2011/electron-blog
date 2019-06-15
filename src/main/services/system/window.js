// import is from 'electron-is'
// import { join } from 'path'
import { BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

let count = 0

export function create (opts) {
  count += 1
  let win = new BrowserWindow(opts)
  win.on('close', () => {
    count -= 1
    win = null
  })
  return win
}

export function getCount () {
  return count
}

export function getPath () {
  let path = ''
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    // win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    path = process.env.WEBPACK_DEV_SERVER_URL
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    // win.loadURL('app://./index.html')
    path = 'app://./index.html'
  }
  return path
}
