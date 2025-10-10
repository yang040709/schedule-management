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
import { computed, h, isProxy, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTagStore } from '@/stores/tag'
import TagItem from '@/components/Tag/TagItem.vue'
import { useScheduleStore } from '@/stores/schedule'

import type { ScheduleEvent, ScheduleForm } from '@/types/schedule'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import ReturnButton from '@/components/ReturnButton.vue'

const props = defineProps<{
  date: string
  id: string
}>()

const router = useRouter()
const route = useRoute()

const scheduleStore = useScheduleStore()
const tagStore = useTagStore()

const schedule = computed(() => scheduleStore.getScheduleData(props.date, props.id))

const formSchema = toTypedSchema(
  z.object({
    title: z
      .string('标题不能为空且必须为字符串')
      .min(2, '标题不能少于2个字')
      .max(50, '标题不能超过50个字'),
    description: z.string('描述不能为空且必须为字符串'),
    date: z.string().refine((v) => v, '请选择日期'),
    category: z.refine(() => true),
    priority: z.enum(['low', 'medium', 'high'], '请选择优先级'),
    completed: z.refine(() => true),
    startTime: z.refine(() => true),
    endTime: z.refine(() => true),
  }),
)

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const placeholder = ref()

const { handleSubmit, setFieldValue, values } = useForm<ScheduleForm>({
  validationSchema: formSchema,
  initialValues: {
    date: props.date,
    title: schedule.value?.title,
    description: schedule.value?.description,
    category: schedule.value?.category,
    priority: schedule.value?.priority,
    completed: schedule.value?.completed,
    startTime: schedule.value?.startTime,
    endTime: schedule.value?.endTime,
  },
})

const value = computed({
  get: () => (values.date ? parseDate(values.date) : undefined),
  set: (val) => val,
})

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

const onSubmit = handleSubmit((validateValues) => {
  console.log('Form submitted!', validateValues)
  if (values.date === undefined) {
    console.log('date is null')
    return
  }
  console.log(values)
  scheduleStore.updateScheduleData(values.date, { ...values, id: props.id }, props.date)
  toast.success('修改成功')
  router.push('/calendar')
})

const handleReturn = () => {
  const returnPath = route.query?.from || '/'
  console.log(returnPath)
  router.push(returnPath as string)
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 lg:p-8">
      <!-- <div> -->
      <!-- <Button
        type="button"
        class="w-auto px-8 h-12 text-white font-medium
         rounded-lg transition-all transform hover:scale-[1.02] 
         active:scale-[0.98]"
        >返回</Button
      > -->
      <ReturnButton @click="handleReturn" />
      <div class="p-6 sm:p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">修改日程</h2>
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
                    class="px-3 py-1.5"
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
              >修改</Button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
