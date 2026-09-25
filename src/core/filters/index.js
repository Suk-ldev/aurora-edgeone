import Vue from 'vue'
import currencyjs from 'currency.js'
import bytes from 'bytes'
import dayjs from 'dayjs'
import { store } from '@/core/collectors'

/**
 * 格式化金额(单位: 分)
 */
Vue.filter('amount', (value = 0) => {
  const unit = store.state.auth.userConfig?.currency_symbol ?? '¥'
  return currencyjs(value, { fromCents: true, symbol: unit }).format()
})

/**
 * 格式化流量(单位: 字节)
 */
Vue.filter('flow', (value = 0) => {
  return bytes(value)
})

/**
 * 格式化日期
 */
Vue.filter('date', (value) => {
  if (!value) return ''
  return dayjs.unix(value).format('YYYY/MM/DD')
})

/**
 * 格式化日期时间
 */
Vue.filter('datetime', (value) => {
  if (!value) return ''
  return dayjs.unix(value).format('YYYY/MM/DD HH:mm:ss')
})
