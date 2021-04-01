import {
  authCodeList,
  authCodeCreate,
  authCodeUpdate,
  authCodeDelete
} from '@/api/authCode'


const state = {
  authcodeList: [],
  authcodeAllList: [],
  total: 0,
  loading: false,
  options: {}
}
const mutations = {
  SET_AUTH_CODE (state, list) {
    if(state.authcodeAllList.length === 0) {
      state.authcodeAllList = list
    }  
    if(state.authcodeAllList.length === 0 && list.length > 10) {
      state.authcodeList = list.slice(0,10)
    } else {
      state.authcodeList = list
    }
  },
  SET_LIST_TOTAL (state, total) {
    state.total = total
  },
  SET_TABLE_LOADING (state, bool) {
    state.loading = bool
  },

}
const actions = {
  getAuthCodeAction: ({ commit }, params ={}) => {
    return new Promise((resolve, reject) => {
      commit('SET_TABLE_LOADING', true)
      authCodeList(params).then(res => {
        if (res.code === 0) {
          commit('SET_TABLE_LOADING', false)
          commit('SET_AUTH_CODE', res.data.authcode || [])
          commit('SET_LIST_TOTAL', res.data.total)
        }
      }).catch(err => {
        commit('SET_TABLE_LOADING', false)
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
