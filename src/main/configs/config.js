import Config from 'electron-config'
/**
 * https://iblog.wilee.me/post/detail/4
 * http://www.ruanyifeng.com/blog/2019/04/github-oauth.html
 * owner: 'ly2011', // github用户名
 * repo: 'blog' // 作为文章源的github仓储
 * token: github personal token
 */
export default new Config({
  name: 'config',
  owner: 'ly2011',
  repo: 'blog',
  token: '',
  client_id: '',
  client_secret: ''
})
