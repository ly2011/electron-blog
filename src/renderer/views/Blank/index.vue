<template>
  <div>授权回调中转页面

    <el-button @click="$router.replace('/')">首页</el-button>
  </div>
</template>

<script>
import axios from 'axios'
import { clientID, clientSecret } from '../../config'
export default {
  created () {
    this.getOauth()
  },
  methods: {
    async getOauth () {
      const requestToken = this.$route.query.code
      console.log('authorization code:', requestToken)
      // https://stackoverflow.com/questions/42150075/cors-issue-on-github-oauth
      const tokenResponse = await axios({
        method: 'post',
        url: 'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?' +
          `client_id=${clientID}&` +
          `client_secret=${clientSecret}&` +
          `code=${requestToken}`,
        headers: {
          accept: 'application/json'
        }
      })

      const accessToken = tokenResponse.data.access_token
      console.log(`access token: ${accessToken}`)

      const result = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
          accept: 'application/json',
          Authorization: `token ${accessToken}`
        }
      })
      console.log(result.data)
      const name = result.data.name

      console.log('回调成功的用户名称：', name)

      // ctx.response.redirect(`/welcome.html?name=${name}`)
    }
  }
}
</script>
