import axios from 'axios'
export const audioService = axios.create({
  baseURL: process.env.VUE_APP_AUDIO_URL,
  // baseURL: 'http://192.168.43.105:9202',
  // 超时时间
  timeout: 20000
})
export const baseService = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // url = base url + request url
  // 超时时间
  timeout: 20000
})


// 拦截response 事先统一处理
audioService.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  // Do something with response error
  return Promise.reject({
    msg: '网络错误',
    err: error
  })
})
// 拦截response 事先统一处理
baseService.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  // Do something with response error
  return Promise.reject({
    msg: '网络错误',
    err: error
  })
})


