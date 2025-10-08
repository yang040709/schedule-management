<script setup lang="ts">
import ScheduleItem from './ScheduleItem.vue'
import { useDateStore } from '@/stores/date'
import { useScheduleStore } from '@/stores/schedule'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import TagList from '../Tag/TagList.vue'

const scheduleStore = useScheduleStore()
const { scheduleData } = storeToRefs(scheduleStore)
const dateStore = useDateStore()
console.log(dateStore.selectDate)

// console.log(dateStore.selectDate.toString(), '<==date')
</script>

<template>
  <div>
    <div class="mb-5 flex flex-col gap-2">
      <div class="text-xl font-bold text-gray-900">日程</div>
      <div class="text-md">{{ dateStore.selectDate.toString() }}</div>
      <TagList />
    </div>
    <div class="flex flex-col gap-5">
      <ScheduleItem
        v-for="ev in scheduleData[dateStore.selectDate.toString()]"
        :key="ev.id"
        :event="ev"
        @toggle-complete="(id) => {}"
        @click="(id) => {}"
      />
    </div>
  </div>
</template>

<style scoped></style>
