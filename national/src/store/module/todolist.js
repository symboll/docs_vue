import { 
  // createOrUpdateApi,
  // removeApi,
  // getDetailApi,
  getListApi,
  // auditApi,
  // importApi,
  // cancelReport,
  todolistApi
} from '@/api/template'
const type = 'agenda'

const state = {
  todoList: [],
  todoListTotal: 0,
  todoListCard: []
}
const mutations = {}
const actions = {
  getTodoListAction ({commit}, params) {
    return new Promise((resolve, reject)=> {
      getListApi(type, params).then(res => {
        commit('SET', { module:"todoList", key: "todoList", value: res.rows })
        commit('SET', { module:"todoList", key: "todoListTotal", value: res.total })
      })
    })
  },
  getTodoListCardAction({ commit }, params) {
    return new Promise((resolve, reject)=> {
      todolistApi(params).then(res => {
        commit('SET', { module:"todoList", key: "todoListCard", value: res.pageList })
      })
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