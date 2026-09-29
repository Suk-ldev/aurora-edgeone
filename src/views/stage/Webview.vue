<template>
  <div class="webview-container">
    <div v-if="subscribe">
      <template v-if="needSubscribe">
        <iframe v-if="isValidSubscribed" :src="url" class="iframe" scrolling="auto" seamless="seamless" :key="token" />
        <div v-else class="empty-tip">
          <a-empty description="" :image-style="{ height: '200px' }" />
          <div class="tit">
            {{ tipText }}
          </div>
          <a-button v-wave type="primary" size="large" style="min-width: 160px" @click="goPage">{{ buttonText }}</a-button>
        </div>
      </template>
      <iframe v-else :src="url" class="iframe" scrolling="auto" seamless="seamless" />
    </div>
    <div v-else class="spin-loading">
      <a-spin size="large" />
    </div>
  </div>
</template>

<script>
import { getSubscribes } from './apis/subscribe'
import { ComboEnum } from './enums/buysubs'
import dayjs from 'dayjs'

export default {
  name: 'Webview',
  data() {
    return {
      url: '',
      needSubscribe: '',
      subscribe: null
    }
  },
  computed: {
    token() {
      return this.$route.query.token
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
    planId() {
      return this.subscribe?.plan_id
    },
    renewable() {
      return Number(this.subscribe?.plan.renew) === 1 // 是否可续订，0禁用，1启用
    },
    tipText() {
      if (this.comboType === ComboEnum.UNBUY) {
        return this.$t('have_not_purchased_subscriptio_2')
      } else if (this.comboType === ComboEnum.PERIOD) {
        return this.$t('subscription_has_expired_can_v')
      } else if (this.comboType === ComboEnum.ONE_TIME) {
        return this.$t('one_time_traffic_has_been_used')
      }
      return ''
    },
    isValidSubscribed() {
      if (this.comboType === ComboEnum.UNBUY) {
        return false
      } else if (this.comboType === ComboEnum.PERIOD) {
        return this.expiredResidue > 0
      } else if (this.comboType === ComboEnum.ONE_TIME) {
        return this.leftFlow > 0
      }
      return false
    },
    buttonText() {
      if (this.comboType === ComboEnum.UNBUY || !this.renewable) {
        return this.$t('purchase')
      } else {
        return this.$t('renew_subscription')
      }
    },
    buttonUrl() {
      if (this.comboType === ComboEnum.UNBUY || !this.renewable) {
        return '/console/catalog'
      } else {
        return `/console/catalog/order?id=${this.planId}`
      }
    }
  },
  watch: {
    token: {
      immediate: true,
      async handler() {
        this.url = atob(this.$ls.get('ex_token'))
        this.needSubscribe = this.$ls.get('ex_needSubscribe') == 1

        const res = await getSubscribes()
        this.subscribe = res.data
      }
    }
  },
  methods: {
    goPage() {
      this.$router.push(this.buttonUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.webview-container {
  .iframe {
    width: 100%;
    border: 0;
    height: calc(100vh - 148px);
  }
}
</style>
