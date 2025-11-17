<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { exportJson } from '@/utils/file'
import { useFetchData } from '@/hooks/useFetchData'
import { exportDataApi } from '@/api/setting'
import { getTodayDate } from '@/utils/date'

const { fetchData, data } = useFetchData(exportDataApi, [], {
  total: 0,
  data: [],
})

const fileName = `scheduleData-v${getTodayDate()}.json`

const exportData = async () => {
  await fetchData()
  exportJson(data.value, fileName)
  toast.success('数据已导出')
}
</script>

<template>
  <Button @click="exportData">导出数据</Button>
</template>

<style scoped></style>
