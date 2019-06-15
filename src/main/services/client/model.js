/**
 * 留给客户端服务基类
 */
import path from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

class Model {
  constructor (appInstance) {
    this._initData()
    this.appDir = appInstance.appDir
    this.db = appInstance.db

    this.initDataStore()
  }
  _initData () {
    this.appDir = ''
    this.$setting = ''
    this.$posts = ''
    this.$theme = ''
    this.db = ''
  }
  initDataStore () {
    const settingAdapter = new FileSync(path.join(this.appDir, 'config/setting.json'))
    const setting = low(settingAdapter)
    this.$setting = setting

    const postsAdapter = new FileSync(path.join(this.appDir, 'config/posts.json'))
    const posts = low(postsAdapter)
    this.$posts = posts

    const themeAdapter = new FileSync(path.join(this.appDir, 'config/theme.json'))
    const theme = low(themeAdapter)
    this.$theme = theme
  }
}

export default Model
