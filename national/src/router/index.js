import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { setTitle, setToken, getToken } from '@/lib/util'
import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  // mode: "hash",
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  setTitle(to.meta)
  const token = getToken()
  const accountName = store.state.user.currentUser?.accountName
  const authCodeList = store.state.user.currentUser?.authCodeList
  
  if(accountName) {
    if(to.name ==='login') {
      next({ name: "Home" })
    }else if(authCodeList.includes(to.name)) {
      next()
    }else {
      next({ name: "Home" })
    }
  }else if(token && token !== '') {
    store.dispatch('getCurrentUserInfoAction').then(res => {
      if (to.name === 'login') {
        next({ name: 'Home' })
      } else if(res.authCodeList.includes(to.name)){ 
        next() 
      } else {
        next({ name: 'Home' })
      }
    }).catch(_ => {
      setToken('')
      if (from.name !== 'login') next({ name: 'login' })
    })
  } else {
    if (to.name === 'login') next()
    else next({ name: 'login' })
  }
})

export default router
