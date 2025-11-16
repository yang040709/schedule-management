import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Schedule } from '@/types/schedule'
import { getScheduleInitialData } from '@/constant'

export const useDetailModelStore = defineStore('detailModel', () => {
  const isOpen = ref(false)
  const schedule = ref<Schedule>(getScheduleInitialData())

  return {
    isOpen,
    schedule,
  }
})
