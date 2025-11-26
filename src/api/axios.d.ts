import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    meta?: Record<string, any> // 或更具体的类型
  }

  export interface InternalAxiosRequestConfig {
    meta?: Record<string, any>
  }
}
