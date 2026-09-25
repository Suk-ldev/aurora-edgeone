'use strict'
const dayjs = require('dayjs')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

// 站点配置见 site.config.js；环境变量只有 API_URL，给边缘函数和本地开发代理用
const { loadingText, customHtml, ...site } = require('./site.config')

function isProd() {
  return process.env.NODE_ENV === 'production'
}

function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(str).replace(/[&<>"']/g, (c) => map[c])
}

// 前端读取的 window.EnvConfig，site.config.js 里删掉的项用默认值补上
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

function getEnvConfig() {
  // 把 < 转义成 unicode，防止配置值里的 </script> 把标签提前闭合
  const json = JSON.stringify(siteConfig, null, 2).replace(/</g, '\\u003c')
  return `<script>window.EnvConfig = ${json}</script>`
}

function getFavicon() {
  return `<link rel="icon" href="${escapeHtml(siteConfig.appLogo || '/favicon.svg')}" />`
}

function getCustomLoading() {
  if (loadingText) {
    return `<div class="loading-user">${loadingText}</div>`
  }
  return `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="hourglassx" x="0px" y="0px" viewBox="0 0 203 203" enable-background="new 0 0 203 203" xml:space="preserve">
      <g>
        <path
          class="hourglass"
          fill="none"
          stroke="#C0E5FA"
          stroke-width="5"
          stroke-linecap="round"
          stroke-miterlimit="10"
          d="M137.5,169.5h-72
		c0-72,63-73,63-126h-54C74.5,96.5,137.5,97.5,137.5,169.5z"
        />
        <path
          class="hourglass"
          fill="none"
          stroke="#74C2EE"
          stroke-width="5"
          stroke-linecap="round"
          stroke-miterlimit="10"
          d="M65.5,34.5h72
		c0,71-63,71-63,126h54C128.5,105.5,65.5,105.5,65.5,34.5z"
        />
      </g>
    </svg>
  `
}

process.env.VUE_APP_TIME = dayjs().format('YYYYMMDDHHmmss')
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
    // 本地开发模拟线上边缘函数：/api 和 /s 转发到 .env.local 里的 API_URL
    proxy: {
      '^/(api|s)/': {
        target: process.env.API_URL || 'http://localhost',
        changeOrigin: true
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
          name: 'n',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        }
      }
    })
    config.optimization.runtimeChunk('single')
  }
}
