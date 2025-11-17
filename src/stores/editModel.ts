import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { getTodayDate } from '@/utils/date'
import type { Schedule } from '@/types/schedule'
import { getScheduleInitialData } from '@/constant'

export const useEditModelStore = defineStore('editModel', () => {
  const editModelOpen = ref(false)
  const editModelInfo = ref<Schedule>(getScheduleInitialData())
  const editResponse = ref<Schedule | null>(null)
  return {
    editModelOpen,
    editModelInfo,
    editResponse,
  }
})
