
import { setToken } from '@/lib/util'
import { login, modifyPassword } from '@/api/login'
import { 
  getCurOrgTreeApi, 
  getUserListApi ,
  getOrganListApi,
  createUserApi,
  getCurrentUserInfoApi,
  getUserInfoApi,
  modifyUserApi,
  deleteUserByIdApi,
  disableOrEnableApi,
  resetPasswordApi
} from '../../api/system/user'

const state = {
  organTree: [],
  organList: [],
  userList: [],
  userListTotal: 0,
  userInfo: {
    roleIdList: [],
  },

  currentUser: {}
}
const mutations = {}
const actions = {
  LoginAction ({commit}, data) {
    return new Promise((resolve, reject)=> {
      login(data).then(res => {
        setToken(res.data.token)
        resolve()
      })
      .catch(err => reject(err))
    })
  },
  modifyPasswordApi ({commit}, data) {
    return new Promise((resolve, reject) => {
      modifyPassword(data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  getCurOrgTreeAction ({ commit},params) {
    return new Promise((resolve, reject) => {
      getCurOrgTreeApi(params).then(res => {
        commit('SET', { module: "user", key: "organTree", value: res.data?.jurisdictionList  })
      }).catch(err => reject(err))
    })
  }, 
  getUserListAction ({commit}, params) {
    return new Promise((resolve, reject)=> {
      getUserListApi(params)
        .then(res => {
          commit('SET', { module: "user", key: "userList", value: res.rows || []  })
          commit('SET', { module: "user", key: "userListTotal", value: res.total  || 0 })
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getOrganListAction({ commit }) {
    return new Promise((resolve, reject)=> {
      getOrganListApi()
        .then(res => {
          commit('SET', { module: "user", key: "organList", value: res.data || []  })
        })
        .catch(err => reject(err))
    })
  },
  createUserAction ({commit}, data) {
    return new Promise((resolve, reject)=> {
      createUserApi(data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  modifyUserAction({commit}, data) {
    return new Promise((resolve, reject)=> {
      modifyUserApi(data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  deleteUserByIdAction ({commit}, id) {
    return new Promise((resolve, reject)=> {
      deleteUserByIdApi(id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  getCurrentUserInfoAction ({commit}) {
    return new Promise((resolve, reject)=> {
      getCurrentUserInfoApi().then(res => {
        commit('SET', { module: "user", key: "currentUser", value: res.data })
        resolve(res.data)
      })
        .catch(err => reject(err))
    })
  },
  getUserInfoAction ({ commit }, id) {
    return new Promise((resolve, reject)=> {
      getUserInfoApi(id).then(res => {
        commit('SET', { module: "user", key: "userInfo", value: res.data })
        resolve()
      })
        .catch(err => reject(err))
    })
  },
  disableOrEnableAction({ commit }, {id, delFlag}) {
    return new Promise((resolve, reject)=> {
      disableOrEnableApi(id, delFlag).then(res => {
        // commit('SET', { module: "user", key: "userInfo", value: res.data })
        resolve()
      })
        .catch(err => reject(err))
    })
  },
  resetPasswordAction ({ commit }, id) {
    return new Promise((resolve, reject)=> {
      resetPasswordApi(id).then(res => {
        // commit('SET', { module: "user", key: "userInfo", value: res.data })
        resolve()
      })
        .catch(err => reject(err))
    })
  },
}
const getters = {
  buttonList: (state) => (pageName) => {
    const pattern = new RegExp(pageName)
    const authCodeList = state.currentUser?.authCodeList
    const res = authCodeList.filter(item => pattern.test(item)).map(item => {
      const arr = item.split(':')
      return arr[1]
    }).filter(i => i)
    return res
  },
}

export default{
  state,
  mutations,
  actions,
  getters
}