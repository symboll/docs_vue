
const BASE_URL = process.env.NODE_ENV === 'production' ? './' : '/'

module.exports = {
  lintOnSave: false,
  publicPath: BASE_URL,
  productionSourceMap: false,
  devServer: {
    proxy: 'http://47.105.117.147:8083'
    // proxy: "http://192.168.2.169:8083"
  }
}
