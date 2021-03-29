import { login } from '@/api/login'
import { setToken } from '@/util/token'

const state = {
  // moduleKey: 'ssss',
  // username: '',
  // avatar: ''
}

const mutations = {
  // SET_USER_NAME (state, params) {
  //   state.username = params
  // },
  // SET_USER_AVATAR (state, params) {
  //   state.avatar = params
  // },
  // LOGOUT (state, params) {
  //   state.username = ''
  //   state.avatar = ''
  //   setToken('')
  // }
}

const actions = {
  loginAction: ({ commit }, { username, password }) => {
    return new Promise((resolve, reject) => {
      login({ username, password }).then(res => {
        setToken(res.data)
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  }
  // authorization: ({ commit }) => {
  //   return new Promise((resolve, reject) => {
  //     getUserInfoByToken().then(res => {
  //     /**
  //      * 需要后端支持，每次验证，返回新的token
  //      * setToken(res.data.token)
  //      */
  //       commit('SET_USER_NAME', res.data.username)
  //       commit('SET_USER_AVATAR', res.data.avatar)
  //       resolve()
  //     }).catch(err => {
  //       reject(err.response.data)
  //     })
  //   })
  // }
}
const getters = {
  // modulesKeyGetter: (state) => {
  //   return state.moduleKey
  // }
}

export default {
  state,
  getters,
  mutations,
  actions
}
