import { axios } from '../index'

export const getDictList =() => {
  return axios.request({
    url: '/system/dict/data/list'
  })
}

export const createDict = (data) => {
  return axios.request({
    url: '/system/dict/data',
    method: "POST",
    data
  })
}
export const updateDict =(data) => {
  return axios.request({
    url: '/system/dict/data',
    methods: "PUT",
    data
  })
}

export const dictDetail = (dictType) => {
  return axios.request({
    url: `/system/dict/data/type/${dictType}`
  })
}
export const deleteDict = (dictCodes) => {
  return axios.request({
    url: `/system/dict/data/${dictCodes}`,
    method: "DELETE"
  })
}
