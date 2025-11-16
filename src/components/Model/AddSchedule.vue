<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAddModelStore } from '@/stores/addModel'
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
import type { ScheduleForm, ScheduleResponse } from '@/types/schedule'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { getTodayDate } from '@/utils/date'
import { useScheduleFrom } from '@/hooks/useScheduleFrom'
import Tags from '@/components/Tag/Tags.vue'
import { useTagStore } from '@/stores/tag'
import { watch, ref, computed } from 'vue'
import { useFetchData } from '@/hooks/useFetchData'
import { addScheduleApi } from '@/api/schedule'
import { getScheduleInitialData } from '@/constant'

const tagStore = useTagStore()
const modelStore = useAddModelStore()
const { addModelOpen, addModelInfo } = storeToRefs(modelStore)

const initResponse: ScheduleResponse = {
  schedule: getScheduleInitialData(),
}

const params = computed(() => {
  return values
})

const { data, loading, fetchData } = useFetchData(addScheduleApi, [params], initResponse)
const submitFunc = async () => {
  // scheduleStore.setScheduleData(values)
  await fetchData()
  toast.success('添加日程成功', {
    description: '1秒后跳转到日历页',
  })
  addModelOpen.value = false
}

const initValue: ScheduleForm = {
  title: '',
  description: '',
  category: [],
  priority: 'high',
  date: getTodayDate(),
}

watch(
  () => addModelInfo.value.date,
  () => {
    if (addModelInfo.value.date) {
      setFieldValue('date', addModelInfo.value.date)
    }
  },
)

const {
  onSubmit,
  values,
  setFieldValue,
  placeholder,
  singleDate,
  df,
  categoryInput,
  addCategory,
  removeCategory,
  addCategoryByClickTag,
} = useScheduleFrom(initValue, submitFunc)
</script>
<template>
  <Dialog v-model:open="addModelOpen">
    <DialogContent
      class="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] h-[90vh] overflow-hidden"
    >
      <DialogHeader>
        <DialogTitle>添加新日程</DialogTitle>
        <DialogDescription> 添加您的新日程 </DialogDescription>
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
                          !singleDate && 'text-muted-foreground',
                        )
                      "
                    >
                      <span>{{ singleDate ? df.format(toDate(singleDate)) : '选择日期' }}</span>
                      <CalendarIcon class="ms-2 h-5 w-5 opacity-70" />
                    </Button>
                    <input hidden />
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0 rounded-lg shadow-lg border-0">
                  <Calendar
                    v-model:placeholder="placeholder"
                    :model-value="singleDate"
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

          <FormField v-slot="{ componentField }" name="dependentId">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">依赖日程ID（可选）</FormLabel>
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
          <FormField v-slot="{ componentField }" name="category">
            <FormItem class="space-y-3">
              <FormLabel class="text-base font-medium">日程标签（可选）</FormLabel>
              <FormControl>
                <div class="flex gap-2">
                  <Input v-model="categoryInput" placeholder="输入分类" class="flex-1" />
                  <Button @click="addCategory" size="sm" type="button">添加</Button>
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
              :disabled="loading"
              type="submit"
              class="w-full h-12 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <template v-if="!loading"> 添加 </template>
              <template v-else> 添加中... </template>
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
