<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import ScheduleNode from '@/components/Flow/ScheduleNode.vue'
import FlowSideBar from '@/components/Flow/FlowSideBar.vue'
import { ref, nextTick, watch } from 'vue'
import type { FlowScheduleForm, Schedule } from '@/types/schedule'
import { getTemplateId } from '@/utils'
import { toast } from 'vue-sonner'
import { getTodayDate } from '@/utils/date'
import { useRouter } from 'vue-router'
import { APP_CONFIG } from '@/config/app'
import { useDragStore } from '@/stores/drag'
import { useEditModelStore } from '@/stores/editModel'
import { useFetchData } from '@/hooks/useFetchData'
import { modifyScheduleApi } from '@/api/schedule'
import { getScheduleInitialData } from '@/constant'
import eventBus from '@/utils/eventBus'
import { getScheduleFlowApi } from '@/api/schedule'
import { useRoute } from 'vue-router'


const nodes = ref<Node<Schedule>[]>([])
const edges = ref<Edge[]>([])

const route = useRoute();

const flowId = ref(route.query.id as string || '')
const { data, fetchData, loading } = useFetchData(getScheduleFlowApi, [flowId], { flow: [] })


const fetchFlowData = async () => {
  if (flowId.value && flowId.value.trim() !== '') {
    await fetchData()
    nodes.value = data.value.flow.map((item, i) => {
      return {
        id: item.id,
        type: 'schedule',
        position: { x: i * 200, y: i * 200 },
        data: item,
      }
    })
    await Promise.resolve();
    data.value.flow.forEach((item) => {
      if (!item.dependentSchedule || !item.dependentSchedule.id) {
        return;
      }
      edges.value.push({
        id: getTemplateId(),
        source: item.id,
        target: item.dependentSchedule.id,
        markerEnd: 'arrowclosed',
      })
    })
  }
}

fetchFlowData();

watch(() => route.query.id, (newId) => {
  if (newId) {
    flowId.value = newId as string
    fetchFlowData()
  }
})




eventBus.on('edit-schedule', (schedule) => {
  const node = nodes.value.find((item) => {
    if (item && item.data) {
      return item.data.id === schedule.id
    }
  })
  if (node) {
    node.data = schedule
  }
})



/* 
首次调用useVueFlow非常重要，
useVueFlow 组合式会在第一次调用时创建一个新的 VueFlowStore 实例，并将其注入到 Vue 组件树中。这允许你使用 useVueFlow 组合式从任何子组件中访问存储。
这也意味着 useVueFlow 的第一次调用至关重要，因为它决定了整个组件树中将要使用的状态实例。你可以将其视为一种自动注入到组件树中的 <VueFlowProvider> 包装器。
*/
const { onConnect, addEdges, fitView } = useVueFlow('yang-flow')

const dragStore = useDragStore()

const { onDrop, onDragOver, onDragLeave, isDragOver } = dragStore

/* 
监听连接事件
*/
onConnect((params) => {
  console.log('connect', params)
  const sourceNode = nodes.value.find((item) => item.id === params.source)
  const targetNode = nodes.value.find((item) => item.id === params.target)
  if (params.source === params.target) {
    return
  }
  if (!sourceNode || !targetNode || !sourceNode.data || !targetNode.data) {
    console.error('连接失败，源节点或目标节点不存在')
    return
  }
  targetNode.data.dependentSchedule = sourceNode.data
  addEdges([{ ...params, id: getTemplateId(), markerEnd: 'arrowclosed' }])
  useFetchData(
    modifyScheduleApi,
    [
      targetNode.id,
      {
        status: "locked",
        dependentId: sourceNode.data.id,
      },
    ],
    {
      schedule: getScheduleInitialData(),
    },
    {
      init: 'immediate',
    },
  )
})

// const { onDrop, onDragOver, onDragLeave, isDragOver } = useDragAndDrop()

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
  // setTimeout(() => {
  //   router.push('/')
  //   isSave.value = false
  // }, 1000)
}
const handleReset = async () => {
  nodes.value = []
  edges.value = []
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
  <div class="flex w-full border-1" @drop="onDrop" id="yang-flow-container" :style="{
    'max-height': `calc(100vh - ${APP_CONFIG.HeaderHeight + 3}px)`,
    height: `calc(100vh - ${APP_CONFIG.HeaderHeight + 3}px)`,
  }">
    <!-- :style="{ height: `calc(100vh - ${APP_CONFIG.HeaderHeight})` }" -->
    <FlowSideBar @save="handleSave" @reset="handleReset" />

    <VueFlow v-model:nodes="nodes" v-model:edges="edges" :default-viewport="defaultViewport" @dragover="onDragOver"
      @dragleave="onDragLeave" :style="{
        backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
        transition: 'background-color 0.2s ease',
      }" class="flex-1">
      <Background />
      <!-- <Controls /> -->
      <!-- <MiniMap /> -->
      <template #node-schedule="props">
        <ScheduleNode v-bind="props" />
      </template>
    </VueFlow>
  </div>
</template>
