import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date'

import { computed, h, ref } from 'vue'

import { useTagStore } from '@/stores/tag'

import { useScheduleStore } from '@/stores/schedule'

import type { ScheduleEvent, ScheduleForm } from '@/types/schedule'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

// interface
type ScheduleInitType = ScheduleForm | (() => ScheduleForm)

export const useScheduleFrom = (initialParam: ScheduleInitType, submitFunc: () => void) => {
  const router = useRouter()
  const route = useRoute()

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

  let initialValues = null
  if (typeof initialParam === 'function') {
    initialValues = initialParam()
  } else {
    initialValues = initialParam
  }

  const { handleSubmit, setFieldValue, values } = useForm<ScheduleForm>({
    validationSchema: formSchema,
    initialValues: initialValues,
  })

  const value = computed({
    get: () => (values.date ? parseDate(values.date) : undefined),
    set: (val) => val,
  })

  const scheduleStore = useScheduleStore()

  const tagStore = useTagStore()

  const addTags = (item: string) => {
    if (!values.category) {
      setFieldValue('category', [item])
    } else if (!(values.category instanceof Array)) {
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
    if (values.date === undefined) {
      console.log('date is null')
      return
    }
    submitFunc()
    // scheduleStore.setScheduleData(values.date, values)
    // toast.success('添加日程成功', {
    //   description: '1秒后跳转到日历页',
    // })
    // setTimeout(() => {
    //   const defaultDate = today(getLocalTimeZone()).toString()
    //   const from = (route.query?.date as string) || defaultDate
    //   router.push({
    //     name: 'calendar',
    //     params: {
    //       date: from,
    //     },
    //   })
    // }, 1000)
  })

  const handleReturn = () => {
    const returnPath = route.query?.from || '/'
    console.log(returnPath)
    router.push(returnPath as string)
  }
  return {
    onSubmit,
    handleReturn,
    addTags,
    values,
    setFieldValue,
    formSchema,
    tagStore,
    scheduleStore,
    placeholder,
    value,
    df,
  }
}
