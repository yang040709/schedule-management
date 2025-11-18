import { z } from 'zod'

// 习惯表单验证模式
export const habitFormSchema = z.object({
  title: z
    .string('习惯名称不能为空')
    .min(1, '习惯名称不能为空')
    .max(50, '习惯名称不能超过50个字符'),
  description: z.string('习惯描述不能为空').max(200, '习惯描述不能超过200个字符').optional(),
  goal: z.object({
    targetDays: z
      .number('目标天数不能为空')
      .min(1, '目标天数至少为1天')
      .max(365, '目标天数不能超过365天'),
    durationMinutes: z
      .number('每次时长不能为空')
      .min(1, '每次时长至少为1分钟')
      .max(480, '每次时长不能超过8小时'),
  }),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  category: z.array(z.string()).max(5, '最多只能选择5个分类').optional(),
})

// 打卡表单验证模式
export const checkInFormSchema = z.object({
  habitId: z.string('习惯ID不能为空').min(1, '习惯ID不能为空'),
  notes: z.string('备注不能为空').max(100, '备注不能超过100个字符').optional(),
  mood: z.number('情绪评分不能为空').min(1).max(5).optional(),
  duration: z.number('时长不能为空').min(1).max(480).optional(),
})

// 修改习惯表单验证模式
export const modifyHabitFormSchema = habitFormSchema.partial()

export type HabitFormInput = z.infer<typeof habitFormSchema>
export type CheckInFormInput = z.infer<typeof checkInFormSchema>
export type ModifyHabitFormInput = z.infer<typeof modifyHabitFormSchema>
