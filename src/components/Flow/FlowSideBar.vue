<script setup lang='ts'>
import { ref } from 'vue';
import ScheduleNode from './ScheduleNode.vue';
import useDragAndDrop from '@/hooks/useDnD';
import NodeTemplate from './NodeTemplate.vue';
import type { ScheduleEvent } from '@/types/schedule';
import Button from '../ui/button/Button.vue';
const data = ref({
  label: "侧边栏"
});
const { onDragStart } = useDragAndDrop();

const emit = defineEmits<{
  save: [],
  reset: [],
}>()

const schedule = ref<ScheduleEvent>(
  {
    "id": "no-id",
    "title": "请您制定日程的流程",
    "priority": "low",
    "category": [
      "规划",
      '制定',
      '计划',
      '流程',
    ],
    "completed": false,
    "date": "2025-10-06"
  },
)
</script>

<template>
  <div class="w-56 border-r border-gray-200  bg-white shadow-sm flex flex-col justify-between">
    <!-- <ScheduleNode :data="data" /> -->
    <div class="p-4">
      <p class="text-sm text-gray-500 mb-4">您可以拖动下面节点到面板中</p>
      <NodeTemplate :schedule="schedule" class="mt-4 hover:bg-gray-50 cursor-move transition-colors" :draggable="true"
        @dragstart="onDragStart($event, 'schedule')" :only-view="true" />
    </div>
    <div class="flex p-4 justify-between gap-10 border-t border-gray-200 pt-4">
      <Button class="flex-1" @click="emit('save')">保存</Button>
      <Button variant="secondary" class="flex-1" @click="emit('reset')">重置</Button>
    </div>
  </div>
</template>

<style scoped></style>