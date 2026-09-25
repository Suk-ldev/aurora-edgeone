import i18n from '@/i18n'

export default [
  {
    groupTitle: '',
    groupLinks: [
      {
        menuTitle: i18n.t('仪表盘'),
        menuIcon: 'gauge',
        menuPath: '/stage/dashboard'
      },
      {
        menuTitle: i18n.t('使用文档'),
        menuIcon: 'book-open-text',
        menuPath: '/stage/knowledge'
      }
    ]
  },
  {
    groupTitle: i18n.t('订阅'),
    groupLinks: [
      {
        menuTitle: i18n.t('购买订阅'),
        menuIcon: 'currency-circle-dollar',
        menuPath: '/stage/buysubs'
      },
      {
        menuTitle: i18n.t('购买订阅'),
        menuIcon: 'currency-circle-dollar',
        menuPath: '/stage/buysubs/order',
        menuHide: true
      },
      {
        menuTitle: i18n.t('我的订阅'),
        menuIcon: 'shopping-cart-simple',
        menuPath: '/stage/mysubs'
      }
    ]
  },
  {
    groupTitle: i18n.t('财务'),
    groupLinks: [
      {
        menuTitle: i18n.t('我的订单'),
        menuIcon: 'cardholder',
        menuPath: '/stage/order'
      },
      {
        menuTitle: i18n.t('我的订单'),
        menuIcon: 'cardholder',
        menuPath: '/stage/order/info',
        menuHide: true
      },
      {
        menuTitle: i18n.t('我的邀请'),
        menuIcon: 'link-break',
        menuPath: '/stage/invite'
      },
      {
        menuTitle: i18n.t('礼品卡'),
        menuIcon: 'gift',
        menuPath: '/stage/giftcard'
      }
    ]
  },
  {
    groupTitle: i18n.t('用户'),
    groupLinks: [
      {
        menuTitle: i18n.t('个人中心'),
        menuIcon: 'user-circle',
        menuPath: '/stage/profile',
        topNavHide: true
      },
      {
        menuTitle: i18n.t('我的工单'),
        menuIcon: 'chat-centered-dots',
        menuPath: '/stage/ticket',
        topNavHide: true
      },
      {
        menuTitle: i18n.t('流量明细'),
        menuIcon: 'presentation-chart',
        menuPath: '/stage/flow',
        topNavHide: true
      }
    ]
  }
]
