import { axios } from '../index'

export const getUserInfo = () => {
  return axios.request({
    url: '/getInfo'
  })
}

export const getRouters = () => {
  return axios.request({
    url: "/getRouters"
  })
}