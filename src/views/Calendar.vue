<script setup lang="ts">
import AppCalendar from '@/components/AppCalendar.vue'
import ScheduleList from '@/components/Schedule/ScheduleList.vue'
import IntelligentTaskInput from '@/components/IntelligentTaskInput/IntelligentTaskInput.vue'
import { getTodayDate } from '@/utils/date'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PastWeekSchedule from '@/components/Schedule/PastWeekSchedule.vue'
const route = useRoute()
const date = computed(() => route.params.date?.toString() || getTodayDate())

</script>

<template>
  <div class="md:flex md:gap-8 w-1/1">
    <div class="flex flex-1 flex-col gap-[60px]">
      <ScheduleList class="flex-1" />
      <div class="justify-center items-start space-y-[60px] md:hidden">
        <AppCalendar />
        <IntelligentTaskInput />
      </div>
      <PastWeekSchedule :date="date" class="flex-1" />
    </div>
    <div class="justify-center items-start space-y-5 mt-10 hidden md:mt-0 md:block md:w-[280px]">
      <AppCalendar />
      <IntelligentTaskInput />
    </div>
  </div>
</template>

<style scoped></style>
