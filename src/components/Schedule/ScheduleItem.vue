<script setup lang='ts'>
import type { ScheduleEvent } from '@/types/schedule'

const props = defineProps<{ event: ScheduleEvent }>()

const emit = defineEmits<{
  (e: 'toggle-complete', id: string): void
  (e: 'click', id: string): void
}>()

function onToggleComplete(e: Event) {
  e.stopPropagation()
  emit('toggle-complete', props.event.id)
}

function onClickItem() {
  emit('click', props.event.id)
}
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
      <div class="flex items-center gap-2">
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
      </div>
      <div class="mt-1 text-xs text-slate-500">
        {{ event.startTime }} - {{ event.endTime }}
      </div>
    </div>

    <!-- right icon
    <div class="text-slate-400">
      <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z" fill="currentColor" />
      </svg>
    </div> -->
  </div>
</template>

<style scoped>
</style>