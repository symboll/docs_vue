import {
  authCodeList,
  authCodeCreate,
  authCodeUpdate,
  authCodeDelete
} from '@/api/authCode'


const state = {
  authcodeList: []
}
const mutations = {
  SET_AUTH_CODE (state, list) {
    state.authcodeList = list
  }
}
const actions = {
  getAuthCodeAction: ({ commit }) => {
    return new Promise((resolve, reject) => {
      authCodeList().then(res => {
        if (res.code === 0) {
          commit('SET_AUTH_CODE', res.data.authcode)
        }
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  createAuthCodeAction: ({commit}, data) => {
    return new Promise((resolve, reject)=> {
      authCodeCreate(data).then(_ => {
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  updateAuthCodeAction: ({commit},{ id, ...data }) => {
    return new Promise((resolve, reject)=> {
      authCodeUpdate(id, data).then(_ => {
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  deleteAuthCodeAction: ({commit}, id) =>  {
    return new Promise((resolve, reject)=> {
      authCodeDelete(id).then(_ => {
        resolve()
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
