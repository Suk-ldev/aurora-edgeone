import axios from 'axios'
import { notification } from 'ant-design-vue'
import ls, { Authorization } from './ls'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import i18n, { getLang } from '@/i18n'

const service = axios.create({
  baseURL: '', // 基础路径
  timeout: 30 * 1000 // 单位（秒）
})

NProgress.configure({ showSpinner: false })

function startLoading() {
  NProgress.start()
}

function endLoading() {
  NProgress.done()
}

service.interceptors.request.use(
  (config) => {
    startLoading()
    const lang = getLang('-')
    const token = ls.get(Authorization)
    if (token) {
      config.headers[Authorization] = token
    }

    if (lang) {
      config.headers['Content-Language'] = lang
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    endLoading()
    const res = response.data
    return res
  },
  (error) => {
    endLoading()
    if (error.config && error.config.silent) {
      return Promise.reject(error)
    }

    try {
      const res = error.response.data
      // console.log(error.response)
      notification.error({
        message: i18n.t('请求失败'),
        description: res.message
      })

      if (error.response.status === 403) {
        ls.remove(Authorization)
      }
    } catch {
      notification.error({
        message: i18n.t('请求失败'),
        description: i18n.t('似乎出了点问题')
      })
    }

    return Promise.reject(error)
  }
)

export default service
