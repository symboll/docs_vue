import {
  roleList,
  roleCreate,
  roleUpdate,
  roleDelete
} from '@/api/role'

const state = {
  roleList: [],
  roleAllList: [],
  loading: false,
  total: 0
}

const mutations = {
  SET_ROLE (state, roles) {
    if(state.roleAllList.length === 0) {
      state.roleAllList = roles
    }  
    if(state.roleAllList.length === 0 && roles.length > 10) {
      state.roleList = roles.slice(0,10)
    }else {
      state.roleList = roles
    }
  },
  SET_ROLE_TOTAL (state, total) {
    state.total = total
  },
  SET_TABLE_LOADING (state, bool) {
    state.loading = bool
  }
}

const actions = {
  getRoleAction: ({ commit }, params={}) => {
    return new Promise((resolve, reject) => {
      commit('SET_TABLE_LOADING', true)
      roleList(params).then(res => {
        if (res.code === 0) {
          commit('SET_ROLE', res.data.roles || [])
          commit('SET_ROLE_TOTAL', res.data.total)
          commit('SET_TABLE_LOADING', false)
        }
      }).catch(err => {
        commit('SET_TABLE_LOADING', false)
        reject(err.response.data)
      })
    })
  },

  createRoleAction: ({commit}, data) => {
    return new Promise((resolve, reject)=> {
      roleCreate(data).then(_ => {
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  updateRoleAction: ({commit},{ id, ...data }) => {
    return new Promise((resolve, reject)=> {
      roleUpdate(id, data).then(_ => {
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  deleteRoleAction: ({commit}, id) =>  {
    return new Promise((resolve, reject)=> {
      roleDelete(id).then(_ => {
        resolve()
      }).catch(err => {
        reject(err.response.data)
      })
    })
  }
}

const getters = {

}

export default {
  state,
  getters,
  mutations,
  actions
}
