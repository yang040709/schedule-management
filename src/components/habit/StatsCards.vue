<script setup lang="ts">
import type { AllStats } from '@/types/habit'

interface Stats extends AllStats {
  todayHabits: number
  completedTodayHabits: number
}

interface Props {
  stats: Stats
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="text-2xl font-bold text-blue-600">{{ stats.todayHabits }}</div>
      <div class="text-gray-600 text-sm">今日习惯数</div>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="text-2xl font-bold text-green-600">{{ stats.completedTodayHabits }}</div>
      <div class="text-gray-600 text-sm">今日完成</div>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="text-2xl font-bold text-purple-600">{{ stats.totalCheckedIn }}</div>
      <div class="text-gray-600 text-sm">总打卡数</div>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="text-2xl font-bold text-orange-600">{{ stats.avgSuccessRate }}%</div>
      <div class="text-gray-600 text-sm">平均成功率</div>
    </div>
  </div>
</template>
