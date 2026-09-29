/**
 * 登录后才注册的路由
 *
 * 文件名不叫 static.js 是刻意的：core/collectors/router.js 里的 require.context
 * 只匹配 routes/static.js，这样本文件（以及它引用的全部页面文案）不会进首屏 chunk。
 * 注册时机见 router.js 的 addAuthedRoutes()。
 */
export default [
  {
    path: '/console',
    name: 'Stage',
    component: () => import('../components/Layout.vue'),
    redirect: '/console/overview',
    children: [
      {
        path: '/console/overview',
        name: 'Dashboard',
        component: () => import('../Dashboard.vue'),
        meta: {
          title: 'dashboard'
        }
      },
      {
        path: '/console/docs',
        name: 'Knowledge',
        component: () => import('../Knowledge.vue'),
        meta: {
          title: 'tutorial'
        }
      },
      {
        path: '/console/usage',
        name: 'Flow',
        component: () => import('../Flow.vue'),
        meta: {
          title: 'traffic'
        }
      },
      {
        path: '/console/account',
        name: 'Profile',
        component: () => import('../Profile.vue'),
        meta: {
          title: 'settings'
        }
      },
      {
        path: '/console/referral',
        name: 'Invite',
        component: () => import('../Invite.vue'),
        meta: {
          title: 'invite'
        }
      },
      {
        path: '/console/vouchers',
        name: 'GiftCard',
        component: () => import('../GiftCard.vue'),
        meta: {
          title: 'm_33'
        }
      },
      {
        path: '/console/catalog',
        name: 'Buysubs',
        component: () => import('../Buysubs.vue'),
        meta: {
          title: 'purchase'
        }
      },
      {
        path: '/console/catalog/order',
        name: 'BuysubsOrder',
        component: () => import('../BuysubsOrder.vue'),
        meta: {
          title: 'subscription_details'
        }
      },
      {
        path: '/console/items',
        name: 'Mysubs',
        component: () => import('../Mysubs.vue'),
        meta: {
          title: 'subscribe'
        }
      },
      {
        path: '/console/orders',
        name: 'Order',
        component: () => import('../Order.vue'),
        meta: {
          title: 'order'
        }
      },
      {
        path: '/console/orders/info',
        name: 'OrderInfo',
        component: () => import('../OrderInfo.vue'),
        meta: {
          title: 'order_details'
        }
      },
      {
        path: '/console/support',
        name: 'Ticket',
        component: () => import('../Ticket.vue'),
        meta: {
          title: 'questions'
        }
      },
      {
        path: '/console/view',
        name: 'Webview',
        component: () => import('../Webview.vue'),
        meta: {
          title: 'view'
        }
      }
    ]
  },
  {
    path: '/pay/qrcode',
    name: 'PayQrcode',
    component: () => import('../PayQrcode.vue'),
    meta: {
      title: 'pay'
    }
  },
  {
    // 为了支付完成后回调到订单详情，是php后台写死的地址
    path: '/order/:id',
    name: 'OrderCallback',
    component: () => import('../OrderCallback.vue'),
    meta: {
      title: 'payment_succeeded'
    }
  },
  {
    path: '/client-download',
    name: 'ClientDownload',
    component: () => import('@/views/gate/ClientDownload.vue'),
    meta: {
      title: 'client_download'
    }
  }
]
