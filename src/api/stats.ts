import type { DashboardStats } from '@/types/stat'
import request from '.'
export const getStatsApi = async () => {
  return request({
    url: '/stats',
  }) as Promise<DashboardStats>
}
