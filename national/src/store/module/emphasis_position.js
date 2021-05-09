import { 
  createOrUpdateApi,
  removeApi,
  getDetailApi,
  getListApi,
  auditApi,
  // importApi
} from '@/api/template'

const type = 'position'

const state = {
  positionList: [],
  positionListTotal: 0,
  positionItem: {}
}
const mutations = {
  SET_POSITION_ITEM (state, params) {
    state.positionItem = params
  }
}
const actions = {
  getPositionListAction ({commit},params) {
    return new Promise((resolve, reject)=> {
      getListApi(type, params)
        .then(res => {
          commit('SET', { module:"position", key: "positionList", value: res.rows })
          commit('SET', { module:"position", key: "positionListTotal", value: res.total })
        })
        .catch(err => reject(err))
    })
  },

  getPositionDetailAction ({commit, dispatch},id) {
    return new Promise((resolve, reject)=> {
      getDetailApi(type, id)
        .then(res => {
          commit('SET_POSITION_ITEM', res.data) 
        })
        .catch(err => reject(err))
    })
  },

  createOrUpdatePositionAction ({commit},form) {
    return new Promise((resolve,reject)=> {
      createOrUpdateApi(type, form)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  removePositionAction ({commit}, id) {
    return new Promise((resolve,reject)=> {
      removeApi(type, id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  auditPositionAction ({commit}, data) {
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