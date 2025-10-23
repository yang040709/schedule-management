import { defineStore } from 'pinia'
import type { ScheduleData, ScheduleEvent, ScheduleForm } from '@/types/schedule'
import { nanoid } from 'nanoid'
import { useStorage } from '@vueuse/core'
import { APP_CONFIG } from '@/config/app'
import { getTodayDate } from '@/utils/date'
import { getId } from '@/utils'
export const useScheduleStore = defineStore('schedule', () => {
  const getDefaultdata: () => ScheduleData = () => {
    return [
      {
        id: 'fc20251006001',
        title: '周计划制定',
        startTime: '09:00',
        endTime: '09:30',
        priority: 'medium',
        category: ['工作', '规划'],
        completed: true,
        date: getTodayDate(),
      },
    ]
  }

  const scheduleData = useStorage<ScheduleData>(APP_CONFIG.ScheduleStorageKey, getDefaultdata())

  const getScheduleData = (id: string) => {
    const schedule = scheduleData.value || []
    return schedule.find((item) => item.id === id)
  }
  const setScheduleData = (data: ScheduleForm) => {
    const schedule: ScheduleEvent = {
      ...data,
      id: getId(),
      completed: false,
    }
    scheduleData.value.push(schedule)
    console.log(schedule)
  }
  const updateScheduleData = (data: ScheduleEvent) => {
    const index = scheduleData.value.findIndex((item) => item.id === data.id)
    if (index > -1) {
      scheduleData.value.splice(index, 1)
    }
    scheduleData.value.push(data)
  }
  const deleteScheduleData = (id: string) => {
    const index = scheduleData.value.findIndex((item) => item.id === id)
    if (index > -1) {
      scheduleData.value.splice(index, 1)
    }
  }
  const toggleScheduleData = (id: string) => {
    const schedule = scheduleData.value || []
    schedule.forEach((item) => {
      if (item.id === id) {
        item.completed = !item.completed
      }
    })
  }
  return {
    scheduleData,
    getScheduleData,
    setScheduleData,
    updateScheduleData,
    deleteScheduleData,
    toggleScheduleData,
  }
})
