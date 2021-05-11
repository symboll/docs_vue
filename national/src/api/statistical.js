import { axios } from './index'
import { version } from '@/config/index.js'

// 任务下派完成情况统计
export const getFinishedApi = (params) => {
  return axios.request({
    url: `/api/count/${version}/finished`,
    params
  })
}

// 人员思想情况评估统计/场所情况评估统计
export const getIdeologicalApi = (params) => {
  return axios.request({
    url: `/api/count/${version}/ideological`,
    params
  })
}

// 走访信息评价统计
export const getVisitApi = (params) => {
  return axios.request({
    url: `/api/count/${version}/visit`,
    params
  })
}