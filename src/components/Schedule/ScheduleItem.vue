<script setup lang="ts">
import type { ScheduleEvent } from '@/types/schedule'
import { computed } from 'vue'
import { List } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import DeleteDialog from './DeleteDialog.vue'
const props = defineProps<{ event: ScheduleEvent }>()

const emit = defineEmits<{
  (e: 'toggle-complete', id: string): void
  (e: 'click', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()

function onToggleComplete(e: Event) {
  e.stopPropagation()
  emit('toggle-complete', props.event.id)
}

function onClickItem() {
  emit('click', props.event.id)
}

function handleEdit(e: Event) {
  e.stopPropagation()
  emit('edit', props.event.id)
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
  return priorityMap[props.event.priority]
})
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm hover:bg-gray-50 transition-colors"
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
        :class="event.completed ? 'bg-blue-500' : ''"
      ></span>
    </button>

    <!-- content -->
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2 flex-wrap">
        <h4
          class="truncate text-sm font-semibold text-slate-900"
          :class="{ 'line-through text-slate-400': event.completed }"
        >
          {{ event.title }}
        </h4>
        <span
          v-for="tag in event.category"
          :key="tag"
          class="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600"
        >
          {{ tag }}
        </span>
        <span
          class="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium"
          :class="priority.class"
        >
          {{ priority.text }}
        </span>
      </div>
      <p v-if="event.description" class="mt-2 text-sm text-slate-500">{{ event.description }}</p>
      <div class="mt-1 text-xs text-slate-500" v-if="event.startTime && event.endTime">
        {{ event.startTime }} - {{ event.endTime }}
      </div>
    </div>
    <Popover>
      <PopoverTrigger @click.stop> <List class="font-md text-slate-400 mr-1" /> </PopoverTrigger>
      <PopoverContent class="w-auto">
        <div class="flex flex-col gap-3">
          <Button variant="secondary" @click="handleEdit">编辑</Button>
          <DeleteDialog @confirm="$emit('delete', event.id)">
            <Button variant="destructive" @click.prevent>删除</Button>
          </DeleteDialog>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<style scoped></style>
