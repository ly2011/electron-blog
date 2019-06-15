module.exports = {
  presets: ['@vue/app'],
  plugins: [
    ['@babel/plugin-proposal-class-properties'],
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
}
