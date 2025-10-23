<script setup lang="ts">
import { X } from 'lucide-vue-next';
defineProps<{
  text: string
  isActive: boolean,
  canDelete?: boolean,
}>()

defineEmits<{
  "click": [text: string],
  "delete": [text: string]
}>()
// const isActive = ref(false)
</script>

<template>
  <span
    class="rounded-full flex items-center gap-2 px-4 py-2 text-sm mr-1 border-1 cursor-pointer hover:bg-gray-50 transition-colors"
    :class="[
      isActive ? 'bg-black text-white border-black hover:bg-gray-950' : 'bg-white text-gray-800',
    ]" @click="$emit('click', text)">
    {{ text }}
    <button v-if="canDelete" @click.stop="$emit('delete', text)" class="text-gray-400 hover:text-red-500">
      <X class="size-4" />
    </button>
  </span>

</template>

<style scoped></style>
