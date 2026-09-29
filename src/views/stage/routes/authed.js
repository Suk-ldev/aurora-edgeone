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
          title: '仪表盘'
        }
      },
      {
        path: '/console/docs',
        name: 'Knowledge',
        component: () => import('../Knowledge.vue'),
        meta: {
          title: '使用文档'
        }
      },
      {
        path: '/console/usage',
        name: 'Flow',
        component: () => import('../Flow.vue'),
        meta: {
          title: '流量明细'
        }
      },
      {
        path: '/console/account',
        name: 'Profile',
        component: () => import('../Profile.vue'),
        meta: {
          title: '个人中心'
        }
      },
      {
        path: '/console/referral',
        name: 'Invite',
        component: () => import('../Invite.vue'),
        meta: {
          title: '我的邀请'
        }
      },
      {
        path: '/console/vouchers',
        name: 'GiftCard',
        component: () => import('../GiftCard.vue'),
        meta: {
          title: '礼品卡'
        }
      },
      {
        path: '/console/catalog',
        name: 'Buysubs',
        component: () => import('../Buysubs.vue'),
        meta: {
          title: '购买订阅'
        }
      },
      {
        path: '/console/catalog/order',
        name: 'BuysubsOrder',
        component: () => import('../BuysubsOrder.vue'),
        meta: {
          title: '订阅详情'
        }
      },
      {
        path: '/console/items',
        name: 'Mysubs',
        component: () => import('../Mysubs.vue'),
        meta: {
          title: '我的订阅'
        }
      },
      {
        path: '/console/orders',
        name: 'Order',
        component: () => import('../Order.vue'),
        meta: {
          title: '我的订单'
        }
      },
      {
        path: '/console/orders/info',
        name: 'OrderInfo',
        component: () => import('../OrderInfo.vue'),
        meta: {
          title: '订单详情'
        }
      },
      {
        path: '/console/support',
        name: 'Ticket',
        component: () => import('../Ticket.vue'),
        meta: {
          title: '我的工单'
        }
      },
      {
        path: '/console/view',
        name: 'Webview',
        component: () => import('../Webview.vue'),
        meta: {
          title: '查看'
        }
      }
    ]
  },
  {
    path: '/pay/qrcode',
    name: 'PayQrcode',
    component: () => import('../PayQrcode.vue'),
    meta: {
      title: '支付'
    }
  },
  {
    // 为了支付完成后回调到订单详情，是php后台写死的地址
    path: '/order/:id',
    name: 'OrderCallback',
    component: () => import('../OrderCallback.vue'),
    meta: {
      title: '支付成功'
    }
  },
  {
    path: '/client-download',
    name: 'ClientDownload',
    component: () => import('@/views/gate/ClientDownload.vue'),
    meta: {
      title: '客户端下载'
    }
  }
]
