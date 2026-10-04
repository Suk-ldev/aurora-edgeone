/**
 * 分流规则集转发：/plugin/rule-hub/... → 后端同路径
 *
 * 后端装了「在线分流规则」插件并选「客户端下载规则集」时，订阅里的规则集链接用的是后台
 * 「订阅URL」的域名，也就是这个域名。代理客户端定时来拉，和订阅链接一样带不了校验头，
 * 所以不校验请求头，改为收紧其它方面：
 * - 路径必须完全符合插件生成的格式，只转发 GET / HEAD，不带查询参数
 * - 后端返回非 2xx 时一律统一 404，裸探测拿不到后端的错误页
 * - 响应只保留内容类型和缓存头，后端的其它响应头不往外带
 */
import { notFound } from '../../_shared/not-found.js'

// 与插件 routes/web.php 的路由约束一致：/plugin/rule-hub/<方案指纹>/<客户端>/<编号>-<分片>.<扩展名>
const RULESET_RE =
  /^\/plugin\/rule-hub\/[0-9a-f]{16}\/(clashmeta|clash|stash|singbox|surge|surfboard)\/[0-9a-f]{10}-(domain|ipcidr|classical|json)\.(txt|json)$/

const PASS_HEADERS = ['Content-Type', 'Cache-Control']

export async function onRequest({ request, env }) {
  const apiUrl = String(env.API_URL || '').trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(apiUrl)) {
    return notFound()
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return notFound()
  }

  const url = new URL(request.url)
  if (!RULESET_RE.test(url.pathname)) {
    return notFound()
  }

  const headers = new Headers()
  const userAgent = request.headers.get('user-agent')
  if (userAgent) {
    headers.set('User-Agent', userAgent)
  }
  const clientIp = request.eo && request.eo.clientIp
  if (clientIp) {
    headers.set('X-Real-IP', clientIp)
    headers.set('X-Forwarded-For', clientIp)
  }

  let response
  try {
    response = await fetch(apiUrl + url.pathname, { method: request.method, headers, redirect: 'manual' })
  } catch (e) {
    return notFound()
  }
  if (!response.ok) {
    return notFound()
  }

  const out = new Headers()
  for (const name of PASS_HEADERS) {
    const value = response.headers.get(name)
    if (value) {
      out.set(name, value)
    }
  }
  return new Response(request.method === 'HEAD' ? null : response.body, { status: response.status, headers: out })
}
