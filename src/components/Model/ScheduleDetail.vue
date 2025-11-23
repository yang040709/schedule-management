<script setup lang="ts">
import { useDetailModelStore } from '@/stores/detailModel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { storeToRefs } from 'pinia'
import dayjs from '@/utils/dayjs'
import { getTodayDate } from '@/utils/date'
import { computed } from 'vue'
import type { ScheduleStatus } from '@/types/schedule'
import { useEditModelStore } from '@/stores/editModel'

const detailModelStore = useDetailModelStore()
const { schedule, isOpen } = storeToRefs(detailModelStore)

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

const relativeSingleTime = computed(() => {
  const date = dayjs(schedule.value.date).format('YYYY-MM-DD')
  if (date === getTodayDate()) {
    return '今天'
  } else {
    return date
  }
})
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

const editModelStore = useEditModelStore()

const handleEditClick = () => {
  editModelStore.editModelOpen = true
  editModelStore.editModelInfo = schedule.value
}


const createdAt = computed(() => {
  return dayjs(schedule.value.createdAt).format('YYYY-MM-DD HH:mm:ss')
})

const updatedAt = computed(() => {
  return dayjs(schedule.value.updatedAt).format('YYYY-MM-DD HH:mm:ss')
})

</script>

<template>
  <!-- 日程详情卡片 -->
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] h-[90vh] overflow-hidden block">
      <DialogHeader>
        <DialogTitle>日程详情</DialogTitle>
        <DialogDescription> 查看日程详情 </DialogDescription>
      </DialogHeader>
      <div class="w-full mt-8 mx-auto bg-white rounded-lg shadow p-6 border border-gray-100">
        <!-- 标题区 -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span :class="statusMap[schedule.status].class"
              class="inline-block px-3 py-2 text-xs font-medium rounded-full">
              {{ statusMap[schedule.status].text }}
            </span>
            <h1 class="text-xl font-semibold text-gray-900">{{ schedule.title }}</h1>
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

        <!-- 操作按钮
        <div class="flex gap-3 pt-3 border-t border-gray-100">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition"
            @click="handleEditClick">
            编辑
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition">
            标记为完成
          </button>
          <button
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition">
            取消
          </button>
        </div> -->

        <!-- 元信息（可选折叠） -->
        <div class="mt-6 pt-4 text-xs text-gray-500 border-t border-gray-100 space-y-1">
          <div><span class="font-medium">创建时间：</span> {{ createdAt }}</div>
          <div><span class="font-medium">最后更新：</span> {{ updatedAt }}</div>
          <div><span class="font-medium">日期：</span> {{ schedule.date }}</div>
          <div><span class="font-medium" v-if="schedule.dependentSchedule">依赖任务 ID：</span>
            {{ schedule.dependentSchedule?.id }}</div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
