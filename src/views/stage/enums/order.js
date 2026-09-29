import Enum from '@/core/utils/enum'
import i18n from '@/i18n'

/**
 * 工单级别
 */
export const States = new Enum({
  WAIT_PAY: [0, i18n.t('pending_payment')],
  OPENING: [1, i18n.t('activating')],
  CANCEL: [2, i18n.t('canceled')],
  END: [3, i18n.t('completed')]
})
