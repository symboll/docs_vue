import { axios } from './index'
import { version } from '@/config/index.js'

/**
 * 创建 or 更新
 * @param {*} data
 * @returns 
 */
 export const createOrUpdateApi = (type, data)=> {
  return axios.request({
    url: `/api/${type}/${version}/addOrUpdate`,
    method: "POST",
    data
  })
}

/**
 * 审核
 * @param {*} data
 * @returns 
 */
 export const auditApi = (type, data)=> {
  return axios.request({
    url: `/api/${type}/${version}/audit`,
    method: "POST",
    data
  })
}

/**
 * 删除
 * @param {*} id 
 * @returns 
 */
 export const removeApi = (type, id)=> {
  return axios.request({
    url: `/api/${type}/${version}/del/${id}`,
    method: "POST",
  })
}


/**
 * 导入
 * @param {*} data 
 * @returns 
 */
 export const importApi = (type, data) => {
  return axios.request({
    url: `/api/${type}/${version}/import`,
    method: "POST",
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}


/**
 * 详情
 * @param {*} id 
 * @returns 
 */
export const getDetailApi = (type, id)=> {
  return axios.request({
    url: `/api/${type}/${version}/info/${id}`,
  })
}


/**
 * 列表
 * @param {*} params 
 * @returns 
 */
 export const getListApi = (type, params)=> {
  return axios.request({
    url: `/api/${type}/${version}/page`,
    params
  })
}


/**
 * 撤销报备
 * 情报信息 >>> 信息员管理 页面特有
 * @param {*} id 
 * @returns 
 */
 export const cancelReport = (type, id)=> {
  return axios.request({
    url: `/api/${type}/${version}/cancel/${id}`,
    method: "POST",
  })
}
