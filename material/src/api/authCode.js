import axios from './index'

export const authCodeList = (params) => {
  return axios.request({
    url: 'authcode',
    method: 'GET',
    params
  })
}
export const authCodeCreate = (data) => {
  return axios.request({
    url: 'authcode',
    method: 'POST',
    data
  })
}
export const authCodeUpdate = (id, data) => {
  return axios.request({
    url: `authcode/${id}`,
    method: 'PUT',
    data,
  })
}
export const authCodeDelete = (id) => {
  return axios.request({
    url: `authcode/${id}`,
    method: 'DELETE'
  })
}


