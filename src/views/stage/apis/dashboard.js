import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'

/**
 * 获取通知列表
 */
export function getNoticeList() {
  return request({
    url: SERVER_URL + '/api/v1/user/notice/fetch',
    method: 'get'
  })
}

/**
 * 获取余额
 */
export function getAccountInfo() {
  return request({
    url: SERVER_URL + '/api/v1/user/getStat',
    method: 'get'
  })
}
