# Aurora EdgeOne

V2Board / Xboard 的用户前端（Aurora 主题），部署在 EdgeOne Makers（原 EdgeOne Pages）上。用户只接触 EdgeOne 上的域名，后端域名不会暴露。

```
浏览器 ──> EdgeOne 域名 ──┬─ 页面：静态文件
                          └─ /api/*、/s/*：边缘函数转发 ──> 后端（API_URL）
```

- 页面、接口、订阅链接都走 EdgeOne 域名，浏览器里看不到后端地址
- 后端地址只写在 EdgeOne 环境变量里，前端代码和仓库里都没有
- 前端域名被封：EdgeOne 换绑一个新域名就行，不用重新构建

## 部署

1. 把本仓库推到自己的 GitHub
2. 按需修改 [`site.config.js`](site.config.js)（站点名称、Logo、客户端下载地址等），提交
3. 在 EdgeOne Makers 控制台导入这个仓库，构建配置会自动读取 [`edgeone.json`](edgeone.json)，不用手动填
   - 加速区域选「全球可用区（不含中国大陆）」。边缘节点在境外才能访问被墙的后端，也不需要备案
4. 在「项目设置 → 环境变量」添加 `API_URL`，值为后端地址，如 `https://your-xboard-backend.com`。改完需要重新部署
5. 绑定自己的域名。这个加速区域下 EdgeOne 分配的默认域名对大陆访客返回 401，不能直接给用户用
6. Xboard 后台设置：
   - 「订阅URL」填 EdgeOne 域名，否则用户复制到的订阅链接是后端域名
   - 「站点网址」填 EdgeOne 域名，支付回跳和邮件里的链接才会指向新域名
   - 「订阅路径」保持默认的 `s`。改过的话，把 `edge-functions/s` 目录改成同样的名字
   - 后端看到的来源 IP 是 EdgeOne 节点的 IP，开了「IP 注册限制」的话建议关掉

以后换域名：EdgeOne 绑定新域名，再把 Xboard 后台的「订阅URL」「站点网址」改过去。

## 站点配置

所有站点配置都在 [`site.config.js`](site.config.js)，构建时写进页面。它是普通 JS 文件，值里可以有空格、换行和 html，每一项都有注释说明。

| 配置项 | 说明 |
| --- | --- |
| `appName` / `appDesc` / `appLogo` | 站点名称、描述、Logo 地址 |
| `appVersion` | 侧边栏站点名后面显示的版本号 |
| `appTheme` | 主题模式：`light` / `dark` / `auto` |
| `appColor` | 主题颜色，可选值见文件内注释 |
| `showRegInvite` | 注册页是否显示邀请码：`show` / `hide` |
| `slogan` | 客户端下载页的标语，支持 html |
| `helpUrl` | 帮助中心外链 |
| `clientIOS` 等 | 各平台客户端下载地址 |
| `customLink1` / `customLink2` | 客户端下载页的自定义按钮，格式 `名称\|链接` |
| `extraMenus` | 侧边栏额外菜单，写法见文件内示例 |
| `loadingText` | 加载页内容，不填显示沙漏动画 |
| `customHtml` | 插入页面底部的 html，可放客服、统计脚本 |

这些内容本来就会出现在网页源码里，仓库公开也没关系。后端地址不要写进来。

其他可以改的地方：

- `public/static/custom.css`、`public/static/custom.js`：自定义样式和脚本
- `public/static/i18n/`：界面文案（简体、繁体、英文）
- `public/favicon.svg`：没配置 `appLogo` 时的网站图标

## 套餐描述

Xboard 后台的套餐描述支持下面这些 html 样式：

```html
<!-- 角标，预置 color-1 到 color-6 六种颜色，也可以用 style 自定义 -->
<div class="t0 color-1">即将售罄</div>
<div class="t0" style="background: #000; color: #fff;">即将售罄</div>

<!-- 描述项 -->
<div class="t4">
  <!-- tag 是小标签 -->
  <span class="tit">流量明细 <span class="tag">轻量</span></span>
  <div class="desc">
    <!-- gou 表示包含，cha 表示不包含 -->
    <i class="gou"></i>
    <!-- re 标红，bo 加粗 -->
    每月 <b class="re bo">250GB</b> 流量
  </div>
</div>
```

预置颜色：`color-1` #3e92f6、`color-2` #faad14、`color-3` #eb2f96、`color-4` #04b5c7、`color-5` #384142、`color-6` #368914。

## 本地开发

需要 Node.js 20 或更高版本。

```bash
npm ci
cp .env.example .env.local   # 填好 API_URL
npm run dev                  # http://localhost:7800
```

本地开发时 `/api` 和 `/s` 会转发到 `.env.local` 里的 `API_URL`，和线上的边缘函数一样。

```bash
npm run build                # 产物在 dist/
```

## 目录结构

```
edge-functions/     EdgeOne 边缘函数：/api/*、/s/* 转发到后端
public/             页面模板和静态资源，原样复制到 dist/
src/                前端源码（Vue 2）
site.config.js      站点配置
edgeone.json        EdgeOne 构建配置
```

## 致谢

基于开源项目 Aurora Theme 改造。
