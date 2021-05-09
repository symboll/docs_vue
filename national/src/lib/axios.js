import axios from 'axios'
import { baseURL } from '@/config'
// import { Message } from 'element-ui'
import { getToken } from '@/lib/util'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = new Set()
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      withCredentials: true, // 是否携带cookie
      headers: {
        'Content-Type': 'application/json'
      },
      loading: false
    }
    return config
  }

  interceptors (instance, options) {
    const { loading, url } = options
    instance.interceptors.request.use(config => {
      if (loading && !this.queue.size) {
        // 出现loading
        this.queue.add(url)
      }
      config.headers['Authorization'] = `${getToken()}`
      return config
    }, error => {
      return Promise.reject(error)
    })
    instance.interceptors.response.use(res => {
      if (loading && !this.queue.size) {
        // 关闭loading
        this.queue.delete(url)
      }
      const { data } = res
      if(data.success || data.code === 200 || data.resultCode === 0) {
        return data
      }else {
        return Promise.reject(data.message) 
      }
    }, error => {
      if (loading && !this.queue.size) {
        // 关闭loading
        this.queue.delete(url)
      }
      return Promise.reject(error)
    })
  }

  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options)
    Reflect.deleteProperty(options, 'loading')
    return instance(options)
  }
}

export default HttpRequest