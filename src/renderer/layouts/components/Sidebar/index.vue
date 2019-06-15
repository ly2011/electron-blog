
<template>
  <scroll-bar>
    <div class="logo">
      <img class="img" src="@/assets/images/logo-hey.png">
      <h3>blog</h3>
    </div>
    <el-menu class="sidebar-menu" mode="vertical" :show-timeout="200" :default-active="$route.path" :collapse="isCollapse">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes () {
      return this.$router.options.routes
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="less" scoped>
.logo {
  min-height: 64px;
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 32px 0 16px;

  h3 {
    color: #333;
    font-size: 18px;
    transform: translateY(8px);
  }
  .img {
    width: 64px;
    height: 64px;
    border-radius: 16px;
  }
}
.sidebar-menu {
  &.el-menu {
    background-color: #f9f7f3;
  }
  ::v-deep {
    .el-menu-item,
    .el-submenu__title {
      line-height: 40px;
      height: 40px;
    }
    .el-menu-item {
      color: #434343;
      &.is-active {
        background-color: #efebe3;
      }
      &:hover {
        background-color: rgba(239, 235, 227, 0.52);
      }
    }
  }
}
</style>
