import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import { getStaticRoutes } from '../utils/route'
import ls, { Authorization } from '../utils/ls'
import { APP_NAME } from '../constants'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(Router)

/**
 * 静态路由文件
 */
export const routeStaticContext = require.context('@/views', true, /\/routes\/static\.js$/)

/**
 * 初始化路由
 */
const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    ...getStaticRoutes(),
    {
      path: '*',
      name: '404',
      redirect: '/error'
    }
  ]
})

const whiteList = ['/', '/login', '/register', '/reset-password', '/agreement', '/client-download', '/error']

router.beforeEach(async (to, from, next) => {
  document.title = [APP_NAME, to.meta?.name ?? ''].reverse().join(' - ')
  if (to.path === '/error') {
    return next()
  }
  const hasToken = ls.get(Authorization)
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/stage' })
    } else {
      const { userInfo } = store.state.auth
      if (userInfo.uuid) {
        next()
      } else {
        try {
          await store.dispatch('auth/getUserConfig')
          await store.dispatch('auth/getUserInfo')
          next({ ...to, replace: true })
        } catch (error) {
          console.error(error)
          next('/error')
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login`)
    }
  }
})

export default router
