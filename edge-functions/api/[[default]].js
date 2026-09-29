/**
 * 接口转发
 *
 * 前端发的是 _shared/api-map.js 里的中性路径，这里查表还原成真实后端路径再转发。
 * 三道门：请求头不对 → 404；路径不在映射表里 → 404；免鉴权的 bootstrap 只放行白名单字段。
 * 浏览器只和当前域名通信，后端地址不会出现在前端代码和网络请求里。
 */
import { API_MAP } from '../_shared/api-map.js'
import { notFound } from '../_shared/not-found.js'

const BOOTSTRAP = '/api/bootstrap'

/**
 * bootstrap 是唯一不需要登录就能调的接口，直接透传等于把后端的响应结构送出去。
 * 只保留登录/注册页真正用到的 5 个字段，并换成中性名。
 */
const BOOTSTRAP_FIELDS = {
  is_recaptcha: 'captchaOn',
  recaptcha_site_key: 'captchaKey',
  is_email_verify: 'verifyEmail',
  is_invite_force: 'inviteRequired',
  email_whitelist_suffix: 'emailDomains'
}

/** 真实路径 → 中性路径，用于改写后端返回的跳转地址 */
const REVERSE_MAP = {}
for (const neutral in API_MAP) {
  REVERSE_MAP[API_MAP[neutral]] = neutral
}

function jsonError(status, message) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  })
}

async function filterBootstrap(response) {
  if (!response.ok) {
    // 未鉴权接口不要把后端的错误内容吐出去
    return notFound()
  }
  let body
  try {
    body = await response.json()
  } catch (e) {
    return notFound()
  }
  const src = (body && body.data) || {}
  const data = {}
  for (const key in BOOTSTRAP_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(src, key)) {
      data[BOOTSTRAP_FIELDS[key]] = src[key]
    }
  }
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  })
}

export async function onRequest({ request, env }) {
  const apiUrl = String(env.API_URL || '').trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(apiUrl)) {
    // 配置缺失也走统一 404，不要吐出「未配置 API_URL」这类可识别的错误
    return notFound()
  }

  // CLIENT_KEY 没配置时跳过校验：漏配一个环境变量不至于让整站不可用。
  // 配上之后，不带正确请求头的裸探测一律 404。
  const clientKey = String(env.CLIENT_KEY || '')
  if (clientKey && request.headers.get('x-csrf-token') !== clientKey) {
    return notFound()
  }

  const url = new URL(request.url)
  const target = API_MAP[url.pathname]
  if (!target) {
    return notFound()
  }

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('x-csrf-token')

  // 把用户真实 IP 带给后端，后端要信任代理才会用上
  const clientIp = request.eo && request.eo.clientIp
  if (clientIp) {
    headers.set('X-Real-IP', clientIp)
    headers.set('X-Forwarded-For', clientIp)
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD'

  let response
  try {
    response = await fetch(apiUrl + target + url.search, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: 'manual'
    })
  } catch (e) {
    return jsonError(502, 'Upstream unavailable')
  }

  if (url.pathname === BOOTSTRAP) {
    return filterBootstrap(response)
  }

  // 后端跳回自己域名时换成当前域名；若跳的是真实接口路径，反查成中性路径
  const location = response.headers.get('Location')
  if (location && (location === apiUrl || location.startsWith(apiUrl + '/'))) {
    let rest = location.slice(apiUrl.length) || '/'
    const cut = rest.indexOf('?')
    const bare = cut === -1 ? rest : rest.slice(0, cut)
    if (REVERSE_MAP[bare]) {
      rest = REVERSE_MAP[bare] + (cut === -1 ? '' : rest.slice(cut))
    }
    const res = new Response(response.body, response)
    res.headers.set('Location', url.origin + rest)
    return res
  }

  return response
}
