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
  const scheduleData = useStorage<ScheduleData>('scheduleData', {
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

  const getScheduleData = (date: string, id: string) => {
    const schedule = scheduleData.value[date] || []
    return schedule.find((item) => item.id === id)
  }
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
  const updateScheduleData = (date: string, data: ScheduleEvent, oldDate: string) => {
    if (oldDate === date) {
      const schedule = scheduleData.value[date] || []
      const index = schedule.findIndex((item) => item.id === data.id)
      console.log(index, '<===index', data, date)
      if (index > -1) {
        schedule[index] = data
      }
    } else {
      const oldSchedule = scheduleData.value[oldDate] || []
      const index = oldSchedule.findIndex((item) => item.id === data.id)
      if (index > -1) {
        oldSchedule.splice(index, 1)
      }
      const scheduleList = scheduleData.value[date] || []
      scheduleList.push(data)
      scheduleData.value[date] = scheduleList
    }
  }
  const deleteScheduleData = (date: string, id: string) => {
    const schedule = scheduleData.value[date] || []
    const index = schedule.findIndex((item) => item.id === id)
    if (index > -1) {
      schedule.splice(index, 1)
    }
  }
  const toggleScheduleData = (date: string, id: string) => {
    const schedule = scheduleData.value[date] || []
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
