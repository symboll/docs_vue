import { upload } from '@/api/upload'
 
const actions = {
  upLoadAction: ({ commit }, data) => {
    return new Promise((resolve,reject)=> {
      upload(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err.response.data)
      })
    })
  }
}

export default actions
