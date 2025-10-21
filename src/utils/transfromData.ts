import type { ScheduleDataV1, ScheduleData } from '@/types/schedule'
import { oldScheduleData } from './data/old-schedule'

export const transfromScheduleDatav1Tov2 = (data: ScheduleDataV1) => {
  const result: ScheduleData = []
  Object.keys(data).forEach((key) => {
    if (data[key] && data[key].length) {
      data[key].forEach((item) => {
        result.push({ ...item, date: key })
      })
    }
  })
  return result
}

const res = transfromScheduleDatav1Tov2(oldScheduleData)
console.log(res)
