import { SERVER_URL } from '@/core/constants'
import request from '@/core/utils/request'
import { PATHS } from '@api-map'

/**
 * 获取文档目录
 */
export function getKnowledgeCatalog(language) {
  return request({
    url: SERVER_URL + PATHS.DOCS,
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
    url: SERVER_URL + PATHS.DOCS,
    method: 'get',
    params: {
      language,
      id
    }
  })
}
