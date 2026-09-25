<template>
  <div class="subscribe-info" :class="{ 'is-reverse': reverse }">
    <div class="panel-box col-1">
      <div class="panel-header">
        <span class="tit">{{ $t('我的订阅') }}</span>
      </div>
      <div v-if="comboType" class="panel-body subs-box use-shadow">
        <template v-if="comboType === ComboEnum.PERIOD || comboType === ComboEnum.ONE_TIME">
          <div class="subs-msg">
            <div class="t1">{{ subscribe.plan.name }}</div>
            <template v-if="comboType === ComboEnum.PERIOD">
              <p v-if="expiredResidue > 0" class="t2">
                {{
                  $t('于X到期，距离到期还有X天，已用流量将在X日后重置', {
                    expiredDate: getExpiredDate(),
                    expiredResidue: expiredResidueDuration,
                    resetDay: subscribe.reset_day
                  })
                }}
              </p>
              <p v-else class="t2 re">{{ $t('已过期') }}</p>
              <div :class="{ blur: expiredResidue <= 0 }">
                <a-progress class="prog" stroke-linecap="square" :percent="percent" :stroke-width="16" />
                <p class="t3">
                  {{ $t('已用') }}
                  <b>{{ usedFlow | flow }}</b>
                  / {{ $t('总计') }}
                  <b>{{ allFlow | flow }}</b>
                </p>
              </div>
            </template>
            <template v-else>
              <p v-if="leftFlow > 0" class="t2">{{ $t('一次性订阅的流量没有时间限制') }}</p>
              <p v-else class="t2">{{ $t('流量已用尽，请续费订阅') }}</p>
              <a-progress class="prog" stroke-linecap="square" :percent="percent" :stroke-width="16" />
              <p class="t3">
                {{ $t('已用') }}
                <b>{{ usedFlow | flow }}</b>
                / {{ $t('总计') }}
                <b>{{ allFlow | flow }}</b>
              </p>
            </template>
          </div>
          <div class="subs-btns">
            <a-tooltip v-if="renewable" :title="$t('续费只会延长到期时间，并不会重置流量。')" placement="bottom">
              <a-button class="btn-2" size="large" @click="onBuySubs()">
                <svg-icon name="calendar" />
                {{ $t('续费订阅') }}
              </a-button>
            </a-tooltip>
            <a-button v-else class="btn-2" size="large" @click="onBuySubs()">
              <svg-icon name="calendar" />
              {{ $t('购买订阅') }}
            </a-button>
            <a-tooltip :title="$t('重置流量包只会重置流量，不会延长到期时间，也不会改变重置日期。')" placement="bottom">
              <a-button v-if="showResetButton" class="btn-2" size="large" @click="onBuySubs('reset')">
                <svg-icon name="arrow-clockwise" />
                {{ $t('重置流量包') }}
              </a-button>
            </a-tooltip>
            <a-button class="btn-3" size="large" @click="$router.push('/stage/knowledge')">
              <svg-icon name="book" />
              {{ $t('查看教程') }}
            </a-button>
          </div>
        </template>

        <template v-else>
          <div class="subs-msg" style="margin: 50px 0 30px">
            <a-empty :image="simpleImage" :description="$t('您还没有购买订阅')" />
          </div>
          <div class="subs-btns" style="text-align: center">
            <a-button class="btn-2" size="large" @click="onBuySubs()">
              <svg-icon name="calendar" />
              {{ $t('购买订阅') }}
            </a-button>
            <a-button class="btn-3" size="large" @click="$router.push('/stage/knowledge')">
              <svg-icon name="book" />
              {{ $t('查看教程') }}
            </a-button>
          </div>
        </template>
      </div>
      <div v-else class="spin-loading">
        <a-spin size="large" />
      </div>
    </div>
    <div class="col-gap"></div>
    <div class="panel-box col-2">
      <div class="panel-header">
        <span class="tit">{{ $t('快速导入') }}</span>
      </div>
      <div v-if="comboType" class="panel-body import-btns use-shadow" :class="{ spec: clientLinks.length > 0 }">
        <div v-wave class="btn btn-weixin" @click="onImport('copy')">
          <svg-icon name="clipboard-text" />
          {{ $t('复制') }}
        </div>
        <div v-wave class="btn btn-alipay" @click="onImport('qrcode')">
          <i class="metron-qrcode" />
          {{ $t('二维码') }}
        </div>
        <div v-wave class="btn btn-clash" @click="onImport('clash')">
          <i class="metron-clash" />
          Clash {{ $t('订阅') }}
        </div>
        <div v-wave class="btn btn-surge" @click="onImport('surge')">
          <i class="metron-surge" />
          Surge {{ $t('订阅') }}
        </div>
        <div v-wave class="btn btn-shadowrocket" @click="onImport('shadowrocket')">
          <i class="metron-shadowrocket" />
          Shadowrocket {{ $t('订阅') }}
        </div>
        <div v-wave class="btn btn-surfboard" @click="onImport('surfboard')">
          <i class="metron-surfboard" />
          Surfboard {{ $t('订阅') }}
        </div>
        <div v-wave class="btn btn-quantumultx" @click="onImport('quantumultx')">
          <i class="metron-quantumultx" />
          Quantumult X {{ $t('订阅') }}
        </div>

        <div v-if="comboType === ComboEnum.UNBUY" class="tips">{{ $t('未购买订阅') }}</div>
        <div v-else-if="comboType === ComboEnum.PERIOD && expiredResidue <= 0" class="tips">{{ $t('订阅已过期') }}</div>
      </div>
      <div v-else class="spin-loading">
        <a-spin size="large" />
      </div>
      <div
        v-if="comboType && clientLinks.length > 0"
        class="client-links use-shadow"
        :class="{ less: clientLinks.length <= 4, one: clientLinks.length === 1 }"
      >
        <a v-for="item in clientLinks" :key="item.name" :href="item.url" class="link-item" target="_blank">
          <svg-icon :name="item.icon" class="icon" />
          <span class="tit">{{ item.name }}</span>
        </a>
      </div>
    </div>

    <a-modal v-model="qr.visible" :title="$t('二维码')" :footer="null">
      <img :src="qr.imgUrl" width="200" style="display: block; margin: 0 auto" />
    </a-modal>
  </div>
