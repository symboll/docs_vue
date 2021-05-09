import { axios } from './index'

export const login = (params)=> {
  return axios.request({
    url: "/login",
    method: "POST",
    params
  })
}