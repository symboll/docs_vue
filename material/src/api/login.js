import axios from './index'

export const login = (data) => {
  return axios.request({
    url: 'user/login',
    method: 'POST',
    loading: true,
    data
  })
}
