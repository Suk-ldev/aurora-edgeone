import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'

/**
 * 获取流量明细
 */
export function getFlowList() {
  return request({
    url: SERVER_URL + '/api/v1/user/stat/getTrafficLog',
    method: 'get'
  })
}
