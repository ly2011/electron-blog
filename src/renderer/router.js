import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from './layouts/Layout'
// import Home from './views/Home.vue'

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: '',
    // name: 'home',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('./views/Home.vue'),
        meta: {
          title: '首页',
          icon: 'home'
        }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
        meta: {
          title: '关于',
          icon: 'about'
        }
      },
      {
        path: 'articles',
        name: 'articles',
        component: () => import(/* webpackChunkName: "about" */ './views/Article/list.vue'),
        meta: {
          title: '文章',
          icon: 'articles'
        }
      }
    ]
  },
  {
    path: '/oauthredirect',
    name: 'oauthredirect',
    component: () => import('./views/Blank')
  }
]
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
