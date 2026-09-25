import i18n from '@/i18n'

export default [
  {
    path: '/stage',
    name: 'Stage',
    component: () => import('../components/Layout.vue'),
    redirect: '/stage/dashboard',
    children: [
      {
        path: '/stage/dashboard',
        name: 'Dashboard',
        component: () => import('../Dashboard.vue'),
        meta: {
          name: i18n.t('仪表盘')
        }
      },
      {
        path: '/stage/knowledge',
        name: 'Knowledge',
        component: () => import('../Knowledge.vue'),
        meta: {
          name: i18n.t('使用文档')
        }
      },
      {
        path: '/stage/flow',
        name: 'Flow',
        component: () => import('../Flow.vue'),
        meta: {
          name: i18n.t('流量明细')
        }
      },
      {
        path: '/stage/profile',
        name: 'Profile',
        component: () => import('../Profile.vue'),
        meta: {
          name: i18n.t('个人中心')
        }
      },
      {
        path: '/stage/invite',
        name: 'Invite',
        component: () => import('../Invite.vue'),
        meta: {
          name: i18n.t('我的邀请')
        }
      },
      {
        path: '/stage/giftcard',
        name: 'GiftCard',
        component: () => import('../GiftCard.vue'),
        meta: {
          name: i18n.t('礼品卡')
        }
      },
      {
        path: '/stage/buysubs',
        name: 'Buysubs',
        component: () => import('../Buysubs.vue'),
        meta: {
          name: i18n.t('购买订阅')
        }
      },
      {
        path: '/stage/buysubs/order',
        name: 'BuysubsOrder',
        component: () => import('../BuysubsOrder.vue'),
        meta: {
          name: i18n.t('订阅详情')
        }
      },
      {
        path: '/stage/mysubs',
        name: 'Mysubs',
        component: () => import('../Mysubs.vue'),
        meta: {
          name: i18n.t('我的订阅')
        }
      },
      {
        path: '/stage/order',
        name: 'Order',
        component: () => import('../Order.vue'),
        meta: {
          name: i18n.t('我的订单')
        }
      },
      {
        path: '/stage/order/info',
        name: 'OrderInfo',
        component: () => import('../OrderInfo.vue'),
        meta: {
          name: i18n.t('订单详情')
        }
      },
      {
        path: '/stage/ticket',
        name: 'Ticket',
        component: () => import('../Ticket.vue'),
        meta: {
          name: i18n.t('我的工单')
        }
      },
      {
        path: '/stage/webview',
        name: 'Webview',
        component: () => import('../Webview.vue'),
        meta: {
          name: i18n.t('查看')
        }
      }
    ]
  },
  {
    path: '/pay/qrcode',
    name: 'PayQrcode',
    component: () => import('../PayQrcode.vue'),
    meta: {
      name: i18n.t('支付')
    }
  },
  {
    // 为了支付完成后回调到订单详情，是php后台写死的地址
    path: '/order/:id',
    name: 'OrderCallback',
    component: () => import('../OrderCallback.vue'),
    meta: {
      name: i18n.t('支付成功')
    }
  }
]
