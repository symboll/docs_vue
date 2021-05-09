import {
  getPoliceStationList,
  getPoliceList,
  getDicItems,

  commonUploadApi
} from '../api/common'

export default {
  getPoliceStationListAction ({ commit }) {
    return new Promise((resolve, reject)=> {
      getPoliceStationList().then(res => {
        commit('COMMIT_SET', { key: "policeStationList", value: res.data })
      }).catch(err => reject(err))
    })
  },
  getPoliceListAction ({ commit }, orgId) {
    return new Promise((resolve, reject)=> {
      getPoliceList(orgId).then(res => {
        commit('COMMIT_SET', { key: "policeList", value: res.data })
      }).catch(err => reject(err))
    })
  },
  getDicItemsAction ({ commit }, params) {
    const { typeCode } = params
    return new Promise((resolve, reject)=> {
      getDicItems({ typeCode }).then(res => {
        commit('COMMIT_SET', { key: params.key, value: res.data?.rows || [] })
      }).catch(err => reject(err))
    })
  },
  commonUploadAction ({ commit }, data) {
    return new Promise((resolve, reject)=> {
      commonUploadApi(data).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
}