import fs from 'fs'
import fse from 'fs-extra'
import Bluebird from 'bluebird'

import simpleGit from 'simple-git/promise'
import Model from './model'

Bluebird.promisifyAll(fs)

class Renderer extends Model {
  constructor (appInstance) {
    super(appInstance)
    this._initData()
    this.loadConfig()

    const { setting } = this.db
    this.platformAddress = {
      github: 'github.com',
      coding: 'git.coding.net'
    }[setting.platform || 'github']

    this.remoteUrl = `https://${setting.username}:${setting.token}@${this.platformAddress}/${setting.username}/${
      setting.repository
    }.git`

    this.git = simpleGit(this.outputDir)
    this.utils.now = Date.now()

    this.preview()
    this.remoteDetect()
  }
  _initData () {
    this.outputDir = `${this.appDir}/output`
    this.themePath = ''
    this.postsData = []
    this.tagsData = []
    this.menuData = []
    this.git = null
    this.platformAddress = ''
    this.remoteUrl = ''
    this.utils = {}
  }
  /**
   * Load Config
   */
  async loadConfig () {
    this.themePath = `${this.appDir}/themes/${this.db.themeConfig.themeName}`

    await fse.ensureDir(`${this.appDir}/output`)
    await fse.ensureDir(`${this.appDir}/output/post`)
  }

  async preview () {
    this.db.themeConfig.domain = this.outputDir
    await this.renderAll('preview')
  }

  async renderAll (mode) {
    await this.clearOutputFolder()
    await this.formatDataForRender(mode)
  }
  async formatDataForRender (mode) {
    this.postsData = this.db.posts.map(item => {
      // const currentTags = item.data.tags || []
      let toc = ''
      const result = {
        content: item.content,
        fileName: item.fileName,
        abstract: item.abstract,
        title: item.data.title,
        tags: item.data.tags,
        date: item.data.date,
        feature: item.data.feature,
        link: '',
        hideInList: (item.data.hideInList === undefined && false) || item.data.hideInList
      }
      result.toc = toc
      return result
    })

    // console.log('postsData: ', this.postsData)
  }
  async clearOutputFolder () {
    await fse.removeSync(`${this.outputDir}/images`)
    await fse.removeSync(`${this.outputDir}/media`)
    await fse.removeSync(`${this.outputDir}/page`)
    await fse.removeSync(`${this.outputDir}/post`)
    await fse.removeSync(`${this.outputDir}/post-images`)
    await fse.removeSync(`${this.outputDir}/styles`)
    await fse.removeSync(`${this.outputDir}/tag`)
  }
  /**
   * Check whether the remote connection is normal
   */
  async remoteDetect () {
    const result = {
      success: true,
      message: ''
    }
    try {
      const { setting } = this.db
      const isRepo = await this.git.checkIsRepo()
      if (!setting.username || !setting.repository || !setting.token) {
        return {
          success: false,
          message: 'Username、repository、token is required'
        }
      }
      if (!isRepo) {
        await this.git.init()
        await this.git.addConfig('user.name', setting.username)
        await this.git.addConfig('user.email', setting.email)
        await this.git.add('./*')
        await this.git.commit('first commit')
        await this.git.addRemote('origin', this.remoteUrl)
      }

      await this.git.raw(['remote', 'set-url', 'origin', this.remoteUrl])
      await this.git.listRemote([])
    } catch (e) {
      console.log('Test Remote Error: ', e.message)
      result.success = false
      result.message = e.message
    }
    // console.log('检测结果: ', result)
    return result
  }
}

export default Renderer
