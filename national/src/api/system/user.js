import { axios } from '../index'
import { version } from '@/config'



export const getCurOrgTreeApi = (params) => {
  return axios.request({
    url: `/api/organization/${version}/getCurOrgTree`,
    params
  })
}


export const getUserListApi = (params) => {
  return axios.request({
    url: `/api/user/${version}/getUserList`,
    params
  })
}

export const getOrganListApi = () => {
  return axios.request({
    url: `/api/organization/${version}/select`
  })
}


export  const createUserApi = (data) => {
  return axios.request({
    url: `/api/user/${version}/addUser`,
    method: "POST",
    data
  })
}

export  const modifyUserApi = (data) => {
  return axios.request({
    url: `/api/user/${version}/modifyUser`,
    method: "POST",
    data
  })
}

export const deleteUserByIdApi = (id) => {
  return axios.request({
    url: `/api/user/${version}/deleteUserById/${id}`,
    method: "POST"
  })
} 


export  const getCurrentUserInfoApi = () => {
  return axios.request({
    url: `/api/user/${version}/getCurrentUserInfo`,
  })
}

export const getUserInfoApi = (id) => {
  return axios.request({
    url: `/api/user/${version}/getUserInfo/${id}`,
  })
}



export const disableOrEnableApi = (id,  delFlag) => {
  return axios.request({
    url: `/api/user/${version}/delFalg/${id}`,
    method: "POST",
    params: {
      delFlag
    }
  })
}

export const resetPasswordApi = (userId) => {
  return axios.request({
    url: `/api/user/${version}/resetPassword/${userId}`,
    method: "POST"
  })
}