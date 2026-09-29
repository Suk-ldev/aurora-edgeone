import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'
import { PATHS } from '@api-map'

/**
 * 获取工单列表
 */
export function getTicketList() {
  return request({
    url: SERVER_URL + PATHS.SUPPORT,
    method: 'get'
  })
}

/**
 * 获取工单详情
 */
export function getTicketInfo(id) {
  return request({
    url: SERVER_URL + PATHS.SUPPORT + `?id=${id}`,
    method: 'get'
  })
}

/**
 * 新建工单
 */
export function saveTicket(params) {
  return request({
    url: SERVER_URL + PATHS.SUPPORT_CREATE,
    method: 'post',
    params
  })
}

/**
 * 关闭工单
 */
export function closeTicket(id) {
  return request({
    url: SERVER_URL + PATHS.SUPPORT_CLOSE + `?id=${id}`,
    method: 'post'
  })
}

/**
 * 回复工单
 */
export function replyTicket(params) {
  return request({
    url: SERVER_URL + PATHS.SUPPORT_REPLY,
    method: 'post',
    params
  })
}
