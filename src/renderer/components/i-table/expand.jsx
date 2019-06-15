// 自定义内容的组件
export default {
  name: 'TableExpand',
  functional: true,
  inject: ['tableRoot'],
  props: {
    row: Object, // table-column每一行的数据
    render: Function,
    index: Number,
    $index: Number,
    prop: String,
    label: String,
    column: {
      // 每一行的配置信息
      type: Object,
      default: null
    }
  },
  render (h, ctx) {
    const params = {
      row: ctx.props.row,
      index: ctx.props.index,
      $index: ctx.props.$index,
      prop: ctx.props.prop,
      label: ctx.props.label
    }

    if (ctx.props.column) params.column = ctx.props.column

    return ctx.props.render(h, params)
  }
}
