<script setup lang="ts">
import { Button } from '@/components/ui/button'
const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json' // 只接受 JSON 文件
  input.addEventListener('change', (event) => {
    console.log(event)
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      const result = event.target?.result as string
      const data = JSON.parse(result)
      console.log(data)
    })
    reader.readAsText(file)
  })
  input.click()
}
</script>

<template>
  <Button @click="importData">导入数据</Button>
</template>

<style scoped></style>
