import { login, register, getUserInfo, getUserList } from '@/api/user'
import { setToken } from '@/util/token'

const state = {
  username: '',
  avatar: '',
  userList: []
}

const mutations = {
  SET_USER_NAME (state, name) {
    state.username = name
  },
  // SET_USER_AVATAR (state, params) {
  //   state.avatar = params
  // },
  LOGOUT (state) {
    state.username = ''
    state.avatar = ''
    setToken('')
  },
  SET_USER_LIST(state, userList) {
    state.userList = userList
  }
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
  },
  authorization: ({ commit }) => {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        commit('SET_USER_NAME', res.data.name)
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  registerAction: ({ commit}, data) =>  {
    return new Promise((resolve, reject)=> {
      register(data).then(_ => {
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  getUserListAction: ({ commit })=> {
    return new Promise((resolve, reject)=> {
      getUserList().then(res => {
        commit("SET_USER_LIST", res.data.users)
      }).catch(err => {
        reject(err.response.data)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
