import { axios } from '../index'
import { version } from '@/config'

/**
 * 给角色添加权限
 * @param {*} data 
 * @returns 
 */
export const addAuthToRoleApi = (data) => {
  return axios.request({
    url: `/api/role/${version}/addAuthToRole`,
    method: "POST",
    data
  })
}

/**
 * 添加角色
 * @param {*} params { moduleIds, name, parentId }
 * @returns 
 */
export const addRoleApi = (params) => {
  return axios.request({
    url: `/api/role/${version}/addRole`,
    method: "POST",
    params
  })
}


/**
 * 获取角色详情，即获取角色权限相关信息
 * @param {*} id 
 * @returns 
 */
export const getRoleDetailApi =(id) => {
  return axios.request({
    url: `/api/role/${version}/getRoleDetail/${id}`,
  })
}


/**
 * 根据条件获取角色列表
 * @param {*} params 
 * @returns 
 */
export const getRoleListByParamApi =(params) => {
  return axios.request({
    url: `/api/role/${version}/getRoleListByParam`,
    method: "POST",
    params
  })
}

/**
 * 修改角色
 * @param {*} params 
 * @returns 
 */
export const modifyRoleApi =(params) => {
  return axios.request({
    url: `/api/role/${version}/modifyRole`,
    method: "POST",
    params
  })
}


// 

export const deleteRoleApi = (id) => {
  return axios.request({
    url: `/api/role/${version}/delRole/${id}`,
    method: "POST"
  }) 
}