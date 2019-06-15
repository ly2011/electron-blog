<script>
// 由于vue中的css module不支持::v-deep,才改用为scoped样式
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  name: 'i-form',
  props: {
    labelWidth: {
      type: String,
      default: 'standard'
    },
    transition: {
      type: Boolean,
      default: false
    },
    // 默认暂开或者收起
    isDefaultCollapse: {
      type: Boolean,
      default: false
    },
    isShowOperate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      formHeight: '',
      isCollapse: this.isDefaultCollapse,
      isShowToggle: true,
      sizeMap: {
        huge: 140,
        large: 120,
        standard: 100,
        mini: 80,
        superMini: 75
      }
    }
  },
  computed: {
    formItemStyle (value) {
      return this.transition
        ? {}
        : {
          height: this.isCollapse ? 'auto' : '47px'
        }
    },
    collapseText (value) {
      return this.isCollapse ? '收起' : '展开'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initLayout()
      this.observer = elementResizeDetectorMaker()
      this.observer.listenTo(this.$el, this.initLayout)
    })
  },
  beforeDestroy () {
    this.observer.removeListener(this.$el, this.initLayout)
  },
  methods: {
    initLayout () {
      if (!this.$refs.form || !this.$refs.formItem) return

      const formEl = this.$refs.form.$el
      const formItemEls = this.$refs.formItem.children
      this._resetLayout(formEl, formItemEls)
      // this.addResizeListener(formEl, formItemEls)
    },
    addResizeListener (formEl, formItemEls) {
      // 监听宽口变化事件，且避免事件覆盖
      // window.onresize = (window.onresize || (() => {})).after(() => {
      //   this._resetLayout(formEl, formItemEls)
      // })
    },
    search () {
      this.$emit('search')
    },
    reset () {
      this.$emit('reset')
    },
    // 处理收起与展开事件
    handleCollapse () {
      this.isCollapse = !this.isCollapse
      this.transition && this.handleTransition(this.isCollapse)
      this.$emit('handleCollapse')
    },
    // 展开关闭动画
    handleTransition (isCollapse) { },
    // 获取dom元素占据空间属性
    _getElBoxProperty (el, property) {
      return +el.getBoundingClientRect()[property]
    },
    // 重置布局
    _resetLayout (formEl, formItemEls) {
      const formWidth = this._getElBoxProperty(formEl, 'width')
      let col = 0
      if (formWidth > 1300) {
        col = 4
      } else if (formWidth > 1000) {
        col = 3
      } else if (formWidth > 700) {
        col = 2
      } else {
        col = 1
      }
      const widthPercent = parseFloat((1 / col) * 100) + '%'
      this.setIsShowToggle(formItemEls.length, col)
      Array.from(formItemEls).forEach(item => {
        item.style.width = widthPercent
      })
    },
    /**
     * 设置是否展示收起与展开按钮
     * @param {Number} formItem formItem列表项数目
     * @param {Number} col 每一行最多展示多少个formItem
     */
    setIsShowToggle (length, col) {
      this.isShowToggle = length > col
    }
  },
  render () {
    const {
      isCollapse,
      formItemStyle,
      isShowToggle,
      handleCollapse,
      collapseText,
      sizeMap,
      labelWidth,
      reset,
      search
    } = this
    return (
      <el-form class={['i-form', 'clearfix']} style={formItemStyle} ref="form">
        <div class={['i-form__operate', 'clearfix']}>
          {isShowToggle && (
            <el-button
              type="text"
              icon="el-icon-arrow-down"
              class={{ 'icon-rotate': isCollapse }}
              onClick={handleCollapse}
            >
              {collapseText}
            </el-button>
          )}
          <el-button type="plain" className={'form-btn'} onClick={reset}>
            重置
          </el-button>
          <el-button type="primary" class={'form-btn'} onClick={search}>
            查询
          </el-button>
        </div>
        <div ref="formItem" class={['i-form__item', 'clearfix', `label-width-${sizeMap[labelWidth]}`]}>
          {this.$slots.default}
        </div>
      </el-form>
    )
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
