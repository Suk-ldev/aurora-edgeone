/**
 * 把 /api/* 转发到环境变量 API_URL 配置的后端
 * 浏览器只和当前域名通信，后端域名不会出现在前端代码和网络请求里
 */
function jsonError(status, message) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  })
}

export async function onRequest({ request, env }) {
  const apiUrl = String(env.API_URL || '').trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(apiUrl)) {
    return jsonError(500, '未配置环境变量 API_URL')
  }

  const url = new URL(request.url)
  const headers = new Headers(request.headers)
  headers.delete('host')

  // 把用户真实 IP 带给后端，后端要信任代理才会用上
  const clientIp = request.eo && request.eo.clientIp
  if (clientIp) {
    headers.set('X-Real-IP', clientIp)
    headers.set('X-Forwarded-For', clientIp)
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD'

  let response
  try {
    response = await fetch(apiUrl + url.pathname + url.search, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: 'manual'
    })
  } catch (e) {
    return jsonError(502, '后端连接失败')
  }

  // 后端跳转回自己域名时换成当前域名，避免把后端域名暴露给用户
  const location = response.headers.get('Location')
  if (location && (location === apiUrl || location.startsWith(apiUrl + '/'))) {
    const res = new Response(response.body, response)
    res.headers.set('Location', url.origin + location.slice(apiUrl.length))
    return res
  }

  return response
}
