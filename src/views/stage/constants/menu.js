import i18n from '@/i18n'

export default [
  {
    groupTitle: '',
    groupLinks: [
      {
        menuTitle: i18n.t('仪表盘'),
        menuIcon: 'gauge',
        menuPath: '/console/overview'
      },
      {
        menuTitle: i18n.t('使用文档'),
        menuIcon: 'book-open-text',
        menuPath: '/console/docs'
      }
    ]
  },
  {
    groupTitle: i18n.t('订阅'),
    groupLinks: [
      {
        menuTitle: i18n.t('购买订阅'),
        menuIcon: 'currency-circle-dollar',
        menuPath: '/console/catalog'
      },
      {
        menuTitle: i18n.t('购买订阅'),
        menuIcon: 'currency-circle-dollar',
        menuPath: '/console/catalog/order',
        menuHide: true
      },
      {
        menuTitle: i18n.t('我的订阅'),
        menuIcon: 'shopping-cart-simple',
        menuPath: '/console/items'
      }
    ]
  },
  {
    groupTitle: i18n.t('财务'),
    groupLinks: [
      {
        menuTitle: i18n.t('我的订单'),
        menuIcon: 'cardholder',
        menuPath: '/console/orders'
      },
      {
        menuTitle: i18n.t('我的订单'),
        menuIcon: 'cardholder',
        menuPath: '/console/orders/info',
        menuHide: true
      },
      {
        menuTitle: i18n.t('我的邀请'),
        menuIcon: 'link-break',
        menuPath: '/console/referral'
      },
      {
        menuTitle: i18n.t('礼品卡'),
        menuIcon: 'gift',
        menuPath: '/console/vouchers'
      }
    ]
  },
  {
    groupTitle: i18n.t('用户'),
    groupLinks: [
      {
        menuTitle: i18n.t('个人中心'),
        menuIcon: 'user-circle',
        menuPath: '/console/account',
        topNavHide: true
      },
      {
        menuTitle: i18n.t('我的工单'),
        menuIcon: 'chat-centered-dots',
        menuPath: '/console/support',
        topNavHide: true
      },
      {
        menuTitle: i18n.t('流量明细'),
        menuIcon: 'presentation-chart',
        menuPath: '/console/usage',
        topNavHide: true
      }
    ]
  }
]
