import { 
  getFinishedApi,
  getIdeologicalApi,
  getVisitApi
} from '@/api/statistical'

const state = {
  finishedList: [],
  finishedTotal: 0,
  ideologicalList: [],
  ideologicalTotal: 0,
  visitList: [],
  visitTotal: 0
}
const mutations = {
}

const actions = {
  getFinishedAction ({commit}, params) {
    return new Promise((resolve, reject) => {
      getFinishedApi(params)
        .then(res  => {
          commit('SET',{ module: 'statistical', key: "finishedList", value: res.rows })
          commit('SET',{ module: 'statistical', key: "finishedTotal", value: res.total })
        })
        .catch(err => reject(err))
    })
  },
  getIdeologicalAction ({commit}, params) {
    return new Promise((resolve, reject) => {
      getIdeologicalApi(params)
        .then(res  => {
          commit('SET',{ module: 'statistical', key: "ideologicalList", value: res.rows })
          commit('SET',{ module: 'statistical', key: "ideologicalTotal", value: res.total })
        })
        .catch(err => reject(err))
    })
  },
  getVisitAction ({commit}, params) {
    return new Promise((resolve, reject) => {
      getVisitApi(params)
        .then(res  => {
          commit('SET',{ module: 'statistical', key: "visitList", value: res.rows })
          commit('SET',{ module: 'statistical', key: "visitTotal", value: res.total })
        })
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