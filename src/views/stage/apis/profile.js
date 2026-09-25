import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'

/**
 * 重置订阅
 */
export function resetSubscribe() {
  return request({
    url: SERVER_URL + '/api/v1/user/resetSecurity',
    method: 'get'
  })
}

/**
 * 更新提醒设置
 */
export function updateRemind(params) {
  return request({
    url: SERVER_URL + '/api/v1/user/update',
    method: 'post',
    params
  })
}

/**
 * 绑定telegram
 */
export function getBotInfo(params) {
  return request({
    url: SERVER_URL + '/api/v1/user/telegram/getBotInfo',
    method: 'get',
    params
  })
}
