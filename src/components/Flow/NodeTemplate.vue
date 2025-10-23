<script setup lang='ts'>
import { ref, computed } from 'vue'
import type { ScheduleEvent, PriorityLevel } from '@/types/schedule'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { X } from 'lucide-vue-next';
import type { DateValue } from "@internationalized/date"
import {
  DateFormatter,
  fromDate,
  getLocalTimeZone,
  parseDate
} from "@internationalized/date"
import { CalendarIcon } from "lucide-vue-next"
import { cn } from '@/lib/utils'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { z } from 'zod'
import { toast } from 'vue-sonner'

// Props
interface Props {
  schedule?: ScheduleEvent
  onlyView?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  schedule: () => ({
    id: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    priority: 'medium' as PriorityLevel,
    category: [],
    completed: false,
    date: ''
  }),
  onlyView: false
})

// console.log("props=>", props);


// Emits
const emit = defineEmits<{
  update: [schedule: ScheduleEvent],
  delete: [id: string]
}>()

// 编辑模式状态
const isEditing = ref(false)

// 表单数据
const formData = ref<ScheduleEvent>({
  id: props.schedule.id || '',
  title: props.schedule.title || '',
  description: props.schedule.description || '',
  startTime: props.schedule.startTime || '',
  endTime: props.schedule.endTime || '',
  priority: props.schedule.priority || '',
  category: props.schedule.category || [],
  completed: props.schedule.completed || false,
  date: props.schedule.date || ''
})

// 分类输入
const categoryInput = ref('')

// 计算属性
const timeDisplay = computed(() => {
  if (formData.value.startTime && formData.value.endTime) {
    return `${formData.value.startTime}-${formData.value.endTime}`
  }
  return formData.value.startTime || formData.value.endTime || ''
})

