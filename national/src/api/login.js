import { axios } from './index'

export const login = (params)=> {
  return axios.request({
    url: "/login",
    method: "POST",
    params
  })
}

export const modifyPassword = (data) => {
  return axios.request({
    url: '/api/user/v1/editPassword',
    method: "POST",
    data
  })
}