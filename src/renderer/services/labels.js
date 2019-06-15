import request from '@/utils/request'

// 获取标签
export const getLabels = (params = {}) => {
  return request({
    url: 'labels',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params
  })
}
