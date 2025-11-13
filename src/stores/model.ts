import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { getTodayDate } from '@/utils/date'
import type { ScheduleEvent } from '@/types/schedule'
export const useModelStore = defineStore('model', () => {
  const addModelOpen = ref(false)
  const editModelOpen = ref(false)
  const addModelInfo = ref({
    date: getTodayDate(),
  })

  /* 
    id: string // 唯一标识符
    title: string // 标题
    description?: string // 可选字段，使用?
    startTime?: string // 开始时间
    endTime?: string // 结束时间
    priority: PriorityLevel // 优先级
    category?: string[] // 分类支持多个标签
    completed: boolean // 完成状态
    date: string
  */
  const editModelInfo = ref<ScheduleEvent>({
    id: '',
    title: '',
    description: '',
    category: [],
    completed: false,
    priority: 'medium',
    date: getTodayDate(),
  })
  return {
    addModelInfo,
    addModelOpen,
    editModelOpen,
    editModelInfo,
  }
})
