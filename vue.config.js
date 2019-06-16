const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  css: {
    loaderOptions: {
      less: {
        import: [
          resolve('src/renderer/styles/variables.less'),
          resolve('src/renderer/styles/monokai_sublime.less'),
          resolve('element-ui/lib/theme-chalk/index.css')
        ],
        javascriptEnabled: true
      },
      sass: {
        data: `@import "element-ui/packages/theme-chalk/src/common/var.scss";`
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      productName: 'electron-blog',
      builderOptions: {
        files: [
          {
            filter: ['**/*']
          }
        ],
        extraFiles: ['./extensions/'],
        asar: false,
        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: 'electron-blog' // 图标名称
        }
      },
      chainWebpackRendererProcess: config => {},
      mainProcessFile: 'src/main/main.js',
      mainProcessWatch: ['src/main'],
      // [1.0.0-rc.4+] Provide a list of arguments that Electron will be launched with during "electron:serve",
      // which can be accessed from the main process (src/background.js).
      // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
      mainProcessArgs: []
    }
  },
  configureWebpack: config => {
    // 更改入口文件的路径
    config.entry.app = resolve('src/renderer/main.js')

    // 添加插件
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src/renderer'))
      .set('_n', resolve('node_modules'))
      .set('@main', resolve('src/main'))
      .set('@shared', resolve('src/shared'))
    // const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    // types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },
  // 打包时不生成.map文件，减少体积，加快速度
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    useLocalIp: true,
    port: 3000,
    hotOnly: false
  }
}

/**
 * 全局 less 引入
 * @param {*} rule 传递规则
 */
// function addStyleResource (rule) {
//   rule
//     .use('style-resource')
//     .loader('style-resources-loader')
//     .options({
//       patterns: [path.resolve(__dirname, './src/common/theme/iview-variables.less')]
//     })
// }
