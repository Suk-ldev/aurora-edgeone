# 用户控制台前端

独立部署在 EdgeOne Makers（原 EdgeOne Pages）上的用户控制台。用户只接触 EdgeOne 上的域名，后端地址不暴露。

```
浏览器 ──> EdgeOne 域名 ──┬─ /、/static/*：静态页面
                          ├─ /api/*：接口，边缘函数查表还原路径后转发到后端
                          ├─ /api/v1/guest/...：支付、Telegram 回调，原样转发
                          ├─ /d/*：数据订阅链接，转发到后端
                          ├─ /plugin/rule-hub/*：分流规则集（后端插件），原样转发
                          └─ 其他路径：404
```

## 设计要点

这个前端刻意做了几件事，让未登录的访客（以及自动化扫描器）看到的只是一个普通的账号登录页：

- **首屏只有登录相关的内容。** 业务路由、页面文案、站点配置都在登录后才加载，不在首屏包里。
- **源码里的界面文案 key 全是 ASCII。** 中文只作为字典的值存在，而字典是登录后才拉的，
  所以任何构建产物（包括懒加载 chunk）里都不含业务文案。
- **接口路径是中性的。** 前端发的是 `/api/session`、`/api/me` 这类路径，真实的后端路径只存在于
  [`edge-functions/_shared/api-map.js`](edge-functions/_shared/api-map.js) 的映射表里，由边缘函数还原。后端零改动。
- **裸探测拿不到东西。** 配置了 `CLIENT_KEY` 之后，不带对应请求头的 `/api/*` 请求一律返回 404，
  和访问不存在的路径完全一样的响应。
- **未登录接口不透传。** `/api/bootstrap` 是唯一不需要登录的接口，边缘函数只放行登录/注册页
  真正用到的几个字段并改成中性名，响应体里没有后端特征。
- **第三方入口单独放行。** 支付网关、Telegram、代理客户端带不了校验头，它们访问的地址又由后端决定，
  所以支付回调、Telegram Webhook、订阅链接、分流规则集不过上面几道门。回调只有后端验签通过才返回
  真实响应，否则同样是 404。**改接口层时别把这几个入口拦掉**，回调列表见
  [`edge-functions/api/[[default]].js`](edge-functions/api/[[default]].js) 里的 `CALLBACKS`。

**建议把仓库设为私有。** EdgeOne 用 OAuth 授权，私有仓库照样能构建。公开仓库本身就是一条
可被检索的线索，前端做得再干净也绕不过。

## 部署

1. 把本仓库推到自己的 GitHub（建议私有）
2. 按需修改 [`site.config.js`](site.config.js)，提交
3. 在 EdgeOne Makers 控制台导入仓库，构建配置自动读取 [`edgeone.json`](edgeone.json)
   - 加速区域选「全球可用区（不含中国大陆）」。边缘节点在境外才能访问后端，也不需要备案
4. 在「项目设置 → 环境变量」添加：
   - `API_URL`：后端地址
   - `CLIENT_KEY`：随机字符串，如 `openssl rand -hex 16` 的输出
5. 绑定自己的域名。这个加速区域下 EdgeOne 分配的默认域名对大陆访客返回 401，不能直接给用户用
6. 后端管理后台设置：
   - 「站点网址」填 EdgeOne 域名，邮件里的链接才会指向这个域名。Telegram 机器人的 Webhook
     也用它拼地址（没单独填「Telegram Webhook 地址」时），改完要在后台重新设置一次 Webhook
   - 每个支付方式的「自定义通知域名」填 `https://EdgeOne 域名`（末尾不带 `/`）。
     不填的话回调地址是 http 开头，部分网关会拒绝
   - 「订阅URL」填 `https://EdgeOne 域名`（末尾不带 `/`），「订阅路径」填 `d`（前后都不带 `/`）。
     控制台自己用当前域名 + `/d/<token>` 生成链接，不读这两项；但 Telegram 机器人发的订阅链接是后端用
     「订阅URL」+「订阅路径」拼的，改成这样才和控制台的链接一致、能被边缘函数转发。
     「订阅URL」不填的话后端会用自己的地址拼，链接里就带出后端域名了。
     订阅路由是后端启动时注册的，改完「订阅路径」如果 TG 发的链接没变，重启一次后端
   - 装了「在线分流规则」插件并选「客户端下载规则集」时，插件设置里的「规则集链接域名」留空即可：
     它会用「订阅URL」（也就是 EdgeOne 域名），客户端经 `/plugin/rule-hub/*` 拉规则集，由
     [`edge-functions/plugin/rule-hub`](edge-functions/plugin/rule-hub/[[default]].js) 转发到后端
   - 后端看到的来源 IP 是 EdgeOne 节点的 IP，开了「IP 注册限制」的话建议关掉

