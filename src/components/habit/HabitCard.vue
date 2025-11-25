<script setup lang="ts">
import { ref } from 'vue'
import { Pencil, Trash, Check, Ellipsis, Ban } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import CheckInDialog from './CheckInDialog.vue'
import type { TodayHabit, CheckInForm } from '@/types/habit'

interface Props {
  habit: TodayHabit
  onEdit: (habit: TodayHabit) => void
  onDelete: (habitId: string) => void
  onCancelCheckIn: (habitId: string) => void
}

interface Emits {
  (e: 'checkIn', form: CheckInForm): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 打卡弹窗状态
const checkInDialogOpen = ref(false)

// 处理打卡按钮点击
const handleCheckInClick = () => {
  checkInDialogOpen.value = true
}

// 处理打卡表单提交
const handleCheckInSubmit = (form: CheckInForm) => {
  emit('checkIn', form)
}

// 获取进度百分比
const getProgressPercentage = (habit: TodayHabit) => {
  return Math.min((habit.stats.currentStreak / habit.goal.targetDays) * 100, 100)
}

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
  <div
    class="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-blue-200 flex flex-col h-full">
    <!-- 标题和标签区域 -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="font-bold text-lg text-gray-900 mb-1">{{ habit.title }}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">{{ habit.description }}</p>
      </div>
      <div class="flex flex-col items-end space-y-1 ml-3">
        <span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
          {{ getFrequencyText(habit.frequency) }}
        </span>
        <span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
          {{ habit.goal.durationMinutes }}分钟
        </span>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="mb-4">
      <div class="flex justify-between text-sm text-gray-700 mb-2">
        <span class="font-medium">进度 {{ habit.stats.totalCompleted }}/{{ habit.goal.targetDays }}天</span>
        <span class="font-semibold text-blue-600">{{ Math.round(getProgressPercentage(habit)) }}%</span>
      </div>
      <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
          :style="{ width: `${getProgressPercentage(habit)}%` }"></div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-3 gap-2 mb-4">
      <div class="text-center p-2 bg-gray-50 rounded-lg">
        <div class="text-sm font-semibold text-blue-600">
          {{ habit.stats.currentStreak }}
        </div>
        <div class="text-xs text-gray-500">连续</div>
      </div>
      <div class="text-center p-2 bg-gray-50 rounded-lg">
        <div class="text-sm font-semibold text-purple-600">
          {{ habit.stats.longestStreak }}
        </div>
        <div class="text-xs text-gray-500">最长</div>
      </div>
      <div class="text-center p-2 bg-gray-50 rounded-lg">
        <div class="text-sm font-semibold text-green-600">{{ habit.stats.successRate }}%</div>
        <div class="text-xs text-gray-500">成功率</div>
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div class="mt-auto pt-4 border-t border-gray-200">
      <div class="flex space-x-2 items-center">
        <Button v-if="!habit.completed" @click="handleCheckInClick" aria-describedby="打卡日程"
          class="h-10 flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center">
          <Check class="mr-2" />
          打卡
        </Button>
        <template v-else>
          <div
            class="h-10 text-[14px] flex-1 border-1 ont-semibold py-2.5 rounded-lg transform shadow-md flex items-center justify-center">
            已打卡
          </div>
        </template>

        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline">
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="flex flex-col w-fit gap-3">
            <Button v-if="habit.completed" @click="onCancelCheckIn(habit.id)"
              class="h-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 transform shadow-md hover:shadow-lg flex items-center justify-center">
              <Ban class="mr-2" />
              取消打卡
            </Button>
            <Button @click="onEdit(habit)" variant="outline"
              class="px-3 border-blue-200 text-blue-600 hover:bg-blue-50 h-10 flex items-center justify-center">
              <Pencil class="mr-2" />
              编辑习惯
            </Button>
            <Button @click="onDelete(habit.id)" variant="outline"
              class="px-3 border-red-200 text-red-600 hover:bg-red-50 h-10 flex items-center justify-center">
              <Trash class="mr-2" />
              删除习惯
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <!-- 打卡弹窗 -->
    <CheckInDialog :open="checkInDialogOpen" :habit-id="habit.id" :habit-title="habit.title"
      :default-duration="habit.goal.durationMinutes" @update:open="checkInDialogOpen = $event"
      @submit="handleCheckInSubmit" />
  </div>
</template>
