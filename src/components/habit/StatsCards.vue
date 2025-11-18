<script setup lang="ts">
interface Props {
  stats: {
    totalHabits: number
    completedToday: number
    totalStreak: number
    avgSuccessRate: number
  }
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="text-2xl font-bold text-blue-600">{{ stats.totalHabits }}</div>
      <div class="text-gray-600 text-sm">总习惯数</div>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="text-2xl font-bold text-green-600">{{ stats.completedToday }}</div>
      <div class="text-gray-600 text-sm">今日完成</div>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="text-2xl font-bold text-purple-600">{{ stats.totalStreak }}</div>
      <div class="text-gray-600 text-sm">总连续天数</div>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6 border">
      <div class="text-2xl font-bold text-orange-600">{{ stats.avgSuccessRate }}%</div>
      <div class="text-gray-600 text-sm">平均成功率</div>
    </div>
  </div>
</template>
