<template>
  <a-popover v-model="visible" class="bell-notice" :title="$t('公告')" placement="bottom" :overlay-style="{ position: 'fixed' }" trigger="click">
    <div slot="content" class="bell-box">
      <ul>
        <li v-for="row in filteredNotices" :key="row.id" @click="onNoticeShow(row)">
          <div class="icon"><svg-icon name="bell-simple" /></div>
          <div class="texts">
            <div class="tit">{{ row.title }}</div>
            <div class="time">
              <a-icon type="clock-circle" />
              {{ row.updated_at | date }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <a-badge :count="total" :overflow-count="9" :offset="[-5, 5]">
      <svg-icon name="bell-simple" class="bell" />
    </a-badge>
  </a-popover>
</template>

<script>
import { getNoticeList } from '../apis/dashboard'
import { mapState } from 'vuex'
import { Notice } from '@/core/utils/ls'

export default {
  name: 'BellNotice',
  data() {
    return {
      notices: [],
      total: 0,
      visible: false
    }
  },
  computed: {
    ...mapState('auth', ['alertFlag']),
    filteredNotices() {
      return this.notices.filter((row) => row.show)
    },
    isBackend() {
      return this.$route.path.includes('/stage')
    }
  },
  mounted() {
    this.loopGetNotice()
  },
  methods: {
    async loopGetNotice() {
      const getNotices = async () => {
        const res = await getNoticeList()
        this.notices = res.data ?? []
        this.total = res.total
      }

      setInterval(() => {
        getNotices()
      }, 10 * 60 * 1000)

      await getNotices()

      if (this.isBackend && !this.alertFlag && !this.$ls.get(Notice)) {
        this.checkImmediate()
        this.$store.commit('auth/SET_ALERT_FLAG', true)
        this.$ls.set(Notice, 1, 60 * 60 * 1000)
      }
    },
    checkImmediate() {
      // tags中有[弹窗]标记的，立即弹出
      const showArr = this.notices.filter((item) => item.tags?.includes('弹窗'))
      let showIndex = 0
      const showInfo = () => {
        const row = showArr[showIndex]
        if (!row) return
        const content = row.img_url ? (
          <div class='notice-rich-content'>
            <div domProps={{ innerHTML: row.content }}></div>
            <img src={row.img_url} width='100%' style='margin-top: 10px;' />
          </div>
        ) : (
          <div class='notice-rich-content'>
            <div domProps={{ innerHTML: row.content }}></div>
          </div>
        )
        this.$info({
          title: row.title,
          okText: showIndex === showArr.length - 1 ? this.$t('我知道了') : this.$t('下一条'),
          mask: true,
          width: 580,
          icon: 'bell',
          closable: true,
          content,
          onOk: () => {
            showIndex++
            showInfo()
          }
        })
      }
      if (showArr.length > 0) {
        showInfo()
      }
    },
    onNoticeShow(row) {
      this.visible = false
      const content = row.img_url ? (
        <div class='notice-rich-content'>
          <div domProps={{ innerHTML: row.content }}></div>
          <img src={row.img_url} width='100%' style='margin-top: 10px;' />
        </div>
      ) : (
        <div class='notice-rich-content'>
          <div domProps={{ innerHTML: row.content }}></div>
        </div>
      )
      this.$info({
        title: row.title,
        okText: this.$t('我知道了'),
        closable: true,
        width: 580,
        mask: true,
        icon: 'bell',
        content
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bell-notice {
  .bell {
    font-size: 23px;
  }
}
.bell-box {
  max-height: 300px;
  overflow: auto;
  min-width: 260px;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    margin-bottom: 20px;
    cursor: pointer;

    &::after {
      position: absolute;
      left: 0;
      bottom: -10px;
      width: 100%;
      content: '';
      margin: 0;
      border: none;
      height: 1px;
      background-color: #f5f5f5;
      background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.4), transparent);
      opacity: 0.1;
    }
    .icon {
      width: 36px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 6px;
      background-color: #c5dffd;
      color: #{'rgba(var(--primary-color), 1)'};
      font-size: 22px;
      margin-right: 10px;
    }
    .texts {
      flex: 1;
    }
    .tit {
      font-weight: 500;
      font-size: 16px;
      white-space: nowrap;
      color: var(--theme-heading);
    }
    .time {
      font-size: 12px;
      color: var(--theme-faint);
    }
  }
}

@at-root .is-darkmode {
  .bell-box {
    li {
      &::after {
        background-image: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.28), transparent);
        opacity: 1;
      }

      .icon {
        color: var(--theme-accent);
        background-color: var(--theme-accent-soft);
      }

      .tit {
        color: var(--theme-heading);
      }

      .time {
        color: var(--theme-faint);
      }
    }
  }
}
</style>

<style lang="scss">
.ant-popover-title {
  color: var(--theme-heading);
  font-size: 18px;
  padding: 8px 15px;
}
</style>
