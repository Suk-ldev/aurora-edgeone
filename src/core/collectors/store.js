import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const storeContext = require.context('@/', true, /\/stores\/[\w\-]+.js$/)

const modules = storeContext.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.match(/(\w+)\.js/)[1]
  if (modules[moduleName]) {
    throw new Error('store模块文件名不允许重名，请修改')
  }
  const value = storeContext(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules
})

export default store
