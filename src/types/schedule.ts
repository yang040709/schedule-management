// 例如，优先级如果只有固定的几个级别
type PriorityLevel = 1 | 2 | 3 | 4 | 5
// 或者分类名称预定义
// type CategoryTag = 'work' | 'personal' | 'health' | 'shopping';

// 日程项接口，定义单个日程的详细结构
export interface ScheduleEvent {
  id: string
  title: string
  description?: string // 可选字段，使用?
  startTime: string
  endTime: string
  priority: PriorityLevel
  category: string[] // 分类支持多个标签
  completed: boolean
}

// 主数据结构接口，以日期字符串为键，日程项数组为值
export interface ScheduleData {
  [date: string]: ScheduleEvent[] // 索引签名，允许动态的日期键
}
