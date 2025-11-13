<script setup lang="ts">
import AppCalendar from '@/components/AppCalendar.vue'
import ScheduleList from '@/components/Schedule/ScheduleList.vue'
import { Button } from '@/components/ui/button'
import { useModelStore } from '@/stores/model'
// const { date } = defineProps<{
//   date: string
// }>()
const modelStore = useModelStore()
</script>

<template>
  <div class="md:flex md:gap-8">
    <ScheduleList class="flex-2" />
    <div class="justify-center items-start mx-auto mt-10 md:mt-0 md:block md:w-[280px]">
      <AppCalendar />
    </div>
  </div>
</template>

<style scoped></style>