const priorityColor = computed(() => {
  switch (formData.value.priority) {
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


const scheduleSchema = z.object({
  title: z
    .string('标题不能为空且必须为字符串')
    .min(2, '标题不能少于2个字')
    .max(50, '标题不能超过50个字'),
  description: z.string('描述不能为空且必须为字符串').min(1, "描述不能少于1个字"),
  date: z.string().refine((v) => v, '请选择日期'),
  category: z.refine(() => true),
  priority: z.enum(['low', 'medium', 'high'], '请选择优先级'),
  completed: z.refine(() => true),
  startTime: z.refine(() => true),
  endTime: z.refine(() => true),
})

// 方法
const toggleEdit = () => {
  if (isEditing.value) {
    // 退出编辑模式时保存数据
    // emit('update', formData.value)
    // console.log("正在编辑中");
    // console.log(result);
    const result = scheduleSchema.safeParse(formData.value)
    if (!result.success) {
      if (result.error.issues.length > 0 && result.error.issues[0]) {
        toast.error(result.error.issues[0].message)
      }
      else {
        toast.error("表单类型错误，请检查表单")
      }
      return;
    }
  }
  isEditing.value = !isEditing.value
}

const addCategory = () => {
  if (categoryInput.value.trim() && !formData.value.category?.includes(categoryInput.value.trim())) {
    formData.value.category = [...(formData.value.category || []), categoryInput.value.trim()]
    categoryInput.value = ''
  }
}

const removeCategory = (index: number) => {
  if (formData.value.category) {
    formData.value.category.splice(index, 1)
  }
}


const handleDelete = () => {
  emit('delete', props.schedule.id)
}




const df = new DateFormatter("en-US", {
  dateStyle: "long",
})



const neededDate = computed(
  {
    get: () => {
      return parseDate(formData.value.date)
    },
    set: (date) => {
      formData.value.date = date.toString()
    }
  }
)

const pickDateText = computed(() => {
  return formData.value.date ? formData.value.date : "Pick a date"
})

</script>

<template>
  <div class="w-full relative p-4 rounded-2xl text-md border-2 transition-all duration-200 hover:shadow-md" :class="[
    priorityColor,
    formData.completed ? 'opacity-80' : ''
  ]">
    <!-- 显示模式 -->
    <div v-if="!isEditing || onlyView" class="space-y-2">
      <!-- 标题和完成状态 -->
      <div class="flex items-center gap-2">
        <h3 class="font-medium text-gray-900 flex-1" :class="{ 'line-through': formData.completed }">
          {{ formData.title || '无标题' }}
        </h3>

      </div>

      <!-- 描述 -->
      <p v-if="formData.description" class="text-sm text-gray-600">
        {{ formData.description }}
      </p>

      <!-- 时间 -->
      <div v-if="timeDisplay" class="text-sm text-gray-500">
        {{ timeDisplay }}

      </div>

      <!-- 分类标签 -->
      <div v-if="formData.category && formData.category.length > 0" class="flex flex-wrap gap-1">
        <span v-for="(cat, index) in formData.category" :key="index"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
          {{ cat }}
        </span>
      </div>

      <!-- 优先级标识 -->
      <div class="flex items-center gap-1 text-xs">
        <span class="text-gray-500">优先级:</span>
        <span class="px-2 py-1 rounded-full text-xs font-medium" :class="{
          'bg-red-100 text-red-700': formData.priority === 'high',
          'bg-yellow-100 text-yellow-700': formData.priority === 'medium',
          'bg-green-100 text-green-700': formData.priority === 'low'
        }">
          {{ formData.priority === 'high' ? '高' : formData.priority === 'medium' ? '中' : '低' }}
        </span>
      </div>
      <div v-if="!onlyView" class="mt-6 flex justify-between gap-5">
        <Button variant="outline" @click="toggleEdit">编辑</Button>
        <Button variant="destructive" @click="handleDelete">删除</Button>
      </div>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="space-y-4">
      <!-- 标题 -->
      <div class="space-y-2">
        <Label for="title">标题</Label>
        <Input id="title" v-model="formData.title" placeholder="输入标题" class="w-full nodrag" />
      </div>

      <!-- 描述 -->
      <div class="space-y-2">
        <Label for="description">描述</Label>
        <Textarea id="description" v-model="formData.description" placeholder="输入描述" class="w-full nodrag" rows="3" />
      </div>
      <div class="space-y-2 no-drag">
        <Label for="description">日期</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline" :class="cn(
              'w-[280px] justify-start text-left font-normal',
              !formData.date && 'text-muted-foreground',
            )">
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ pickDateText }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar v-model="neededDate" initial-focus />
          </PopoverContent>
        </Popover>
      </div>
      <!-- 时间 -->
      <div class="grid grid-cols-2 gap-2">
        <div class="space-y-2">
          <Label for="startTime">开始时间</Label>
          <Input id="startTime" v-model="formData.startTime" type="time" class="w-full" />
        </div>
        <div class="space-y-2">
          <Label for="endTime">结束时间</Label>
          <Input id="endTime" v-model="formData.endTime" type="time" class="w-full" />
        </div>
      </div>

      <!-- 优先级 -->
      <div class="space-y-2">
        <Label>优先级</Label>
        <RadioGroup v-model="formData.priority" class="flex gap-4">
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label for="high" class="text-red-600">高</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label for="medium" class="text-yellow-600">中</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label for="low" class="text-green-600">低</Label>
          </div>
        </RadioGroup>
      </div>

      <!-- 分类 -->
      <div class="space-y-2">
        <Label>分类标签</Label>
        <div class="flex gap-2">
          <Input v-model="categoryInput" placeholder="输入分类" class="flex-1 nodrag" @keyup.enter="addCategory" />
          <Button @click="addCategory" size="sm">添加</Button>
        </div>
        <div v-if="formData.category && formData.category.length > 0" class="flex flex-wrap gap-1">
          <span v-for="(cat, index) in formData.category" :key="index"
            class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
            {{ cat }}
            <button @click="removeCategory(index)" class="text-gray-400 hover:text-red-500">
              <X class="w-4" />
            </button>
          </span>
        </div>
      </div>

      <!-- 完成状态 -->
      <div class="flex items-center space-x-2">
        <input id="completed" v-model="formData.completed" type="checkbox" class="rounded" />
        <Label for="completed">已完成</Label>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2 pt-2">
        <Button @click="toggleEdit" class="flex-1 nodrag">保存</Button>
        <Button @click="isEditing = false" variant="outline" class="flex-1 nodrag">取消</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>