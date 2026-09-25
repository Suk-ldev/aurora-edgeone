<template>
  <div ref="refLayout" class="layout-container" :class="{ 'is-collapse': isCollapse, 'is-expand': !isCollapse, 'is-webview': isWebview }">
    <header class="layout-topbar">
      <div class="topbar-inner">
        <h1 class="menu-logo" @click="$router.push('/')">
          <img v-if="$appLogo" :src="$appLogo" />
          <img v-else src="~@/core/assets/rocket2.svg" />
          <span>{{ $appName }}</span>
        </h1>

        <nav ref="refTopNav" class="top-nav" :class="{ 'has-overflow': navOverflow }" @scroll="updateNavOverflow">
          <button
            v-for="menu in visibleMenus"
            v-show="!menu.menuHide"
            :key="menu.menuPath"
            class="nav-link"
            :class="{ 'is-active': isMenuActive(menu) }"
            @click="goMenu(menu)"
          >
            <svg-icon :name="menu.menuIcon" />
            <span>{{ menu.menuTitle }}</span>
          </button>
        </nav>

        <corner-bar />

        <button class="mobile-menu-toggle" :aria-label="$t('菜单')" @click.stop="isCollapse = !isCollapse">
          <img src="../assets/83-menu-2.png" />
        </button>
      </div>
    </header>

    <div class="layout-menu">
      <div class="menu-groups">
        <div v-for="(group, index) in groupMenus" :key="index" class="menu-group">
          <div v-if="group.groupTitle" class="g-title">{{ group.groupTitle }}</div>
          <ul class="g-links">
            <li
              v-for="(menu, idx) in group.groupLinks"
              v-show="!menu.menuHide"
              :key="idx"
              :class="{ 'is-active': isMenuActive(menu) }"
            >
              <a-tooltip :title="menu.menuTitle" placement="right" :get-popup-container="() => $refs.refLayout">
                <span class="link" @click="goMenu(menu)">
                  <svg-icon :name="menu.menuIcon" />
                  <span class="tit">{{ menu.menuTitle }}</span>
                </span>
              </a-tooltip>
            </li>
          </ul>
        </div>
      </div>

      <p class="version">
        {{ $appName + ' ' + $appVersion }}
      </p>
    </div>
    <div class="layout-mask" @click="isCollapse = true"></div>

    <div class="layout-main">
      <div class="wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ENV_CONFIG } from '@/core/constants'
import navMenus from '../constants/menu'
import CornerBar from './CornerBar'
import '../styles/overview.scss'

