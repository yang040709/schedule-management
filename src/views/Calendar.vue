<script setup lang="ts">
import AppCalendar from '@/components/AppCalendar.vue'
import ScheduleList from '@/components/Schedule/ScheduleList.vue'

// const { date } = defineProps<{
//   date: string
// }>()
</script>

<template>
  <div class="md:flex md:gap-4">
    <div class="justify-center items-start hidden md:flex">
      <AppCalendar class="w-[fit-content]" />
    </div>
    <ScheduleList class="flex-1" />
  </div>
</template>

<style scoped></style>
