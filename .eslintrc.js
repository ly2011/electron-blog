module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'standard/no-callback-literal': 'off',
    'handle-callback-err': 'off',
    camelcase: 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
