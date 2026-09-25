import i18n from '@/i18n'
import bytes from 'bytes'
import currencyjs from 'currency.js'
import { store } from '@/core/collectors'

/**
 * 取出后端返回的错误提示（接口失败时返回的是 http 400 + { message }）
 */
export function getErrMsg(err, fallback = '') {
  return err?.response?.data?.message || fallback || i18n.t('似乎出了点问题')
}

/**
 * 把礼品卡奖励对象转成可渲染的行数据
 *
 * 单位提醒：
 * rewards.transfer_enable 是字节（后端直接累加到 user.transfer_enable），
 * 而 code_info.plan_info.transfer_enable 是 GB（PlanResource），两者不要混用。
 */
export function formatRewards(rewards) {
  if (!rewards) return []

  const unit = store.state.auth.userConfig?.currency_symbol ?? '¥'
  const toAmount = (val) => currencyjs(val, { fromCents: true, symbol: unit }).format()
  const list = []

  if (rewards.balance > 0) {
    list.push({
      key: 'balance',
      icon: 'wallet',
      label: i18n.t('余额'),
      text: toAmount(rewards.balance)
    })
  }

  if (rewards.transfer_enable > 0) {
    list.push({
      key: 'transfer_enable',
      icon: 'cell-signal-full',
      label: i18n.t('流量'),
      text: '+' + bytes(rewards.transfer_enable)
    })
  }

  // 后端 giveRewards()：带 plan_id 时走套餐开通，不再单独处理 expire_days
  if (rewards.plan_id) {
    list.push({
      key: 'plan_id',
      icon: 'package',
      label: i18n.t('套餐'),
      text: rewards.plan_validity_days > 0 ? rewards.plan_validity_days + i18n.t('天') : i18n.t('已指定')
    })
  } else if (rewards.expire_days > 0) {
    list.push({
      key: 'expire_days',
      icon: 'calendar-plus',
      label: i18n.t('有效期'),
      text: '+' + rewards.expire_days + i18n.t('天')
    })
  }

  if (rewards.device_limit > 0) {
    list.push({
      key: 'device_limit',
      icon: 'devices',
      label: i18n.t('设备数'),
      text: '+' + rewards.device_limit
    })
  }

  if (rewards.reset_package) {
    list.push({
      key: 'reset_package',
      icon: 'arrows-clockwise',
      label: i18n.t('流量重置'),
      text: i18n.t('立即重置')
    })
  }

  if (rewards.invite_reward_rate > 0) {
    list.push({
      key: 'invite_reward_rate',
      icon: 'users-three',
      label: i18n.t('邀请人奖励'),
      text: Math.round(rewards.invite_reward_rate * 100) + '%'
    })
  }

  return list
}

/**
 * 奖励的一行文字摘要（用于列表）
 */
export function formatRewardsText(rewards) {
  const text = formatRewards(rewards)
    .map((item) => item.label + ' ' + item.text)
    .join(' · ')
  return text || '-'
}
