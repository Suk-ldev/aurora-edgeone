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
      title: 'login'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../Register.vue'),
    meta: {
      title: 'register'
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../ResetPassword.vue'),
    meta: {
      title: 'reset_password'
    }
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: () => import('../Agreement.vue'),
    meta: {
      title: 'service_agreement'
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../Error.vue'),
    meta: {
      title: 'abnormal'
    }
  }
]
