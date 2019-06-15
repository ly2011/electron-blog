import Vue from 'vue'
import Vuex from 'vuex'
// import app from './modules/app'
// import user from './modules/user'
// import articles from './modules/articles'
// import labels from './modules/labels'
// 改为统一由./modules/index.js自动导入模块
import modules from './modules'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  // modules: {
  //   app,
  //   user,
  //   articles,
  //   labels
  // },
  modules,
  getters
})

export default store
