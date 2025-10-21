import { defineStore } from 'pinia'
import type { ScheduleData, ScheduleEvent, ScheduleForm } from '@/types/schedule'
import { ref } from 'vue'
import { scheduleData as mockData } from './mockData'
import { nanoid } from 'nanoid'
import { useStorage } from '@vueuse/core'
export const useScheduleStore = defineStore('schedule', () => {
  // const scheduleData = ref<ScheduleData>(mockData)
  // const scheduleData = ref<ScheduleData>({
  //   '2025-10-06': [
  //     {
  //       id: 'fc20251006001',
  //       title: '周计划制定',
  //       startTime: '09:00',
  //       endTime: '09:30',
  //       priority: 'medium',
  //       category: ['工作', '规划'],
  //       completed: true,
  //     },
  //   ],
  // })
  const scheduleData = useStorage<ScheduleData>('scheduleData-v2', [
    {
      id: 'fc20251006001',
      title: '周计划制定',
      startTime: '09:00',
      endTime: '09:30',
      priority: 'medium',
      category: ['工作', '规划'],
      completed: true,
      date: '2025-10-21',
    },
  ])

  const getScheduleData = (date: string, id: string) => {
    const schedule = scheduleData.value || []
    return schedule.find((item) => item.id === id && item.date === date)
  }
  const setScheduleData = (date: string, data: ScheduleForm) => {
    const schedule: ScheduleEvent = {
      ...data,
      id: date + nanoid(),
      completed: false,
    }
    scheduleData.value.push(schedule)
    console.log(schedule)
  }
  const updateScheduleData = (date: string, data: ScheduleEvent, oldDate: string) => {
    const index = scheduleData.value.findIndex(
      (item) => item.id === data.id && item.date === oldDate,
    )
    if (index > -1) {
      scheduleData.value.splice(index, 1)
    }
    scheduleData.value.push(data)
  }
  const deleteScheduleData = (date: string, id: string) => {
    const index = scheduleData.value.findIndex((item) => item.id === id && item.date === date)
    if (index > -1) {
      scheduleData.value.splice(index, 1)
    }
  }
  const toggleScheduleData = (date: string, id: string) => {
    const schedule = scheduleData.value || []
    schedule.forEach((item) => {
      if (item.id === id && item.date === date) {
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
