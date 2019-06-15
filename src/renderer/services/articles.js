import request from '@/utils/request'

export const getArticles = (params = {}) => {
  return request({
    url: 'issues',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params
  })
}

export const getArticle = id => {
  return request({
    url: `issues/${id}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
