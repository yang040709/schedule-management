import type { PriorityLevel, ScheduleStatus } from '@/types/schedule'
import { getTodayDate, getTodayDateTime } from '@/utils/date'
import type { Schedule } from '@/types/schedule'
export const priorityMap: Record<PriorityLevel, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
} as const

export const statusMap: Record<ScheduleStatus, string> = {
  done: '已完成',
  pending: '未完成',
  expired: '已过期',
  canceled: '已取消',
  locked: '已锁定',
} as const

export const getScheduleInitialData: () => Schedule = () => {
  return {
    id: '',
    title: '',
    description: '',
    category: [],
    priority: 'high',
    date: getTodayDate(),
    status: 'pending',
    createdAt: getTodayDateTime(),
    updatedAt: getTodayDateTime(),
  }
}
/* 
  访问令牌的key
*/
export const ACCESS_TOKEN_KEY = 'yang-customer-access-token'

/* 
  登录就能访问，不登录就不能访问
*/
export const NO_LOGIN_CAN_ACCESS = ['login', 'register'] as const as readonly string[]
