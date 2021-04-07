import { login, logout, register, authorization, getUserList, update } from '@/api/user'
import { upload } from '@/api/upload'

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
  SET_USER_AVATAR(state, avatar) {
    state.avatar = avatar
  },
  LOGOUT (state) {
    state.username = ''
    state.avatar = ''
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
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  logoutAction: ({ commit })=> {
    return new Promise((resolve, reject)=> {
      logout().then(res => {
        resolve()
        commit('LOGOUT')
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  authorizationAction: ({ commit }) => {
    return new Promise((resolve, reject) => {
      authorization().then(res => {
        commit('SET_USER_NAME', res.data.name)
        commit('SET_USER_AVATAR', res.data.avatar)
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  registerAction: ({ commit}, data) =>  {
    return new Promise((resolve, reject)=> {
      register(data).then(_ => {
        // resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  updateAction: ({ commit }, data)=> {
    return new Promise((resolve, reject)=> {
      update(data).then(_ => {
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
        resolve()
      }).catch(err => {
        commit('SET_TABLE_LOADING', false)
        reject(err.response.data)
      })
    })
  },
  upLoadAvatarAction: ({ commit }, data) => {
    return new Promise((resolve,reject)=> {
      upload(data).then(res => {
        if(res.url){
          resolve(res.url)
        }else {
          reject('上传头像失败!')
        } 
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
