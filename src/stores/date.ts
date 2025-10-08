import { defineStore } from 'pinia'
import type { DateValue } from '@internationalized/date'
import type { Ref } from 'vue'
import { getLocalTimeZone, today } from '@internationalized/date'
import { ref } from 'vue'
import { Calendar } from '@/components/ui/calendar'

export const useDateStore = defineStore('date', () => {
  const selectDate = ref(today(getLocalTimeZone())) as Ref<DateValue>
  return { selectDate }
})
