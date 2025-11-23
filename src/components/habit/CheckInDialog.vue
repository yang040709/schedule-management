<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CheckInForm } from '@/types/habit'

interface Props {
  open: boolean
  habitId: string
  habitTitle: string
  defaultDuration?: number
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', form: CheckInForm): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单数据
const formData = ref({
  notes: '',
  mood: undefined as number | undefined,
  duration: props.defaultDuration || 0,
})

// 心情选项
const moodOptions = [
  { value: 1, label: '😞 很差', color: 'text-red-300' },
  { value: 2, label: '😕 一般', color: 'text-orange-300' },
  { value: 3, label: '😐 还行', color: 'text-yellow-500' },
  { value: 4, label: '😊 不错', color: 'text-green-500' },
  { value: 5, label: '😄 很棒', color: 'text-blue-500' },
]

// 计算属性
const isFormValid = computed(() => {
  return formData.value.duration > 0
})

// 方法
const handleOpenChange = (value: boolean) => {
  emit('update:open', value)
  if (!value) {
    // 关闭时重置表单
    resetForm()
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) return

  const checkInForm: CheckInForm = {
    habitId: props.habitId,
    notes: formData.value.notes || undefined,
    mood: formData.value.mood,
    duration: formData.value.duration,
  }

  emit('submit', checkInForm)
  handleOpenChange(false)
}

const resetForm = () => {
  formData.value = {
    notes: '',
    mood: undefined,
    duration: props.defaultDuration || 0,
  }
}

// 监听默认持续时间变化
watch(
  () => props.defaultDuration,
  (newVal) => {
    if (newVal) {
      formData.value.duration = newVal
    }
  },
)
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-center"> 完成打卡 - {{ habitTitle }} </DialogTitle>
      </DialogHeader>
      <DialogDescription class="sr-only">
        请填写本次习惯打卡的实际持续时间、心情和备注。
      </DialogDescription>
      <div class="space-y-6 py-4">
        <!-- 持续时间 -->
        <div class="space-y-2">
          <Label for="duration" class="text-sm font-medium">
            实际持续时间 (分钟) <span class="text-red-500">*</span>
          </Label>
          <Input
            id="duration"
            v-model.number="formData.duration"
            type="number"
            min="1"
            max="480"
            placeholder="请输入实际持续的时间"
            class="w-full"
          />
          <p class="text-xs text-gray-500">请输入1-480分钟之间的数值</p>
        </div>

        <!-- 心情评分 -->
        <div class="space-y-2">
          <Label class="text-sm font-medium">心情评分</Label>
          <div class="grid grid-cols-5 gap-2">
            <Button
              v-for="option in moodOptions"
              :key="option.value"
              :variant="formData.mood === option.value ? 'default' : 'outline'"
              :class="['h-10 text-sm', formData.mood === option.value ? option.color : '']"
              @click="formData.mood = formData.mood === option.value ? undefined : option.value"
            >
              {{ option.label }}
            </Button>
          </div>
        </div>

        <!-- 备注 -->
        <div class="space-y-2">
          <Label for="notes" class="text-sm font-medium">打卡备注</Label>
          <Textarea
            id="notes"
            v-model="formData.notes"
            placeholder="记录一下今天的感受或心得..."
            class="min-h-[80px] resize-none"
          />
        </div>
      </div>

      <div class="flex gap-3 justify-end pt-4">
        <Button variant="outline" @click="handleOpenChange(false)"> 取消 </Button>
        <Button
          :disabled="!isFormValid"
          @click="handleSubmit"
          class="bg-green-600 hover:bg-green-700"
        >
          确认打卡
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
