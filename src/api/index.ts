import { useUserStore } from '@/stores/user'
import { logResponse } from '@/utils'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

let isRefreshing = false //是否正在刷新
let failedRequestQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [] //等待重试的请求队列

request.interceptors.response.use(
  async (response) => {
    logResponse(response, false)
    if (response.data.code === 0) {
      return response.data.data
    }
    /* 
      401: 说明需要尝试刷新访问令牌
    */
    const originalRequest = response.config
    // @ts-ignore
    if (response.data.code === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            resolve,
            reject,
          })
        })
          .then(() => {
            return request(originalRequest)
          })
          .catch((error) => {
            return Promise.reject(error)
          })
      }
      // @ts-ignore
      originalRequest._retry = true
      isRefreshing = true
      const userStore = useUserStore()
      // const router = useRouter()
      try {
        const { data } = await axios.get('/api/auth/refresh')
        // console.log(data, '<==refreshToken')
        userStore.accessToken = data.data.accessToken
        failedRequestQueue.forEach((item) => item.resolve(data))
        failedRequestQueue = []
        return request(originalRequest)
      } catch (error) {
        // 登出
        failedRequestQueue.forEach((item) => item.reject(error))
        failedRequestQueue = []
        userStore.logout()
        window.location.href = import.meta.env.VITE_BASE_URL + '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }
    // toast.error(response.data.message)
    console.error(response.data.message)
    return Promise.reject(response.data.message)
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default request
