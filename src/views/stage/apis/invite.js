import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'
import { PATHS } from '@api-map'

/**
 * 邀请码列表
 */
export function getInviteCodes() {
  return request({
    url: SERVER_URL + PATHS.REFERRALS,
    method: 'get'
  })
}

/**
 * 生成邀请码
 */
export function createInviteCode() {
  return request({
    url: SERVER_URL + PATHS.REFERRAL_CREATE,
    method: 'get'
  })
}

/**
 * 获取佣金发放记录
 */
export function getInviteDetails() {
  return request({
    url: SERVER_URL + PATHS.REFERRAL_RECORDS,
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
    url: SERVER_URL + PATHS.PAYOUT_REQUEST,
    method: 'post',
    params
  })
}

/**
 * 佣金划转
 */
export function transferCommission(params) {
  return request({
    url: SERVER_URL + PATHS.PAYOUT_TRANSFER,
    method: 'post',
    params
  })
}
