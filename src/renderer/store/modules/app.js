const app = {
  namespaced: true,
  state: {
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    device: 'desktop',
    appDir: '',
    posts: [
      {
        abstract: '高考七年后、工作三年后的感悟',
        excerpt: '高考七年后、工作三年后的感悟',
        content: '高考七年后、工作三年后的感悟',
        fileName: 'about',
        isEmpty: false,
        data: {
          date: '2019-06-13 17:53:34',
          feature: '',
          hideInList: false,
          published: true,
          tags: [],
          title: '高考七年后、工作三年后的感悟'
        }
      },
      {
        abstract: 'Vue 改变数据，页面不刷新的问题',
        excerpt: 'Vue 改变数据，页面不刷新的问题',
        content: 'Vue 改变数据，页面不刷新的问题',
        fileName: 'about',
        isEmpty: false,
        data: {
          date: '2019-06-15 17:53:34',
          feature: '',
          hideInList: false,
          published: true,
          tags: ['css'],
          title: 'Vue 改变数据，页面不刷新的问题'
        }
      },
      {
        abstract: '大疆的这个可编程教育机器人，可真不是个一般的机器人',
        excerpt: '大疆的这个可编程教育机器人，可真不是个一般的机器人',
        content: '大疆的这个可编程教育机器人，可真不是个一般的机器人',
        fileName: 'about',
        isEmpty: false,
        data: {
          date: '2019-06-15 17:53:34',
          feature: '',
          hideInList: false,
          published: true,
          tags: ['css'],
          title: '大疆的这个可编程教育机器人，可真不是个一般的机器人'
        }
      }
    ],
    tags: [
      {
        index: -1,
        name: 'css',
        slg: 'kYitPhsHB',
        used: true
      },
      {
        index: 1,
        name: 'js',
        slg: 'kYitPhsKB',
        used: false
      }
    ],
    menus: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    updateSite: (state, siteData) => {
      const { appDir, posts, tags, menus } = siteData
      state.appDir = appDir
      state.posts = posts
      state.tags = tags
      state.menus = menus
    },
    updatePosts: (state, posts) => {
      state.posts = posts
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar ({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    updateSite ({ commit }, siteData) {
      commit('updateSite', siteData)
    },
    updatePosts ({ commit }, posts) {
      commit('updatePosts', posts)
    }
  }
}

export default app
