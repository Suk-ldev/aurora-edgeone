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
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../Register.vue'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../ResetPassword.vue'),
    meta: {
      title: '重置密码'
    }
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: () => import('../Agreement.vue'),
    meta: {
      title: '服务协议'
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../Error.vue'),
    meta: {
      title: '异常'
    }
  }
]
