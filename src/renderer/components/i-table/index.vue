<template>
  <div class="i-table">
    <el-table style="width: 100%;" :border="border" :max-height="maxHeight" :class="!isEmptyCenter && !(data && data.length) ? 'empty-i-table': ''" :data="data" :row-key="rowKey" @selection-change="handleSelectionChange">
      <el-table-column v-if="selection.show" :fixed="selection.fixed" :width="selection.width || 60" :align="selection.align || 'center'"></el-table-column>
      <el-table-column v-for="(e, i) in columns" :key="i" :prop="e.prop" :label="e.label" :fixed="e.fixed" :formatter="e.formatter" :width="e.width" :min-width="e.minWidth || 140" :align="e.align || 'center'" :show-overflow-tooltip="e.showOverflowTooltip" :render-header="e.renderHeader" :header-align="e.headerAlign || e.align" :sortable="e.sortable" :sort-by="e.sortBy" :sort-method="e.method" :resizable="e.resizable" :class-name="e.className" :label-class-name="e.labelClassName" :selectable="e.selectable" :reserve-selection="e.reserveSelection" :filters="e.filters" :filter-placement="e.filterPlacement" :filter-multiple="e.filterMultiple" :filter-method="e.filterMethod" :filtered-value="e.filteredValue">
        <template v-if="!e.children" slot-scope="scope">
          <!-- 过滤器渲染 -->
          <span v-if="e.filter">
            {{ Vue.filter(e.filter)(scope.row[e.prop]) }}
          </span>
          <!-- slot渲染 -->
          <!-- <slot v-else-if="e.slot" :name="e.slot" :$index="scope.$index" :row="scope.row" :prop="e.prop" :label="e.label"></slot> -->
          <table-slot v-else-if="e.slot" :$index="scope.$index" :index="i" :row="scope.row" :column="e" :prop="e.prop" :label="e.label"></table-slot>
          <!-- render渲染 -->
          <table-expand v-else-if="e.render" :$index="scope.$index" :index="i" :row="scope.row" :column="e" :prop="e.prop" :label="e.label" :render="e.render"></table-expand>
          <!-- formatter渲染 -->
          <span v-else-if="e.formatter">
            {{ e.formatter(scope.row, scope.e, scope.row[e.prop], scope.$index) }}
          </span>
          <!-- 普通渲染 -->
          <span v-else>{{scope.row[e.prop]}}</span>
        </template>
        <template v-if="e.children && e.children.length">
          <el-table-column v-for="(child, j) in e.children" :key="`child${i+j+1}`" :prop="child.prop" :label="child.label" :formatter="child.formatter" :width="child.width" :min-width="child.minWidth || 140" :align="child.align || 'center'" :show-overflow-tooltip="child.showOverflowTooltip" :render-header="child.renderHeader" :header-align="child.headerAlign || child.align" :sortable="child.sortable" :sort-by="child.sortBy" :sort-method="child.method" :resizable="child.resizable" :class-name="child.className" :label-class-name="child.labelClassName" :selectable="child.selectable" :reserve-selection="child.reserveSelection" :filters="child.filters" :filter-placement="child.filterPlacement" :filter-multiple="child.filterMultiple" :filter-method="child.filterMethod" :filtered-value="child.filteredValue">
            <template slot-scope="childScope">
              <!-- 过滤器渲染 -->
              <span v-if="child.filter">
                {{ Vue.filter(child.filter)(childScope.row[child.prop]) }}
              </span>
              <!-- slot渲染 -->
              <table-slot v-else-if="child.slot" :$index="childScope.$index" :index="j" :row="childScope.row" :column="child" :prop="child.prop" :label="child.label"></table-slot>
              <!-- render渲染 -->
              <table-expand v-else-if="child.render" :$index="childScope.$index" :index="j" :row="childScope.row" :column="child" :prop="child.prop" :label="child.label" :render="child.render"></table-expand>
              <!-- formatter渲染 -->
              <span v-else-if="child.formatter">
                {{ child.formatter(childScope.row, childScope.e, childScope.row[child.prop], childScope.$index) }}
              </span>
              <!-- 普通渲染 -->
              <span v-else>{{childScope.row[child.prop]}}</span>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box" v-if="showPagination">
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="pagination.currentPage" :layout="pagination.layout" :page-sizes="pagination.pageSizes || [10, 20, 50, 100, 200]" :page-size="pagination.pageSize" :total="pagination.total"></el-pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TableExpand from './expand'
import TableSlot from './slot'
export default {
  components: {
    TableExpand,
    TableSlot
  },
  name: 'iTable',
  provide () {
    return {
      tableRoot: this
    }
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    maxHeight: {
      type: [String, Number],
      default: 600
    },
    pagination: {
      type: Object,
      default () {
        return {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          layout: 'total, sizes, prev, pager, next, jumper',
          pageSizes: [10, 20, 50, 100, 200]
        }
      }
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    selection: {
      type: Object,
      default: () => {
        return {
          show: false,
          fixed: '',
          align: 'center'
        }
      }
    },
    isEmptyCenter: { // 列表数据为空时，是否居中展示
      type: Boolean,
      default: true
    },
    rowKey: {
      type: [String, Function],
      default: ''
    },
    border: {
      type: Boolean,
      default: true
    },
    emptyText: String,
    tooltipEffect: String,
    size: String
  },
  data () {
    return {
      Vue
    }
  },
  methods: {
    sizeChange (e) {
      this.$emit('size-change', e)
    },
    currentChange (e) {
      this.$emit('current-change', e)
    },
    handleSelectionChange (data) {
      this.$emit('selection-change', data)
    }
  }
}
</script>

<style lang="less">
.i-table {
  .empty-i-table {
    .el-table__empty-block,
    .show-data-table__empty {
      text-align: left;
      line-height: 60px;
    }
    .show-data-table__empty > div,
    .el-table__empty-block .el-table__empty-text {
      position: relative;
      left: 0;
      top: 0;
      margin-left: 500px;
      -ms-transform: translate(0);
      transform: translate(0);
    }
  }
  .table-remark {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pagination-box {
    margin-top: 20px;
    text-align: right;
    margin-right: 36px;
  }
}
.i-table-tips-popover {
  &.el-popover {
    padding: 10px;
    // 修复loading空白区域高度太低
    min-height: 34px;
    box-sizing: border-box;
  }
  .el-loading-mask {
    .el-loading-spinner {
      margin-top: -12px;
      .circular {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
