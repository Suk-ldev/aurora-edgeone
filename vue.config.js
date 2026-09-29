'use strict'
const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

// 站点配置见 site.config.js；环境变量只有 API_URL，给边缘函数和本地开发代理用
const { loadingText, customHtml, ...site } = require('./site.config')

/**
 * 读取接口映射表，给本地开发代理用（线上是边缘函数查同一张表）
 *
 * _shared/api-map.js 是 ESM（边缘函数和 webpack 都要用），而本文件是 CommonJS，
 * 没法直接 require，所以这里按字面量解析。只影响 npm run dev，
 * 解析出问题本地会立刻报错，不影响线上构建产物。
 * 表的正确性由 scripts/check-api-map.mjs 校验。
 */
function loadApiMap() {
  const src = fs.readFileSync(path.resolve(__dirname, 'edge-functions/_shared/api-map.js'), 'utf8')
  const start = src.indexOf('export const API_MAP = {')
  const body = src.slice(src.indexOf('{', start), src.indexOf('\n}', start) + 2)
  return JSON.parse(body.replace(/'/g, '"'))
}

function isProd() {
  return process.env.NODE_ENV === 'production'
}

function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(str).replace(/[&<>"']/g, (c) => map[c])
}

// 前端读取的 window.__CFG，site.config.js 里删掉的项用默认值补上
const siteConfig = {
  appName: 'Aurora',
  appDesc: '',
  appLogo: '',
  appVersion: '',
  appTheme: 'auto',
  appColor: 'default',
  showRegInvite: 'show',
  slogan: '',
  helpUrl: '',
  clientIOS: '',
  clientAndroid: '',
  clientWindows: '',
  clientMacOS: '',
  clientOpenwrt: '',
  clientLinux: '',
  customLink1: '',
  customLink2: '',
  extraMenus: [],
  ...site,
  staticUrl: '/static'
}

/**
 * 内联进 HTML 的配置，只放登录页和启动脚本真正需要的字段
 *
 * 其余字段（客户端下载地址、侧边栏额外菜单等）键名本身就是特征 ——
 * 通用控制台不会有 clientOpenwrt —— 所以拆出去登录后再下发。
 * showRegInvite 留在这里，因为注册页是未登录页面。
 */
const BOOT_KEYS = ['appName', 'appDesc', 'appTheme', 'appColor', 'showRegInvite', 'staticUrl']

const bootConfig = {}
const appConfig = {}
Object.keys(siteConfig).forEach((key) => {
  ;(BOOT_KEYS.indexOf(key) === -1 ? appConfig : bootConfig)[key] = siteConfig[key]
})

/** 登录后下发的那部分，文件名与 src/core/app-config.js 里的一致 */
const APP_CONFIG_FILE = 'e5b2c8'
const dataDir = path.resolve(__dirname, 'public/static/data')
fs.mkdirSync(dataDir, { recursive: true })
fs.writeFileSync(path.join(dataDir, APP_CONFIG_FILE + '.json'), JSON.stringify(appConfig))

function getEnvConfig() {
  // 把 < 转义成 unicode，防止配置值里的 </script> 把标签提前闭合
  const json = JSON.stringify(bootConfig, null, 2).replace(/</g, '\\u003c')
  return `<script>window.__CFG = ${json}</script>`
}

function getFavicon() {
  return `<link rel="icon" href="${escapeHtml(siteConfig.appLogo || '/favicon.svg')}" />`
}

function getCustomLoading() {
  if (loadingText) {
    return `<div class="boot">${loadingText}</div>`
  }
  return '<div class="boot"><div class="boot-spin"></div></div>'
}

process.env.VUE_APP_TIME = dayjs().format('YYYYMMDDHHmmss')
process.env.VUE_APP_CLIENT_KEY = process.env.CLIENT_KEY || ''
process.env.VUE_APP_ENV = getEnvConfig()
process.env.VUE_APP_HTML = customHtml || ''
process.env.VUE_APP_TITLE = escapeHtml(siteConfig.appName)
process.env.VUE_APP_META_DESC = escapeHtml(siteConfig.appDesc)
process.env.VUE_APP_LOADING = getCustomLoading()
process.env.VUE_APP_FAVICON = getFavicon()

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    compress: false,
    progress: false,
    port: 7800,
    open: false,
    overlay: {
      warnings: false,
      errors: false
    },
    // 本地开发模拟线上边缘函数：把中性路径还原成真实后端路径，再转发到 .env.local 的 API_URL
    proxy: {
      '^/api/': {
        target: process.env.API_URL || 'http://localhost',
        changeOrigin: true,
        pathRewrite(reqPath) {
          const cut = reqPath.indexOf('?')
          const bare = cut === -1 ? reqPath : reqPath.slice(0, cut)
          const target = loadApiMap()[bare]
          return target ? target + (cut === -1 ? '' : reqPath.slice(cut)) : reqPath
        }
      },
      '^/d/': {
        target: process.env.API_URL || 'http://localhost',
        changeOrigin: true,
        pathRewrite(reqPath) {
          const cut = reqPath.indexOf('?')
          const bare = cut === -1 ? reqPath : reqPath.slice(0, cut)
          const extra = cut === -1 ? '' : '&' + reqPath.slice(cut + 1)
          return '/api/v1/client/subscribe?token=' + bare.replace(/^\/d\//, '') + extra
        }
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass')
      }
    }
  },
  configureWebpack: {
    plugins: [
      new AntdDayjsWebpackPlugin({
        preset: 'antdv3'
      })
    ]
  },
  chainWebpack(config) {
    // 接口路径映射表跟边缘函数共用一个文件，避免两边漂移
    config.resolve.alias.set('@api-map', path.resolve(__dirname, 'edge-functions/_shared/api-map.js'))

    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    if (isProd()) {
      config.plugin('html').tap((args) => {
        args[0].minify = false
        return args
      })
    }

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .plugin('ScriptExtHtmlWebpackPlugin')
      .after('html')
      .use('script-ext-html-webpack-plugin', [
        {
          inline: /runtime\..*\.js$/
        }
      ])
      .end()

    config.devtool(isProd() ? false : 'cheap-source-map')

    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        }
      }
    })
    config.optimization.runtimeChunk('single')
  }
}
