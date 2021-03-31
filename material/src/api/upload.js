import axios from './index'

export const upload = (data) => {
  return axios.request({
    url: 'upload',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data 
  })
}