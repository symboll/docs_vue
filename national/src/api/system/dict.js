import { axios } from '../index'
import { version } from '@/config'
const type = 'v2'

// 大类
export const getDictTypeListApi = () => {
  return axios.request({
    url: `/api/dictionary/${version}/getDicTypes`,
  })
}

// list
export const getDicItemsApi = (params) => {
  return axios.request({
    url: `/api/dictionary/${version}/getDicItems`,
    method: "POST",
    params
  })
}


// detail
export const getDicItemDetailApi = (id) => {
  return axios.request({
    url: `/api/dictionary/${version}/getDicInfoById/${id}`,
  })
}


// add
export const addDictItemApi = (data) => {
  return axios.request({
    url: `/api/dictionary/${version}/addDicItem/${type}`,
    method: "POST",
    data
  })
}

// edit
export const editDictionaryApi = (data) => {
  return axios.request({
    url: `/api/dictionary/${version}/editDictionary/${type}`,
    method: "POST",
    data
  })
}

// delete
export const deleteDictionaryApi = (id) => {
  return axios.request({
    url: `/api/dictionary/${version}/deleteDictionary/${id}`,
    method: "POST"
  })
}


