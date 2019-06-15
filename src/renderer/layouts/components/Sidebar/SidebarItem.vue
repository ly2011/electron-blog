<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
      <template v-if="!item.hidden && item.children && item.children.length > 0 && !item.alwaysShow">
        <template v-for="childItem in item.children">
          <router-link :to="item.path+'/'+childItem.path" :key="childItem.name">
            <el-menu-item :index="item.path+'/'+childItem.path" :class="{'submenu-title-noDropdown':!isNest}">
              <!-- <svg-icon v-if="childItem.meta&&childItem.meta.icon" :icon-class="childItem.meta.icon"></svg-icon> -->
              <span v-if="childItem.meta&&childItem.meta.title" slot="title">{{childItem.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>

      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren (children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>
