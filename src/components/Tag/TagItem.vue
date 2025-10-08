<script setup lang="ts">
defineProps<{
  text: string
  isActive: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
// const isActive = ref(false)
</script>

<template>
  <span
    class="rounded-full px-4 py-2 text-sm mr-1 border-1 cursor-pointer"
    :class="[isActive ? 'bg-black text-white border-black' : 'bg-white text-gray-800']"
    @click="$emit('click')"
  >
    {{ text }}
  </span>
</template>

<style scoped></style>
