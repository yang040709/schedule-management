import { defineStore } from 'pinia'
import type { ScheduleData, ScheduleEvent, ScheduleForm } from '@/types/schedule'
import { ref } from 'vue'
import { scheduleData as mockData } from './mockData'
import { nanoid } from 'nanoid'
export const useScheduleStore = defineStore('schedule', () => {
  // const scheduleData = ref<ScheduleData>(mockData)
  const scheduleData = ref<ScheduleData>({
    '2025-10-06': [
      {
        id: 'fc20251006001',
        title: '周计划制定',
        startTime: '09:00',
        endTime: '09:30',
        priority: 'medium',
        category: ['工作', '规划'],
        completed: true,
      },
    ],
  })

  const getScheduleData = (date: string) => scheduleData.value[date]
  const setScheduleData = (date: string, data: ScheduleForm) => {
    const schedule: ScheduleEvent = {
      ...data,
      id: nanoid(),
      completed: false,
    }
    console.log(schedule)
    // scheduleData
    const scheduleList = scheduleData.value[date] || []
    scheduleList.push(schedule)
    scheduleData.value[date] = scheduleList
  }
  const updateScheduleData = (date: string, data: ScheduleEvent) => {
    const schedule = scheduleData.value[date] || []
    const index = schedule.findIndex((item) => item.id === data.id)
    if (index > -1) {
      schedule[index] = data
    }
  }
  const deleteScheduleData = (date: string, id: string) => {
    const schedule = scheduleData.value[date] || []
    const index = schedule.findIndex((item) => item.id === id)
    if (index > -1) {
      schedule.splice(index, 1)
    }
  }
  return { scheduleData, getScheduleData, setScheduleData, updateScheduleData, deleteScheduleData }
})
