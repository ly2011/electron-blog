export default {
  name: 'TableSlot',
  functional: true,
  inject: ['tableRoot'],
  props: {
    row: Object,
    index: Number,
    $index: Number,
    prop: String,
    label: String,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, ctx) => {
    return h(
      'span',
      ctx.injections.tableRoot.$scopedSlots[ctx.props.column.slot]({
        row: ctx.props.row,
        column: ctx.props.column,
        index: ctx.props.index,
        $index: ctx.props.$index,
        prop: ctx.props.prop,
        label: ctx.props.label
      })
    )
  }
}
