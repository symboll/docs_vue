import { 
  addAuthToRoleApi,
  addRoleApi,
  getRoleDetailApi,
  getRoleListByParamApi,
  modifyRoleApi,
  deleteRoleApi
} from '@/api/system/role'

const state = {
  roleList: [],
  selectedRoleId: '',
  selectedRoleName: '',
  selectedRole: [],
  selectedIds: []
}
const mutations = {
  SET_SELECTED_IDS (state, params) {
    const {id, value} = params
    if(value) {
      state.selectedIds.push(id)
    }else {
      const index = state.selectedIds.findIndex(item => item === id)
      state.selectedIds.splice(index,1)
    }
  }
}

const actions = {
  addAuthToRoleAction ({commit}, params) {
    return new Promise((resolve, reject) => {
      addAuthToRoleApi(params)
        .then(_ => resolve())
        .catch(err => reject(err))
    })
  },
  getRoleListByParamAction ({ commit }) {
    return new Promise((resolve, reject)=> {
      getRoleListByParamApi()
        .then(res => {
          commit("SET", { module: "role", key: "roleList", value: res.data })
          resolve(res.data)
        })
        .catch(err => console.log(err))
    })
  },
  getRoleDetailAction ({commit, state}, roleId) {
    commit('SET', { module: "role", key: "selectedRoleId", value: roleId  })
    const item = state.roleList.find(item => item.id === roleId) || {}
    commit('SET', { module: "role", key: "selectedRoleName", value: item.name  })
    return new Promise((resolve,reject)=> {
      getRoleDetailApi(roleId).then(res => {
        commit("SET", { module: "role", key: "selectedRole", value: res.data })
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  deleteRoleAction ({commit}, id) {
    return new Promise((resolve, reject) => {
      deleteRoleApi(id)
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