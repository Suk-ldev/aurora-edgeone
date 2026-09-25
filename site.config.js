/**
 * 站点配置
 *
 * 构建时读取，写进 index.html。改完提交到仓库，EdgeOne 会自动重新构建。
 * 值是普通 JS 字符串，可以有空格、引号和 html，多行内容用反引号 ` 包起来。
 *
 * 注意：
 * - 这里的内容会出现在网页源码里，仓库公开的话所有人都能看到
 * - 后端地址不要写在这里，在 EdgeOne 控制台的环境变量里配置 API_URL
 */
module.exports = {
  // 站点名称，显示在标题栏和页面上
  appName: 'NBoard',
  // 站点描述，写进 <meta name="description">
  appDesc: 'NBoard',
  // Logo 图片地址，不填用默认图标
  appLogo: 'https://oss.imsuk.cn/img/studio.png',
  // 显示在侧边栏站点名后面的版本号
  appVersion: '',

  // 主题模式：light 浅色 / dark 深色 / auto 跟随系统
  appTheme: 'auto',
  // 主题颜色：default dustRed volcano sunsetOrange calendulaGold sunriseYellow lime polarGreen cyan daybreakBlue
  appColor: 'default',

  // 注册时是否显示邀请码：show / hide
  showRegInvite: 'show',

  // 客户端下载页的标语，支持 html
  slogan: '<span style="margin-right: 60px;">极致简洁</span><span>互通世界</span>',
  // 帮助中心外链
  helpUrl: '',

  // 客户端下载地址
  clientIOS: '',
  clientAndroid: '',
  clientWindows: '',
  clientMacOS: '',
  clientOpenwrt: '',
  clientLinux: '',

  // 客户端下载页的两个自定义按钮，格式：名称|链接
  customLink1: '',
  customLink2: '',

  /**
   * 侧边栏额外菜单，例：
   *
   * extraMenus: [
   *   {
   *     groupTitle: '自定义标题', // 分组标题，要多语言的话在 public/static/i18n 里配置
   *     groupLinks: [
   *       {
   *         menuTitle: '小标题', // 菜单文字
   *         menuIcon: 'gauge', // 图标名，在 https://phosphoricons.com 挑
   *         menuPath: 'https://www.bing.com', // 链接地址
   *         needSubscribe: false, // true 需要有订阅才能打开
   *         isExternal: true // true 新窗口打开 / false 内嵌在页面里
   *       }
   *     ]
   *   }
   * ]
   */
  extraMenus: [],

  // 加载页显示的内容，支持 html，不填显示默认沙漏动画
  loadingText: '',

  // 插入到页面底部的自定义 html，可放客服、统计脚本等，例：
  // customHtml: `
  //   <script>
  //     console.log('hello')
  //   </script>
  // `,
  customHtml: ''
}
