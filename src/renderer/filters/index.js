import Vue from 'vue'
import dayjs from 'dayjs'

// 格式化日期
Vue.filter('formatDate', (value, format = 'YYYY-MM-DD') => {
  return value ? dayjs(value).format(format) : ''
})
// 格式化日期时间
Vue.filter('formatDateTime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return value ? dayjs(value).format(format) : ''
})
// 格式化月份
Vue.filter('formatMonth', (value, format = 'YYYY-MM') => {
  return value ? dayjs(value).format(format) : ''
})
// 格式化金额
Vue.filter('formatCurrency', (value, digits = 2) => {
  if (typeof value === 'number') {
    value = value.toFixed(digits)
  }
  return value
})
