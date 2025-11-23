import request from '.'
import type {
  HabitListQuery,
  HabitListResponse,
  HabitForm,
  HabitResponse,
  ModifyHabitForm,
  TodayHabitsResponse,
  CheckInRecordsResponse,
  CheckInForm,
  AchievementsResponse,
  AllStats,
} from '@/types/habit'

// 获取习惯列表
export const getHabitsApi = (query: HabitListQuery) => {
  return request({
    url: '/habits',
    method: 'get',
    params: query,
  }) as Promise<HabitListResponse>
}

// 获取今日需要完成的习惯
export const getTodayHabitsApi = () => {
  return request({
    url: '/habits/today',
    method: 'get',
  }) as Promise<TodayHabitsResponse>
}

// 添加新的习惯
export const addHabitApi = (data: HabitForm) => {
  return request({
    url: '/habits',
    method: 'post',
    data,
  }) as Promise<HabitResponse>
}

// 修改习惯
export const modifyHabitApi = (id: string, data: ModifyHabitForm) => {
  return request({
    url: `/habits/${id}`,
    method: 'put',
    data,
  }) as Promise<HabitResponse>
}

// 删除习惯
export const deleteHabitApi = (id: string) => {
  return request({
    url: `/habits/${id}`,
    method: 'delete',
  }) as Promise<undefined>
}

// 打卡今天的习惯
export const checkInHabitApi = (data: CheckInForm) => {
  return request({
    url: '/habits/check-in',
    method: 'post',
    data,
  }) as Promise<undefined>
}

// 取消打卡今天的习惯
export const cancelCheckInHabitApi = (habits_id: string) => {
  return request({
    url: `/habits/check-in/${habits_id}`,
    method: 'delete',
  }) as Promise<undefined>
}

// 分页获取习惯列表
export const getHabitRecordsApi = (habitId: string, page?: number, pageSize?: number) => {
  return request({
    url: `/habits/${habitId}/records`,
    method: 'get',
    params: { page, pageSize },
  }) as Promise<CheckInRecordsResponse>
}

// 获取成就
export const getAchievementsApi = () => {
  return request({
    url: '/achievements',
    method: 'get',
  }) as Promise<AchievementsResponse>
}

// 获取所有习惯的统计信息
export const getAllStatsApi = () => {
  return request({
    url: '/habits/stats',
    method: 'get',
  }) as Promise<AllStats>
}
