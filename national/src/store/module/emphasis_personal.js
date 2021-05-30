import { 
  createOrUpdateApi,
  removeApi,
  getDetailApi,
  getListApi,
  auditApi,
  completeApi,
  completeAuditApi,
  importApi
} from '@/api/template'

import { taskDownApi  } from '@/api/record'
const type = 'person'

const state = {
  personalList: [],
  personalListTotal: 0,
  personalItem: {},

  statusMap: {
    // init: '审核中',
    // finish: '完成',
    // fail: '办结'
    init:'审核中',
    finish:'通过',
    fail:'拒绝',
    close: '办结中',
    close_finish:'办结审核成功',
    close_fail: '办结审核失败'
  },
  visitStatusMap: {
    init: '待审核',
    finish: '已审核',
    fail: '已拒绝',
    evaluation: '已评价'
  },
}
const mutations = {}
const actions = {
  getPersonalListAction ({commit},params) {
    return new Promise((resolve, reject)=> {
      getListApi(type, params)
        .then(res => {
          commit('SET', { module:"personal", key: "personalList", value: res.rows })
          commit('SET', { module:"personal", key: "personalListTotal", value: res.total })
        })
        .catch(err => reject(err))
    })
  },

  getPersonalDetailAction ({commit, dispatch},id) {
    return new Promise((resolve, reject)=> {
      getDetailApi(type, id)
        .then(res => {
          commit('SET', { module:"personal", key: "personalItem", value: res.data })
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },

  createOrUpdatePersonalAction ({commit},form) {
    return new Promise((resolve,reject)=> {
      createOrUpdateApi(type, form)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  removePersonalAction ({commit}, id) {
    return new Promise((resolve,reject)=> {
      removeApi(type, id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  auditPersonalAction ({commit}, data) {
    return new Promise((resolve,reject)=> {
      auditApi(type, data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  completeAuditPersonalAction ({commit}, data) {
    return new Promise((resolve,reject)=> {
      completeAuditApi(type, data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  completePersonalAction ({commit}, data) {
    return new Promise((resolve,reject)=> {
      completeApi(type, data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  personalImportAction ({ commit}, data) {
    return new Promise((resolve, reject)=> {
      importApi(type, data)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  taskDownAction({commit}, id) {
    return new Promise((resolve,reject) => {
      taskDownApi(id)
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