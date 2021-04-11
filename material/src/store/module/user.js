import { login, logout, register, authorization, getUserList, update, getUserInfo } from '@/api/user'
import { upload } from '@/api/upload'

const state = {
  username: '',
  avatar: '',
  email: '',
  userId: '',
  city: '',
  sex: '',
  role: [],
  
  userList: [],
  loading: false,
  total: 0
}

const mutations = {
  // only
  SET_USER_BASIC_INFO (state, params) {
    state.username = params.name
    state.avatar = params.avatar
    state.userId = params.id
  },
  SET_BASIC_INFO (state, params) { 
    state[params.key] = params.value 
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
        commit('SET_USER_BASIC_INFO', res.data)
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
  },
  getUserInfoAction : ({commit}, id)=> {
    return new Promise((resolve, reject)=> {
      getUserInfo(id).then(res => {
        const info = ['sex','city', 'email', 'role']
        for(let key of info) {
          commit('SET_BASIC_INFO', { key, value: res.data[key] })
        }
        resolve(res.data)
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  editUserBasicInfo : ({commit, state})=> {
    const data = {
      sex: state.sex,
      city: state.city
    }
    return new Promise((resolve, reject)=> {
      update(data).then(_ => {
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  }
}

const getters = {
  basicUserinfo: (state) => ([
    { 
      label: 'email', 
      value: state.email,
      type: 'v-text-field',
      disabled: true
    },
    { 
      label: 'role',
      value: state.role,
      type: 'v-select',
      options: [],
      disabled: true
    },
    { 
      label: 'sex', 
      value: state.sex,
      type: 'v-select',
      options: [
        {label: '男', value: 'male'},
        {label: '女', value: 'female'}
      ],
    },
    { 
      value: state.city,
      label: 'city', 
      type: 'v-text-field',
    }
  ])
}

export default {
  state,
  mutations,
  getters,
  actions
}
