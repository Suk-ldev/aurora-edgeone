import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'
import { PATHS } from '@api-map'

/**
 * 获取通知列表
 */
export function getNoticeList() {
  return request({
    url: SERVER_URL + PATHS.ANNOUNCEMENTS,
    method: 'get'
  })
}

/**
 * 获取余额
 */
export function getAccountInfo() {
  return request({
    url: SERVER_URL + PATHS.ME_SUMMARY,
    method: 'get'
  })
}
