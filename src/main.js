import Vue from 'vue'
import App from './App'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.min.css'
import VWave from 'v-wave'

import './core/styles'
import './icons'
import { router, store } from './core/collectors'
import { APP_NAME, APP_DESC, APP_LOGO, APP_VERSION } from './core/constants'
import { v4 as uuidV4 } from 'uuid'
import './core/filters'
import i18n from './i18n'

Vue.prototype.$appName = APP_NAME
Vue.prototype.$appDesc = APP_DESC
Vue.prototype.$appLogo = APP_LOGO
Vue.prototype.$appVersion = APP_VERSION.replace(/\.\d{8,}/, '')
Vue.prototype.$uuid = uuidV4

Vue.use(Antd)
Vue.use(VWave)

Vue.config.productionTip = false

document.body.classList.toggle('is-darkmode', window.isDarkMode())

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App)
})
