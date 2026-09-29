import Vue from 'vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import ls, { Language } from '@/core/utils/ls'
import { CLIENT_KEY_HEADER, CLIENT_KEY } from '@/core/utils/client-key'
import gate from './gate'

Vue.use(VueI18n)

/**
 * 完整文案文件名
 *
 * 源码里的 i18n key 全部是 ASCII，中文只作为值存在于这些文件里，
 * 因此任何构建产物都不含业务文案。三种语言都需要字典（简体也不例外）。
 * 这些路径在 middleware.js 里做了请求头校验，直接 GET 返回 404，
 * 未登录的访客和扫描器拿不到。
 */
const MESSAGE_FILES = {
  zhCN: 'b3f07a',
  zhTW: '5c91e4',
  enUS: 'a82d6f'
}

export function getLang(spliter = '') {
  const getEnvLang = () => {
    const lang = (navigator.language || navigator.browserLanguage).replace(/[-_]/g, '').toLowerCase()
    if (lang.includes('zhcn')) {
      return 'zhCN'
    } else if (lang.includes('zhtw')) {
      return 'zhTW'
    } else {
      return 'enUS'
    }
  }
  const lang = ls.get(Language) || getEnvLang()
  document.body.classList.add(lang)
  return lang.substring(0, 2) + spliter + lang.substring(2)
}

const i18n = new VueI18n({
  locale: getLang(),
  // 简体的 key 就是文案本身，没有字典，缺 key 时原样返回是预期行为，不必告警
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  messages: gate
})

let loading = null

/**
 * 拉取完整文案
 *
 * 必须在导入任何 stage 模块「之前」await 它：stage 的路由 meta 和侧边栏菜单
 * 是在模块导入那一刻就把翻译取好存成字符串的，字典晚到会显示成原始 key。
 * 语言切换会 location.reload()，所以这里用单例 promise 缓存是安全的。
 */
export function loadMessages() {
  if (loading) {
    return loading
  }
  const file = MESSAGE_FILES[i18n.locale]
  if (!file) {
    return Promise.resolve()
  }
  loading = axios
    .get(`/static/data/${file}.json`, { headers: { [CLIENT_KEY_HEADER]: CLIENT_KEY } })
    .then(({ data }) => {
      i18n.mergeLocaleMessage(i18n.locale, data)
    })
    .catch((error) => {
      loading = null
      throw error
    })
  return loading
}

export default i18n
