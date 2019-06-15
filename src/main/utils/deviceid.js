// TODO: 暂时废弃，getmac读取失败
import getmac from 'getmac'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'

import { isMac } from './assist'

global.device = {}

const setDevice = (uuid, mac) => {
  global.device.uuid = uuid
  global.device.mac = mac || uuid.split('---')[0]

  if (isMac) {
    global.device.gid = (global.device.mac || '').replace(/:/g, '')
  } else {
    global.device.gid = global.device.mac || ''
  }
  console.log('gid: ', global.device.gid)
}

let macAddress = null

const getMac = () => {
  if (macAddress) return Promise.resolve(macAddress)
  return new Promise((resolve, reject) => {
    getmac.getMac((err, mac) => {
      if (err) return reject(err)
      macAddress = mac.toLowerCase()
      return resolve(macAddress)
    })
  })
}

const deviceFile = path.resolve(app.getPath('appData'), 'ELECTRON_BLOG_DEVICE_UUID')
let uuid
try {
  uuid = fs.readFileSync(deviceFile).toString('utf8')
} catch (error) {
  uuid = null
}

// TODO: 从本地 storage 拉取 deviceId
export const get = async () => {
  let rand
  while (1) {
    rand = Math.random()
    if (rand.length > 4) break
  }
  return getMac()
    .then(mac => `${mac}---${rand.slice(2)}`)
    .catch(_ => `${rand.slice(2)}`)
    .then(uuid_ => {
      if (!uuid) {
        uuid = uuid_
      }
      fs.writeFile(deviceFile, uuid)
      setDevice(uuid, macAddress)
      return uuid
    })
}

export default getMac
