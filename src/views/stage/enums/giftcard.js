import Enum from '@/core/utils/enum'
import i18n from '@/i18n'

/**
 * 礼品卡类型（对应后端 GiftCardTemplate::TYPE_*）
 */
export const CardTypes = new Enum({
  GENERAL: [1, i18n.t('通用礼品卡')],
  PLAN: [2, i18n.t('套餐礼品卡')],
  MYSTERY: [3, i18n.t('盲盒礼品卡')]
})

/**
 * 类型对应的标签配色
 */
export function getTypeColor(type) {
  if (Number(type) === CardTypes.PLAN) return 'blue'
  if (Number(type) === CardTypes.MYSTERY) return 'purple'
  return 'pink'
}
