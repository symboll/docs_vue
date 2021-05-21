import { 
  createOrUpdateApi,
  removeApi,
  // getDetailApi,
  getListApi,
  auditApi,
  // importApi
} from '@/api/template'

import {
  getDetailApi
} from '../../api/record.js'

const type = 'record'

const state = {
  recordList: [],
  recordListTotal: 0,
  recordItem: {
    attachmentList:[],
    video: []
  },

  statusMap: {
    init: '待审核',
    finish: '审核通过',
    fail: '拒绝'
  },
}

const mutations = {
  RECORD_ITEM_UPDATE (state, { file, type, index }) {
    let t = type === 'video' ? "video": "attachmentList"
    if(file && index == undefined) {
      if(!state.recordItem[t]) {
        state.recordItem[t] = []
      }
      state.recordItem[t].push(file)
    }else if(index !== undefined && file == undefined) {
      state.recordItem[t].splice(index, 1)
    }
  }
}
const actions = {
  getRecordListAction ({commit},params) {
    return new Promise((resolve, reject)=> {
      getListApi(type, params)
        .then(res => {
          commit('SET', { module:"record", key: "recordList", value: res.rows })
          commit('SET', { module:"record", key: "recordListTotal", value: res.total })
        })
        .catch(err => reject(err))
    })
  },
  
  getRecordDetailAction ({commit}, params) {
    return new Promise((resolve, reject)=> {
      getDetailApi(type, params)
        .then(res => {
          commit('SET', { module:"record", key: "recordItem", value: res.data })
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },

  createOrUpdateRecordAction ({commit},form) {
    return new Promise((resolve,reject)=> {
      createOrUpdateApi(type, form)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  
  removeRecordAction ({commit}, id) {
    return new Promise((resolve,reject)=> {
      removeApi(type, id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  auditRecordAction ({commit}, data) {
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