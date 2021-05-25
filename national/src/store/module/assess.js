import { 
  createOrUpdateApi,
  removeApi,
  getDetailApi,
  getListApi2,
  auditApi,
  // importApi
} from '@/api/template'

const type = 'info/person/assess'

const state = {
  assessList: [],
  assessListTotal: 0,
  assessItem: {}
}
const mutations = {}
const actions = {
  getInfoPersonAssessListAction ({commit},{id , params}) {
    return new Promise((resolve, reject)=> {
      getListApi2(type, id, params)
        .then(res => {
          commit('SET', { module:"assess", key: "assessList", value: res.rows })
          commit('SET', { module:"assess", key: "assessListTotal", value: res.total })
        })
        .catch(err => reject(err))
    })
  },

  getInfoPersonAssessDetailAction ({commit, dispatch},id) {
    return new Promise((resolve, reject)=> {
      getDetailApi(type, id)
        .then(res => {
          commit('SET', { module:"assess", key: "assessItem", value: res.data })
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },

  createOrUpdateInfoPersonAssessAction ({commit},form) {
    return new Promise((resolve,reject)=> {
      createOrUpdateApi(type, form)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  removeInfoPersonAssessAction ({commit}, id) {
    return new Promise((resolve,reject)=> {
      removeApi(type, id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  auditInfoPersonAssessAction ({commit}, data) {
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