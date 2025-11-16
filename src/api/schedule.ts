import request from '.'
import type {
  ScheduleListQuery,
  ScheduleListResponse,
  ScheduleForm,
  GenerateSchedule,
  ScheduleResponse,
  ModifyScheduleForm,
  AISuggest,
} from '@/types/schedule'

export const getScheduleListApi = (query: ScheduleListQuery) => {
  return request({
    url: '/schedule',
    method: 'get',
    params: query,
  }) as Promise<ScheduleListResponse>
}

export const addScheduleApi = (data: ScheduleForm) => {
  return request({
    url: '/schedule',
    method: 'post',
    data,
  }) as Promise<ScheduleResponse>
}

export const modifyScheduleApi = (id: string, data: ModifyScheduleForm) => {
  return request({
    url: `/schedule/${id}`,
    method: 'put',
    data,
  }) as Promise<ScheduleResponse>
}

export const deleteScheduleApi = (id: string) => {
  return request({
    url: `/schedule/${id}`,
    method: 'delete',
  }) as Promise<undefined>
}

export const generateScheduleApi = (data: GenerateSchedule) => {
  return request({
    url: '/schedule/ai/generate',
    method: 'post',
    data,
  }) as Promise<ScheduleForm>
}

export const getAISuggestApi = (id: string) => {
  return request({
    url: `/schedule/${id}/ai/suggest`,
    method: 'get',
  }) as Promise<AISuggest>
}

export const getAISuggestByEditFormApi = (id: string, from: ModifyScheduleForm) => {
  return request({
    url: `/schedule/${id}/ai/suggest-by-edit`,
    method: 'post',
    data: from,
  }) as Promise<AISuggest>
}
