import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'

/**
 * 获取文档目录
 */
export function getKnowledgeCatalog(language) {
  return request({
    url: SERVER_URL + '/api/v1/user/knowledge/fetch',
    method: 'get',
    params: {
      language
    }
  })
}

/**
 * 获取文档详情
 */
export function getKnowledgeInfo(id, language) {
  return request({
    url: SERVER_URL + '/api/v1/user/knowledge/fetch',
    method: 'get',
    params: {
      language,
      id
    }
  })
}
