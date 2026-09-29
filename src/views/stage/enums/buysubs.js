import Enum from '@/core/utils/enum'
import i18n from '@/i18n'

/**
 * 订阅筛选
 */
export const Filtered = new Enum({
  ALL: [0, i18n.t('all')],
  PERIOD: [1, i18n.t('by_cycle')],
  ONE_TIME: [2, i18n.t('by_traffic')]
})

/**
 * 优惠券类型
 */
export const CouponEnum = new Enum({
  NUMBER: [1, i18n.t('discount_amount')],
  PERCENT: [2, i18n.t('discount_percentage')]
})

/**
 * 套餐类型
 */
export const ComboEnum = new Enum({
  UNBUY: [1, i18n.t('not_purchased')],
  PERIOD: [2, i18n.t('periodic_subscription')],
  ONE_TIME: [3, i18n.t('one_time_subscription')]
})
