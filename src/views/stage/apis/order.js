import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'

/**
 * 获取订单列表
 */
export function getOrderList() {
  return request({
    url: SERVER_URL + '/api/v1/user/order/fetch',
    method: 'get'
  })
}

/**
 * 获取订单详情
 */
export function getOrderInfo(code) {
  return request({
    url: SERVER_URL + `/api/v1/user/order/detail?trade_no=${code}`,
    method: 'get'
  })
}

/**
 * 获取支付方式
 */
export function getOrderPayments() {
  return request({
    url: SERVER_URL + `/api/v1/user/order/getPaymentMethod`,
    method: 'get'
  })
}

/**
 * 取消订单
 */
export function cancelOrder(id) {
  return request({
    url: SERVER_URL + `/api/v1/user/order/cancel?trade_no=${id}`,
    method: 'post'
  })
}

/**
 * 支付订单
 */
export function checkoutOrder(id, type) {
  return request({
    url: SERVER_URL + `/api/v1/user/order/checkout?trade_no=${id}&method=${type}`,
    method: 'post'
  })
}
/**
 * 查询订单状态
 */
export function getOrderState(id) {
  return request({
    url: SERVER_URL + `/api/v1/user/order/check?trade_no=${id}`,
    method: 'get'
  })
}
