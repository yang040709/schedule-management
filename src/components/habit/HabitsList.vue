<script setup lang="ts">
import type { Habit } from '@/types/habit'

interface Props {
  habits: Habit[]
}

defineProps<Props>()

// 获取频率显示文本
const getFrequencyText = (frequency: string) => {
  const frequencyMap = {
    daily: '每日',
    weekly: '每周',
    monthly: '每月',
  }
  return frequencyMap[frequency as keyof typeof frequencyMap] || frequency
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border">
    <div class="p-6 border-b">
      <h2 class="text-xl font-semibold text-gray-900">习惯列表</h2>
    </div>
    <div class="p-6">
      <div v-if="habits.length === 0" class="text-center py-4">
        <p class="text-gray-500">暂无习惯</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="habit in habits"
          :key="habit.id"
          class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
        >
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 rounded-full bg-blue-500"></div>
            <div>
              <div class="font-medium text-sm">{{ habit.title }}</div>
              <div class="text-xs text-gray-500">{{ getFrequencyText(habit.frequency) }}</div>
            </div>
          </div>
          <div class="text-sm font-medium text-green-600">{{ habit.stats.successRate }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>
