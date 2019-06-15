<template>
  <div class="home">
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import { githubLoginUrl } from '../config'
export default {
  name: 'home',
  components: {
  },
  methods: {
    login () {
      window.location.href = githubLoginUrl
    }
  }
}
</script>
