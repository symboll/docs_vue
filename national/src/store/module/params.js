import {
  getSystemConfigListApi,
  getConfigByIdApi,
  editSystemConfigApi
} from '../../api/system/params'

const state = {
  systemConfigList: [],
  systemConfigListTotal: 0,
  paramsItemInfo: {}
}
const mutations = {}
const actions = {
  getSystemConfigListAction ({commit}, params) {
    return new Promise((resolve, reject)=> {
      getSystemConfigListApi(params).then(res => {
        commit('SET', { module:"params", key: "systemConfigList", value: res.rows })
        commit('SET', { module:"params", key: "systemConfigListTotal", value: res.total })
      })
    })
  },
  getConfigByIdAction({ commit }, id) {
    return new Promise((resolve,reject) => {
      getConfigByIdApi(id)
        .then(res => {
          commit('SET', { module:"params", key: "paramsItemInfo", value: res.data })
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  editSystemConfigAction({commit},data) {
    return new Promise ((resolve,reject)=> {
      editSystemConfigApi(data)
        .then(_ => resolve())
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