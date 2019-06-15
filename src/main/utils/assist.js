'use strict'

export const isWin = () => {
  return ['win32', 'win64'].includes(process.platform)
}

export const isMac = () => {
  return process.platform === 'darwin'
}

export const isLinux = () => {
  return process.platform === 'linux'
}
