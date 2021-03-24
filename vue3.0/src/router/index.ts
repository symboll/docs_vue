import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/demo1',
    name: 'Demo1',
    component: () => import(/* webpackChunkName: "about" */ '../views/Demo1.vue')
  },
  {
    path: '/demo2',
    name: 'Demo2',
    component: () => import(/* webpackChunkName: "about" */ '../views/Demo2.vue')
  },
  {
    path: '/demo3',
    name: 'Demo3',
    component: () => import(/* webpackChunkName: "about" */ '../views/Demo3.vue')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
