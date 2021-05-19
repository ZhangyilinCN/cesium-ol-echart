import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index'
Vue.config.productionTip = false
import './css/reset.css' // 全局css重置
// import './css/common.css' // 全局公用css
import '@/styles/index.scss' // global css
import './utils/common.js'

import keymaster from 'keymaster'
const bindKeyHandler = (fn) => {
  return () => {
    fn()
    return false
  }
}
export const key = {
  bind: (seed, func) => keymaster(seed, bindKeyHandler(func)),
  ...keymaster,
}
Vue.prototype.$key = key
// import { Select, Dialog, Pagination, Loading, Button, Upload } from 'element-ui'
// Vue.component(Select.name, Select)
// Vue.component(Dialog.name, Dialog)
// Vue.component(Pagination.name, Pagination)
// Vue.component(Button.name, Button)
// Vue.component(Upload.name, Upload)
// Vue.prototype.$loading = Loading.service

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

// console.log(999999, XE)
// if (typeof XE !== 'undefined') {
//   // 如果XE存在，说明EarthSDK已载入
//   // eslint-disable-next-line no-console
//   console.log('当前正在使用EarthSDK开发！')
//   /* eslint-disable*/
//   function startup() {
//     new Vue({
//       router,
//       store,
//       render: (h) => h(App),
//     }).$mount('#app')
//   }


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

//   // 1 XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
//   XE.ready().then(startup)
// } else
// if (typeof Cesium !== 'undefined') {
//   // 如果XE不存在，存在Cesium，则此时用纯Cesium进行开发
//   console.log('当前正在使用纯Cesium开发！')
//   new Vue({
//     router,
//     store,
//     render: (h) => h(App),
//   }).$mount('#app')
// }
