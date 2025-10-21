// 例如，优先级如果只有固定的几个级别
export type PriorityLevel = 'high' | 'medium' | 'low'
// 或者分类名称预定义
// type CategoryTag = 'work' | 'personal' | 'health' | 'shopping';

// 日程项接口，定义单个日程的详细结构
export interface ScheduleEvent {
  id: string // 唯一标识符
  title: string // 标题
  description?: string // 可选字段，使用?
  startTime?: string // 开始时间
  endTime?: string // 结束时间
  priority: PriorityLevel // 优先级
  category?: string[] // 分类支持多个标签
  completed: boolean // 完成状态
  date: string
}

export interface ScheduleEventV1 extends Omit<ScheduleEvent, 'date'> {}

// 主数据结构接口，以日期字符串为键，日程项数组为值
export interface ScheduleDataV1 {
  [date: string]: ScheduleEventV1[] // 索引签名，允许动态的日期键
}

export type ScheduleData = ScheduleEvent[]

export interface ScheduleForm extends Omit<ScheduleEvent, 'id'> {}
