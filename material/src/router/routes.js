import Layout from '@/views/layout.vue'

export default [
  {
    path: '/',
    name: '',
    component: Layout,
    redirect: () => 'home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home.vue')
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/about.vue')
      },
      {
        path: 'basic',
        name: 'basic',
        component: () => import('@/views/basic.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '*',
    name: 'error',
    component: () => import('@/views/error.vue')
  }
]