</template>

<script>
import { getSubscribes } from '../apis/subscribe'
import { ComboEnum } from '../enums/buysubs'
import openApp from '../utils/open-app'
import dayjs from 'dayjs'
import bytes from 'bytes'
import copy from 'copy-to-clipboard'
import qrcode from 'qrcode'
import '../styles/imp-btn.scss'
import { Empty } from 'ant-design-vue'
import duration from 'dayjs/plugin/duration'
import { CLIENT_IOS, CLIENT_ANDROID, CLIENT_WINDOWS, CLIENT_MACOS, CLIENT_OPENWRT, CLIENT_LINUX } from '@/core/constants'

dayjs.extend(duration)

export default {
  name: 'SubscribeInfo',
  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      subscribe: null,
      simpleImage: '',
      qr: {
        visible: false,
        imgUrl: ''
      },
      ComboEnum
    }
  },
  computed: {
    clientLinks() {
      return [
        { name: 'iOS', icon: 'apple-logo', url: CLIENT_IOS },
        { name: 'Android', icon: 'bug-droid', url: CLIENT_ANDROID },
        { name: 'Windows', icon: 'windows-logo', url: CLIENT_WINDOWS },
        { name: 'macOS', icon: 'laptop', url: CLIENT_MACOS },
        { name: 'Openwrt', icon: 'broadcast', url: CLIENT_OPENWRT },
        { name: 'Linux', icon: 'linux-logo', url: CLIENT_LINUX }
      ].filter((item) => item.url?.length > 0)
    },
    comboType() {
      if (!this.subscribe) return null

      // plan或者plan_id为null，未购买
      // expired_at为null, 按流量买
      // expired_at不为null，按周期买

      if (this.subscribe.plan === null) {
        return ComboEnum.UNBUY
      } else if (this.subscribe.expired_at === null) {
        return ComboEnum.ONE_TIME
      } else {
        return ComboEnum.PERIOD
      }
    },
    expiredResidue() {
      if (this.expiredDate > 0) {
        return dayjs.unix(this.expiredDate).diff(dayjs(), 'second')
      } else {
        return null
      }
    },
    expiredResidueDuration() {
      const e = this.expiredResidue
      if (e === null) return 0

      if (e < 60) return e + ' ' + this.$t('秒')

      const duration = dayjs.duration(e, 'seconds')
      const years = duration.years()
      const months = duration.months()
      const days = duration.days()
      const hours = duration.hours()
      const minutes = duration.minutes()

      return [
        years > 0 ? years + ' ' + this.$t('年') : '',
        months > 0 ? months + ' ' + this.$t('月') : '',
        days > 0 ? days + ' ' + this.$t('天') : '',
        hours > 0 ? hours + ' ' + this.$t('小时') : '',
        minutes > 0 ? minutes + ' ' + this.$t('分钟') : ''
      ]
        .filter((_) => _.length > 0)
        .join(' ')
    },
    expiredDate() {
      return this.subscribe?.expired_at
    },
    usedFlow() {
      return this.subscribe?.d + this.subscribe?.u
    },
    allFlow() {
      return this.subscribe?.transfer_enable ?? 0
    },
    leftFlow() {
      const left = this.allFlow - this.usedFlow
      return left > 0 ? left : 0
    },
    percent() {
      return parseFloat(((this.usedFlow / this.allFlow) * 100).toFixed(2))
    },
    planId() {
      return this.subscribe?.plan_id
    },
    renewable() {
      return Number(this.subscribe?.plan.renew) === 1 // 是否可续订，0禁用，1启用
    },
    showResetButton() {
      // 重置流量包价格大于0
      // 已用流量超过80%
      // 如果是周期性订阅，未过期
      if (this.comboType === ComboEnum.UNBUY) return false
      if (this.comboType === ComboEnum.PERIOD) {
        if (this.expiredResidue <= 0) {
          return false
        }
      }
      if (!(this.subscribe?.plan.reset_price > 0)) return false
      if (this.percent < 80) return false
      return true
    }
  },
  created() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  async mounted() {
    const res = await getSubscribes()
    this.subscribe = res.data

    this.$nextTick(() => {
      const { expiredDate, expiredResidue, leftFlow, planId, comboType } = this
      this.$emit('change', { expiredDate, expiredResidue, leftFlow, planId, comboType })

      if (window.$crisp) {
        window.$crisp.push([
          'set',
          'session:data',
          [
            [
              ['Plan', res.data.plan?.name || '-'],
              ['ExpireTime', this.expiredDate > 0 ? dayjs.unix(this.expiredDate).format('YYYY-MM-DD') : '-'],
              ['UsedTraffic', bytes(this.usedFlow)],
              ['AllTraffic', bytes(this.allFlow)]
            ]
          ]
        ])
      }
    })

    window.onerror = (e) => {
      console.log(e)
    }
  },
  methods: {
    getExpiredDate() {
      return this.$options.filters.date(this.expiredDate)
    },
    onBuySubs(type) {
      // 购买过套餐并且该套餐是可续订状态，才能去续订或重置流量包，否则跳转去购买
      if (this.planId && this.renewable) {
        if (type) {
          this.$router.push(`/stage/buysubs/order?id=${this.planId}&type=${type}`)
        } else {
          this.$router.push(`/stage/buysubs/order?id=${this.planId}`)
        }
      } else {
        this.$router.push('/stage/buysubs')
      }
    },
    openClient(schemaUrl, type) {
      openApp(schemaUrl, () => {
        this.$message.info(this.$t('您还没有安装X客户端，或者客户端已打开', { type }))
      })
    },
    getSubscribeUrl() {
      const token = this.subscribe.token
      const subscribeUrl = this.subscribe.subscribe_url

      return subscribeUrl || `${location.origin}/api/v1/client/subscribe?token=${token}`
    },
    getImportName() {
      const appName = String(this.$appName || '').trim()
      if (appName && appName !== '$app_name') {
        return appName
      }

      return document.title || 'XBoard'
    },
    async onImport(type) {
      const url = this.getSubscribeUrl()
      const importName = this.getImportName()
      switch (type) {
        case 'copy':
          copy(url)
          this.$message.success(this.$t('链接已复制'))
          break

        case 'qrcode':
          const qrimg = await qrcode.toDataURL(url)
          this.qr.imgUrl = qrimg
          this.qr.visible = true
          break

        case 'clash':
          this.openClient('clash://install-config?url=' + encodeURIComponent(url) + '&name=' + encodeURIComponent(importName), type)
          break

        case 'surge':
          this.openClient('surge:///install-config?url=' + encodeURIComponent(url) + '&name=' + encodeURIComponent(importName), type)
          break

        case 'shadowrocket':
          this.openClient(
            'shadowrocket://add/sub://' +
              window
                .btoa(url + '&flag=shadowrocket')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '') +
              '?remark=' +
              encodeURIComponent(importName),
            type
          )
          break

        case 'quantumultx':
          this.openClient(
            'quantumult-x:///update-configuration?remote-resource=' +
              encodeURI(
                JSON.stringify({
                  server_remote: [url + ', tag=' + importName]
                })
              ),
            type
          )
          break

        case 'surfboard':
          this.openClient('surfboard:///install-config?url=' + encodeURIComponent(url) + '&name=' + encodeURIComponent(importName), type)
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.subscribe-info {
  display: flex;
  flex-direction: row;
  align-items: stretch;

  &.is-reverse {
    flex-direction: row-reverse;
  }

  .col-1 {
    flex: 1;
  }

  .col-2 {
    width: 420px;
  }

  .col-gap {
    width: 24px;
    flex: none;
  }

  .subs-box {
    min-height: 300px;
    .subs-msg {
      margin-top: 0;
      .t1 {
        color: var(--theme-heading);
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 14px;
      }
      .t2 {
        color: var(--theme-muted);
        font-size: 14px;
        line-height: 1.8;
        min-height: 46px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 16px;
      }
      .re {
        color: #ff4200;
      }
      .prog {
        margin-bottom: 14px;
        ::v-deep {
          .ant-progress-bg {
            background: linear-gradient(90deg, #22c55e, #9be269);
          }
          .ant-progress-inner {
            background-color: var(--theme-panel-hover);
          }
        }
      }
      .blur {
        filter: blur(6px);
      }
      .t3 {
        color: var(--theme-muted);
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 0;
        display: flex;
        justify-content: space-between;
        gap: 16px;

        b {
          color: var(--theme-heading);
          font-weight: 800;
          font-size: 16px;
        }
      }
    }
    .subs-tips {
      padding: 20px 0;
      font-size: 20px;
      height: 180px;
    }
    .subs-btns {
      margin-top: 22px;
      margin-bottom: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      ::v-deep {
        .ant-btn {
          margin-right: 0;
          height: 38px;
          border-radius: 10px;
          // width: 174px;
          // height: 44px;
          // font-size: 18px;
          // color: #fff;
          // border: 0;
          // margin-right: 30px;
          // margin-bottom: 10px;
          // display: inline-flex;
          // flex-direction: row;
          // align-items: center;
          // justify-content: center;

          &:hover {
            opacity: 0.9;
          }

          .svg-icon {
            font-size: 19px;
            margin-right: 2px;
            margin-top: -2px;
            vertical-align: middle;
          }
        }
      }
      // .btn-1 {
      //   background-color: #318bf6;
      // }
      // .btn-2 {
      //   background-color: #e4964d;
      // }
      // .btn-3 {
      //   background-color: #f0987c;
      // }
    }
  }

  .import-btns {
    min-height: 300px;
    overflow: hidden;
    padding-top: 24px;
    padding-bottom: 0;

    &.spec {
      min-height: 205px;
      padding-top: 24px;
    }

    .tips {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px;
      color: var(--theme-heading);
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.72);
      backdrop-filter: saturate(180%) blur(2px);
    }
  }

  .client-links {
    min-height: 84px;
    margin-top: 12px;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    &.less.one {
      justify-content: center;
    }

    .link-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 64px;
      border-radius: 10px;
      transition: background-color 0.2s ease, color 0.2s ease;

      &:hover {
        background-color: var(--theme-accent-soft);
      }

      .icon {
        font-size: 24px;
        color: var(--theme-accent);
      }

      .tit {
        margin-top: 4px;
        font-size: 12px;
        color: var(--theme-muted);
      }
    }
  }
}

@at-root .enUS {
  .subscribe-info {
    .col-2 {
      width: 600px;
    }
  }
}

@media screen and (max-width: 980px) {
  .subscribe-info {
    display: block;

    .col-gap {
      width: 100%;
      height: 0;
    }

    .col-1 {
      .subs-msg {
        margin-top: 10px;
        .t2 {
          height: auto;
        }
      }
      .subs-box {
        height: auto;
      }
    }

    .col-2 {
      width: 100% !important;
      .import-btns {
        height: auto;
        padding-top: 20px;
      }
    }
  }
}

@media screen and (max-width: 700px) {
  .subscribe-info {
    .subs-box {
      flex-direction: column;
      .subs-btns {
        text-align: center;
        margin-top: 40px;

        ::v-deep {
          .ant-btn {
            margin-right: 0;
            margin: 0 5px 10px;
          }
        }
      }
    }

    .client-links {
      padding: 10px 10px;
      height: auto;
      justify-content: flex-start;

      &.less {
        justify-content: space-between;
      }

      .link-item {
        width: 25%;
      }
    }
  }
}

@at-root .is-darkmode {
  .subscribe-info {
    .subs-box {
      .subs-msg {
        .t1 {
          color: var(--theme-heading);
        }

        .t2,
        .t3 {
          color: var(--theme-muted);
        }

        .prog {
          ::v-deep {
            .ant-progress-inner {
              background-color: var(--theme-panel-hover);
            }
          }
        }

        .t3 b {
          color: var(--theme-heading);
        }
      }
    }

    .client-links {
      .link-item {
        &:hover {
          background-color: var(--theme-panel-hover);
        }

        .icon {
          color: var(--theme-accent);
        }

        .tit {
          color: var(--theme-muted);
        }
      }
    }

    .import-btns {
      .tips {
        color: var(--theme-text);
        background-color: rgba(10, 16, 32, 0.72);
      }
    }
  }
}
</style>
