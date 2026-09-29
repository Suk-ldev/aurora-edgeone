/**
 * 接口请求校验头
 *
 * 前端每个 /api 请求都会带上，边缘函数校验不通过直接返回 404。
 * 这样扫描器裸探测接口路径时拿不到任何可用于识别的响应。
 *
 * 值来自构建期环境变量 CLIENT_KEY，和边缘函数读的是同一个变量，
 * 在 EdgeOne「项目设置 → 环境变量」里配置，改完需要重新部署。
 */
export const CLIENT_KEY_HEADER = 'X-Csrf-Token'

export const CLIENT_KEY = process.env.VUE_APP_CLIENT_KEY || ''
