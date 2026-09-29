import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'
import { PATHS } from '@api-map'

/**
 * 重置订阅
 */
export function resetSubscribe() {
  return request({
    url: SERVER_URL + PATHS.ME_ACCESS_ROTATE,
    method: 'get'
  })
}

/**
 * 更新提醒设置
 */
export function updateRemind(params) {
  return request({
    url: SERVER_URL + PATHS.ME_UPDATE,
    method: 'post',
    params
  })
}

/**
 * 绑定telegram
 */
export function getBotInfo(params) {
  return request({
    url: SERVER_URL + PATHS.INTEGRATION_BOT,
    method: 'get',
    params
  })
}
