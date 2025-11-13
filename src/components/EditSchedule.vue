<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModelStore } from '@/stores/model'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-vue-next'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { toDate } from 'reka-ui/date'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import TagItem from '@/components/Tag/TagItem.vue'
import { useScheduleStore } from '@/stores/schedule'
import type { ScheduleForm, ScheduleEvent } from '@/types/schedule'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { getTodayDate } from '@/utils/date'
import { useScheduleFrom } from '@/hooks/useScheduleFrom'
import Tags from '@/components/Tag/Tags.vue'
import { useTagStore } from '@/stores/tag'
import { watch } from 'vue'
import { cloneDeep } from 'lodash-es'

// const route = useRoute()
// const router = useRouter()
const scheduleStore = useScheduleStore()
const tagStore = useTagStore()
const modelStore = useModelStore()
const { editModelOpen, editModelInfo } = storeToRefs(modelStore)

const submitFunc = () => {
  scheduleStore.updateScheduleData(cloneDeep(values) as ScheduleEvent)
  toast.success('修改日程成功')
  editModelOpen.value = false
}
const initValue: ScheduleEvent = {
  id: editModelInfo.value.id,
  date: editModelInfo.value.date || getTodayDate(),
  title: editModelInfo.value.title || '',
  description: editModelInfo.value.description || '',
  category: editModelInfo.value.category || [],
  priority: editModelInfo.value.priority || 'high',
  completed: editModelInfo.value.completed || false,
  startTime: editModelInfo.value.startTime || undefined,
  endTime: editModelInfo.value.endTime || undefined,
}

watch(
  () => editModelInfo.value,
  () => {
    setFieldValue('id' as keyof ScheduleForm, editModelInfo.value.id)
    setFieldValue('date', editModelInfo.value.date)
    setFieldValue('title', editModelInfo.value.title)
    setFieldValue('description', editModelInfo.value.description)
    setFieldValue('category', editModelInfo.value.category)
    setFieldValue('priority', editModelInfo.value.priority)
    setFieldValue('completed', editModelInfo.value.completed)
    setFieldValue('startTime', editModelInfo.value.startTime)
    setFieldValue('endTime', editModelInfo.value.endTime)
  },
  {
    deep: true,
  },
)

const {
  onSubmit,
  values,
  setFieldValue,
  placeholder,
  value,
  df,
  categoryInput,
  addCategory,
  removeCategory,
  addCategoryByClickTag,
} = useScheduleFrom(initValue, submitFunc)
</script>
<template>
  <Dialog v-model:open="editModelOpen">
    <DialogContent
      class="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] h-[90vh] overflow-hidden"
    >
      <DialogHeader>
        <DialogTitle>编辑日程</DialogTitle>
        <DialogDescription> 编辑您的日程 </DialogDescription>
      </DialogHeader>
      <div class="overflow-y-scroll mr-[-10px] pr-[10px] p-[2px]">
        <form @submit.prevent="onSubmit" class="space-y-5">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">标题</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="请输入日程标题"
                  v-bind="componentField"
                  class="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入描述信息"
                  class="min-h-[100px] rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all resize-y"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <FormField name="date">
            <FormItem class="flex flex-col space-y-2">
              <FormLabel class="text-base font-medium">日程日期</FormLabel>
              <Popover>
                <PopoverTrigger as-child>
                  <FormControl>
                    <Button
                      variant="outline"
                      :class="
                        cn(
                          'w-full h-11 justify-between ps-4 font-medium border-gray-300 hover:border-blue-500 transition-all',
                          !value && 'text-muted-foreground',
                        )
                      "
                    >
                      <span>{{ value ? df.format(toDate(value)) : '选择日期' }}</span>
                      <CalendarIcon class="ms-2 h-5 w-5 opacity-70" />
                    </Button>
                    <input hidden />
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0 rounded-lg shadow-lg border-0">
                  <Calendar
                    v-model:placeholder="placeholder"
                    :model-value="value"
                    calendar-label="选择日期"
                    initial-focus
                    :min-value="new CalendarDate(2000, 1, 1)"
                    :max-value="new CalendarDate(2050, 1, 1)"
                    @update:model-value="
                      (v) => {
                        if (v) {
                          setFieldValue('date', v.toString())
                        } else {
                          setFieldValue('date', today(getLocalTimeZone()).toString())
                        }
                      }
                    "
                  />
                </PopoverContent>
              </Popover>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="startTime">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">开始时间（可选）</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  v-bind="componentField"
                  class="w-full h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="endTime">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">结束时间（可选）</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  v-bind="componentField"
                  class="w-full h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="priority">
            <FormItem class="space-y-3">
              <FormLabel class="text-base font-medium">日程优先级</FormLabel>
              <FormControl>
                <RadioGroup class="flex flex-col space-y-1" v-bind="componentField">
                  <FormItem
                    class="flex items-center space-y-0 gap-x-3 p-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <FormControl>
                      <RadioGroupItem value="high" class="text-red-500 border-gray-300" />
                    </FormControl>
                    <FormLabel class="font-medium cursor-pointer">高优先级</FormLabel>
                  </FormItem>
                  <FormItem
                    class="flex items-center space-y-0 gap-x-3 p-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <FormControl>
                      <RadioGroupItem value="medium" class="text-yellow-500 border-gray-300" />
                    </FormControl>
                    <FormLabel class="font-medium cursor-pointer">中优先级</FormLabel>
                  </FormItem>
                  <FormItem
                    class="flex items-center space-y-0 gap-x-3 p-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <FormControl>
                      <RadioGroupItem value="low" class="text-green-500 border-gray-300" />
                    </FormControl>
                    <FormLabel class="font-medium cursor-pointer">低优先级</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="category">
            <FormItem class="space-y-3">
              <FormLabel class="text-base font-medium">日程标签（可选）</FormLabel>
              <FormControl>
                <div class="flex gap-2">
                  <Input v-model="categoryInput" placeholder="输入分类" class="flex-1" />
                  <Button @click="addCategory" size="sm" type="button">修改</Button>
                </div>
                <div>
                  <p class="text-gray-600 mb-3 font-bold">点击下面标签，快速添加日程标签</p>
                  <Tags :tags="tagStore.tags" @click="addCategoryByClickTag" />
                </div>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(item, index) in componentField.modelValue"
                    :key="index"
                    class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full flex items-center gap-1"
                  >
                    {{ item }}
                    <button @click="removeCategory(item)" class="text-gray-400 hover:text-red-500">
                      <X class="w-4" />
                    </button>
                  </span>
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <div class="pt-4">
            <Button
              type="submit"
              class="w-full h-12 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >修改</Button
            >
          </div>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
