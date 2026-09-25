<template>
  <a-modal v-model="visible" :title="$t('兑换详情')" :footer="null" :width="540" :after-close="onClosed">
    <a-spin :spinning="loading">
      <div v-if="info" class="gc-detail">
        <div class="row">
          <div class="k">{{ $t('礼品卡') }}</div>
          <div class="v">
            {{ info.template.name || '-' }}
            <a-tag v-if="info.template.type_name" :color="typeColor">{{ info.template.type_name }}</a-tag>
          </div>
        </div>
        <div v-if="info.template.description" class="row">
          <div class="k">{{ $t('说明') }}</div>
          <div class="v">{{ info.template.description }}</div>
        </div>
        <div class="row">
          <div class="k">{{ $t('兑换码') }}</div>
          <div class="v">
            {{ info.code || '-' }}
            <svg-icon v-if="info.code" name="copy" class="copy-link" :title="$t('复制')" @click="onCopy" />
          </div>
        </div>
        <div class="row">
          <div class="k">{{ $t('兑换时间') }}</div>
          <div class="v">{{ info.created_at | datetime }}</div>
        </div>
        <div v-if="info.multiplier_applied > 1" class="row">
          <div class="k">{{ $t('加成倍率') }}</div>
          <div class="v">×{{ info.multiplier_applied }}</div>
        </div>
        <div v-if="info.invite_user" class="row">
          <div class="k">{{ $t('邀请人') }}</div>
          <div class="v">{{ info.invite_user.email }}</div>
        </div>
        <div v-if="info.notes" class="row">
          <div class="k">{{ $t('备注') }}</div>
          <div class="v">{{ info.notes }}</div>
        </div>

        <hr class="line-hr" />

        <div class="sub-tit">{{ $t('获得奖励') }}</div>
        <gift-card-rewards :rewards="info.rewards_given" />

        <template v-if="hasInviteRewards">
          <div class="sub-tit">{{ $t('邀请人同时获得') }}</div>
          <gift-card-rewards :rewards="info.invite_rewards" />
        </template>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { getGiftCardDetail } from '../apis/giftcard'
import { getTypeColor } from '../enums/giftcard'
import GiftCardRewards from './GiftCardRewards'
import copy from 'copy-to-clipboard'

export default {
  name: 'GiftCardDetail',
  components: {
    GiftCardRewards
  },
  data() {
    return {
      visible: false,
      loading: false,
      info: null
    }
  },
  computed: {
    typeColor() {
      return getTypeColor(this.info?.template?.type)
    },
    hasInviteRewards() {
      return Object.keys(this.info?.invite_rewards ?? {}).length > 0
    }
  },
  methods: {
    async showModal(id) {
      this.visible = true
      this.loading = true
      try {
        const res = await getGiftCardDetail(id)
        this.info = res.data
      } catch {
        this.visible = false
      }
      this.loading = false
    },
    onCopy() {
      copy(this.info.code)
      this.$message.success(this.$t('已复制'))
    },
    onClosed() {
      this.info = null
    }
  }
}
</script>

<style lang="scss" scoped>
.gc-detail {
  min-height: 120px;

  .row {
    display: flex;
    align-items: flex-start;
    padding: 7px 0;
    font-size: 14px;

    .k {
      width: 90px;
      flex-shrink: 0;
      color: var(--theme-muted);
      font-weight: 600;
    }

    .v {
      flex: 1;
      color: var(--theme-heading);
      font-weight: 600;
      word-break: break-all;
    }
  }

  .sub-tit {
    color: var(--theme-muted);
    font-size: 13px;
    font-weight: 700;
    margin: 14px 0 10px;
  }
}
</style>
