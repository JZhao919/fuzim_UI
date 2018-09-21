import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  { path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    name: 'Dashboard',
    hidden: false,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'example', noCache: true }
    }]
  },

  {
    path: '/detail',
    component: Layout,
    hidden: false,
    children: [
      {
        name: 'Detail',
        path: 'index',
        component: () => import('@/views/detail/index'),
        meta: { title: 'Detail', icon: 'tree' }
      }
    ]
  },

  {
    path: '/map',
    component: Layout,
    hidden: false,
    children: [
      {
        name: 'Map',
        path: 'index',
        component: () => import('@/views/mapmake/index'),
        meta: { title: 'Map', icon: 'table' }
      }
    ]
  },

  {
    path: '/Track',
    component: Layout,
    hidden: false,
    children: [
      {
        name: 'Track',
        path: 'index',
        component: () => import('@/views/track/index'),
        meta: { title: 'Track', icon: 'nested' }
      }
    ]
  },

  {
    path: '/Video',
    component: Layout,
    hidden: false,
    children: [
      {
        name: 'Video',
        path: 'index',
        component: () => import('@/views/video/index'),
        meta: { title: 'Video', icon: 'eye' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/theme',
    component: Layout,
    hidden: false,
    meta: {
      role: ['ROLE_ADMIN']
    },
    children: [
      {
        name: 'Theme',
        path: 'index',
        component: () => import('@/views/theme/index'),
        meta: { title: 'theme', icon: 'example', role: ['ROLE_ADMIN'] }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
