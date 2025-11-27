<script setup lang='ts'>
import { useFetchData } from '@/hooks/useFetchData';
import type { ScheduleListQuery, ScheduleListResponse } from '@/types/schedule';
import { ref, watch } from 'vue';
import { getTodayDate } from '@/utils/date';
import dayjs from 'dayjs';
import SampleScheduleItem from './SampleScheduleItem.vue';
import { getScheduleListApi } from '@/api/schedule';

interface PastWeekScheduleProps {
  date?: string
}
const { date = getTodayDate() } = defineProps<PastWeekScheduleProps>()

const lastOneDay = (date: string) => {
  return dayjs(date).subtract(1, 'day').format('YYYY-MM-DD')
}
// 过去七天
const lastSevenDays = (date: string) => {
  return dayjs(date).subtract(7, 'day').format('YYYY-MM-DD')
}

const scheduleQuery = ref<ScheduleListQuery>({
  dateRangeStartDate: lastSevenDays(date),
  dateRangeEndDate: lastOneDay(date),
  status: "pending",
})
/* 
  如果传入的date发生变化则变化
*/
watch(() => date, () => {
  scheduleQuery.value.dateRangeStartDate = lastSevenDays(date)
  scheduleQuery.value.dateRangeEndDate = lastOneDay(date)
  fetchData()
})

const initialVal: ScheduleListResponse = {
  total: 0,
  data: [],
}

const { data, fetchData, loading } = useFetchData(getScheduleListApi, [scheduleQuery], initialVal)

fetchData()
</script>

<template>
  <transition name="page-fade">
    <div class='rounded-2xl bg-white shadow-sm border ring-1 ring-gray-100 p-4 sm:p-5'
      v-if="data.data.length > 0 && !loading">
      <div class="text-lg font-bold text-gray-600 mb-3">过去七天，您未完成的任务有 </div>
      <div class="flex flex-col gap-5">
        <SampleScheduleItem v-for="item in data.data" :key="item.id" :schedule="item" />
      </div>
    </div>
  </transition>

</template>

<style scoped></style>