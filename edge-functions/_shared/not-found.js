/**
 * 全站统一的 404
 *
 * 路径白名单、接口校验失败、映射表未命中、订阅 token 格式不对，全部返回这一个响应。
 * 各处 404 必须完全一致 —— 响应体或状态码有差异，差异本身就成了指纹。
 * middleware.js 里有一份相同实现（跨根目录 import 在平台上未经验证），改这里要同步改那边。
 */
export function notFound() {
  return new Response('404 Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
