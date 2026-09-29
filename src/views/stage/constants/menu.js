import i18n from '@/i18n'

export default [
  {
    groupTitle: '',
    groupLinks: [
      {
        menuTitle: i18n.t('dashboard'),
        menuIcon: 'gauge',
        menuPath: '/console/overview'
      },
      {
        menuTitle: i18n.t('tutorial'),
        menuIcon: 'book-open-text',
        menuPath: '/console/docs'
      }
    ]
  },
  {
    groupTitle: i18n.t('subscribe_2'),
    groupLinks: [
      {
        menuTitle: i18n.t('purchase'),
        menuIcon: 'currency-circle-dollar',
        menuPath: '/console/catalog'
      },
      {
        menuTitle: i18n.t('purchase'),
        menuIcon: 'currency-circle-dollar',
        menuPath: '/console/catalog/order',
        menuHide: true
      },
      {
        menuTitle: i18n.t('subscribe'),
        menuIcon: 'shopping-cart-simple',
        menuPath: '/console/items'
      }
    ]
  },
  {
    groupTitle: i18n.t('finance'),
    groupLinks: [
      {
        menuTitle: i18n.t('order'),
        menuIcon: 'cardholder',
        menuPath: '/console/orders'
      },
      {
        menuTitle: i18n.t('order'),
        menuIcon: 'cardholder',
        menuPath: '/console/orders/info',
        menuHide: true
      },
      {
        menuTitle: i18n.t('invite'),
        menuIcon: 'link-break',
        menuPath: '/console/referral'
      },
      {
        menuTitle: i18n.t('m_33'),
        menuIcon: 'gift',
        menuPath: '/console/vouchers'
      }
    ]
  },
  {
    groupTitle: i18n.t('user'),
    groupLinks: [
      {
        menuTitle: i18n.t('settings'),
        menuIcon: 'user-circle',
        menuPath: '/console/account',
        topNavHide: true
      },
      {
        menuTitle: i18n.t('questions'),
        menuIcon: 'chat-centered-dots',
        menuPath: '/console/support',
        topNavHide: true
      },
      {
        menuTitle: i18n.t('traffic'),
        menuIcon: 'presentation-chart',
        menuPath: '/console/usage',
        topNavHide: true
      }
    ]
  }
]
