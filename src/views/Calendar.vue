<script setup lang="ts">
import AppCalendar from '@/components/AppCalendar.vue'
import ScheduleItem from '@/components/Schedule/ScheduleItem.vue'
import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'
import ScheduleList from '@/components/Schedule/ScheduleList.vue'
const scheduleStore = useScheduleStore()
const { scheduleData } = storeToRefs(scheduleStore)
</script>

<template>
  <div class="md:flex md:gap-4">
    <div class="flex justify-center items-start">
      <AppCalendar class="w-[fit-content]" />
    </div>
    <ScheduleList class="flex-1" />
  </div>
</template>

<style scoped></style>
