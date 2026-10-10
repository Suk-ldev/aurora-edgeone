/**
 * 路径白名单：只放行前端页面和转发用到的路径，其他一律 404
 * 不拦的话平台会把任意路径回退到 index.html，/xxx 这种地址也能打开前端
 */
const ALLOWED_PATHS = [
  /^\/$/, // 首页，前端路由都在 # 后面
  /^\/index\.html$/,
  /^\/favicon\.svg$/,
  /^\/static\//, // 构建产物和静态资源
  /^\/api\//, // 接口，见 edge-functions/api
  /^\/d\//, // 订阅链接，见 edge-functions/d
  /^\/plugin\/rule-hub\//, // 分流规则集，见 edge-functions/plugin/rule-hub
  /^\/api\/v1\/client-hub\// // 客户端助手，见 edge-functions/plugin/client-hub
]

/**
 * 需要校验请求头才放行的路径
 *
 * 完整界面文案放在 /static/data/ 下，登录后由前端带头拉取。
 * 不拦的话扫描器直接 GET 就能拿到全站词汇 —— 这正是之前最大的一处泄露。
 */
const GUARDED_PATHS = [/^\/static\/data\//]

// 与 edge-functions/_shared/not-found.js 保持完全一致，改一处要同步改另一处
function notFound() {
  return new Response('404 Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}

export function middleware(context) {
  const { request, next, env } = context
  const { pathname } = new URL(request.url)

  if (GUARDED_PATHS.some((re) => re.test(pathname))) {
    const expected = String((env && env.CLIENT_KEY) || '')
    const got = request.headers.get('x-csrf-token') || ''
    // 中间件拿不到 env 时退化成「必须带头」，仍能挡住裸 GET
    if (expected ? got !== expected : !got) {
      return notFound()
    }
  }

  if (ALLOWED_PATHS.some((re) => re.test(pathname))) {
    return next()
  }
  return notFound()
}

// 所有请求都先经过这里
export const config = {
  matcher: '/:path*'
}
