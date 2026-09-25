import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'

/**
 * 获取工单列表
 */
export function getTicketList() {
  return request({
    url: SERVER_URL + '/api/v1/user/ticket/fetch',
    method: 'get'
  })
}

/**
 * 获取工单详情
 */
export function getTicketInfo(id) {
  return request({
    url: SERVER_URL + `/api/v1/user/ticket/fetch?id=${id}`,
    method: 'get'
  })
}

/**
 * 新建工单
 */
export function saveTicket(params) {
  return request({
    url: SERVER_URL + '/api/v1/user/ticket/save',
    method: 'post',
    params
  })
}

/**
 * 关闭工单
 */
export function closeTicket(id) {
  return request({
    url: SERVER_URL + `/api/v1/user/ticket/close?id=${id}`,
    method: 'post'
  })
}

/**
 * 回复工单
 */
export function replyTicket(params) {
  return request({
    url: SERVER_URL + `/api/v1/user/ticket/reply`,
    method: 'post',
    params
  })
}
