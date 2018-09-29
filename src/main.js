import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 之所以把Hls挂载window对象上，是因为当DPlayer.video.type='hls'时，new DPlayer()对象会用到此对象。
// window.Hls = require('hls.js')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
