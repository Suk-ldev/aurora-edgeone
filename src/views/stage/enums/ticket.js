import Enum from '@/core/utils/enum'
import i18n from '@/i18n'

/**
 * 工单级别
 */
export const Levels = new Enum({
  LOW: [0, i18n.t('low')],
  NORMAL: [1, i18n.t('medium')],
  HIGH: [2, i18n.t('high')]
})

/**
 * 工单状态
 */
export const States = new Enum({
  HANDLING: [0, i18n.t('pending_reply')],
  CLOSED: [1, i18n.t('closed')]
})
