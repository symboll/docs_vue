import axios from './index'

export const authCodeList = (query) => {
  return axios.request({
    url: 'authcode',
    method: 'GET',
    query
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


