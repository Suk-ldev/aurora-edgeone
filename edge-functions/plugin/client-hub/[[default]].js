/**
 * 客户端助手转发：/api/v1/client-hub/... → 后端同路径
 *
 * 后端装了「客户端助手」插件后，代理客户端在面板地址下探测 /info、上报 /telemetry、
 * 拉 /update 和 /domains。客户端用自己的 HTTP 栈，带不了校验头，所以不校验，
 * 收紧其它方面：
 * - 只转发插件存在的四个路径，只收 GET / HEAD 和带 JSON 体的 POST
 * - 请求体限 64KB，去掉可能带凭据的头，把真实 IP 补给后端限流用
 * - 后端 404/4xx 一律原样转发状态码（客户端靠 404 判断插件是否安装），但不透传后端响应头
 */
import { notFound } from '../../_shared/not-found.js'

const HUB_RE = /^\/api\/v1\/client-hub\/(info|telemetry|update|domains)$/
const MAX_BODY_BYTES = 64 * 1024

const PASS_HEADERS = ['Content-Type', 'Cache-Control']

export async function onRequest({ request, env }) {
  const apiUrl = String(env.API_URL || '').trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(apiUrl)) {
    return notFound()
  }

  const url = new URL(request.url)
  if (!HUB_RE.test(url.pathname)) {
    return notFound()
  }

  const hasBody = request.method === 'POST'
  if (!hasBody && request.method !== 'GET' && request.method !== 'HEAD') {
    return notFound()
  }
  let body
  if (hasBody) {
    if (request.headers.get('content-type') !== 'application/json') {
      return notFound()
    }
    body = await request.arrayBuffer()
    if (body.byteLength > MAX_BODY_BYTES) {
      return notFound()
    }
  }

  const headers = new Headers({ Accept: 'application/json' })
  if (body) {
    headers.set('Content-Type', 'application/json')
  }
  const userAgent = request.headers.get('user-agent')
  if (userAgent) {
    headers.set('User-Agent', userAgent)
  }
  const clientIp = request.eo && request.eo.clientIp
  if (clientIp) {
    // 后端按 IP 和安装 ID 限流
    headers.set('X-Real-IP', clientIp)
    headers.set('X-Forwarded-For', clientIp)
  }

  let response
  try {
    response = await fetch(apiUrl + url.pathname, {
      method: request.method,
      headers,
      body,
      redirect: 'manual'
    })
  } catch (e) {
    return notFound()
  }

  // 插件没装时后端给 404 —— 原样返回 404，客户端才知道这台面板没装插件，
  // 但后端的错误页（比如 Laravel 调试页）不透传
  if (response.status === 404) {
    return notFound()
  }

  const out = new Headers()
  for (const name of PASS_HEADERS) {
    const value = response.headers.get(name)
    if (value) {
      out.set(name, value)
    }
  }
  return new Response(request.method === 'HEAD' ? null : response.body, {
    status: response.status,
    headers: out
  })
}