export default {
  name: 'Layout',
  components: {
    CornerBar
  },
  data() {
    return {
      isCollapse: window.innerWidth < 900,
      navOverflow: false,
      navMenus
    }
  },
  computed: {
    navTitle() {
      return this.navMenus
        .map((item) => item.groupLinks)
        .flat()
        .find((item) => this.$route.path.includes(item.menuPath))?.menuTitle
    },
    extraMenus() {
      try {
        const extraMenus = ENV_CONFIG.extraMenus.map((group) => {
          const groupLinks = group.groupLinks.map((link) => {
            return {
              menuTitle: this.$t(link.menuTitle),
              menuIcon: link.menuIcon || 'fire',
              menuPath: '/stage/webview?token=' + btoa(link.menuPath),
              externalLink: link.menuPath,
              needSubscribe: link.needSubscribe ?? true,
              isExternal: link.isExternal ?? false,
              isExtraMenu: true // 标记为额外菜单，配置见 site.config.js 的 extraMenus
            }
          })
          return {
            groupTitle: this.$t(group.groupTitle),
            groupLinks
          }
        })

        return extraMenus
      } catch {
        return []
      }
    },
    groupMenus() {
      return [...this.navMenus, ...this.extraMenus]
    },
    visibleMenus() {
      return this.groupMenus
        .map((item) => item.groupLinks)
        .flat()
        .filter((item) => !item.menuHide && !item.topNavHide)
    },
    isWebview() {
      return this.$route.path.includes('/webview')
    }
  },
  watch: {
    $route() {
      this.$nextTick(this.scrollActiveIntoView)
    }
  },
  mounted() {
    window.addEventListener(
      'resize',
      () => {
        this.isCollapse = window.innerWidth < 900
        this.updateNavOverflow()
      },
      false
    )

    document.addEventListener(
      'click',
      () => {
        if (window.innerWidth < 700) {
          this.isCollapse = true
        }
      },
      false
    )

    this.$nextTick(this.scrollActiveIntoView)
    // 字体加载完文字宽度会变，重新量一次
    document.fonts?.ready?.then(this.updateNavOverflow)
  },
  methods: {
    /**
     * 顶部导航装不下时，右侧做渐隐处理，提示还能横向滚动
     */
    updateNavOverflow() {
      const el = this.$refs.refTopNav
      if (!el) return
      this.navOverflow = el.scrollWidth - el.clientWidth - el.scrollLeft > 1
    },
    /**
     * 导航横向滚动过时，保证当前页对应的菜单项可见
     */
    scrollActiveIntoView() {
      this.$refs.refTopNav?.querySelector('.nav-link.is-active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      this.updateNavOverflow()
    },
    isMenuActive(menu) {
      return this.$route.path === menu.menuPath || this.$route.path.startsWith(menu.menuPath + '/')
    },
    goMenu(menu) {
      if (menu.isExtraMenu) {
        if (menu.isExternal) {
          window.open(menu.externalLink, '_blank')
        } else {
          const token = btoa(menu.externalLink)
          const needSubscribe = menu.needSubscribe ? 1 : 0
          this.$ls.set('ex_token', token)
          this.$ls.set('ex_needSubscribe', needSubscribe)
          this.$router.push(menu.menuPath)
        }
      } else {
        this.$router.push(menu.menuPath)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  min-height: 100vh;
  overflow: hidden;
  color: var(--theme-heading);
  background-color: var(--theme-page);
  background-image: radial-gradient(rgba(148, 163, 184, 0.22) 1px, transparent 1px);
  background-size: 24px 24px;

  &.is-expand {
    ::v-deep {
      .ant-tooltip {
        display: none !important;
      }
    }
  }

  .layout-topbar {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 64px;
    z-index: 20;
    background: rgba(248, 250, 252, 0.82);
    border-bottom: 1px solid var(--theme-border);
    backdrop-filter: blur(12px);
  }

  .topbar-inner {
    // 比正文栏(1152)宽，留给顶部导航更多位置
    width: min(1440px, calc(100% - 48px));
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .menu-logo {
    height: 40px;
    min-width: max-content;
    display: flex;
    align-items: center;
    margin: 0;
    color: var(--theme-heading);
    font-size: 20px;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;

    img {
      width: 34px;
      height: 34px;
      flex: 0 0 auto;
      margin-right: 10px;
      border-radius: 50%;
      background: var(--theme-panel);
      border: 1px solid var(--theme-border);
      object-fit: cover;
    }

    // 站点名过长时截断，不然会把导航挤出去
    span {
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .top-nav {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: flex-start;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      display: none;
    }

    // 右侧还有内容没露出来时渐隐，避免最后一项被生切
    &.has-overflow {
      -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 36px), transparent 100%);
      mask-image: linear-gradient(to right, #000 calc(100% - 36px), transparent 100%);
    }
  }

  .nav-link {
    height: 40px;
    padding: 0 14px;
    flex: 0 0 auto;
    border: 0;
    border-radius: 12px;
    color: var(--theme-muted);
    background: transparent;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

    .svg-icon {
      font-size: 18px;
    }

    &:hover {
      color: var(--theme-heading);
      background: var(--theme-panel-hover);
    }

    &.is-active {
      color: var(--theme-heading);
      background: var(--theme-panel);
      box-shadow: 0 0 0 1px var(--theme-border);
    }
  }

  .mobile-menu-toggle {
    display: none;
    width: 40px;
    height: 40px;
    padding: 8px;
    border: 0;
    border-radius: 12px;
    background: var(--theme-panel);
    box-shadow: 0 0 0 1px var(--theme-border);
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      display: block;
      transition: transform 0.25s ease;
    }
  }

  .layout-menu {
    display: none;
  }

  .layout-mask {
    display: none;
  }

  .layout-main {
    height: 100vh;
    overflow: auto;
    padding: 64px 0 0;

    .wrapper {
      width: min(1152px, calc(100% - 48px));
      padding: 24px 0 40px;
      margin: 0 auto;
    }
  }

  .menu-groups {
    overflow: auto;
  }

  .menu-group {
    padding: 0 16px;
    margin-bottom: 18px;

    .g-title {
      padding: 0 12px 8px;
      color: var(--theme-faint);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0;
    }

    .g-links {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 6px;

        &.is-active {
          .link {
            color: var(--theme-heading);
            background: var(--theme-panel);
            box-shadow: var(--theme-shadow), 0 0 0 1px var(--theme-border);
          }
        }
      }

      .link {
        min-height: 42px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 12px;
        border-radius: 12px;
        color: var(--theme-muted);
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease;

        &:hover {
          color: var(--theme-heading);
          background: var(--theme-panel-hover);
        }
      }

      .svg-icon {
        color: var(--theme-accent);
        font-size: 20px;
      }

      .tit {
        color: inherit;
        font-size: 14px;
        white-space: nowrap;
      }
    }
  }

  .version {
    margin: auto 0 0;
    padding: 16px 20px;
    color: var(--theme-faint);
    font-size: 12px;
    text-align: center;
  }

  @at-root .is-darkmode {
    .layout-container {
      color: var(--theme-text);
      background-color: var(--theme-page);
      background-image: radial-gradient(rgba(59, 130, 246, 0.18) 1px, transparent 1px);

      .layout-topbar {
        background: rgba(2, 8, 23, 0.82);
        border-bottom-color: var(--theme-border);
      }

      .menu-logo {
        color: var(--theme-heading);

        img {
          background: var(--theme-heading);
          border-color: var(--theme-border);
        }
      }

      .nav-link {
        color: var(--theme-muted);

        &:hover {
          color: var(--theme-heading);
          background: var(--theme-panel-hover);
        }

        &.is-active {
          color: var(--theme-heading);
          background: var(--theme-panel-hover);
          box-shadow: 0 0 0 1px var(--theme-border);
        }
      }

      .mobile-menu-toggle {
        background: var(--theme-panel-soft);
        box-shadow: 0 0 0 1px var(--theme-border);

        img {
          filter: invert(1);
        }
      }

      .layout-menu {
        background: rgba(10, 16, 32, 0.96);
        border-right-color: var(--theme-border);
      }

      .menu-group {
        .g-title {
          color: var(--theme-faint);
        }

        .g-links {
          .link {
            color: var(--theme-muted);

            &:hover {
              color: var(--theme-heading);
              background: var(--theme-panel-hover);
            }
          }

          li.is-active {
            .link {
              color: var(--theme-heading);
              background: var(--theme-panel-soft);
              box-shadow: 0 0 0 1px var(--theme-border);
            }
          }

          .svg-icon {
            color: var(--theme-accent);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1180px) {
  .layout-container {
    .topbar-inner {
      width: calc(100% - 32px);
      gap: 12px;
    }

    .top-nav {
      justify-content: flex-start;
    }

    .nav-link {
      padding: 0 10px;
      gap: 6px;
      font-size: 13px;

      .svg-icon {
        font-size: 17px;
      }
    }

    .layout-main {
      .wrapper {
        width: calc(100% - 32px);
      }
    }
  }
}

@media screen and (max-width: 1320px) {
  .layout-container {
    .topbar-inner {
      gap: 14px;
    }

    .nav-link {
      padding: 0 12px;
    }
  }
}

@media screen and (max-width: 900px) {
  .layout-container {
    ::v-deep {
      .ant-tooltip {
        display: none !important;
      }
    }

    .layout-topbar {
      height: 64px;
    }

    .topbar-inner {
      gap: 10px;
      justify-content: space-between;
    }

    .menu-logo {
      font-size: 16px;
      flex: 0 0 auto;

      img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
    }

    .top-nav {
      display: none;
    }

    .mobile-menu-toggle {
      display: block;
      flex: 0 0 auto;
    }

    .layout-menu {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 30;
      width: 280px;
      display: flex;
      flex-direction: column;
      padding: 84px 0 0;
      background: rgba(255, 255, 255, 0.96);
      border-right: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 24px 0 60px rgba(15, 23, 42, 0.16);
      backdrop-filter: saturate(180%) blur(18px);
      transform: translateX(0);
      transition: transform 0.25s ease;
    }

    .layout-mask {
      position: fixed;
      inset: 0;
      z-index: 25;
      display: block;
      background: rgba(15, 23, 42, 0.2);
      opacity: 1;
      pointer-events: auto;
      transition: opacity 0.2s ease;
    }

    &.is-collapse {
      .layout-menu {
        transform: translateX(-105%);
      }

      .layout-mask {
        opacity: 0;
        pointer-events: none;
      }

      .mobile-menu-toggle {
        img {
          transform: rotateY(180deg);
        }
      }
    }

    .layout-main {
      .wrapper {
        width: calc(100% - 24px);
        padding: 16px 0 28px;
      }
    }
  }
}

@media screen and (max-width: 560px) {
  .layout-container {
    .topbar-inner {
      gap: 8px;
    }

    .menu-logo {
      min-width: 0;

      span {
        display: none;
      }

      img {
        margin-right: 0;
      }
    }
  }
}

@media screen and (max-width: 430px) {
  .layout-container {
    .topbar-inner {
      width: calc(100% - 18px);
      gap: 6px;
    }

    .menu-logo {
      img {
        width: 30px;
        height: 30px;
      }
    }

    .layout-main {
      .wrapper {
        width: calc(100% - 18px);
      }
    }
  }
}
</style>
