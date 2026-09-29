/**
 * 接口路径映射
 *
 * 前端只发左边这些中性路径，边缘函数查表还原成右边的真实后端路径。
 * 后端零改动 —— /api/v1/passport/... 这类 V2Board 特征路径不会出现在
 * 前端代码、浏览器地址栏和抓包里。
 *
 * 本文件被两边共用：
 * - 边缘函数：edge-functions/api/[[default]].js
 * - 前端：通过 vue.config.js 里的 @api-map 别名引入
 *
 * 加接口时两个对象都要加，改完用 `node scripts/check-api-map.mjs` 校验。
 * 表里没有的路径边缘函数一律返回 404。
 */

/** 前端引用用的常量，值即请求路径 */
export const PATHS = {
  // 登录态
  BOOTSTRAP: '/api/bootstrap',
  LOGIN: '/api/session',
  REGISTER: '/api/users',
  RECOVER: '/api/session/recover',
  VERIFY_CODE: '/api/verify-code',

  // 账号
  ME: '/api/me',
  ME_SETTINGS: '/api/me/settings',
  ME_UPDATE: '/api/me/update',
  ME_PASSWORD: '/api/me/password',
  ME_SUMMARY: '/api/me/summary',
  ME_ACCESS: '/api/me/access',
  ME_ACCESS_ROTATE: '/api/me/access/rotate',

  // 用量
  USAGE_SERIES: '/api/usage/series',

  // 目录与下单
  CATALOG: '/api/catalog',
  REGIONS: '/api/regions',
  COUPON_VERIFY: '/api/coupons/verify',
  ORDERS: '/api/orders',
  ORDER_CREATE: '/api/orders/create',
  ORDER_DETAIL: '/api/orders/detail',
  ORDER_STATUS: '/api/orders/status',
  ORDER_CANCEL: '/api/orders/cancel',
  ORDER_CHECKOUT: '/api/orders/checkout',
  PAYMENT_METHODS: '/api/payments/methods',

  // 推荐与提现
  REFERRALS: '/api/referrals',
  REFERRAL_RECORDS: '/api/referrals/records',
  REFERRAL_CREATE: '/api/referrals/create',
  PAYOUT_REQUEST: '/api/payouts/request',
  PAYOUT_TRANSFER: '/api/payouts/transfer',

  // 兑换码
  VOUCHER_VERIFY: '/api/vouchers/verify',
  VOUCHER_REDEEM: '/api/vouchers/redeem',
  VOUCHER_DETAIL: '/api/vouchers/detail',
  VOUCHER_HISTORY: '/api/vouchers/history',

  // 支持
  SUPPORT: '/api/support',
  SUPPORT_CREATE: '/api/support/create',
  SUPPORT_REPLY: '/api/support/reply',
  SUPPORT_CLOSE: '/api/support/close',

  // 其他
  DOCS: '/api/docs',
  ANNOUNCEMENTS: '/api/announcements',
  INTEGRATION_BOT: '/api/integrations/bot'
}

/** 中性路径 → 真实后端路径。查询串由边缘函数原样转发，这里只映射 path */
export const API_MAP = {
  '/api/bootstrap': '/api/v1/guest/comm/config',
  '/api/session': '/api/v1/passport/auth/login',
  '/api/users': '/api/v1/passport/auth/register',
  '/api/session/recover': '/api/v1/passport/auth/forget',
  '/api/verify-code': '/api/v1/passport/comm/sendEmailVerify',

  '/api/me': '/api/v1/user/info',
  '/api/me/settings': '/api/v1/user/comm/config',
  '/api/me/update': '/api/v1/user/update',
  '/api/me/password': '/api/v1/user/changePassword',
  '/api/me/summary': '/api/v1/user/getStat',
  '/api/me/access': '/api/v1/user/getSubscribe',
  '/api/me/access/rotate': '/api/v1/user/resetSecurity',

  '/api/usage/series': '/api/v1/user/stat/getTrafficLog',

  '/api/catalog': '/api/v1/user/plan/fetch',
  '/api/regions': '/api/v1/user/server/fetch',
  '/api/coupons/verify': '/api/v1/user/coupon/check',
  '/api/orders': '/api/v1/user/order/fetch',
  '/api/orders/create': '/api/v1/user/order/save',
  '/api/orders/detail': '/api/v1/user/order/detail',
  '/api/orders/status': '/api/v1/user/order/check',
  '/api/orders/cancel': '/api/v1/user/order/cancel',
  '/api/orders/checkout': '/api/v1/user/order/checkout',
  '/api/payments/methods': '/api/v1/user/order/getPaymentMethod',

  '/api/referrals': '/api/v1/user/invite/fetch',
  '/api/referrals/records': '/api/v1/user/invite/details',
  '/api/referrals/create': '/api/v1/user/invite/save',
  '/api/payouts/request': '/api/v1/user/ticket/withdraw',
  '/api/payouts/transfer': '/api/v1/user/transfer',

  '/api/vouchers/verify': '/api/v1/user/gift-card/check',
  '/api/vouchers/redeem': '/api/v1/user/gift-card/redeem',
  '/api/vouchers/detail': '/api/v1/user/gift-card/detail',
  '/api/vouchers/history': '/api/v1/user/gift-card/history',

  '/api/support': '/api/v1/user/ticket/fetch',
  '/api/support/create': '/api/v1/user/ticket/save',
  '/api/support/reply': '/api/v1/user/ticket/reply',
  '/api/support/close': '/api/v1/user/ticket/close',

  '/api/docs': '/api/v1/user/knowledge/fetch',
  '/api/announcements': '/api/v1/user/notice/fetch',
  '/api/integrations/bot': '/api/v1/user/telegram/getBotInfo'
}

/** 订阅链接：不校验请求头，代理客户端要能直接拉 */
export const SUBSCRIBE_PREFIX = '/d/'
export const SUBSCRIBE_TARGET = '/api/v1/client/subscribe'