换域名：EdgeOne 绑定新域名，再把后台的「站点网址」「自定义通知域名」「订阅URL」改过去，并重新设置 Telegram Webhook。

## 站点配置

所有配置在 [`site.config.js`](site.config.js)，构建时读取，每一项都有注释。

配置分两部分下发：

| | 字段 | 说明 |
| --- | --- | --- |
| 内联进 HTML | `appName` `appDesc` `appTheme` `appColor` `showRegInvite` | 登录页和启动脚本需要 |
| 登录后下发 | `appLogo` `appVersion` `slogan` `helpUrl` `client*` `customLink*` `extraMenus` | 键名本身有辨识度，不放首屏 |

登录后下发的那部分由 `vue.config.js` 在构建时生成成一个静态文件，路径在
[`middleware.js`](middleware.js) 里做了请求头校验，未登录直接访问返回 404。

## 改界面文案

文案分两部分：

- `src/i18n/gate.js`：登录 / 注册 / 找回密码页用到的几十条，内嵌进首屏包，
  断网也能显示。只放通用的账号体系词汇。
- `public/static/data/{b3f07a,5c91e4,a82d6f}.json`：简体 / 繁体 / 英文的完整字典，
  登录后带校验头拉取，同样受 `middleware.js` 保护。

**源码里的 key 必须是 ASCII**（如 `$t('purchase')`），中文只能出现在字典的值里 ——
key 写成中文的话会被直接编进构建产物，等于白做。加完文案跑：

```bash
node scripts/check-i18n.mjs
```

它会检查有没有中文 key，以及每个 key 在三份字典里是否都有译文。

其他可改的地方：

- `public/static/site.css`、`public/static/site.js`：自定义样式和脚本
- `public/favicon.svg`：没配置 `appLogo` 时的网站图标

## 改接口

加或改接口时，同时改 [`edge-functions/_shared/api-map.js`](edge-functions/_shared/api-map.js) 里的
`PATHS`（前端用的常量）和 `API_MAP`（映射到真实后端路径），然后跑：

```bash
node scripts/check-api-map.mjs
```

它会校验两个对象一致，并检查前端代码里没有漏改的真实后端路径。表里没有的路径，边缘函数一律返回 404。

## 本地开发

需要 Node.js 20 或更高版本。

```bash
npm ci
cp .env.example .env.local   # 填好 API_URL
npm run dev                  # http://localhost:7800
npm run build                # 产物在 dist/
```

本地开发时 `/api` 和 `/d` 的路径映射由 devServer 代理完成，和线上边缘函数做的事情一样。
注意本地没有 `middleware.js`，所以 `/static/data/` 的请求头校验只在线上生效。

## 套餐描述样式

后台的套餐描述支持这些 html 样式：

```html
<!-- 角标，预置 color-1 到 color-6 六种颜色，也可以用 style 自定义 -->
<div class="t0 color-1">即将售罄</div>
<div class="t0" style="background: #000; color: #fff;">即将售罄</div>

<!-- 描述项 -->
<div class="t4">
  <!-- tag 是小标签 -->
  <span class="tit">标题 <span class="tag">轻量</span></span>
  <div class="desc">
    <!-- gou 表示包含，cha 表示不包含 -->
    <i class="gou"></i>
    每月 <b class="re bo">250GB</b>
  </div>
</div>
```

预置颜色：`color-1` #3e92f6、`color-2` #faad14、`color-3` #eb2f96、`color-4` #04b5c7、`color-5` #384142、`color-6` #368914。

## 目录结构

```
edge-functions/     EdgeOne 边缘函数：接口、订阅链接和分流规则集转发
  _shared/          接口路径映射表、统一 404
middleware.js       路径白名单 + 受保护路径的请求头校验
public/             页面模板和静态资源，原样复制到 dist/
src/                前端源码（Vue 2）
scripts/            映射表校验
site.config.js      站点配置
edgeone.json        EdgeOne 构建配置
```
