<template>
  <div class="giftcard-container">
    <div class="gc-switch use-shadow">
      <button v-wave type="button" class="gc-switch-item" :class="{ active: tab === 'redeem' }" @click="tab = 'redeem'">
        <svg-icon name="gift" />
        {{ $t('兑换礼品卡') }}
      </button>
      <button v-wave type="button" class="gc-switch-item" :class="{ active: tab === 'history' }" @click="onHistoryTab">
        <svg-icon name="clock-counter-clockwise" />
        {{ $t('兑换历史') }}
      </button>
    </div>

    <!-- 兑换 -->
    <div v-show="tab === 'redeem'">
      <div class="panel-box">
        <div class="gc-search use-shadow">
          <a-input v-model="code" class="input" size="large" :max-length="32" :placeholder="$t('请输入礼品卡兑换码')" @pressEnter="onCheck" />
          <a-button type="primary" size="large" :loading="checking" @click="onCheck">
            <svg-icon name="magnifying-glass" />
            {{ $t('查询') }}
          </a-button>
        </div>
        <div v-if="checkError" class="gc-error">
          <svg-icon name="warning-circle" />
          {{ checkError }}
        </div>
      </div>

      <div v-if="cardInfo" class="panel-box">
        <div class="gc-card use-shadow">
          <div class="gc-card-head">
            <div class="ico" :style="iconStyle">
              <img v-if="cardIcon.type === 'img'" :src="cardIcon.value" alt="" />
              <span v-else-if="cardIcon.type === 'text'" class="emoji">{{ cardIcon.value }}</span>
              <svg-icon v-else :name="cardIcon.value" />
            </div>
            <div class="meta">
              <div class="name">
                {{ cardInfo.template.name }}
                <a-tag :color="typeColor">{{ cardInfo.template.type_name }}</a-tag>
              </div>
              <div class="desc">{{ cardInfo.template.description || $t('暂无说明') }}</div>
            </div>
            <div class="state" :class="{ ok: canRedeem }">{{ cardInfo.status_name }}</div>
          </div>

          <hr class="line-hr" />

          <gift-card-rewards :rewards="rewardPreview" />

          <div v-if="planInfo" class="gc-plan">
            <div class="gc-plan-item">
              <svg-icon name="package" />
              <span>{{ planName }}</span>
            </div>
            <div class="gc-plan-item">
              <svg-icon name="cell-signal-full" />
              <span>{{ planFlow }}</span>
            </div>
            <div class="gc-plan-item">
              <svg-icon name="gauge" />
              <span>{{ planSpeed }}</span>
            </div>
            <div class="gc-plan-item">
              <svg-icon name="devices" />
              <span>{{ planDevice }}</span>
            </div>
          </div>

          <div class="gc-card-foot">
            <div class="tips">
              <span v-if="cardInfo.expires_at">{{ $t('有效期至') }}: {{ cardInfo.expires_at | datetime }}</span>
              <span v-else>{{ $t('长期有效') }}</span>
              <span v-if="cardInfo.max_usage > 1">{{ $t('已使用') }}: {{ cardInfo.usage_count }} / {{ cardInfo.max_usage }}</span>
            </div>
            <div class="act">
              <span v-if="!canRedeem && reason" class="reason">
                <svg-icon name="warning-circle" />
                {{ reason }}
              </span>
              <a-button type="primary" size="large" :disabled="!canRedeem" :loading="redeeming" @click="onRedeem">
                <svg-icon name="seal-check" />
                {{ $t('立即兑换') }}
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 兑换历史 -->
    <div v-show="tab === 'history'">
      <div v-if="historyData">
        <a-table
          v-if="historyData.length > 0"
          :data-source="historyData"
          :pagination="pagination"
          :custom-row="customRow"
          :loading="historyLoading"
          row-key="id"
          table-layout="fixed"
          :scroll="{ x: 900 }"
          class="gc-table data-table use-shadow"
          @change="onTableChange"
        >
          <a-table-column key="created_at" data-index="created_at" :title="$t('兑换时间')" width="180px">
            <div slot="customRender" slot-scope="text">
              {{ text | datetime }}
            </div>
          </a-table-column>
          <a-table-column key="template_name" data-index="template_name" :title="$t('礼品卡')" width="170px" />
          <a-table-column key="template_type_name" data-index="template_type_name" :title="$t('类型')" width="120px">
            <a-tag slot="customRender" slot-scope="text, record" :color="getTypeColor(record.template_type)">{{ text }}</a-tag>
          </a-table-column>
          <a-table-column key="rewardsText" data-index="rewardsText" :title="$t('获得奖励')" />
          <a-table-column key="code" data-index="code" :title="$t('兑换码')" width="150px" />
          <a-table-column :title="$t('操作')" align="center" width="120px">
            <template slot-scope="record">
              <a-button type="link" @click.stop="onDetail(record)">{{ $t('查看详情') }}</a-button>
            </template>
          </a-table-column>
        </a-table>

        <div v-else class="empty-tip">
          <a-empty description="" :image-style="{ height: '200px' }" />
          <div class="tit">{{ $t('你还没有兑换过礼品卡') }}</div>
        </div>
      </div>

      <div v-else class="spin-loading">
        <a-spin size="large" />
      </div>
    </div>

    <gift-card-detail ref="refDetail" />

    <a-modal v-model="resultVisible" :title="$t('兑换成功')" :footer="null" :width="460" :after-close="onResultClosed">
      <div v-if="resultData" class="gc-result">
        <div class="ico">
          <svg-icon name="seal-check" />
        </div>
        <div class="tit">{{ resultData.template_name }}</div>
        <div class="exp">{{ resultData.message || $t('兑换成功！') }}</div>
        <gift-card-rewards :rewards="resultData.rewards" />
        <template v-if="hasInviteRewards">
          <div class="sub-tit">{{ $t('邀请人同时获得') }}</div>
          <gift-card-rewards :rewards="resultData.invite_rewards" />
        </template>
        <a-button type="primary" size="large" block class="ok-btn" @click="resultVisible = false">{{ $t('好的') }}</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { checkGiftCard, redeemGiftCard, getGiftCardHistory } from './apis/giftcard'
