import { useUserStore } from '@/stores/user'
import { logResponse } from '@/utils'
import axios from 'axios'
import { toast } from 'vue-sonner'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
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
    if (response.data.code === 0) {
      return response.data.data
    }
    toast.error(response.data.message)
    return Promise.reject(response.data.message)
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default request
