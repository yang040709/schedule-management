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

import type { ScheduleEvent, ScheduleForm } from '@/types/schedule'
import { toast } from 'vue-sonner'
// interface
type ScheduleInitType = ScheduleForm | (() => ScheduleForm)

export const useScheduleFrom = (initialParam: ScheduleForm, submitFunc: () => void) => {
  const formSchema = toTypedSchema(
    z.object({
      title: z
        .string('标题不能为空且必须为字符串')
        .min(2, '标题不能少于2个字')
        .max(50, '标题不能超过50个字'),
      description: z.string('描述不能为空且必须为字符串'),
      date: z.string('日期不能为空').refine((v) => v, '请选择日期'),
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

  const { handleSubmit, setFieldValue, values, validate } = useForm<ScheduleForm>({
    validationSchema: formSchema,
    initialValues: initialParam,
  })

  // watch()

  const value = computed({
    get: () => (values.date ? parseDate(values.date) : undefined),
    set: (val) => val,
  })

  const tagStore = useTagStore()

  // const addTags = (item: string) => {
  //   if (!values.category) {
  //     setFieldValue('category', [item])
  //   } else if (!(values.category instanceof Array)) {
  //     setFieldValue('category', [item])
  //   } else if (!values.category.includes(item)) {
  //     // values.category.push(item)
  //     setFieldValue('category', [...values.category, item])
  //   } else {
  //     const newTags = values.category.filter((i: string) => i !== item)
  //     setFieldValue('category', [...newTags])
  //   }
  //   console.log(values.category)
  // }

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
    // addTags,
    values,
    setFieldValue,
    formSchema,
    // tagStore,
    placeholder,
    value,
    df,
    categoryInput,
    addCategory,
    removeCategory,
    addCategoryByClickTag,
  }
}
