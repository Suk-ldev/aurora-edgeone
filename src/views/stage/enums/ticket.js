import Enum from '@/core/utils/enum'
import i18n from '@/i18n'

/**
 * 工单级别
 */
export const Levels = new Enum({
  LOW: [0, i18n.t('低')],
  NORMAL: [1, i18n.t('中')],
  HIGH: [2, i18n.t('高')]
})

/**
 * 工单状态
 */
export const States = new Enum({
  HANDLING: [0, i18n.t('待回复')],
  CLOSED: [1, i18n.t('已关闭')]
})
