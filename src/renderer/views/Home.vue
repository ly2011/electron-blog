<template>
  <div class="home">
    <el-button type="primary" @click="login">登录</el-button>
  </div>
</template>

<script>
import { githubLoginUrl } from '../config'
import { remote } from 'electron'
const { getGlobal } = remote
export default {
  name: 'home',
  components: {
  },
  mounted () {
    const mainId = getGlobal('mainId')
    const dirname = getGlobal('__dirname')
    console.log('getGlobal - main: ', mainId, dirname)
  },
  methods: {
    login () {
      window.location.href = githubLoginUrl
    }
  }
}
</script>
