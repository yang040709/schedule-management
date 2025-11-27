<script setup lang="ts">
import type { Schedule, ScheduleStatus } from '@/types/schedule'
import { computed, ref } from 'vue'
import { Lock, Ban } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import DeleteDialog from './DeleteDialog.vue'
import dayjs from '@/utils/dayjs'
import { getTodayDate } from '@/utils/date'
import { useDetailModelStore } from '@/stores/detailModel'
import Dialog from '../components/Dialog.vue'
import { useRouter } from 'vue-router'
import Skeleton from '../Skeleton/Skeleton.vue'
const router = useRouter()

const props = defineProps<{ item: Schedule }>()
const detailModelStore = useDetailModelStore()

const emit = defineEmits<{
  (e: 'toggle-complete', id: string): void
  (e: 'click', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
  (e: 'generate-ai-suggest', id: string, cb: () => void): void
  (e: 'remove-ai-suggest', id: string): void
  (e: 'cancel', id: string): void
}>()

function onToggleComplete(e: Event) {
  e.stopPropagation()
  emit('toggle-complete', props.item.id)
}

function onClickItem() {
  emit('click', props.item.id)
}

function handleEdit(e: Event) {
  e.stopPropagation()
  emit('edit', props.item.id)
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

const priority = computed(() => {
  return priorityMap[props.item.priority]
})

const relativeSingleTime = computed(() => {
  const date = dayjs(props.item.date).format('YYYY-MM-DD')
  if (date === getTodayDate()) {
    return '今天'
  } else {
    return date
  }
})

// 'done' | 'pending' | 'expired' | 'canceled' | 'in-progress'
type StatusMap = {
  [K in ScheduleStatus]: {
    class: string
    text: string
    color: string
  }
}
const statusMap: StatusMap = {
  done: {
    class: 'px-3 py-1 text-xs font-bold border-1 text-green-600 bg-green-50',
    text: '已完成',
    color: 'green-50',
  },
  pending: {
    class: 'px-3 py-1 text-xs font-bold border-1 text-yellow-600 bg-yellow-100',
    text: '待处理',
    color: 'yellow-100',
  },
  expired: {
    class: 'px-3 py-1 text-xs font-bold border-1 text-red-600 bg-red-50',
    text: '已过期',
    color: 'red-50',
  },
  canceled: {
    class: 'px-3 py-1 text-xs font-bold border-1 text-red-600 bg-red-100',
    text: '已取消',
    color: 'red-100',
  },
  locked: {
    class: 'px-3 py-1 text-xs font-bold border-1 text-gray-600 bg-gray-50',
    text: '已锁定',
    color: 'gray-50',
  },
}


const suggestLoading = ref(false)
const generateAISuggest = async () => {
  emit('generate-ai-suggest', props.item.id, () => {
    suggestLoading.value = false
  })
  suggestLoading.value = true
}

const removeAISuggest = () => {
  emit('remove-ai-suggest', props.item.id)
}

const showDetail = () => {
  detailModelStore.schedule = props.item
  detailModelStore.isOpen = true
}

// 检查是否有未完成的依赖任务
const hasUncompletedDependency = computed(() => {
  return props.item.status === 'locked' || props.item.status === 'canceled'
})

const showInFlow = () => {
  router.push({
    name: 'flow',
    query: {
      id: props.item.id,
    },
  })
}




</script>

<template>
  <div class="flex gap-3 rounded-[10px] border bg-white p-3 shadow-sm hover:bg-gray-50 transition-colors" :class="{
    'canceled-box': props.item.status === 'canceled',
    'locked-box': props.item.status === 'locked',
  }" @click="onClickItem">
    <!-- complete toggle -->
    <div class="relative">
      <button
        class="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
        :class="{
          'border-slate-300': !hasUncompletedDependency,
          'border-gray-300 cursor-not-allowed': hasUncompletedDependency,
          'border-blue-500': item.status === 'done',
        }" aria-label="toggle completed" @click="onToggleComplete" :disabled="hasUncompletedDependency">
        <span class="block h-2.5 w-2.5 rounded-full transition-colors" :class="{
          'bg-blue-500': item.status === 'done',
          'bg-gray-300': hasUncompletedDependency && item.status !== 'done',
        }"></span>
      </button>

      <!-- 依赖未完成提示 -->
      <div v-if="hasUncompletedDependency && item.status !== 'done'"
        class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-300 text-red-700 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        依赖任务未完成
      </div>
    </div>
    <!-- <Button>开始任务</Button> -->
    <!-- <input type="checkbox" :checked="item.status === 'done'" @change="onToggleComplete" /> -->

    <!-- content -->
    <div class="flex-1 md:flex">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <h4 class="truncate text-md font-semibold text-slate-900 flex items-center">
            <Lock v-if="item.status === 'locked'" class="w-4 h-4 mr-2 text-slate-400" />
            <Ban v-if="item.status === 'canceled'" class="w-4 h-4 text-red-500 mr-2" />
            {{ item.title }}
          </h4>
        </div>
        <p v-if="item.description" class="mt-2 text-sm text-slate-500">{{ item.description }}</p>
        <p v-if="item.timeOfDay" class="mt-1 text-sm text-slate-500">
          时间：{{ item.timeOfDay?.startTime }} - {{ item.timeOfDay?.endTime }}
        </p>
        <div class="mt-2 flex gap-x-3 flex-wrap gap-y-2">
          <span v-for="tag in item.category" :key="tag"
            class="shrink-0 rounded-[1px] bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            {{ tag }}
          </span>
          <span class="shrink-0 rounded-[1px] bg-blue-50 px-3 py-1 text-xs font-medium" :class="priority.class">
            {{ priority.text }}
          </span>
          <!-- <span class="px-3 py-1 text-xs font-bold bg-lime-100 text-lime-600" v-if="item.timeOfDay">
          {{ item.timeOfDay?.startTime }} - {{ item.timeOfDay?.endTime }}
        </span> -->
          <span class="px-3 py-1 text-xs font-bold bg-cyan-100 text-cyan-600">
            {{ relativeSingleTime }}
          </span>

          <span :class="statusMap[item.status].class">
            {{ statusMap[item.status].text }}
          </span>
        </div>
        <div v-if="item.dependentSchedule" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2 h-full">
              <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <span class="text-sm font-medium text-blue-800">依赖任务</span>
            </div>
            <div class="text-xs font-medium text-blue-800">ID: {{ item.dependentSchedule.id }}</div>
          </div>

          <div class="space-y-2">
            <!-- 任务标题和状态 -->
            <div class="flex items-center justify-between">
              <h5 class="text-sm font-semibold text-blue-900">{{ item.dependentSchedule.title }}</h5>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="{
                'bg-green-100 text-green-800': item.dependentSchedule.status === 'done',
                'bg-yellow-100 text-yellow-800': item.dependentSchedule.status === 'pending',
                'bg-red-100 text-red-800':
                  item.dependentSchedule.status === 'expired' ||
                  item.dependentSchedule.status === 'canceled',
              }">
                {{
                  item.dependentSchedule.status === 'done'
                    ? '已完成'
                    : item.dependentSchedule.status === 'pending'
                      ? '待处理'
                      : item.dependentSchedule.status === 'expired'
                        ? '已过期'
                        : '已取消'
                }}
              </span>
            </div>
            <div class="space-y-2">
              <span class="text-sm font-medium text-red-600" v-if="item.status === 'locked'">请先完成依赖任务，才能解锁任务 “{{
                item.title }}”</span>
            </div>

            <!-- 任务描述 -->
            <p v-if="item.dependentSchedule.description" class="text-sm text-blue-700">
              {{ item.dependentSchedule.description }}
            </p>

            <!-- 任务时间信息 -->
            <div class="flex flex-wrap gap-2 text-xs">
              <span class="px-2 py-1 rounded-full" :class="{
                'bg-red-100 text-red-700': item.dependentSchedule.priority === 'high',
                'bg-yellow-100 text-yellow-700': item.dependentSchedule.priority === 'medium',
                'bg-green-100 text-green-700': item.dependentSchedule.priority === 'low',
              }">
                {{
                  item.dependentSchedule.priority === 'high'
                    ? '高优先级'
                    : item.dependentSchedule.priority === 'medium'
                      ? '中优先级'
                      : '低优先级'
                }}
              </span>

              <span v-if="item.dependentSchedule.timeOfDay" class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {{ item.dependentSchedule.timeOfDay.startTime }} -
                {{ item.dependentSchedule.timeOfDay.endTime }}
              </span>

              <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                {{
                  item.dependentSchedule.date === getTodayDate()
                    ? '今天'
                    : item.dependentSchedule.date
                }}
              </span>
            </div>

            <!-- 任务分类标签 -->
            <div v-if="item.dependentSchedule.category && item.dependentSchedule.category.length > 0"
              class="flex flex-wrap gap-1">
              <span v-for="tag in item.dependentSchedule.category" :key="tag"
                class="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4 text-xs text-slate-500 bg-slate-100 p-2 rounded-md" v-if="item.AIsuggestion || suggestLoading">
          <div v-if="suggestLoading">
            <span class="font-medium">行动建议加载中...</span>
            <Skeleton class="w-full h-4" />
            <Skeleton class="w-full h-4 mt-1" />
          </div>
          <div v-else-if="item.AIsuggestion">
            <span class="font-medium">行动建议：</span>
            {{ item.AIsuggestion }}
          </div>
        </div>
        <div class="mt-4 flex gap-2 flex-wrap">
          <button class="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition-colors"
            @click="handleEdit">
            编辑
          </button>
          <button class="px-3 py-1 bg-[#3B82F6] text-white rounded text-sm hover:bg-[#3B82F6]/90 transition-colors"
            @click="showDetail">
            详情
          </button>
          <button
            class="px-3 py-1 bg-[#3B82F6] text-white rounded text-sm hover:bg-[#3B82F6]/90 transition-colors hidden md:block"
            @click="showInFlow">
            流程图
          </button>
          <!-- <button
          class="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition-colors"
        >
          其他操作
        </button> -->
          <Popover>
            <PopoverTrigger @click.stop class="h-fit">
              <span class="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition-colors">
                其他操作
              </span>
            </PopoverTrigger>
            <PopoverContent class="w-auto">
              <div class="flex flex-col gap-3">
                <Button variant="secondary" @click="generateAISuggest">生成行动建议</Button>
                <Button variant="secondary" @click="removeAISuggest">移除行动建议</Button>
                <Dialog title="永久取消日程" desc="确定要永久取消这个日程吗？注意取消后无法恢复日程" @confirm="$emit('cancel', item.id)" />
                <Dialog title="删除日程" desc="确定要删除这个日程吗？" @confirm="$emit('delete', item.id)" />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <!-- <Button>开始任务</Button> -->
      </div>
      <div class="flex flex-col mt-4 md:mt-0">
        <span class="text-xs text-gray-500">ID: {{ item.id }}</span>
      </div>
    </div>

    <!-- <div class="flex flex-col justify-center">
      <Popover>
        <PopoverTrigger @click.stop class="h-fit">
          <span class="bg-slate-100 py-2 px-8 rounded-md font-medium text-center"> 操作 </span>
        </PopoverTrigger>
        <PopoverContent class="w-auto">
          <div class="flex flex-col gap-3">
            <Button variant="secondary" @click="generateAISuggest">生成行动建议</Button>
            <Button variant="secondary" @click="removeAISuggest">移除行动建议</Button>
            <Button variant="secondary" @click="handleEdit">编辑</Button>
            <DeleteDialog @confirm="$emit('delete', item.id)">
              <Button variant="destructive">删除</Button>
            </DeleteDialog>
          </div>
        </PopoverContent>
      </Popover>
    </div> -->
  </div>
</template>

<style scoped>
.locked-box {
  background-color: #f7f5f5;
}

.canceled-box {
  background-color: #fff4f4;
}
</style>
