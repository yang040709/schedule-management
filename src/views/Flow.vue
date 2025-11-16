<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { Background } from '@vue-flow/background'
import ScheduleNode from '@/components/Flow/ScheduleNode.vue'
import FlowSideBar from '@/components/Flow/FlowSideBar.vue'
import { ref, nextTick } from 'vue'
import useDragAndDrop from '@/hooks/useDnD'
import type { Schedule, ScheduleForm } from '@/types/schedule'
import { getTemplateId } from '@/utils'
import { toast } from 'vue-sonner'
import { getTodayDate } from '@/utils/date'
import { useScheduleStore } from '@/stores/schedule'
import { useRouter } from 'vue-router'
import { APP_CONFIG } from '@/config/app'

// const scheduleStore = useScheduleStore()
const router = useRouter()

const node1Id = getTemplateId()
const node2Id = getTemplateId()
const getDefaultNodes: () => Node<ScheduleForm>[] = () => {
  return [
    {
      id: node1Id,
      type: 'schedule',
      position: { x: 0, y: 0 },
      data: {
        title: '周计划制定',
        description: '制定周计划，包括工作和规划',
        priority: 'medium',
        category: ['工作', '规划'],
        date: getTodayDate(),
        // completed: false,
        // state:"",
      },
    },
    {
      id: node2Id,
      type: 'schedule',
      position: { x: 350, y: 280 },
      data: {
        title: '拖拽右侧的节点到面板中',
        description: '这样就可以添加您的日程',
        priority: 'low',
        category: ['工作', '规划'],
        date: getTodayDate(),
      },
    },
  ]
}
const getDefauleEdges: () => Edge[] = () => {
  return [{ id: getTemplateId(), source: node1Id, target: node2Id, markerEnd: 'arrowclosed' }]
}

const nodes = ref<Node<ScheduleForm>[]>(getDefaultNodes())
const edges = ref<Edge[]>(getDefauleEdges())

const { onConnect, addEdges, fitView, nodes: vueFlowNodes } = useVueFlow()

onConnect((params) => {
  console.log('connect', params)
  addEdges([{ ...params, id: getTemplateId(), markerEnd: 'arrowclosed' }])
})

const { onDrop, onDragOver, onDragLeave, isDragOver } = useDragAndDrop()

const isSave = ref(false)
const handleSave = () => {
  if (isSave.value) {
    return
  }
  isSave.value = true
  nodes.value.forEach((node) => {
    if (!node.data) {
      return
    }
    // scheduleStore.setScheduleData(node.data)
  })
  toast.success('保存成功，1秒后跳转到日历页')
  setTimeout(() => {
    router.push('/')
    isSave.value = false
  }, 1000)
}
const handleReset = async () => {
  nodes.value = getDefaultNodes()
  edges.value = getDefauleEdges()
  await nextTick()
  fitView()
  toast.success('重置成功')
}

const defaultViewport = {
  zoom: 0.8,
  x: 100,
  y: 100,
}
</script>

<template>
  <div class="flex w-full border-1" @drop="onDrop">
    <!-- :style="{ height: `calc(100vh - ${APP_CONFIG.HeaderHeight})` }" -->
    <FlowSideBar class="w-1/4" @save="handleSave" @reset="handleReset" />

    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :default-viewport="defaultViewport"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      :style="{
        backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
        transition: 'background-color 0.2s ease',
        height: `calc(100vh - ${APP_CONFIG.HeaderHeight + 3}px)`,
      }"
      class="flex-1"
    >
      <Background />
      <!-- <Controls /> -->
      <!-- <MiniMap /> -->
      <template #node-schedule="props">
        <ScheduleNode v-bind="props" />
      </template>
    </VueFlow>
  </div>
</template>

<style scoped>
.vue-flow {
  /* flex: 1; */
  /* height: calc; */
}

/* width: 600px; */
</style>
