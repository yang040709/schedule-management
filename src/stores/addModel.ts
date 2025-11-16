import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { getTodayDate } from '@/utils/date'

export const useAddModelStore = defineStore('addModel', () => {
  const addModelOpen = ref(false)
  const addModelInfo = ref({
    date: getTodayDate(),
  })

  return {
    addModelInfo,
    addModelOpen,
  }
})
