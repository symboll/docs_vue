import { 
  // createOrUpdateApi,
  // removeApi,
  // getDetailApi,
  getListApi,
  // auditApi,
  // importApi,
  // cancelReport
} from '@/api/template'
const type = 'agenda'

const state = {
  todoList: [],
  todoListTotal: 0
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
  }
}
const getters = {}

export default{
  state,
  mutations,
  actions,
  getters
}