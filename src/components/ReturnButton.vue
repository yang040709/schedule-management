<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineEmits<{
  click: []
}>()
</script>

<template>
  <Button variant="ghost" size="icon" @click="() => $emit('click')">
    <ChevronLeft class="size-10 text-gray-900" />
  </Button>
</template>

<style scoped></style>
