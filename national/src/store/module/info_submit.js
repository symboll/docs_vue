import { 
  createOrUpdateApi,
  removeApi,
  getDetailApi,
  getListApi,
  auditApi,
  importApi
} from '@/api/template'

import {
  allInfoPersonApi
}from '@/api/common'
const type = 'info/submit'

const state = {
  infoSubmitList: [],
  infoSubmitTotal: 0,
  infoSubmitItem: {
    attachmentList:[]
  },
  allInfoPerson: []
}
const mutations = {
  SET_INFO_SUBMIT_ITEM_ATTCH (state, file) {
    if(!state.infoSubmitItem.attachmentList) {
      state.infoSubmitItem.attachmentList = []
    }
    state.infoSubmitItem.attachmentList.push(file)
  }
}
const actions = {
  createOrUpdateInfoSubmitAction ({commit},form) {
    return new Promise((resolve,reject)=> {
      createOrUpdateApi(type, form)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  auditInfoSubmitAction ({commit}, data) {
    return new Promise((resolve,reject)=> {
      auditApi(type, data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  removeInfoSubmitAction ({commit}, id) {
    return new Promise((resolve,reject)=> {
      removeApi(type, id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  infoSubmitImportAction ({ commit}, data) {
    return new Promise((resolve, reject)=> {
      importApi(type, data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  getInfoSubmitDetailAction({commit, dispatch}, id) {
    return new Promise((resolve, reject)=> {
      getDetailApi(type, id)
        .then(res => {
          commit('SET', { module:"infoSubmit", key: "infoSubmitItem", value: res.data })
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },

  getInfoSubmitListAction ({ commit }, params={}) {
    return new Promise((resolve, reject)=> {
      getListApi(type, params)
        .then(res => {
          commit('SET', { module:"infoSubmit", key: "infoSubmitList", value: res.rows })
          commit('SET', { module:"infoSubmit", key: "infoSubmitTotal", value: res.total })
        })
        .catch(err => reject(err))
    })
  },
  allInfoPersonAction({ commit}) {
    return new Promise((resolve, reject) => {
      allInfoPersonApi()
        .then(res => {
          commit('SET', { module:"infoSubmit", key: "allInfoPerson", value: res.data })
          resolve(res)
        })
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

