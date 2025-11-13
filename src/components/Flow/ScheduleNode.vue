<script setup lang="ts">
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import NodeTemplate from './NodeTemplate.vue'
import type { ScheduleEvent } from '@/types/schedule'

interface ScheduleNodeProps {
  data: ScheduleEvent
}

const props = defineProps<ScheduleNodeProps>()

const { nodes, edges } = useVueFlow()

const handleUpdate = (updatedSchedule: ScheduleEvent) => {
  console.log(updatedSchedule, 'update<===')
  nodes.value = nodes.value.map((node) => {
    if (node.data.id === updatedSchedule.id) {
      return { ...node, data: updatedSchedule }
    }
    return node
  })
}

const handleDelete = (deleteId: string) => {
  console.log('delete', deleteId)
  edges.value = edges.value.filter((item) => item.source !== deleteId && item.target !== deleteId)
  nodes.value = nodes.value.filter((node) => node.data.id !== deleteId)
}
</script>

<template>
  <div>
    <NodeTemplate :schedule="props.data" @delete="handleDelete" @update="handleUpdate" />
    <Handle type="target" :position="Position.Top" />
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.schedule-node {
  /* background: #9ca8b3; */
  /* color: #fff; */
  padding: 10px;
  border-radius: 5px;
}
</style>
