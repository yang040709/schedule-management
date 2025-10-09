<script setup lang="ts">
import AppCalendar from '@/components/AppCalendar.vue'
import ScheduleItem from '@/components/Schedule/ScheduleItem.vue'
import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'
import ScheduleList from '@/components/Schedule/ScheduleList.vue'
const scheduleStore = useScheduleStore()
const { scheduleData } = storeToRefs(scheduleStore)

import { defineStore } from 'pinia'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import CalendarDrawer from '@/components/CalendarDrawer.vue'
// const defaultDate = today(getLocalTimeZone()).toString()

const { date } = defineProps<{
  date: string
}>()

console.log(today(getLocalTimeZone()).toString())

// import { defineStore } from 'pinia'
// import type { DateValue } from '@internationalized/date'
// import type { Ref } from 'vue'
// import { getLocalTimeZone, today } from '@internationalized/date'
// import { ref, computed } from 'vue'
// import { Calendar } from '@/components/ui/calendar'

// export const useDateStore = defineStore('date', () => {
//   const selectDate = ref(today(getLocalTimeZone())) as Ref<DateValue>
//   const selectStringDate = computed(() => selectDate.value.toString())
//   return { selectDate, selectStringDate }
// })
</script>

<template>
  <div class="md:flex md:gap-4">
    <div class="justify-center items-start hidden md:flex">
      <AppCalendar class="w-[fit-content]" />
    </div>
    <ScheduleList class="flex-1" />
  </div>
  <!-- <div>
    <CalendarDrawer></CalendarDrawer>
  </div> -->
  <!-- <div>date=>{{ date }}</div> -->
</template>

<style scoped></style>
