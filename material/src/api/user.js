import axios from './index'

export const login = (data) => {
  return axios.request({
    url: 'user/login',
    method: 'POST',
    data
  })
}

export const getUserInfo = () => {
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

export const getUserList = (params) => {
  return axios.request({
    url: 'user',
    params
  })
}