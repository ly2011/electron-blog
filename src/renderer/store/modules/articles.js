import { getArticles } from '@/services/articles'
const articles = {
  namespaced: true,
  state: {
    loading: false,
    list: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      layout: 'total, sizes, prev, pager, next, jumper',
      pageSizes: [10, 20, 50, 100, 200]
    }
  },

  mutations: {
    saveList: (state, payload = {}) => {
      const { pagination: oldPagination } = state
      const {
        data,
        pagination: { current, pageSize }
      } = payload
      state.list = data || []
      state.pagination = {
        ...oldPagination,
        current,
        pageSize
      }
    },
    saveListCount: (state, payload) => {
      const { pagination: oldPagination } = state
      state.pagination = {
        ...oldPagination,
        total: payload
      }
    },
    saveLoading: (state, payload) => {
      state.loading = payload
    }
  },
  actions: {
    async fetchList ({ commit }, { payload, callback } = {}) {
      const { current, pageSize, ...otherParams } = payload
      const params = {
        ...otherParams,
        page: current,
        per_page: pageSize
      }
      try {
        const data = await getArticles(params)
        commit('saveList', {
          data,
          pagination: {
            current,
            pageSize
          }
        })
        callback && callback(null, data)
      } catch (error) {
        callback && callback({ msg: '请求出错' })
      }
    },
    async fetchListCount ({ commit }, { callback } = {}) {
      // const page = 1
      // const per_page = 10 * 1000000
      // const params = {
      //   page,
      //   per_page
      // }
      try {
        // const data = await getArticles(params)
        // const total = Array.isArray(data) ? data.length : 0
        const total = 100 // TODO: 获取所有列表太耗时间了，暂改为写死100
        commit('saveListCount', total)
        callback && callback(null, total)
      } catch (error) {
        callback && callback({ msg: '请求出错' })
      }
    },
    async changeLoading ({ commit }, { payload, callback } = {}) {
      const loading = !!payload
      commit('saveLoading', loading)
      callback && callback(null)
    }
  }
}

export default articles
