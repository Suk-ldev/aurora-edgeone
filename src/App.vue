<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'
import enUS from 'ant-design-vue/lib/locale-provider/en_US'
import { getLang } from '@/i18n'

const antdvLangs = {
  zhCN,
  zhTW,
  enUS
}

export default {
  name: 'App',
  data() {
    return {
      locale: antdvLangs[getLang()]
    }
  },
  mounted() {
    this.initAppConfig()
  },
  methods: {
    initAppConfig() {
      this.$store.dispatch('auth/getGlobalConfig')
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  position: relative;
  z-index: 2;
}
</style>
