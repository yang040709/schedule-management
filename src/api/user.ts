import request from '.'
import type { LoginFrom, User, LoginResponse, RefreshTokenResponse } from '@/types/user'

export const loginApi = (data: LoginFrom) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  }) as Promise<LoginResponse>
}

export const refreshTokenApi = () => {
  return request({
    url: '/auth/refresh',
    method: 'get',
  }) as Promise<RefreshTokenResponse>
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

export const logoutApi = () => {
  return request({
    url: '/auth/logout',
    method: 'post',
  }) as Promise<void>
}
