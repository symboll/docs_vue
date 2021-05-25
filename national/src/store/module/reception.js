import { 
  createOrUpdateApi,
  removeApi,
  getDetailApi,
  getListApi2,
  auditApi,
  // importApi
} from '@/api/template'

const type = 'info/person/reception'

const state = {
  receptionList: [],
  receptionListTotal: 0,
  receptionItem: {}
}
const mutations = {}
const actions = {
  getInfoPersonReceptionListAction ({commit},{params, id}) {
    return new Promise((resolve, reject)=> {
      getListApi2(type, id , params)
        .then(res => {
          commit('SET', { module:"reception", key: "receptionList", value: res.rows })
          commit('SET', { module:"reception", key: "receptionListTotal", value: res.total })
        })
        .catch(err => reject(err))
    })
  },

  getInfoPersonReceptionDetailAction ({commit, dispatch},id) {
    return new Promise((resolve, reject)=> {
      getDetailApi(type, id)
        .then(res => {
          commit('SET', { module:"reception", key: "receptionItem", value: res.data })
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },

  createOrUpdateInfoPersonReceptionAction ({commit},form) {
    return new Promise((resolve,reject)=> {
      createOrUpdateApi(type, form)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  removeInfoPersonReceptionAction ({commit}, id) {
    return new Promise((resolve,reject)=> {
      removeApi(type, id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  auditInfoPersonReceptionAction ({commit}, data) {
    return new Promise((resolve,reject)=> {
      auditApi(type, data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
}
const getters = {}

export default{
  state,
  mutations,
  actions,
  getters
}