<template>
  <div class="detail">
    <h3>文章详情</h3>
    <header class="header">
      <h3 class="title">{{article.title}}</h3>
    </header>

    <div class="content" v-html="article.content"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      id: ''
    }
  },
  computed: {
    ...mapState('articles', {
      article (state) {
        return state.article
      },
      loading: state => state.loading
    })
  },
  created () {
    this.initData()
  },
  methods: {
    ...mapActions('articles', ['fetchDetail', 'changeLoading']),
    initData () {
      const { id } = this.$route.params
      console.log('params: ', this.$route.params)
      this.id = id
      this.getData()
    },
    async getData () {
      this.changeLoading({ payload: true })
      const params = {
        id: this.id
      }
      const postData = {
        payload: params,
        callback (err) {
        }
      }
      await this.fetchDetail(postData)
      this.changeLoading({ payload: false })
    }
  }
}
</script>
