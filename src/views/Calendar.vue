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
    <div>
      <ScheduleList class="flex-2" />
      <div class="h-[60px]"></div>
      <PastWeekSchedule :date="date" />
    </div>
    <div class="justify-center items-start space-y-5 mx-auto mt-10 md:mt-0 md:block md:w-[280px]">
      <AppCalendar />
      <IntelligentTaskInput />
    </div>
  </div>
</template>

<style scoped></style>
