<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import {
  CalendarDate,
  getLocalTimeZone,
  today,
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { toDate } from 'reka-ui/date'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import TagItem from '@/components/Tag/TagItem.vue'
import { useScheduleStore } from '@/stores/schedule'
import type { ScheduleForm } from '@/types/schedule'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import ReturnButton from '@/components/ReturnButton.vue'


import { useScheduleFrom } from '@/hooks/useScheduleFrom'
const route = useRoute()
const router = useRouter()
const scheduleStore = useScheduleStore()
const submitFunc = () => {
  scheduleStore.setScheduleData(values.date, values)
  toast.success('添加日程成功', {
    description: '1秒后跳转到日历页',
  })
  setTimeout(() => {
    const defaultDate = today(getLocalTimeZone()).toString()
    const from = (route.query?.date as string) || defaultDate
    router.push({
      name: 'calendar',
      params: {
        date: from,
      },
    })
  }, 1000)
}
const initValue: ScheduleForm = {
  date: (route.query?.date || today(getLocalTimeZone()).toString()) as string,
  title: '',
  description: '',
  category: [],
  priority: 'high',
  completed: false,
  startTime: undefined,
  endTime: undefined,
}

const { onSubmit, handleReturn, values, setFieldValue, placeholder, value, addTags, df, tagStore } = useScheduleFrom(initValue, submitFunc);


</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 lg:p-8">
      <!-- <div> -->
      <ReturnButton @click="handleReturn" />
      <div class="p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">添加新日程</h2>
        <form @submit="onSubmit" class="space-y-5">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">标题</FormLabel>
              <FormControl>
                <Input type="text" placeholder="请输入日程标题" v-bind="componentField"
                  class="h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all" />
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">描述</FormLabel>
              <FormControl>
                <Textarea placeholder="请输入描述信息"
                  class="min-h-[100px] rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all resize-y"
                  v-bind="componentField" />
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
                    <Button variant="outline" :class="cn(
                      'w-full h-11 justify-between ps-4 font-medium border-gray-300 hover:border-blue-500 transition-all',
                      !value && 'text-muted-foreground',
                    )
                      ">
                      <span>{{ value ? df.format(toDate(value)) : '选择日期' }}</span>
                      <CalendarIcon class="ms-2 h-5 w-5 opacity-70" />
                    </Button>
                    <input hidden />
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0 rounded-lg shadow-lg border-0">
                  <Calendar v-model:placeholder="placeholder" :model-value="value" calendar-label="选择日期" initial-focus
                    :min-value="new CalendarDate(2000, 1, 1)" :max-value="new CalendarDate(2050, 1, 1)"
                    @update:model-value="
                      (v) => {
                        if (v) {
                          setFieldValue('date', v.toString())
                        } else {
                          setFieldValue('date', today(getLocalTimeZone()).toString())
                        }
                      }
                    " />
                </PopoverContent>
              </Popover>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="startTime">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">开始时间（可选）</FormLabel>
              <FormControl>
                <Input type="time" v-bind="componentField"
                  class="w-full h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all" />
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="endTime">
            <FormItem class="space-y-2">
              <FormLabel class="text-base font-medium">结束时间（可选）</FormLabel>
              <FormControl>
                <Input type="time" v-bind="componentField"
                  class="w-full h-11 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all" />
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
                    class="flex items-center space-y-0 gap-x-3 p-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <FormControl>
                      <RadioGroupItem value="high" class="text-red-500 border-gray-300" />
                    </FormControl>
                    <FormLabel class="font-medium cursor-pointer">高优先级</FormLabel>
                  </FormItem>
                  <FormItem
                    class="flex items-center space-y-0 gap-x-3 p-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <FormControl>
                      <RadioGroupItem value="medium" class="text-yellow-500 border-gray-300" />
                    </FormControl>
                    <FormLabel class="font-medium cursor-pointer">中优先级</FormLabel>
                  </FormItem>
                  <FormItem
                    class="flex items-center space-y-0 gap-x-3 p-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
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
          <FormField v-slot="{ }" name="category">
            <FormItem class="space-y-3">
              <FormLabel class="text-base font-medium">日程标签（可选）</FormLabel>
              <FormControl>
                <div class="flex flex-wrap gap-2">
                  <TagItem v-for="item in tagStore.tags"
                    :is-active="values.category instanceof Array && values.category?.includes(item)" :text="item"
                    @click="addTags(item)" class="px-3 py-1.5" />
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <div class="pt-4">
            <Button type="submit"
              class="w-full h-12 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">添加</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
