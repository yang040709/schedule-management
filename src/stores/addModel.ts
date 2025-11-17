import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { getTodayDate } from '@/utils/date'
import type { Schedule } from '@/types/schedule'
import { getScheduleInitialData } from '@/constant'

export const useAddModelStore = defineStore('addModel', () => {
  const addModelOpen = ref(false)
  const addModelInfo = ref({
    date: getTodayDate(),
  })
  const addResponse = ref<Schedule>(getScheduleInitialData())
  return {
    addModelInfo,
    addModelOpen,
    addResponse,
  }
})
