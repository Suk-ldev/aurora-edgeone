import Vue from 'vue'
import axios from 'axios'
import { CLIENT_KEY_HEADER, CLIENT_KEY } from './utils/client-key'

/**
 * 登录后才下发的站点配置
 *
 * 客户端下载地址、侧边栏额外菜单这些字段，键名本身就是特征（通用控制台不会有
 * clientOpenwrt），所以不内联进 HTML。文件路径在 middleware.js 里做了请求头校验，
 * 未登录直接 GET 返回 404。内容由 vue.config.js 在构建时生成。
 */
export const appConfig = Vue.observable({
  appLogo: '',
  appVersion: '',
  slogan: '',
  helpUrl: '',
  clientIOS: '',
  clientAndroid: '',
  clientWindows: '',
  clientMacOS: '',
  clientOpenwrt: '',
  clientLinux: '',
  customLink1: '',
  customLink2: '',
  extraMenus: []
})

let loading = null

export function loadAppConfig() {
  if (loading) {
    return loading
  }
  loading = axios
    .get('/static/data/e5b2c8.json', { headers: { [CLIENT_KEY_HEADER]: CLIENT_KEY } })
    .then(({ data }) => {
      Object.keys(appConfig).forEach((key) => {
        if (data[key] !== undefined) {
          appConfig[key] = data[key]
        }
      })
    })
    .catch((error) => {
      loading = null
      throw error
    })
  return loading
}
