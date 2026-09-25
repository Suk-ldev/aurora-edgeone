import Enum from '@/core/utils/enum'
import i18n from '@/i18n'

/**
 * 订阅筛选
 */
export const Filtered = new Enum({
  ALL: [0, i18n.t('全部')],
  PERIOD: [1, i18n.t('按周期')],
  ONE_TIME: [2, i18n.t('按流量')]
})

/**
 * 优惠券类型
 */
export const CouponEnum = new Enum({
  NUMBER: [1, i18n.t('折扣金额')],
  PERCENT: [2, i18n.t('折扣百分比')]
})

/**
 * 套餐类型
 */
export const ComboEnum = new Enum({
  UNBUY: [1, i18n.t('未购买')],
  PERIOD: [2, i18n.t('周期性订阅')],
  ONE_TIME: [3, i18n.t('一次性订阅')]
})
