import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  store.dispatch('authorization').then(() => {
    if (to.name === 'login') {
      next({ name: 'home' })
    } else { next() }
  }).catch(_ => {
    if(to.name === 'login') next()
    else next({ name: 'login' })      
  })
  
})

export default router
