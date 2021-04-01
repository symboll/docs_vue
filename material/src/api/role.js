import axios from './index'

export const roleList = (params) => {
  return axios.request({
    url: 'role',
    method: 'GET',
    params
  })
}
export const roleCreate = (data) => {
  return axios.request({
    url: 'role',
    method: 'POST',
    data
  })
}
export const roleUpdate = (id, data) => {
  return axios.request({
    url: `role/${id}`,
    method: 'PUT',
    data,
  })
}
export const roleDelete = (id) => {
  return axios.request({
    url: `role/${id}`,
    method: 'DELETE'
  })
}