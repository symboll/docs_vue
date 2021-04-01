import { login, register, getUserInfo, getUserList } from '@/api/user'
import { setToken } from '@/util/token'

const state = {
  username: '',
  avatar: '',
  userList: [],
  loading: false,
  total: 0
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
  },
  SET_USER_TOTAL (state, total) {
    state.total = total
  },
  SET_TABLE_LOADING (state, bool) {
    state.loading = bool
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
  getUserListAction: ({ commit },params={})=> {
    return new Promise((resolve, reject)=> {
      commit('SET_TABLE_LOADING', true)
      getUserList(params).then(res => {
        commit("SET_USER_LIST", res.data.users || [])
        commit("SET_USER_TOTAL", res.data.total)
        commit('SET_TABLE_LOADING', false)
      }).catch(err => {
        commit('SET_TABLE_LOADING', false)
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
