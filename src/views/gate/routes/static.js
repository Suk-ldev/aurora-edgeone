import i18n from '@/i18n'

function getRedirect() {
  return '/login'
}

export default [
  {
    path: '/',
    name: 'Root',
    redirect: getRedirect()
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../Login.vue'),
    meta: {
      name: i18n.t('登录')
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../Register.vue'),
    meta: {
      name: i18n.t('注册')
    }
  },
  {
    path: '/client-download',
    name: 'ClientDownload',
    component: () => import('../ClientDownload.vue'),
    meta: {
      name: i18n.t('客户端下载')
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../ResetPassword.vue'),
    meta: {
      name: i18n.t('重置密码')
    }
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: () => import('../Agreement.vue'),
    meta: {
      name: i18n.t('服务协议')
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../Error.vue'),
    meta: {
      name: i18n.t('异常')
    }
  }
]
