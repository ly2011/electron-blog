<template>
  <div class="article" v-loading="loading">
    <div class="search-box">
      <!-- <el-row type="flex" justify="end"> -->
      <!-- <el-input style="width: 200px;" placeholder="搜索文章" v-model="form.keyword" suffix-icon="el-icon-search" @change="search" /> -->
      <!-- <el-button class="btn" type="danger" @click="deleteSelectedPosts">删除选中</el-button> -->
      <!-- <el-button class="btn" type="primary" @click="addArticle">新文章</el-button> -->
      <!-- </el-row> -->
      <i-form ref="formBox" @search="search" @reset="reset">
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="label">
          <el-select v-model="form.label" placeholder="请选择">
            <el-option v-for="item in labelOptions" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </i-form>

    </div>
    <div class="table-box">
      <i-table :columns="columns" :data="tableData" :pagination="pagination" @size-change="sizeChange" @current-change="currentChange" max-height="600" :border="false">
        <template width="100%" slot="title" slot-scope="scope">
          <!-- <el-link type="primary" :underline="false" @click="viewArticle(scope.row)">{{scope.row[scope.prop]}}</el-link> -->
          <span class="link-btn" @click="viewArticle(scope.row)">{{scope.row[scope.prop]}}</span>
        </template>
        <template width="100%" slot="formatState" slot-scope="scope">
          <el-tag v-if="scope.row[scope.prop] === 'open'" type="success">开启</el-tag>
          <el-tag v-else type="info">关闭</el-tag>
        </template>
        <!-- <template width="100%" slot="formatDate" slot-scope="scope">
          <span>{{scope.row[scope.prop] | formatDateTime}}</span>
        </template> -->
        <template width="100%" slot="operate" slot-scope="scope">
          <el-button size="mini" @click="editArticle(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="delArticle(scope.row)">删除</el-button>
        </template>
      </i-table>
    </div>

    <fade-transition :duration="100">
      <article-edit v-if="articleUpdateVisible" :visible="articleUpdateVisible" :articleFileName="currentArticleFileName" @close="close" />
    </fade-transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { FadeTransition } from 'vue2-transitions'
import iForm from '@/components/i-form'
import iTable from '@/components/i-table'
import ArticleEdit from './edit.vue'

const columns = [
  { label: '标题', prop: 'title', slot: 'title', showOverflowTooltip: true, minWidth: 100 },
  { label: '状态', prop: 'state', slot: 'formatState', showOverflowTooltip: true, width: 100 },
  { label: '创建时间', prop: 'created_at', filter: 'formatDateTime', showOverflowTooltip: true, width: 185 },
  { label: '操作', prop: 'operate', slot: 'operate', width: 200 }
]

export default {
  components: {
    iForm,
    iTable,
    FadeTransition,
    ArticleEdit
  },
  data () {
    return {
      form: {
        // keyword: '',
        state: '',
        label: ''
      },
      stateOptions: [{
        label: '开启',
        value: 'open'
      }, {
        label: '关闭',
        value: 'closed'
      }],
      tableDataUrl: '',
      searchData: {}, // 搜索条件
      selectedArticle: [],
      columns,
      articleUpdateVisible: false,
      currentArticleFileName: ''
    }
  },
  computed: {
    ...mapState('articles', {
      tableData (state) {
        return state.list
      },
      pagination (state) {
        return state.pagination
      },
      loading: state => state.loading
    }),
    ...mapState('labels', {
      labelOptions (state) {
        return state.list
      }
    })
  },
  created () {
    this.initData()
  },
  methods: {
    ...mapActions('articles', ['fetchList', 'fetchListCount', 'changeLoading']),
    ...mapActions('labels', { fetchLabelList: 'fetchList' }),
    async deleteSelectedPosts () {
      try {
        await this.$confirm('删除后不可撤销，你确定要删除吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        })
      } catch (error) {
        return error
      }
    },
    initData () {
      this.fetchLabelList()
      this.getTableData()
    },
    search () {
      let searchData = { ...this.form }
      this.handleSearchData(searchData)
    },
    reset () {
      Object.keys(this.form).forEach(key => {
        if (Array.isArray(this.form[key])) {
          this.form[key] = []
        } else if (typeof this.form[key] === 'string') {
          this.form[key] = ''
        }
      })
    },
    // 表单搜索
    handleSearchData (searchData) {
      this.searchData = { ...searchData }
      this.pagination.currentPage = 1
      this.getTableData()
    },
    addArticle () {
      this.articleUpdateVisible = true
    },
    editArticle (post) {
      this.articleUpdateVisible = true
      this.currentArticleFileName = post.fileName
    },
    viewArticle (post) {

    },
    async delArticle (post) {
      try {
        const h = this.$createElement
        const msgTip = h('div', [
          h('p', null, `你确认要删除该条文章吗？`)
        ])
        await this.$confirm(msgTip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message.success('删除成功')
      } catch (error) {
      }
    },
    close () {
      this.articleUpdateVisible = false
      this.currentArticleFileName = ''
    },
    sizeChange (val) {
      this.pagination.currentPage = 1
      this.pagination.pageSize = val
      this.$nextTick(() => {
        this.getTableData()
      })
    },
    currentChange (val) {
      this.pagination.currentPage = val
      this.$nextTick(() => {
        this.getTableData()
      })
    },
    async getTableData () { // 查询
      this.changeLoading({ payload: true })
      const params = this.getParams()
      const postData = {
        payload: {
          current: 1,
          pageSize: 10,
          ...params
        },
        callback (err) {
        }
      }
      await this.fetchList(postData)
      await this.fetchListCount()
      this.changeLoading({ payload: false })
    },
    getParams () { // 获取查询参数
      const params = { ...this.searchData }
      params.pageIndex = this.pagination.currentPage
      params.pageSize = this.pagination.pageSize
      return params
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  border-bottom: 1px solid #e2e2e2;
  -webkit-app-region: drag;
  background-color: #fff;
  padding: 8px 0 16px;
  margin-bottom: 16px;
  .btn {
    margin-left: 16px;
    -webkit-app-region: no-drag;
  }
}
</style>
<style lang="scss" scoped>
.link-btn {
  color: $--color-primary;
}
</style>
