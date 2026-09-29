import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'
import { PATHS } from '@api-map'

/**
 * 获取套餐列表
 */
export function getPlanList() {
  return request({
    url: SERVER_URL + PATHS.CATALOG,
    method: 'get'
  })
}

/**
 * 获取套餐详情
 */
export function getPlanInfo(id) {
  return request({
    url: SERVER_URL + PATHS.CATALOG + `?id=${id}`,
    method: 'get'
  })
}

/**
 * 验证优惠券
 */
export function verifyCoupon(data) {
  return request({
    url: SERVER_URL + PATHS.COUPON_VERIFY,
    method: 'post',
    data
  })
}

/**
 * 获取套餐详情
 */
export function makePlanOrder(params) {
  return request({
    url: SERVER_URL + PATHS.ORDER_CREATE,
    method: 'post',
    params
  })
}

/**
 * 获取节点信息
 */
export function getServerNodes() {
  return request({
    url: SERVER_URL + PATHS.REGIONS,
    method: 'get'
  })
}

/**
 * 获取我的订阅
 */
export function getSubscribes() {
  return request({
    url: SERVER_URL + PATHS.ME_ACCESS,
    method: 'get'
  })
}
