<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FlowScheduleForm, PriorityLevel, Schedule, ScheduleStatus } from '@/types/schedule'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { X } from 'lucide-vue-next'
import type { DateValue } from '@internationalized/date'
import { DateFormatter, fromDate, getLocalTimeZone, parseDate } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { cloneDeep } from 'lodash-es'
import { getTodayDate, getTodayDateTime } from '@/utils/date'
import { priorityMap } from '@/constant'
import DeleteDialog from '../Schedule/DeleteDialog.vue'

interface Props {
  schedule: Schedule
  onlyView?: boolean
}

const { onlyView = false, schedule } = defineProps<Props>()

const emit = defineEmits<{
  update: [schedule: Schedule]
  delete: [id: string]
}>()

const priorityColor = computed(() => {
  switch (schedule.priority) {
    case 'high':
      return 'border-red-400 bg-white'
    case 'medium':
      return 'border-yellow-300 bg-white'
    case 'low':
      return 'border-green-400 bg-white'
    default:
      return 'border-gray-300 bg-white'
  }
})

const priorityTagColor = computed(() => {
  switch (schedule.priority) {
    case 'high':
      return 'bg-red-100 text-red-700'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700'
    case 'low':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})
type StatusMap = {
  [K in ScheduleStatus]: {
    class: string
    text: string
    color: string
  }
}

const statusMap = {
  done: {
    class: 'px-3 py-1 text-xs font-bold text-green-600 bg-green-50',
    text: '已完成',
    color: 'green-50',
  },
  pending: {
    class: 'px-3 py-1 text-xs font-bold text-yellow-600 bg-yellow-100',
    text: '待处理',
    color: 'yellow-100',
  },
  expired: {
    class: 'px-3 py-1 text-xs font-bold text-red-600 bg-red-50',
    text: '已过期',
    color: 'red-50',
  },
  canceled: {
    class: 'px-3 py-1 text-xs font-bold text-red-600 bg-red-100',
    text: '已取消',
    color: 'red-100',
  },
}

const handleEdit = () => {
  emit('update', schedule)
}

const handleDelete = () => {
  console.log('delete')
  // emit('delete', schedule.id)
}

// /*
// 监听props变化，就会更新
// */
// watch(
//   () => props.schedule,
//   (newVal) => {
//     formData.value = newVal
//   },
// )

// // 编辑模式状态
// const isEditing = ref(false)

// // 表单数据
// const formData = ref<Schedule>({
//   id: props.schedule.id || '',
//   title: props?.schedule.title || '',
//   description: props.schedule.description || '',
//   category: props.schedule.category || [],
//   priority: props.schedule.priority || 'high',
//   date: props.schedule.date || getTodayDate(),
//   status: props.schedule.status || 'pending',
//   createdAt: props.schedule.createdAt || getTodayDateTime(),
//   updatedAt: props.schedule.updatedAt || getTodayDateTime(),
// })

// // 分类输入
// const categoryInput = ref('')

// // // 计算属性
// // const timeDisplay = computed(() => {
// //   if (formData.value.startTime && formData.value.endTime) {
// //     return `${formData.value.startTime}-${formData.value.endTime}`
// //   }
// //   return formData.value.startTime || formData.value.endTime || ''
// // })

// const priorityColor = computed(() => {
//   switch (formData.value.priority) {
//     case 'high':
//       return 'border-red-400 bg-white'
//     case 'medium':
//       return 'border-yellow-300 bg-white'
//     case 'low':
//       return 'border-green-400 bg-white'
//     default:
//       return 'border-gray-300 bg-white'
//   }
// })

// const scheduleSchema = z.object({
//   title: z
//     .string('标题不能为空且必须为字符串')
//     .min(2, '标题不能少于2个字')
//     .max(50, '标题不能超过50个字'),
//   description: z.string('描述不能为空且必须为字符串').min(1, '描述不能少于1个字'),
//   date: z.string().refine((v) => v, '请选择日期'),
//   category: z.refine(() => true),
//   priority: z.enum(['low', 'medium', 'high'], '请选择优先级'),
//   completed: z.refine(() => true),
//   startTime: z.refine(() => true),
//   endTime: z.refine(() => true),
// })

// // 方法
// const toggleEdit = () => {
//   if (isEditing.value) {
//     // 退出编辑模式时保存数据
//     // emit('update', formData.value)
//     // console.log("正在编辑中");
//     // console.log(result);
//     const result = scheduleSchema.safeParse(formData.value)
//     if (!result.success) {
//       if (result.error.issues.length > 0 && result.error.issues[0]) {
//         toast.error(result.error.issues[0].message)
//       } else {
//         toast.error('表单类型错误，请检查表单')
//       }
//       return
//     }
//     // console.log(props.schedule.id, formData.value)
//     const newFormData = cloneDeep(formData.value)
//     emit('update', newFormData)
//   }
//   isEditing.value = !isEditing.value
// }

// const addCategory = () => {
//   if (
//     categoryInput.value.trim() &&
//     !formData.value.category?.includes(categoryInput.value.trim())
//   ) {
//     formData.value.category = [...(formData.value.category || []), categoryInput.value.trim()]
//     categoryInput.value = ''
//   }
// }

// const removeCategory = (index: number) => {
//   if (formData.value.category) {
//     formData.value.category.splice(index, 1)
//   }
// }

// const handleDelete = () => {
//   emit('delete', props.schedule.id)
// }

// const df = new DateFormatter('en-US', {
//   dateStyle: 'long',
// })

// const neededDate = computed({
//   get: () => {
//     return parseDate(formData.value.date)
//   },
//   set: (date) => {
//     formData.value.date = date.toString()
//   },
// })

// const pickDateText = computed(() => {
//   return formData.value.date ? formData.value.date : 'Pick a date'
// })

// const setStartTime = (event: Event) => {
//   console.log(event, '<==start time')
//   const target = event.target as HTMLInputElement
//   formData.value.timeOfDay = {
//     startTime: target.value,
//     endTime: formData.value.timeOfDay?.endTime,
//   }
// }
// const setEndTime = (event: Event) => {
//   const target = event.target as HTMLInputElement
//   formData.value.timeOfDay = {
//     startTime: formData.value.timeOfDay?.startTime,
//     endTime: target.value,
//   }
// }
</script>

<template>
  <div
    class="w-full relative p-4 rounded-2xl text-md border-2 transition-all duration-200 hover:shadow-md"
    :class="[priorityColor]"
  >
    <!-- 显示模式 -->
    <div class="space-y-2">
      <!-- 标题和完成状态 -->
      <div class="flex items-center gap-2">
        <h3 class="font-medium text-gray-900 flex-1">
          {{ schedule.title || '无标题' }}
        </h3>
      </div>

      <!-- 描述 -->
      <p v-if="schedule.description" class="text-sm text-gray-600">
        {{ schedule.description }}
      </p>

      <!-- 时间 -->
      <div v-if="schedule.date" class="text-sm text-gray-500">日期： {{ schedule.date }}</div>

      <div class="text-sm text-gray-500" v-if="schedule.timeOfDay">
        时间：
        {{ schedule.timeOfDay.startTime }}-{{ schedule.timeOfDay.endTime }}
      </div>

      <div class="text-sm text-gray-500" v-if="schedule.id">
        日程ID：
        {{ schedule.id }}
      </div>

      <!-- 依赖 -->
      <div v-if="schedule.dependentId" class="text-sm text-gray-500">
        前置日程： {{ schedule.dependentId }}
      </div>
      <!-- 分类标签 -->
      <div v-if="schedule.category && schedule.category.length > 0" class="flex flex-wrap gap-1">
        <span
          v-for="(cat, index) in schedule.category"
          :key="index"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
        >
          {{ cat }}
        </span>
        <span class="px-2 py-1 rounded-full text-xs font-medium" :class="priorityTagColor">
          {{ priorityMap[schedule.priority] }}
        </span>
        <span
          class="px-2 py-1 rounded-full text-xs font-medium"
          :class="statusMap[schedule.status].class"
        >
          {{ statusMap[schedule.status].text }}
        </span>
      </div>

      <p v-if="schedule.AIsuggestion" class="text-sm text-gray-600 bg-gray-100 p-2 rounded-md">
        <span>行动建议:</span> {{ schedule.AIsuggestion }}
      </p>

      <div v-if="!onlyView" class="mt-3 flex justify-between gap-5">
        <Button variant="outline" @click="handleEdit">编辑</Button>
        <DeleteDialog @confirm="handleDelete">
          <Button variant="destructive">删除</Button>
        </DeleteDialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
