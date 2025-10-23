<script setup lang='ts'>
import TagItem from './TagItem.vue';
interface TagsProps {
  tags: readonly string[];
  canDelete?: boolean;
}

defineProps<TagsProps>()

defineEmits<{
  "click": [item: string],
  "delete": [item: string],
}>()
</script>
<template>
  <div class="flex flex-wrap gap-2">
    <TagItem v-for="item in tags" :text="item" :is-active="false" @click="$emit('click', item)"
      @delete="$emit('delete', item)" :can-delete="canDelete">
    </TagItem>
  </div>
</template>

<style scoped></style>