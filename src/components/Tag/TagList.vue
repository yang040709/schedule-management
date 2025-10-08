<script setup lang="ts">
import Tag from './TagItem.vue'
import { useTagStore } from '@/stores/tag'
const tagStore = useTagStore()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Tag
      v-for="item in tagStore.tags"
      :is-active="item === tagStore.currentActiveTag ? true : false"
      :text="item"
      @click="tagStore.setCurrentActiveTag(item)"
    />
  </div>
</template>

<style scoped></style>
