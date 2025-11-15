import request from '.'
import type { LoginFrom, User, LoginResponse } from '@/types/user'

export const loginApi = (data: LoginFrom) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  }) as Promise<LoginResponse>
}

export const registerApi = (data: LoginFrom) => {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
  }) as Promise<LoginResponse>
}

export const getUserInfoApi = () => {
  return request({
    url: '/auth/verify',
    method: 'get',
  }) as Promise<User>
}
