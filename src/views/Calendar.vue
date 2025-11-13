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
  <div class="md:flex md:gap-4">
    <div class="justify-center items-start hidden md:flex">
      <AppCalendar class="w-[fit-content]" />
    </div>
    <ScheduleList class="flex-1" />
    <!-- <Button variant="outline" @click="modelStore.addModelOpen = true">新增日程</Button> -->
  </div>
</template>

<style scoped></style>
