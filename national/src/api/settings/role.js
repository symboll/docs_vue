import { axios } from '../index'

export const getRoleList = ()=> {
  return axios.request({
    url: "/system/role/list",
  })
}


export const getRoleDetail = (roleId) => {
  return axios.request({
    url: `/system/role/${roleId}`
  })
}