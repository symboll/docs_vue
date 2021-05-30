import { axios } from './index'
import { version } from '@/config/index.js'


export const getPoliceStationList = ()=> {
  return axios.request({
    url: "/common/allOrg",
  })
}

export const getPoliceList = (orgId) => {
  return axios.request({
    url: `/common/allUser/${orgId}`
  })
}


export const getDicItems = (params) => {
  return axios.request({
    url: '/common/getDicItems',
    params
  })
}

export  const getDictTypeList = () => {
  return axios.request({
    url: `/api/dictionary/${version}/getDicTypes`,
  })
}


// 文件上传
export const commonUploadApi = (data) => {
  return axios.request({
    url: `/common/upload`,
    method: "POST",
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 导出
export const exportApi = (params) => {
  return axios.request({
    url: `/api/position/${version}/toExcel`,
    headers: {
      'Content-Type': 'application/vnd.ms-excel'
    },
    params
  })
}


export const allInfoPersonApi = () => {
  return axios.request({
    url: `/common/allInfoPerson`,
  })
}