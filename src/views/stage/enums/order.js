import Enum from '@/core/utils/enum'
import i18n from '@/i18n'

/**
 * 工单级别
 */
export const States = new Enum({
  WAIT_PAY: [0, i18n.t('待支付')],
  OPENING: [1, i18n.t('开通中')],
  CANCEL: [2, i18n.t('已取消')],
  END: [3, i18n.t('已完成')]
})
