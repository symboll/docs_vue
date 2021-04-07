import axios from './index'

export const login = (data) => {
  return axios.request({
    url: 'user/login',
    method: 'POST',
    data
  })
}

export const logout = ()=> {
  return axios.request({
    url: 'user/logout',
    method: "POST"
  })
}

export const authorization = () => {
  return axios.request({
    url: 'user/authorization',
    method: 'GET',
  })
}

export const register = (data) => {
  return axios.request({
    url: 'user/register',
    method: 'POST',
    data
  })
}

export const update = (data) => {
  return axios.request({
    url: 'user/update',
    method: "POST",
    data
  })
}

export const getUserList = (params) => {
  return axios.request({
    url: 'user',
    params
  })
}