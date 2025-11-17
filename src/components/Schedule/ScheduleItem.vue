<script setup lang="ts">
import type { Schedule, ScheduleStatus } from '@/types/schedule'
import { computed } from 'vue'
import { List } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import DeleteDialog from './DeleteDialog.vue'
import dayjs from '@/utils/dayjs'
import { getTodayDate } from '@/utils/date'
import { useDetailModelStore } from '@/stores/detailModel'

const props = defineProps<{ item: Schedule }>()
const detailModelStore = useDetailModelStore()

const emit = defineEmits<{
  (e: 'toggle-complete', id: string): void
  (e: 'click', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
  (e: 'generate-ai-suggest', id: string): void
  (e: 'remove-ai-suggest', id: string): void
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
  if (props.item.date === getTodayDate()) {
    return '今天'
  } else {
    return dayjs().to(dayjs(props.item.date))
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
}

const generateAISuggest = async () => {
  emit('generate-ai-suggest', props.item.id)
}

const removeAISuggest = () => {
  emit('remove-ai-suggest', props.item.id)
}

const showDetail = () => {
  console.log('showDetail')

  detailModelStore.schedule = props.item
  detailModelStore.isOpen = true
}

// const
</script>

<template>
  <div
    class="flex gap-3 rounded-[10px] border bg-white p-3 shadow-sm hover:bg-gray-50 transition-colors"
    @click="onClickItem"
  >
    <!-- complete toggle -->
    <button
      class="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-300 text-slate-400 hover:border-blue-500 hover:text-blue-500"
      aria-label="toggle completed"
      @click="onToggleComplete"
    >
      <span
        class="block h-2.5 w-2.5 rounded-full"
        :class="item.status === 'done' ? 'bg-blue-500' : ''"
      ></span>
    </button>
    <!-- <Button>开始任务</Button> -->
    <!-- <input type="checkbox" :checked="item.status === 'done'" @change="onToggleComplete" /> -->

    <!-- content -->
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2 flex-wrap">
        <h4
          class="truncate text-sm font-semibold text-slate-900"
          :class="{ 'line-through text-slate-400': item.status === 'done' }"
        >
          {{ item.title }}
        </h4>
      </div>
      <p v-if="item.description" class="mt-2 text-sm text-slate-500">{{ item.description }}</p>
      <p v-if="item.dependentId" class="mt-2 text-sm text-slate-500">
        依赖任务：{{ item.dependentId }}
      </p>
      <p v-if="item.timeOfDay" class="mt-1 text-sm text-slate-500">
        时间：{{ item.timeOfDay?.startTime }} - {{ item.timeOfDay?.endTime }}
      </p>
      <div class="mt-2 flex gap-x-3 flex-wrap gap-y-2">
        <span
          v-for="tag in item.category"
          :key="tag"
          class="shrink-0 rounded-[1px] bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
        >
          {{ tag }}
        </span>
        <span
          class="shrink-0 rounded-[1px] bg-blue-50 px-3 py-1 text-xs font-medium"
          :class="priority.class"
        >
          {{ priority.text }}
        </span>
        <!-- <span class="px-3 py-1 text-xs font-bold bg-lime-100 text-lime-600" v-if="item.timeOfDay">
          {{ item.timeOfDay?.startTime }} - {{ item.timeOfDay?.endTime }}
        </span> -->
        <!-- <span class="px-3 py-1 text-xs font-bold bg-cyan-100 text-cyan-600">
          {{ relativeSingleTime }}
        </span> -->

        <span :class="statusMap[item.status].class">
          {{ statusMap[item.status].text }}
        </span>
      </div>
      <!-- <div class="mt-2 flex gap-x-2">
        <span class="px-3 py-1 text-xs font-bold bg-lime-100 text-lime-600" v-if="item.timeOfDay">
          {{ item.timeOfDay?.startTime }} - {{ item.timeOfDay?.endTime }}
        </span>
        <span
          v-if="item.scheduleType === 'single'"
          class="px-3 py-1 text-xs font-bold bg-cyan-100 text-cyan-600"
        >
          {{ item.singleDate }}
        </span>
        <span
          v-if="item.scheduleType === 'daily'"
          class="px-3 py-1 text-xs font-bold bg-cyan-100 text-cyan-600"
        >
          11/20 - 12/1
        </span>
      </div> -->
      <div class="mt-4 text-xs text-slate-500 bg-slate-100 p-2 rounded-md" v-if="item.AIsuggestion">
        <span class="font-medium">行动建议：</span>
        {{ item.AIsuggestion }}
      </div>
      <div class="mt-4 flex gap-2 flex-wrap">
        <button
          class="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition-colors"
          @click="handleEdit"
        >
          编辑
        </button>
        <button
          class="px-3 py-1 bg-[#3B82F6] text-white rounded text-sm hover:bg-[#3B82F6]/90 transition-colors"
          @click="showDetail"
        >
          详情
        </button>
        <!-- <button
          class="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition-colors"
        >
          其他操作
        </button> -->
        <Popover>
          <PopoverTrigger @click.stop class="h-fit">
            <span
              class="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              其他操作
            </span>
          </PopoverTrigger>
          <PopoverContent class="w-auto">
            <div class="flex flex-col gap-3">
              <Button variant="secondary" @click="generateAISuggest">生成行动建议</Button>
              <Button variant="secondary" @click="removeAISuggest">移除行动建议</Button>
              <!-- <Button variant="secondary" @click="handleEdit">编辑</Button> -->
              <DeleteDialog @confirm="$emit('delete', item.id)">
                <Button variant="destructive">删除</Button>
              </DeleteDialog>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <!-- <Button>开始任务</Button> -->
    </div>
    <div class="flex flex-col">
      <span class="text-xs text-gray-500">ID: {{ item.id }}</span>
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

<style scoped></style>
