/**
 * 环境配置
 */
export const ENV_CONFIG = window.__CFG

/**
 * 前端根目录
 */
export const STATIC_URL = ENV_CONFIG.staticUrl

/**
 * 取当前访问页面的根地址（协议 + 域名 + 端口）
 * 兼容不支持 location.origin 的旧浏览器
 */
function getCurrentOrigin() {
  const { protocol, host, origin } = window.location
  return origin || `${protocol}//${host}`
}

/**
 * 服务端根路径
 *
 * 固定用当前访问的网址：/api 请求由 EdgeOne 边缘函数转发到环境变量 API_URL 配置的后端，
 * 浏览器始终看不到后端域名，前端换域名也不用改任何配置
 */
export const SERVER_URL = getCurrentOrigin()
/**
 * 注册时是否显示邀请码（用户配置）
 */
export const SHOW_REG_INVITE = ENV_CONFIG.showRegInvite === 'show'

/**
 * 应用名称（用户配置）
 */
export const APP_NAME = ENV_CONFIG.appName

/**
 * 应用描述（用户配置）
 */
export const APP_DESC = ENV_CONFIG.appDesc

/**
 * 主题模式（用户配置）
 */
export const APP_THEME = ENV_CONFIG.appTheme

/**
 * 主题颜色（用户配置）
 */
export const APP_COLOR = ENV_CONFIG.appColor

// Logo、版本号、客户端下载地址、slogan、额外菜单等不在这里 ——
// 这些键名本身就是特征，改为登录后下发，见 src/core/app-config.js
