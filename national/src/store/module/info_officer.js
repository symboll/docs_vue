import { 
  createOrUpdateApi,
  removeApi,
  getDetailApi,
  getListApi,
  auditApi,
  importApi,
  cancelReport
} from '@/api/template'
const type = 'info/person'

const state = {
  infoOfficerList: [],
  infoOfficerTotal: 0,
  infoOfficerItem: {}
}
const mutations = {
  SET_INFOOFFICER_ITEM (state, params) {
    state.infoOfficerItem = params
  }
}
const actions = {
  getInfoOfficerListAction ({ commit }, params={}) {
    return new Promise((resolve, reject)=> {
      getListApi(type, params).then(res => {
        commit('SET', { module:"infoOfficer", key: "infoOfficerList", value: res.rows })
        commit('SET', { module:"infoOfficer", key: "infoOfficerTotal", value: res.total })
      }).catch(err => reject(err))
    })
  },
  getInfoOfficerDetailAction ({ commit }, id) {
    return new Promise((resolve, reject) => {
      getDetailApi(type, id)
        .then(res => commit('SET_INFOOFFICER_ITEM', res.data))
        .catch(err => reject(err))
    })
  },
  createOrUpdateInfoOfficerAction ({commit},form) {
    return new Promise((resolve,reject)=> {
      createOrUpdateApi(type, form)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  removeInfoOfficerAction ({commit}, id) {
    return new Promise((resolve,reject)=> {
      removeApi(type, id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  cancelInfoOfficerAction ({commit},id) {
    return new Promise((resolve,reject)=> {
      cancelReport(type, id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  auditInfoOfficerAction ({commit}, data) {
    return new Promise((resolve,reject)=> {
      auditApi(type, data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  infoOfficerImportAction ({ commit}, data) {
    return new Promise((resolve, reject)=> {
      importApi(type, data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
  
}
const getters = {}

export default{
  state,
  mutations,
  actions,
  getters
}