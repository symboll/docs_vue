import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import actions from './actions'
import user from './module/user'
import authCode from './module/authCode'
import role from './module/role'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    user,
    authCode,
    role
  }
})
