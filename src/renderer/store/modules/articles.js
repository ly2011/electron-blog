import { getArticles, getArticle } from '@/services/articles'
// eslint-disable-next-line
import markdown from '@/utils/markdown'
const articles = {
  namespaced: true,
  state: {
    loading: false,
    list: [],
    pagination: {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      layout: 'total, sizes, prev, pager, next, jumper',
      pageSizes: [10, 20, 50, 100, 200]
    },
    article: {} // 文章详情
  },

  mutations: {
    saveList: (state, payload = {}) => {
      const { pagination: oldPagination } = state
      const {
        data,
        pagination: { currentPage, pageSize }
      } = payload
      state.list = data || []
      state.pagination = {
        ...oldPagination,
        currentPage,
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
    saveDetail: (state, payload) => {
      state.article = payload
    },
    saveLoading: (state, payload) => {
      state.loading = payload
    }
  },
  actions: {
    async fetchList ({ commit }, { payload, callback } = {}) {
      const { currentPage, pageSize, ...otherParams } = payload
      const params = {
        ...otherParams,
        page: currentPage,
        per_page: pageSize
      }
      try {
        const data = await getArticles(params)
        commit('saveList', {
          data,
          pagination: {
            currentPage,
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
    async fetchDetail ({ commit }, { payload, callback } = {}) {
      const { id } = payload
      try {
        const data = await getArticle(id)
        // console.log('fetchDetail: ', data)
        // To markdown
        markdown.marked(data.body).then(res => {
          console.log('articleDetail: ', res)
          data.content = res.content
          data.toc = res.toc
          commit('saveDetail', data)
          callback && callback(null, data)
        })
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
