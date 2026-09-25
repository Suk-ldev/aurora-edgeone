import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'

/**
 * 邀请码列表
 */
export function getInviteCodes() {
  return request({
    url: SERVER_URL + '/api/v1/user/invite/fetch',
    method: 'get'
  })
}

/**
 * 生成邀请码
 */
export function createInviteCode() {
  return request({
    url: SERVER_URL + '/api/v1/user/invite/save',
    method: 'get'
  })
}

/**
 * 获取佣金发放记录
 */
export function getInviteDetails() {
  return request({
    url: SERVER_URL + '/api/v1/user/invite/details',
    method: 'get',
    params: {
      page_size: 999
    }
  })
}

/**
 * 佣金提现
 */
export function cashCommission(params) {
  return request({
    url: SERVER_URL + '/api/v1/user/ticket/withdraw',
    method: 'post',
    params
  })
}

/**
 * 佣金划转
 */
export function transferCommission(params) {
  return request({
    url: SERVER_URL + '/api/v1/user/transfer',
    method: 'post',
    params
  })
}
