import { create, getPath } from './window'
import ClientApp from '../client/app'

const isDevelopment = process.env.NODE_ENV !== 'production'

export function init (app) {
  const win = create({
    width: 1200,
    height: 800,
    useContentSize: true,
    resizable: isDevelopment, // 是否可调整大小
    alwaysOnTop: !isDevelopment, // 应用是否始终在所有顶层之上
    transparent: false, // 透明边框
    frame: true, // 不使用默认边框
    center: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })
  win.loadURL(getPath())
  if (!process.env.IS_TEST) win.webContents.openDevTools()

  const setting = {
    mainWindow: win,
    app,
    baseDir: __dirname
  }

  // Init app
  const appInstance = new ClientApp(setting)
  console.log('Main process runing...', appInstance.appDir) // DELETE ME
}
