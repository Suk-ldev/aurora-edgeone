import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'
import { PATHS } from '@api-map'

/**
 * 获取流量明细
 */
export function getFlowList() {
  return request({
    url: SERVER_URL + PATHS.USAGE_SERIES,
    method: 'get'
  })
}
