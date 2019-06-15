import { getLabels } from '@/services/labels'
const labels = {
  namespaced: true,
  state: {
    list: []
  },

  mutations: {
    saveList: (state, payload = {}) => {
      const { data } = payload
      state.list = data || []
    }
  },
  actions: {
    async fetchList ({ commit }, { callback } = {}) {
      const current = 1
      const pageSize = 1000
      const params = {
        page: current,
        per_page: pageSize
      }
      try {
        const data = await getLabels(params)
        commit('saveList', {
          data
        })
        callback && callback(null, data)
      } catch (error) {
        callback && callback({ msg: '请求出错' })
      }
    }
  }
}

export default labels
