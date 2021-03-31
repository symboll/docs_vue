import {
  roleList,
  roleCreate,
  roleUpdate,
  roleDelete
} from '@/api/role'

const state = {
  roleList: []
}

const mutations = {
  SET_ROLE (state, roles) {
    state.roleList = roles
  }
}

const actions = {
  getRoleAction: ({ commit }) => {
    return new Promise((resolve, reject) => {
      roleList().then(res => {
        if (res.code === 0) {
          commit('SET_ROLE', res.data.roles)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  createRoleAction: ({commit}, data) => {
    return new Promise((resolve, reject)=> {
      roleCreate(data).then(_ => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateRoleAction: ({commit},{ id, ...data }) => {
    return new Promise((resolve, reject)=> {
      roleUpdate(id, data).then(_ => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  deleteRoleAction: ({commit}, id) =>  {
    return new Promise((resolve, reject)=> {
      roleDelete(id).then(_ => {
        resolve()
      }).catch(err => {
        reject(err)
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
