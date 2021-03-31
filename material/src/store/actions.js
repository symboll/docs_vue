import { upload } from '@/api/upload'
 
const actions = {
  upLoadAction: ({ commit }, data) => {
    return new Promise((resolve,reject)=> {
      upload(data).then(res => {
        console.log('res==>', res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default actions
