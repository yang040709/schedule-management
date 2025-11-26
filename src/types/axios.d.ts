import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    meta?: {
      notToast?: boolean
    }
  }

  export interface InternalAxiosRequestConfig {
    meta?: {
      notToast?: boolean
    }
  }
}
