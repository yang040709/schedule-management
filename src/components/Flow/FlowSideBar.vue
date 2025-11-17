<script setup lang="ts">
import { ref, watch } from 'vue'
import ScheduleNode from './ScheduleNode.vue'
import useDragAndDrop from '@/hooks/useDnD'
import NodeTemplate from './NodeTemplate.vue'
// import type { ScheduleEvent } from '@/types/schedule'
import type { Schedule } from '@/types/schedule'
import { useAddModelStore } from '@/stores/addModel'
import Button from '../ui/button/Button.vue'
import { cloneDeep } from 'lodash-es'
import { getScheduleInitialData } from '@/constant'
import { toast } from 'vue-sonner'
import IntelligentTaskInput from '../IntelligentTaskInput/IntelligentTaskInput.vue'
import { useDragStore } from '@/stores/drag'
import { storeToRefs } from 'pinia'
const data = ref({
  label: '侧边栏',
})
// const { onDragStart } = useDragAndDrop(() => {
//   console.log('drop success<====')
//   schedule.value = null
// })
const dragStore = useDragStore()

const { onDragStart } = dragStore
const { scheduleList } = storeToRefs(dragStore)

const emit = defineEmits<{
  save: []
  reset: []
}>()

const addModelStore = useAddModelStore()

watch(
  () => addModelStore.addResponse,
  (newVal) => {
    // console.log(newVal, 'change')
    // schedule.value = cloneDeep(newVal)
    scheduleList.value.push(newVal)
  },
)

// const handleDragEnd = (event: DragEvent) => {
//   console.log(event, '<===DragEnd event', event.target)
//   // schedule.value = null
// }
</script>

<template>
  <div class="w-[320px] border-r border-gray-200 bg-white shadow-sm flex flex-col relative">
    <!-- <ScheduleNode :data="data" /> -->
    <div class="mb-[75px] overflow-y-scroll" style="max-height: calc(100vh - 56px)">
      <div class="p-4 border-b">
        <h2 class="font-bold text-lg">添加日程节点</h2>
        <p class="text-sm text-gray-500 mt-4 mb-2">填写表单添加日程</p>
        <Button variant="outline" @click="addModelStore.addModelOpen = true" class="w-full"
          >填写表单添加日程</Button
        >
        <p class="text-sm text-gray-500 mt-4 mb-2">快速添加日程</p>
        <IntelligentTaskInput />
      </div>
      <div class="p-4" v-if="scheduleList.length > 0">
        <h2 class="font-bold text-lg">可使用的日程节点</h2>
        <p class="text-sm text-gray-500 mb-2">您可以拖动下面日程节点到面板中</p>
        <p class="text-sm text-gray-500 mb-2">建立日程间的联系</p>
        <div></div>
        <NodeTemplate
          v-for="schedule in scheduleList"
          :key="schedule.id"
          :schedule="schedule"
          class="mt-4 hover:bg-gray-50 cursor-move transition-colors"
          :draggable="true"
          @dragstart="onDragStart($event, 'schedule', schedule)"
          :only-view="true"
        />
      </div>
    </div>

    <div
      class="h-[70px] flex p-4 justify-between bg-white gap-10 border-t border-gray-200 fixed bottom-0 left-0 w-[320px]"
    >
      <Button class="flex-1" @click="emit('save')">保存</Button>
      <Button variant="secondary" class="flex-1" @click="emit('reset')">重置</Button>
    </div>
  </div>
</template>

<style scoped></style>
