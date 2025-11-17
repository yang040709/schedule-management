import request from '.'
import type { ExportResponse, ImportBody } from '@/types/setting'

export const exportDataApi = async () => {
  return request({
    url: '/export/data',
    method: 'GET',
  }) as Promise<ExportResponse>
}

export const importDataApi = async (data: ImportBody) => {
  return request({
    url: '/import/data',
    method: 'POST',
    data: {
      data,
    },
  }) as Promise<undefined>
}
