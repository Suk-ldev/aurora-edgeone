<template>
  <div v-if="list.length" class="gc-rewards">
    <div v-for="item in list" :key="item.key" class="gc-reward">
      <div class="ico">
        <svg-icon :name="item.icon" />
      </div>
      <div class="txt">
        <div class="v">{{ item.text }}</div>
        <div class="l">{{ item.label }}</div>
      </div>
    </div>
  </div>
  <div v-else class="gc-rewards-empty">{{ $t('该礼品卡没有可展示的奖励') }}</div>
</template>

<script>
import { formatRewards } from '../utils/giftcard'

export default {
  name: 'GiftCardRewards',
  props: {
    rewards: {
      type: Object,
      default: null
    }
  },
  computed: {
    list() {
      return formatRewards(this.rewards)
    }
  }
}
</script>

<style lang="scss" scoped>
.gc-rewards {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 32px;
}

.gc-reward {
  display: flex;
  align-items: center;
  min-width: 150px;

  .ico {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin-right: 10px;
    color: var(--theme-accent);
    background-color: var(--theme-accent-soft);
    border: 1px solid var(--theme-border);

    .svg-icon {
      font-size: 18px;
    }
  }

  .v {
    color: var(--theme-heading);
    font-size: 15px;
    font-weight: 800;
    line-height: 1.3;
  }

  .l {
    color: var(--theme-muted);
    font-size: 13px;
    font-weight: 600;
  }
}

.gc-rewards-empty {
  color: var(--theme-faint);
  font-size: 14px;
}
</style>
