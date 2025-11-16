import { logResponse } from '@/utils'
import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

request.interceptors.request.use(
  (config) => {
    // 添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
request.interceptors.response.use(
  (response) => {
    logResponse(response, false)
    if (response.data.code === 200) {
      return response.data.data
    }
    return Promise.reject(response.data.message)
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default request
