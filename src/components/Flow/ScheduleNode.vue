<script setup lang="ts">
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import NodeTemplate from './NodeTemplate.vue'
import type { Schedule } from '@/types/schedule'
import { useFetchData } from '@/hooks/useFetchData'
import { deleteScheduleApi } from '@/api/schedule'
import { toast } from 'vue-sonner'
import { useEditModelStore } from '@/stores/editModel'

interface ScheduleNodeProps {
  data: Schedule
}

const props = defineProps<ScheduleNodeProps>()

const { nodes, edges } = useVueFlow('yang-flow')

const editModelStore = useEditModelStore()

const handleUpdate = (updatedSchedule: Schedule) => {
  // console.log(updatedSchedule, 'update<===')
  // nodes.value = nodes.value.map((node) => {
  //   if (node.data.id === updatedSchedule.id) {
  //     return { ...node, data: updatedSchedule }
  //   }
  //   return node
  // })
  editModelStore.editModelInfo = updatedSchedule
  editModelStore.editModelOpen = true
}

const handleDelete = async (deleteId: string) => {
  const { fetchData } = useFetchData(deleteScheduleApi, [deleteId], undefined)
  try {
    await fetchData()
    edges.value = edges.value.filter((item) => item.source !== deleteId && item.target !== deleteId)
    nodes.value = nodes.value.filter((node) => node.data.id !== deleteId)
  } catch (error) {
    toast.error('删除失败')
  }
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
