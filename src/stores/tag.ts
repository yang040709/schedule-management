import { defineStore } from 'pinia'
import { readonly } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { APP_CONFIG } from '@/config/app'
export const useTagStore = defineStore('tag', () => {
  const _tags = useLocalStorage(APP_CONFIG.TagStorageKey, [
    '工作',
    '规划',
    '会议',
    '文档',
    '健康',
    '学习',
    '开发',
  ])
  const addTag = (tag: string) => {
    if (!tag && tag.trim().length === 0) return
    if (!_tags.value.includes(tag)) {
      _tags.value.push(tag)
    }
  }
  const removeTag = (tag: string) => {
    const index = _tags.value.indexOf(tag)
    if (index !== -1) {
      _tags.value.splice(index, 1)
    }
  }
  return { tags: readonly(_tags), addTag, removeTag }
})
