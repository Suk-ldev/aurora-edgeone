<template>
  <a-dropdown overlay-class-name="dropdown-menu" :trigger="['click']">
    <svg-icon name="translate" class="lang" :style="{ fontSize: size }" />
    <a-menu slot="overlay">
      <a-menu-item v-for="lang in langs" :key="lang.value">
        <a href="javascript:;" @click="onLangClick(lang)">{{ lang.label }}</a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { Language } from '@/core/utils/ls'

export default {
  name: 'LangChange',
  props: {
    size: {
      type: String,
      default: '23px'
    }
  },
  data() {
    return {
      langs: [
        { label: '简体中文', value: 'zhCN' },
        { label: '繁體中文', value: 'zhTW' },
        { label: 'English', value: 'enUS' }
      ]
    }
  },
  methods: {
    onLangClick(lang) {
      this.$ls.set(Language, lang.value)
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.lang {
  cursor: pointer;
}
</style>
