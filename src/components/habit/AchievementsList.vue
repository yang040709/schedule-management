<script setup lang="ts">
import type { Achievement } from '@/types/habit'

interface Props {
  achievements: Achievement[]
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border">
    <div class="p-6 border-b">
      <h2 class="text-xl font-semibold text-gray-900">成就</h2>
    </div>
    <div class="p-6">
      <div v-if="achievements.length === 0" class="text-center py-4">
        <p class="text-gray-500">暂无成就</p>
      </div>
      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="achievement in achievements.slice(0, 4)"
          :key="achievement.id"
          class="text-center p-3 border rounded-lg"
          :class="
            achievement.isUnlocked
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-gray-50 border-gray-200 opacity-50'
          "
        >
          <div class="text-2xl mb-2">{{ achievement.icon }}</div>
          <div class="text-sm font-medium">{{ achievement.name }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ achievement.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
