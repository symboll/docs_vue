import { axios } from './index'
import { version } from '@/config/index.js'


/**
 * 详情
 * @param {*} id 
 * @returns 
 */
export const getDetailApi = (type, params)=> {
  return axios.request({
    url: `/api/${type}/${version}/info`,
    params
  })
}


/**
 * 任务下派
 * @param {*} id 
 * @returns 
 */
export const taskDownApi = (id) => {
  return axios.request({
    url: `/api/person/${version}/taskDown/${id}`,
    method:"POST"
  })
}


/**
 * 评论
 * @param {*} data 
 * @returns 
 */
export const evaluationApi = (data) => {
  return axios.request({
    url: `/api/record/${version}/evaluation`,
    method: "POST",
    data
  })
}