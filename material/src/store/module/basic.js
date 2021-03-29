import {
  authCodeList,
  authCodeCreate,
  authCodeUpdate,
  authCodeDelete
} from '@/api/basic'


const state = {
  authcode: []
}
const mutations = {
  SET_AUTH_CODE (state, list) {
    state.authcode = list
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
        reject(err)
      })
    })
  },
  createAuthCodeAction: ({commit}, data) => {
    return new Promise((resolve, reject)=> {
      authCodeCreate(data).then(_ => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateAuthCodeAction: ({commit},{ id, ...data }) => {
    return new Promise((resolve, reject)=> {
      authCodeUpdate(id, data).then(_ => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  deleteAuthCodeAction: ({commit}, id) =>  {
    return new Promise((resolve, reject)=> {
      authCodeDelete(id).then(_ => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}
export default {
  state,
  mutations,
  actions
}
