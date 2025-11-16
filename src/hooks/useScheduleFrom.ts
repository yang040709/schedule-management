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

import { computed, watch, ref } from 'vue'

import { useTagStore } from '@/stores/tag'

import type { ScheduleForm } from '@/types/schedule'
import { toast } from 'vue-sonner'
import { getTodayDate } from '@/utils/date'
// interface
type ScheduleInitType = ScheduleForm | (() => ScheduleForm)

export const useScheduleFrom = (initialParam: ScheduleForm, submitFunc: () => void) => {
  const formSchema = toTypedSchema(
    z.object({
      title: z.string().min(1, '标题不能为空'),
      description: z.string().optional(),
      priority: z.enum(['high', 'medium', 'low']),
      category: z.array(z.string()).optional(),
      dependentId: z.string().optional(),
      timeOfDay: z
        .object({
          startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
            message: '开始时间格式应为 HH:mm 或 HH:mm:ss',
          }),
          endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
            message: '结束时间格式应为 HH:mm 或 HH:mm:ss',
          }),
        })
        .optional(),

      // 公共字段
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: '日期格式应为 YYYY-MM-DD',
      }),
    }),
  )

  const df = new DateFormatter('en-US', {
    dateStyle: 'long',
  })

  const placeholder = ref()

  const { handleSubmit, setFieldValue, values, validate } = useForm<ScheduleForm>({
    validationSchema: formSchema,
    initialValues: initialParam,
  })

  // watch()

  const singleDate = computed({
    get: () => {
      return values.date ? parseDate(values.date) : undefined
    },
    set: (val) => val,
  })

  // const singleDate=ref(getTodayDate());

  const tagStore = useTagStore()

  const onSubmit = async () => {
    const result = await validate()
    console.log(result)
    if (!result.valid) {
      const errKey = Object.keys(result.errors)[0]
      if (typeof errKey === 'string') {
        // @ts-ignore
        const errMsg = result.errors[errKey as keyof result]
        toast.error(errMsg)
        return
      } else {
        toast.error('请填写完整表单,您有必填项未填写')
      }
      return
    }

    const submitFn = handleSubmit(() => {
      console.log('submit')

      submitFunc()
    })
    submitFn()
  }

  const categoryInput = ref('')
  const addCategory = () => {
    console.log(values.category)
    if (!categoryInput.value || categoryInput.value.trim().length === 0) return
    if (!values.category) {
      setFieldValue('category', [categoryInput.value])
      categoryInput.value = ''
    } else if (!values.category.includes(categoryInput.value)) {
      setFieldValue('category', [...values.category, categoryInput.value])
      categoryInput.value = ''
    }
    tagStore.addTag(categoryInput.value)
  }

  const removeCategory = (item: string) => {
    if (!values.category) return
    const newTags = values.category.filter((i: string) => i !== item)
    setFieldValue('category', [...newTags])
  }

  const addCategoryByClickTag = (text: string) => {
    if (!text || text.trim().length === 0) {
      return
    }
    if (!values.category) {
      setFieldValue('category', [text])
    } else if (!values.category.includes(text)) {
      setFieldValue('category', [...values.category, text])
    }
  }

  return {
    onSubmit,
    values,
    setFieldValue,
    formSchema,
    placeholder,
    singleDate,
    df,
    categoryInput,
    addCategory,
    removeCategory,
    addCategoryByClickTag,
  }
}
