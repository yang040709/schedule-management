<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useScheduleStore } from '@/stores/schedule'
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import { exportJson } from '@/utils/file'
const scheduleStore = useScheduleStore()

const exportData = () => {
  const scheduleData = computed(() => scheduleStore.scheduleData)
  exportJson(scheduleData.value, 'scheduleData.json')
  toast.success('数据已导出')
}
</script>

<template>
  <Button @click="exportData">导出数据</Button>
</template>

<style scoped></style>
