import fse from 'fs-extra'
import path from 'path'

const __static = ''
class App {
  constructor (setting) {
    this.mainWindow = setting.mainWindow
    this.app = setting.app
    this.baseDir = setting.baseDir
    this.appDir = path.join(this.app.getPath('documents'), 'electron-blog')

    this.db = {
      posts: [],
      tags: [],
      menus: [],
      setting: {
        platform: 'github',
        domain: 'https://ly2011.github.io/blog',
        repository: 'blog',
        branch: 'master',
        username: 'ly2011',
        email: '',
        token: '',
        cname: ''
      },
      themeConfig: {
        themeName: '',
        postPageSize: 10,
        archivesPageSize: 50,
        siteName: '',
        siteDescription: '',
        footerInfo: 'Powered by electron-blog',
        showFeatureImage: true,
        domain: '',
        postUrlFormat: 'SLUG',
        tagUrlFormat: 'SLUG',
        dateFormat: 'YYYY-MM-DD',
        feedFullText: true,
        feedCount: 10
      }
    }

    this.init()
  }
  async init () {
    await this.checkDir()
  }
  async checkDir () {
    // Check if there is a .hve-notes folder, if it exists, load it, otherwise use the default configuration.
    const appConfigFolderOld = path.join(this.app.getPath('home'), '.hve-notes') // < 0.7.7

    const appConfigFolder = path.join(this.app.getPath('home'), '.gridea')
    const appConfigPath = path.join(appConfigFolder, 'config.json')
    let defaultAppDir = path.join(this.app.getPath('documents'), 'Gridea')
    defaultAppDir = defaultAppDir.replace(/\\/g, '/')

    try {
      // if exist `.hve-notes` config folder, change folder name to `.gridea`
      try {
        if (!fse.pathExistsSync(appConfigFolder) && fse.pathExistsSync(appConfigFolderOld)) {
          await fse.renameSync(appConfigFolderOld, appConfigFolder)
        }
      } catch (e) {
        console.log('Rename Error: ', e)
      }

      if (!fse.pathExistsSync(appConfigFolder)) {
        await fse.mkdirSync(appConfigFolder)
        const jsonString = `{"sourceFolder": "${defaultAppDir}"}`
        await fse.writeFileSync(appConfigPath, jsonString)
      }

      const appConfig = await fse.readJsonSync(appConfigPath)
      this.appDir = appConfig.sourceFolder

      // Site folder exists
      if (fse.pathExistsSync(this.appDir)) {
        // Check if the `images`, `config`, 'output', `post-images`, 'posts', 'themes' folder exists, if it does not exist, copy it from default-files
        ;['images', 'config', 'output', 'post-images', 'posts', 'themes'].forEach(folder => {
          const folderPath = path.join(this.appDir, folder)
          if (!fse.pathExistsSync(folderPath)) {
            fse.copySync(path.join(__static, 'default-files', folder), folderPath)
          }
        })

        // Check default theme folder if includes [notes、fly、simple、paper] themes
        // this.checkTheme('notes')
        // this.checkTheme('fly')
        // this.checkTheme('simple')
        // this.checkTheme('paper')

        return
      }

      // Site folder not exists
      this.appDir = defaultAppDir
      const jsonString = `{"sourceFolder": "${defaultAppDir}"}`
      await fse.writeFileSync(appConfigPath, jsonString)
      fse.mkdirSync(this.appDir)

      fse.copySync(path.join(__static, 'default-files'), path.join(this.appDir))
    } catch (e) {
      console.log('Error', e)
    } finally {
    }
  }
}

export default App
