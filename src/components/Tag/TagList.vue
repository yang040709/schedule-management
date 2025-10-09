<script setup lang="ts">
import Tag from './TagItem.vue'
import { useTagStore } from '@/stores/tag'
import { computed, ref } from 'vue'
const tagStore = useTagStore()

const tagList = computed(() => tagStore.tags.unshift('全部'))

const currentActiveTag = ref<string>('全部')

const setCurrentActiveTag = (tag: string) => {
  currentActiveTag.value = tag
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Tag
      v-for="item in tagStore.tags"
      :is-active="item === currentActiveTag ? true : false"
      :text="item"
      @click="setCurrentActiveTag(item)"
    />
  </div>
</template>

<style scoped></style>
