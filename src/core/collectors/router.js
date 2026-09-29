import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import { getStaticRoutes } from '../utils/route'
import ls, { Authorization } from '../utils/ls'
import { APP_NAME } from '../constants'
import i18n, { loadMessages } from '@/i18n'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(Router)

/**
 * 未登录可达的路由
 *
 * 只匹配 routes/static.js。业务路由放在 routes/authed.js 里，文件名不同，
 * 不会被这里收集，因此不会进首屏 chunk —— 见 addAuthedRoutes()。
 */
export const routeStaticContext = require.context('@/views', true, /\/routes\/static\.js$/)

/**
 * 初始化路由
 *
 * 这里刻意不放 path: '*' 兜底路由。vue-router 3 的 addRoutes 是往后追加的，
 * 而匹配按定义顺序走，先定义的 '*' 会把后注册的业务路由全部吃掉。
 * 未匹配的路径改在守卫里处理。
 */
const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: getStaticRoutes()
})

const whiteList = ['/', '/login', '/register', '/reset-password', '/agreement', '/error']

let authedRoutesAdded = false

/**
 * 注册业务路由
 *
 * 文案字典必须先到：authed.js 和它引用的 menu.js 是在模块导入那一刻就把
 * 路由 meta、侧边栏菜单的翻译取好存成字符串的，字典晚到会显示成原始 key。
 * 站点配置（Logo、客户端下载地址等）同理，一起在这里拉。
 * 两者失败都不阻断登录 —— 简体的 key 本身就是文案，降级后基本无感。
 */
async function addAuthedRoutes() {
  if (authedRoutesAdded) {
    return
  }
  // app-config 里声明了 clientOpenwrt 这类键名，动态 import 才不会进首屏 chunk
  const { loadAppConfig } = await import('../app-config')
  try {
    await Promise.all([loadMessages(), loadAppConfig()])
  } catch (error) {
    console.error(error)
  }
  const { default: routes } = await import('@/views/stage/routes/authed')
  router.addRoutes(routes)
  authedRoutesAdded = true
}

function setTitle(to) {
  const key = to.meta && to.meta.title
  document.title = [key ? i18n.t(key) : '', APP_NAME].filter(Boolean).join(' - ')
}

router.beforeEach(async (to, from, next) => {
  const hasToken = ls.get(Authorization)

  if (hasToken && !authedRoutesAdded) {
    try {
      await addAuthedRoutes()
    } catch (error) {
      console.error(error)
      return next('/error')
    }
    // 重新走一遍匹配，新注册的路由才会生效
    return next({ ...to, replace: true })
  }

  if (!to.matched.length) {
    return next(hasToken ? '/error' : '/login')
  }

  setTitle(to)

  if (to.path === '/error') {
    return next()
  }

  if (!hasToken) {
    return next(whiteList.includes(to.path) ? undefined : '/login')
  }

  if (to.path === '/login') {
    return next({ path: '/console' })
  }

  if (store.state.auth.userInfo.uuid) {
    return next()
  }

  try {
    await store.dispatch('auth/getUserConfig')
    await store.dispatch('auth/getUserInfo')
    return next({ ...to, replace: true })
  } catch (error) {
    console.error(error)
    return next('/error')
  }
})

export default router
