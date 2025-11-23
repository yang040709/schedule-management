<script setup lang='ts'>
import type { Schedule, ScheduleStatus } from '@/types/schedule';
import { getTodayDate } from '@/utils/date';
import dayjs from 'dayjs';
import { computed } from 'vue';
import { useRouter } from 'vue-router';


interface ScheduleProps {
  schedule: Schedule
}
const { schedule } = defineProps<ScheduleProps>()

type StatusMap = {
  [K in ScheduleStatus]: {
    class: string
    text: string
    color: string
  }
}
const statusMap: StatusMap = {
  done: {
    class: 'text-green-600 bg-green-50',
    text: '已完成',
    color: 'green-50',
  },
  pending: {
    class: 'text-yellow-600 bg-yellow-100',
    text: '待处理',
    color: 'yellow-100',
  },
  expired: {
    class: 'text-red-600 bg-red-50',
    text: '已过期',
    color: 'red-50',
  },
  canceled: {
    class: 'text-red-600 bg-red-100',
    text: '已取消',
    color: 'red-100',
  },
  locked: {
    class: 'text-gray-600 bg-gray-50',
    text: '已锁定',
    color: 'gray-50',
  },
}

const priorityMap = {
  high: {
    class: 'text-red-700 bg-red-100',
    text: '高优先级',
  },
  medium: {
    class: 'text-yellow-700 bg-yellow-100',
    text: '中优先级',
  },
  low: {
    class: 'text-green-700 bg-green-100',
    text: '低优先级',
  },
}

const createdAt = computed(() => {
  return dayjs(schedule.createdAt).format('YYYY-MM-DD HH:mm:ss')
})

const updatedAt = computed(() => {
  return dayjs(schedule.updatedAt).format('YYYY-MM-DD HH:mm:ss')
})


const relativeSingleTime = computed(() => {
  const date = dayjs(schedule.date).format('YYYY-MM-DD')
  if (date === getTodayDate()) {
    return '今天'
  } else {
    return date
  }
})

const router = useRouter();
const navToTargetDay = () => {
  router.push({
    name: "calendar",
    params: {
      date: dayjs(schedule.date).format('YYYY-MM-DD'),
    }
  })
}

</script>

<template>
  <div class=''>
    <div class="w-full mx-auto bg-white rounded-lg shadow p-6 border border-gray-100">
      <!-- 标题区 -->
      <div class="flex items-center justify-between mb-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span :class="statusMap[schedule.status].class"
            class="inline-block px-3 py-2 text-xs font-medium rounded-full">
            {{ statusMap[schedule.status].text }}
          </span>
          <div class="cursor-pointer hover:text-blue-600 font-semibold text-gray-900 transition-colors"
            @click="navToTargetDay">{{
              schedule.title }}</div>
        </div>
        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {{ schedule.id }}</span>
      </div>

      <!-- 描述 -->
      <p class="text-gray-700 mb-4">{{ schedule.description }}</p>

      <!-- 标签区 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <!-- 分类标签 -->
        <span v-for="item in schedule.category" :key="item"
          class="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {{ item }}
        </span>
        <!-- 优先级标签 -->
        <span class="px-2.5 py-1 text-xs font-medium rounded-full" :class="priorityMap[schedule.priority].class">{{
          priorityMap[schedule.priority].text }}</span>

        <!-- 时间段 -->
        <span v-if="schedule.timeOfDay"
          class="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">{{
            schedule.timeOfDay.startTime }} - {{ schedule.timeOfDay.endTime }}</span>
        <!-- 创建时间（示例：1个月前） -->
        <span class="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">{{
          relativeSingleTime
        }}</span>
      </div>
      <!-- AI 建议 -->
      <div class="mb-5" v-if="schedule.AIsuggestion && schedule.AIsuggestion.trim() !== ''">
        <p class="text-gray-600 text-sm">
          <span class="font-medium text-gray-800">行动建议：</span>
          <span class="text-gray-500">{{ schedule.AIsuggestion }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>