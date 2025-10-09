<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { toDate } from 'reka-ui/date'
import { computed, h, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTagStore } from '@/stores/tag'
import TagItem from '@/components/Tag/TagItem.vue'
import { useScheduleStore } from '@/stores/schedule'

import type { ScheduleEvent, ScheduleForm } from '@/types/schedule'

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(2).max(50),
    description: z.string(),
    date: z.string().refine((v) => v, { message: 'A date of birth is required.' }),
    // date:
    category: z.refine(() => true),
    priority: z.enum(['low', 'medium', 'high']),
    completed: z.refine(() => true),
    startTime: z.refine(() => true),
    endTime: z.refine(() => true),
  }),
)

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const placeholder = ref()

// interface ScheduleForm extends ScheduleEvent {
//   date: string
// }

const { handleSubmit, setFieldValue, values } = useForm<ScheduleForm>({
  validationSchema: formSchema,
  initialValues: {
    date: today(getLocalTimeZone()).toString(),
  },
})

/* 
export interface ScheduleEvent {
  id: string // 唯一标识符
  title: string // 标题
  description?: string // 可选字段，使用?
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  priority: PriorityLevel // 优先级
  category: string[] // 分类支持多个标签
  completed: boolean // 完成状态
}
*/
const value = computed({
  get: () => (values.date ? parseDate(values.date) : undefined),
  set: (val) => val,
})

const scheduleStore = useScheduleStore()

const onSubmit = handleSubmit((validateValues) => {
  console.log('Form submitted!', validateValues)
  if (values.date === undefined) {
    console.log('date is null')
    return
  }
  console.log(values)
  scheduleStore.setScheduleData(values.date, values)
})

const tagStore = useTagStore()
// console.log(tagStore.tags)

const addTags = (item: string) => {
  if (!values.category) {
    // values.category = [item]
    setFieldValue('category', [item])
  } else if (!(values.category instanceof Array)) {
    // values.category = [item]
    setFieldValue('category', [item])
  } else if (!values.category.includes(item)) {
    // values.category.push(item)
    setFieldValue('category', [...values.category, item])
  } else {
    const newTags = values.category.filter((i: string) => i !== item)
    setFieldValue('category', [...newTags])
  }
  console.log(values.category)
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 lg:p-8">
      <!-- <div> -->
      <div class="p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">添加新日程</h2>
        <form @submit="onSubmit" class="space-y-5">
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
          <FormField v-slot="{}" name="category">
            <FormItem class="space-y-3">
              <FormLabel class="text-base font-medium">日程标签（可选）</FormLabel>
              <FormControl>
                <div class="flex flex-wrap gap-2">
                  <TagItem
                    v-for="item in tagStore.tags"
                    :is-active="values.category instanceof Array && values.category?.includes(item)"
                    :text="item"
                    @click="addTags(item)"
                    class="px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105"
                  />
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
          <div class="pt-4">
            <Button
              type="submit"
              class="w-full h-12 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >添加</Button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
