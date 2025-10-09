import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<string[]>([
    // '全部',
    // '已完成',
    // '未完成',
    // '高优先级',
    // '中优先级',
    // '低优先级',
    '工作',
    '规划',
    '会议',
    '文档',
    '健康',
    '学习',
    '开发',
    '社交',
    '生活',
    '娱乐',
    '项目',
  ])
  return { tags }
})
