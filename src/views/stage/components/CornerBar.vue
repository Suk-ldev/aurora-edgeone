<template>
  <div class="corner-bar">
    <div class="item" @click="isDarkMode = !isDarkMode">
      <svg-icon :name="isDarkMode ? 'sun' : 'moon'" style="font-size: 24px" />
    </div>
    <div class="item">
      <lang-change />
    </div>
    <div v-show="isBackend" class="item">
      <bell-notice />
    </div>
    <div class="item">
      <a-dropdown overlay-class-name="dropdown-menu" :trigger="['click']">
        <div class="rightbar">
          <span class="avatar">{{ avatar }}</span>
          <span class="name">{{ username }}</span>
        </div>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="javascript:;" @click="$router.push(menuPath)">
              <svg-icon name="user" />
              {{ menuText }}
            </a>
          </a-menu-item>
          <a-menu-item v-if="isBackend">
            <a href="javascript:;" @click="$router.push('/stage/ticket')">
              <svg-icon name="chat-centered-dots" />
              {{ $t('我的工单') }}
            </a>
          </a-menu-item>
          <a-menu-item v-if="isBackend">
            <a href="javascript:;" @click="$router.push('/stage/flow')">
              <svg-icon name="presentation-chart" />
              {{ $t('流量明细') }}
            </a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;" @click="onLogout">
              <svg-icon name="paper-plane-tilt" />
              {{ $t('退出登录') }}
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import LangChange from './LangChange'
import { mapState } from 'vuex'
import { Authorization } from '@/core/utils/ls'
import { Darkmode } from '@/core/utils/ls'
import BellNotice from './BellNotice'

export default {
  name: 'CornerBar',
  components: {
    BellNotice,
    LangChange
  },
  data() {
    return {
      isDarkMode: false
    }
  },
  computed: {
    ...mapState('auth', ['userInfo']),
    email() {
      return this.userInfo.email
    },
    username() {
      return this.email.split('@')[0].toUpperCase()
    },
    avatar() {
      return this.username.substring(0, 1)
    },
    isBackend() {
      return this.$route.path.includes('/stage')
    },
    menuText() {
      return this.isBackend ? this.$t('个人中心') : this.$t('我的服务')
    },
    menuPath() {
      return this.isBackend ? '/stage/profile' : '/stage/dashboard'
    }
  },
  watch: {
    isDarkMode: {
      immediate: false,
      handler(isDarkMode) {
        document.body.classList.toggle('is-darkmode', isDarkMode)
        this.$ls.set(Darkmode, isDarkMode ? 'dark' : 'light')
      }
    }
  },
  mounted() {
    this.isDarkMode = document.body.classList.contains('is-darkmode')
  },
  methods: {
    async onLogout() {
      this.$ls.remove(Authorization)
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.corner-bar {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;

  .item {
    cursor: pointer;
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--theme-heading);
    border-radius: 12px;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover {
      background-color: var(--theme-panel-hover);
      color: var(--theme-accent);
    }
  }

  .rightbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 10px 4px 4px;
    border-radius: 16px;
    background-color: var(--theme-panel);
    box-shadow: var(--theme-shadow), 0 0 0 1px var(--theme-border);
  }

  .avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    color: var(--theme-accent);
    line-height: 1;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--theme-accent-soft);
    box-shadow: inset 0 0 0 1px var(--theme-border);
  }
  .name {
    font-weight: 700;
    font-size: 13px;
    margin: 0;
    line-height: 1;
    margin-right: 2px;
    margin-left: 10px;
    color: var(--theme-muted);
    // 邮箱前缀过长时截断，不然会把顶部导航挤没
    max-width: 96px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .email {
    font-size: 14px;
    margin: 0;
  }
}

@media screen and (max-width: 1320px) {
  .corner-bar {
    .name {
      display: none;
    }

    .rightbar {
      padding: 4px;
    }
  }
}

@media screen and (max-width: 560px) {
  .corner-bar {
    gap: 6px;

    .item {
      min-width: 32px;
      width: 32px;
      height: 32px;
      border-radius: 10px;
    }

    .rightbar {
      padding: 3px;
      border-radius: 14px;
    }

    .avatar {
      width: 28px;
      height: 28px;
      font-size: 14px;
    }
  }
}

@media screen and (max-width: 430px) {
  .corner-bar {
    gap: 4px;

    .item {
      min-width: 30px;
      width: 30px;
      height: 30px;
    }

    .rightbar {
      padding: 2px;
    }

    ::v-deep .svg-icon {
      transform: scale(0.92);
    }
  }
}

@at-root .is-darkmode {
  .corner-bar {
    .item {
      color: var(--theme-text);

      &:hover {
        color: var(--theme-accent);
        background-color: var(--theme-panel-hover);
      }
    }

    .rightbar {
      background-color: var(--theme-panel-soft);
      box-shadow: 0 0 0 1px var(--theme-border);
    }

    .avatar {
      color: var(--theme-accent);
      background-color: var(--theme-accent-soft);
      box-shadow: inset 0 0 0 1px var(--theme-border);
    }

    .name {
      color: var(--theme-muted);
    }
  }
}
</style>
