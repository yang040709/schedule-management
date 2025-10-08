import { defineStore } from 'pinia'
import type { ScheduleData } from '@/types/schedule'
import { ref } from 'vue'
import { scheduleData as mockData } from './mockData'
export const useScheduleStore = defineStore('schedule', () => {
  const scheduleData = ref<ScheduleData>(mockData)
  return { scheduleData }
})
