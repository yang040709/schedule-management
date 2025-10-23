import { getLocalTimeZone, today } from '@internationalized/date'
export const getTodayDate = () => {
  return today(getLocalTimeZone()).toString()
}
