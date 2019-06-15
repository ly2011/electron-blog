<template>
  <div class="edit-article" v-if="visible">
    <div class="header">
      <el-row type="flex" justify="end">
        <el-button class="btn" @click="close">取消</el-button>
        <el-button class="btn" @click="saveDraft">存草稿</el-button>
        <el-button class="btn" type="primary" @click="savePost">保存</el-button>
      </el-row>
    </div>
    <div class="content">
      <el-row :gutter="16">
        <el-col :span="16">
          <el-input class="title" size="medium" placeholder="标题" v-model="form.title" @change="handleTitleChange" />
          <div class="tip-text">你可以插入单独行的
            <!-- more --> 为摘要分隔标识（此行之前内容为摘要）
          </div>
          <markdown-editor id="markdown-editor" ref="editor" class="md-editor" :configs="configs" preview-class="markdown-body" v-model="form.content" @click.native.capture="preventDefault($event)"></markdown-editor>

        </el-col>

        <el-col :span="8" class="right-container">
          <el-collapse v-model="activeKey">
            <el-collapse-item title="URL" name="1">
              <el-input v-model="form.fileName" @change="handleFileNameChange" />
            </el-collapse-item>
            <el-collapse-item title="标签" key="2">
              <div>
                <el-select multiple style="width: 100%;" v-model="form.tags">
                  <el-option v-for="tag in tags" :key="tag" :value="tag">{{
                    tag}}</el-option>
                </el-select>
              </div>
            </el-collapse-item>
            <el-collapse-item title="创建时间" key="3">
              <el-date-picker type="datetime" v-model="form.date" style="width: 100%;"></el-date-picker>
            </el-collapse-item>
            <el-collapse-item title="封面图" key="4">
              <el-radio-group style="margin-bottom: 16px;" v-model="featureType" size="small">
                <el-radio-button label="DEFAULT">默认</el-radio-button>
                <el-radio-button label="EXTERNAL">外链</el-radio-button>
              </el-radio-group>
              <div v-if="featureType === 'DEFAULT'">
                <el-upload action="" list-type="picture-card" class="feature-uploader" :show-file-list="false" :before-upload="beforeFeatureUpload">
                  <div v-if="form.featureImage.path">
                    <img class="feature-image" :src="`file://${form.featureImage.path}`" height="150" />
                  </div>
                  <div v-else>
                    <i class="el-icon-plus"></i>
                    <div class="el-upload__text"><em>点击上传</em></div>
                  </div>
                </el-upload>
                <el-button v-if="form.featureImage.path" type="danger" icon="el-icon-delete" size="mini" style="width: 100%;" @click="handleFeatureRemove"></el-button>
              </div>
              <div v-if="featureType === 'EXTERNAL'">
                <el-input v-model="form.featureImagePath" />
                <div class="tip-text">路径必须包含 http 或 https</div>
                <div class="feature-image-container" v-if="form.featureImagePath">
                  <img class="feature-image" :src="form.featureImagePath" height="150" />
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron'
import MarkdownEditor from 'vue-simplemde/src/markdown-editor.vue'
// import shortid from 'shortid'
import { mapState } from 'vuex'
import dayjs from 'dayjs'

