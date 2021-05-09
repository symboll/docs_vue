import { axios } from '../index'
const type = 'v4'
const prefix = '/api/systemConfig'

export const getSystemConfigListApi = (params = {}) => {
  return axios.request({
    url: `${prefix}/${type}/getSystemConfig`,
    params
  })
}

export const getConfigByIdApi = (id) => {
  return axios.request({
    url: `${prefix}/${type}/getConfigById`,
    params: {
      id
    } 
  })
}

export const editSystemConfigApi = (data) => {
  return axios.request({
    url: `${prefix}/${type}/editSystemConfig`,
    method: "POST",
    data
  })
}

export const addConfigApi = (data) => {
  return axios.request({
    url: `${prefix}/${type}/addConfig`,
    method: "POST",
    data
  })
}


export const deleteConfigApi = (id) => {
  return axios.request({
    url: `${prefix}/${type}/deleteConfig`,
    // method: "POST",
    params: {id}
  })
}

