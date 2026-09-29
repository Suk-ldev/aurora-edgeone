/**
 * 订阅链接转发：/d/<token> → 后端的订阅接口
 *
 * 这条链路刻意「不」校验请求头 —— 代理客户端没法带自定义头，校验了就拉不到节点。
 * 因此它是整站暴露面最大的一环：token 一旦泄露，这个域名就可能被确认。
 * token 格式不对时返回与全站一致的 404，不给出任何可区分的响应。
 */
import { SUBSCRIBE_PREFIX, SUBSCRIBE_TARGET } from '../_shared/api-map.js'
import { notFound } from '../_shared/not-found.js'

const TOKEN_RE = /^[A-Za-z0-9_-]{8,128}$/

export async function onRequest({ request, env }) {
  const apiUrl = String(env.API_URL || '').trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(apiUrl)) {
    return notFound()
  }

  const url = new URL(request.url)
  if (!url.pathname.startsWith(SUBSCRIBE_PREFIX)) {
    return notFound()
  }
  const token = url.pathname.slice(SUBSCRIBE_PREFIX.length)
  if (!TOKEN_RE.test(token)) {
    return notFound()
  }

  const headers = new Headers(request.headers)
  headers.delete('host')
  const clientIp = request.eo && request.eo.clientIp
  if (clientIp) {
    headers.set('X-Real-IP', clientIp)
    headers.set('X-Forwarded-For', clientIp)
  }

  // 客户端会带 ?flag=clash 之类的参数决定输出格式，原样往后带
  const extra = url.search ? '&' + url.search.slice(1) : ''
  const upstream = apiUrl + SUBSCRIBE_TARGET + '?token=' + encodeURIComponent(token) + extra

  try {
    return await fetch(upstream, { method: request.method, headers, redirect: 'manual' })
  } catch (e) {
    return notFound()
  }
}