export default {
  components: {
    MarkdownEditor
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    articleFileName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {
        title: '',
        fileName: '',
        content: '',
        tags: [],
        published: false,
        hideInList: false,
        date: dayjs(new Date()),
        featureImage: {
          path: '',
          name: '',
          type: ''
        },
        featureImagePath: '',
        deleteFileName: ''
      },
      configs: {
        toolbar: ['bold', 'italic', 'heading', 'code', 'quote', 'unordered-list', 'ordered-list', 'preview'],
        promptURLs: true,
        spellChecker: false,
        placeholder: '输入内容...'
      },
      code: 'const noop = () => {}',
      featureType: 'DEFAULT', // 图片类型
      activeKey: ['1'],
      // 编辑文章时，当前文章的索引
      currentPostIndex: -1,
      originalFileName: '',
      fileNameChanged: false
    }
  },
  computed: {
    ...mapState('app', {
      tableData (state) {
        return state.posts
      },
      tags (state) {
        return state.tags.map(tag => tag.name)
      }
    }),
    canSubmit () {
      return this.form.title && this.form.content
    }
  },
  mounted () {
    this.buildCurrentForm()
    this.initEditor()
  },
  methods: {
    initEditor () { },
    buildCurrentForm () {
      const { articleFileName } = this
      console.log('articleFileName: ', articleFileName)
      if (articleFileName) {
        this.fileNameChanged = true // 编辑文章标题时 URL 不跟随其变化
        this.currentPostIndex = this.tableData.findIndex((item) => item.fileName === articleFileName)
        const currentPost = this.tableData[this.currentPostIndex]

        if (currentPost) {
          this.originalFileName = currentPost.fileName
          this.form.title = currentPost.data.title
          this.form.fileName = currentPost.fileName
          this.form.tags = currentPost.data.tags || []
          this.form.date = dayjs(currentPost.data.date).format('YYYY-MM-DD HH:mm:ss')
          this.form.content = currentPost.content
          this.form.published = currentPost.data.published
          this.form.hideInList = currentPost.data.hideInList

          if (currentPost.data.feature && currentPost.data.feature.includes('http')) {
            this.form.featureImagePath = currentPost.data.feature
            this.featureType = 'EXTERNAL'
          } else {
            this.form.featureImage.path = (currentPost.data.feature && currentPost.data.feature.substring(7)) || ''
            this.form.featureImage.name = this.form.featureImage.path.replace(/^.*[\\/]/, '')
          }
        }
      }
    },
    preventDefault (event) {
      if (event.target.tagName === 'A') {
        const href = event.target.getAttribute('href')
        if (href && !href.startsWith('#')) {
          event.preventDefault()
          shell.openExternal(href)
        }
      }
    },
    handleTitleChange () { },
    handleFileNameChange (val) {
      this.fileNameChanged = !!val
    },
    beforeFeatureUpload (file) {
      console.log('file: ', file)
      if (!file) {
        return
      }
      const isImage = file.type.indexOf('image') !== -1
      if (!isImage) {
        return
      }
      if (file && isImage) {
        this.form.featureImage = {
          name: file.name,
          path: file.path,
          type: file.type
        }
      }
      console.log('featureImage: ', this.form.featureImage)
      return false
    },
    handleFeatureRemove (file) {
      console.log('为何为被调用了', file)
      this.form.featureImage = {}
    },
    close () {
      this.$emit('close')
    },
    saveDraft () { },
    savePost () { }
  }
}
</script>

<style lang="less" scoped>
.btn {
  margin-left: 16px;
}
.tip-text {
  margin-top: 8px;
  background: #e4ddd0;
  padding: 4px 8px;
  border-radius: 2px;
  line-height: 1.25;
  font-size: 12px;
}
.title {
  font-weight: bold;
}
.edit-article {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1025;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .header {
    padding: 16px 32px;
    border-bottom: 1px solid #e4e2dd;
    box-shadow: 0 3px 20px #4343430d;
    z-index: 1026;
    background-color: #fff;
  }
  .content {
    flex: 1;
    padding: 24px 16px;
    overflow: scroll;
  }
}
.feature-image-container {
  text-align: center;
  padding: 16px;
}
.feature-image {
  max-width: 100%;
}
/deep/ .el-upload.el-upload--picture-card {
  width: 100%;
  display: block;
  // height: auto;
  // line-height: 1;
  height: 166px;
  padding: 8px;
}
.feature-uploader {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>

<style lang="less">
@import "~simplemde/dist/simplemde.min.css";
/* @import '~github-markdown-css'; */
.CodeMirror {
  border-radius: 2px;
  transition: all 0.3s;
  color: #434343;
  border: none;
  background: #f9f7f3;
  font-size: 16px;
}
.CodeMirror.CodeMirror-focused {
  border-color: #4f4a4a;
  outline: 0;
  -webkit-box-shadow: 0 0 0 2px rgba(67, 67, 67, 0.2);
  box-shadow: 0 0 0 2px rgba(67, 67, 67, 0.2);
  border-right-width: 1px !important;
}
.editor-toolbar {
  border-color: #fff;
  box-shadow: none;
  border-radius: 2px;
  padding: 0;
}
.editor-toolbar a.active,
.editor-toolbar a:hover {
  border-color: #d2c7b3;
  background: #f9f7f3;
}
.editor-toolbar a {
  color: #000 !important;
  width: 32px;
  height: 32px;
  border-radius: 2px;
  margin-right: 4px;
  transition: all 0.3s;
}
.editor-toolbar.fullscreen {
  z-index: 1025;
}
.CodeMirror .editor-preview.markdown-body.editor-preview-active {
  line-height: 1.618;
  background: #f9f7f3;
  padding: 16px;
}
.CodeMirror .editor-preview.markdown-body.editor-preview-active img {
  max-width: 100%;
  display: block;
  margin: 8px 0;
}

// MonacoEditor
.editor {
  width: 600px;
  height: 800px;
}
</style>
