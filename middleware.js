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
  /^\/s\// // 订阅链接，见 edge-functions/s，后台改了订阅路径这里也要改
]

export function middleware({ request, next }) {
  const { pathname } = new URL(request.url)
  if (ALLOWED_PATHS.some((re) => re.test(pathname))) {
    return next()
  }
  return new Response('404 Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}

// 所有请求都先经过这里
export const config = {
  matcher: '/:path*'
}
