import dayjs from 'dayjs'
/**
 * 获得今天的日期，格式为 YYYY-MM-DD
 * @returns
 */
export const getTodayDate = () => {
  return dayjs().format('YYYY-MM-DD')
}

/**
 * 获得今天的日期时间，格式为 YYYY-MM-DD HH:mm:ss
 * @returns
 */

export const getTodayDateTime = () => {
  return dayjs().format('YYYY-MM-DDTHH:mm:ss')
}
