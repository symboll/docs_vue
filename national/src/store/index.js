import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import state from './state'

import todoList from './module/todolist'
import position from './module/emphasis_position'
import personal from './module/emphasis_personal'
import record from './module/record'
import user from './module/user'
import role from './module/role'
import params from './module/params'
import dictionaries from './module/dictionaries'
import infoOfficer from './module/info_officer'
import infoSubmit from './module/info_submit'
import plugin from './plugin'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    todoList,
    position,
    personal,
    record,
    user,
    role,
    params,
    dictionaries,
    infoOfficer,
    infoSubmit
  },
  plugins: [
    plugin
  ]
})