import { getTypeColor } from './enums/giftcard'
import { getErrMsg, formatRewardsText } from './utils/giftcard'
import GiftCardRewards from './components/GiftCardRewards'
import GiftCardDetail from './components/GiftCardDetail'
import bytes from 'bytes'

export default {
  name: 'GiftCard',
  components: {
    GiftCardRewards,
    GiftCardDetail
  },
  data() {
    return {
      tab: 'redeem',
      code: '',
      checking: false,
      checkError: '',
      checkResult: null,
      redeeming: false,
      resultVisible: false,
      resultData: null,
      historyData: null,
      historyLoading: false,
      historyLoaded: false,
      page: 1,
      perPage: 10,
      total: 0
    }
  },
  computed: {
    cardInfo() {
      return this.checkResult?.code_info ?? null
    },
    rewardPreview() {
      return this.checkResult?.reward_preview ?? null
    },
    canRedeem() {
      return this.checkResult?.can_redeem === true
    },
    reason() {
      return this.checkResult?.reason ?? ''
    },
    typeColor() {
      return getTypeColor(this.cardInfo?.template?.type)
    },
    // 后台的 icon 字段格式不固定：可能是图片地址，也可能是 emoji 或图标名
    cardIcon() {
      const icon = (this.cardInfo?.template?.icon ?? '').trim()
      if (/^(https?:)?\/\//.test(icon) || icon.startsWith('/') || icon.startsWith('data:')) {
        return { type: 'img', value: icon }
      }
      // emoji 等非 ascii 直接当文本渲染；其余一律用内置图标，免得图标名对不上时显示成空白方块
      if (icon && /[^\u0000-\u007F]/.test(icon)) {
        return { type: 'text', value: icon }
      }
      return { type: 'icon', value: 'gift' }
    },
    iconStyle() {
      const color = this.cardInfo?.template?.theme_color
      return color ? { color } : {}
    },
    // 套餐礼品卡才有 plan_info
    planInfo() {
      return this.cardInfo?.plan_info ?? null
    },
    planName() {
      const days = this.rewardPreview?.plan_validity_days
      const name = this.planInfo?.name ?? ''
      return days > 0 ? `${name}（${days}${this.$t('天有效期')}）` : name
    },
    planFlow() {
      const gb = this.planInfo?.transfer_enable
      // plan_info.transfer_enable 单位是 GB，和奖励里的字节不是一回事
      if (gb === null || gb === undefined) return this.$t('不限流量')
      return bytes(bytes.parse(gb + 'GB')) + ' ' + this.$t('流量')
    },
    planSpeed() {
      const speed = this.planInfo?.speed_limit
      return speed ? speed + 'Mbps' : this.$t('不限速')
    },
    planDevice() {
      const limit = this.planInfo?.device_limit
      return limit ? limit + ' ' + this.$t('设备数') : this.$t('设备数不限')
    },
    hasInviteRewards() {
      return Object.keys(this.resultData?.invite_rewards ?? {}).length > 0
    },
    pagination() {
      return {
        current: this.page,
        pageSize: this.perPage,
        total: this.total,
        showSizeChanger: false,
        hideOnSinglePage: true
      }
    }
  },
  methods: {
    getTypeColor,
    async onCheck() {
      const code = this.code.trim()
      this.checkError = ''
      if (!code) {
        this.checkError = this.$t('请输入兑换码')
        return
      }

      this.checking = true
      this.checkResult = null
      try {
        const res = await checkGiftCard({ code })
        this.checkResult = res.data
      } catch (err) {
        this.checkError = getErrMsg(err, this.$t('查询失败，请稍后重试'))
      }
      this.checking = false
    },
    async onRedeem() {
      this.redeeming = true
      try {
        const res = await redeemGiftCard({ code: this.cardInfo.code })
        this.resultData = res.data
        this.resultVisible = true
        this.code = ''
        this.checkResult = null
        this.historyLoaded = false
        // 兑换后余额、流量、到期时间都可能变了
        this.$store.dispatch('auth/getUserInfo')
      } catch {}
      this.redeeming = false
    },
    onResultClosed() {
      this.resultData = null
    },
    onHistoryTab() {
      this.tab = 'history'
      if (!this.historyLoaded) {
        this.page = 1
        this.getHistoryData()
      }
    },
    async getHistoryData() {
      this.historyLoading = true
      try {
        // 该接口没有 success() 包装，直接返回 { data, pagination }
        const res = await getGiftCardHistory({ page: this.page, per_page: this.perPage })
        this.historyData = (res.data ?? []).map((row) => ({
          ...row,
          rewardsText: formatRewardsText(row.rewards_given)
        }))
        this.total = res.pagination?.total ?? this.historyData.length
        this.historyLoaded = true
      } catch {
        this.historyData = this.historyData ?? []
      }
      this.historyLoading = false
    },
    onTableChange(pagination) {
      this.page = pagination.current
      this.getHistoryData()
    },
    customRow(record) {
      return {
        style: { cursor: 'pointer' },
        on: {
          click: () => this.onDetail(record)
        }
      }
    },
    onDetail(record) {
      this.$refs.refDetail.showModal(record.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.giftcard-container {
  .gc-switch {
    display: inline-flex;
    padding: 5px;
    border-radius: 14px;
    margin-bottom: 24px;
    gap: 4px;
  }

  .gc-switch-item {
    display: flex;
    align-items: center;
    gap: 7px;
    height: 40px;
    padding: 0 20px;
    border: 0;
    outline: 0;
    cursor: pointer;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    color: var(--theme-muted);
    background-color: transparent;
    transition: color 0.25s ease, background-color 0.25s ease;

    .svg-icon {
      font-size: 17px;
    }

    &:hover {
      color: var(--theme-heading);
    }

    &.active {
      color: var(--theme-heading);
      background-color: var(--theme-panel-hover);
    }
  }

  .gc-search {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;

    .input {
      flex: 1;
    }

    .svg-icon {
      font-size: 16px;
      margin-right: 5px;
    }
  }

  .gc-error {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding-left: 4px;
    color: var(--theme-danger);
    font-size: 14px;
    font-weight: 600;

    .svg-icon {
      font-size: 16px;
    }
  }

  .gc-card {
    padding: 24px;
  }

  .gc-card-head {
    display: flex;
    align-items: center;

    .ico {
      width: 52px;
      height: 52px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 14px;
      border-radius: 14px;
      color: var(--theme-accent);
      background-color: var(--theme-accent-soft);
      border: 1px solid var(--theme-border);

      .svg-icon {
        font-size: 26px;
      }

      .emoji {
        font-size: 26px;
        line-height: 1;
      }

      img {
        width: 30px;
        height: 30px;
        object-fit: contain;
      }
    }

    .meta {
      flex: 1;
      min-width: 0;
    }

    .name {
      color: var(--theme-heading);
      font-size: 18px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .desc {
      color: var(--theme-muted);
      font-size: 14px;
      font-weight: 600;
      margin-top: 2px;
    }

    .state {
      flex-shrink: 0;
      margin-left: 12px;
      color: var(--theme-faint);
      font-size: 14px;
      font-weight: 700;

      &.ok {
        color: var(--theme-success);
      }
    }
  }

  .gc-plan {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 32px;
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px dashed var(--theme-border-strong);
  }

  .gc-plan-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--theme-text);
    font-size: 14px;
    font-weight: 600;

    .svg-icon {
      font-size: 17px;
      color: var(--theme-muted);
    }
  }

  .gc-card-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 22px;

    .tips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 18px;
      color: var(--theme-faint);
      font-size: 13px;
      font-weight: 600;
    }

    .act {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .reason {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--theme-warning);
      font-size: 13px;
      font-weight: 600;

      .svg-icon {
        font-size: 15px;
      }
    }

    .ant-btn {
      .svg-icon {
        font-size: 16px;
        margin-right: 5px;
      }
    }
  }

  .gc-table {
    overflow: hidden;
    border-radius: 12px;
    margin-top: 0;
  }
}

.gc-result {
  text-align: center;

  .ico {
    display: flex;
    justify-content: center;
    color: var(--theme-success);

    .svg-icon {
      font-size: 54px;
    }
  }

  .tit {
    color: var(--theme-heading);
    font-size: 18px;
    font-weight: 800;
    margin-top: 12px;
  }

  .exp {
    color: var(--theme-muted);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .sub-tit {
    color: var(--theme-muted);
    font-size: 13px;
    font-weight: 700;
    margin: 18px 0 10px;
  }

  .ok-btn {
    margin-top: 24px;
  }

  ::v-deep .gc-rewards {
    justify-content: center;
  }
}

@at-root .is-darkmode {
  .giftcard-container {
    .gc-table {
      ::v-deep {
        &,
        .ant-table,
        .ant-table-content,
        .ant-table-body,
        table {
          background: var(--theme-panel);
        }

        .ant-table-thead > tr > th {
          color: var(--theme-muted);
          background: var(--theme-panel-soft);
          border-bottom-color: var(--theme-border);
        }

        .ant-table-tbody > tr > td {
          border-bottom-color: var(--theme-border);
        }

        .ant-table-tbody > tr:hover > td {
          background: var(--theme-panel-hover);
        }
      }
    }
  }
}

@media screen and (max-width: 700px) {
  .giftcard-container {
    .gc-switch {
      display: flex;
      width: 100%;
    }

    .gc-switch-item {
      flex: 1;
      justify-content: center;
      padding: 0 10px;
    }

    .gc-search {
      flex-direction: column;
      align-items: stretch;

      ::v-deep .ant-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .gc-card-foot {
      .act {
        width: 100%;

        ::v-deep .ant-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
