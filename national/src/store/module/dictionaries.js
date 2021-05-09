import {
  getDictTypeListApi,
  getDicItemsApi,
  getDicItemDetailApi,
  addDictItemApi,
  editDictionaryApi,
  deleteDictionaryApi
} from '../../api/system/dict'

const state = {
  dictTypeList: [],
  dictItemList: [],
  dictItemTotal:0,
  dictItemInfo: {
    name: "",
    code: "",
    ownDicType: "",
    description: ""
  }
}
const mutations = {

}
const actions = {
  getDictTypeListAction ({commit}) {
    return new Promise((resolve, reject)=> {
      getDictTypeListApi()
        .then(res => {
          commit('SET', { module: "dictionaries", key: 'dictTypeList', value: res.data })
        })
        .catch(err => reject(err))
    })
  },
  getDicMapItemAction ({commit}, params) {
    return new Promise((resolve, reject)=> {
      getDicItemsApi(params)
        .then(res => {
          commit('SET', { module: 'dictionaries', key: 'dictItemList' , value: res.data?.rows })
          commit('SET', { module: 'dictionaries', key: 'dictItemTotal' , value: res.data?.total })
        })
        .catch(err => reject(err))
    })
  },
  getDicItemDetailApi ({commit}, id) {
    return new Promise((resolve, reject) => {
      getDicItemDetailApi(id).then(res => {
        commit('SET', { module: 'dictionaries', key:'dictItemInfo', value: res.data })
      })
      .catch(err => reject(err))
    })
  },
  addDictItemAction({commit}, data) {
    return new Promise((resolve, reject) => {
      addDictItemApi(data)
        .then(res =>  resolve(res))
        .catch(err => reject(err))
    })
  },
  editDictionaryAction({commit}, data) {
    return new Promise((resolve, reject) => {
      editDictionaryApi(data)
        .then(res =>  resolve(res))
        .catch(err => reject(err))
    })
  },
  deleteDictionaryAction({commit}, id) {
    return new Promise((resolve, reject) => {
      deleteDictionaryApi(id)
        .then(res =>  resolve(res))
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