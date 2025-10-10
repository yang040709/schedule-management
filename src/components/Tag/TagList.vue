<script setup lang="ts">
import Tag from './TagItem.vue'
import { useTagStore } from '@/stores/tag'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const tagStore = useTagStore()

const route = useRoute()
const router = useRouter()

const tagList = computed(() => tagStore.tags.unshift('全部'))

const currentActiveTag = computed(() => route.query.tag || '全部')

const setCurrentActiveTag = (tag: string) => {
  router.push({
    name: route.name,
    params: route.params,
    query: {
      ...route.query,
      tag: tag === '全部' ? undefined : tag,
    },
  })
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Tag
      text="全部"
      :is-active="currentActiveTag === '全部' ? true : false"
      @click="setCurrentActiveTag('全部')"
    />
    <Tag
      v-for="item in tagStore.tags"
      :is-active="item === currentActiveTag ? true : false"
      :text="item"
      @click="setCurrentActiveTag(item)"
    />
  </div>
</template>

<style scoped></style>
