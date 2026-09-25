import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'

/**
 * 查询兑换码信息
 * 兑换码不存在、已过期等属于正常业务流程，用 silent 关掉全局错误弹窗，由页面内联提示
 */
export function checkGiftCard(data) {
  return request({
    url: SERVER_URL + '/api/v1/user/gift-card/check',
    method: 'post',
    data,
    silent: true
  })
}

/**
 * 使用兑换码
 * 兑换失败的原因（不满足条件、已达使用上限等）交给全局错误提示，和其他操作类接口保持一致
 */
export function redeemGiftCard(data) {
  return request({
    url: SERVER_URL + '/api/v1/user/gift-card/redeem',
    method: 'post',
    data
  })
}

/**
 * 获取兑换记录
 * 注意：该接口没有 success() 包装，返回结构是 { data, pagination }
 */
export function getGiftCardHistory(params) {
  return request({
    url: SERVER_URL + '/api/v1/user/gift-card/history',
    method: 'get',
    params
  })
}

/**
 * 获取兑换记录详情
 */
export function getGiftCardDetail(id) {
  return request({
    url: SERVER_URL + `/api/v1/user/gift-card/detail?id=${id}`,
    method: 'get'
  })
}
