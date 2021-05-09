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
