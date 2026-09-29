<template>
  <div class="invite-container">
    <div class="overview-box">
      <a-row v-if="statData" :gutter="[20, 20]">
        <a-col :xl="12" :xxl="6">
          <div class="item use-shadow">
            <div class="icon">
              <svg-icon name="users" />
            </div>
            <div class="right">
              <div class="tit">{{ statData.regNum }}{{ $t('m_people') }}</div>
              <div class="exp">{{ $t('number_invited_registrations') }}</div>
            </div>
          </div>
        </a-col>
        <a-col :xl="12" :xxl="6">
          <div class="item use-shadow">
            <div class="icon">
              <svg-icon name="currency-jpy" />
            </div>
            <div v-if="enableThreeSale" class="right">
              <div class="tit">{{ threeSaleLabel }}</div>
              <div class="exp">{{ $t('three_level_distribution') }}</div>
            </div>
            <div v-else class="right">
              <div class="tit">{{ statData.rate }}%</div>
              <div class="exp">{{ $t('commission_ratio') }}</div>
            </div>
          </div>
        </a-col>
        <a-col :xl="12" :xxl="6">
          <div class="item use-shadow">
            <div class="icon">
              <svg-icon name="hand-coins" />
            </div>
            <div class="right">
              <div class="tit">{{ statData.confirmed | amount }}</div>
              <div class="exp">{{ $t('commission_being_confirmed') }}</div>
            </div>
          </div>
        </a-col>
        <a-col :xl="12" :xxl="6">
          <div class="item use-shadow">
            <div class="icon">
              <svg-icon name="piggy-bank" />
            </div>
            <div class="right">
              <div class="tit">{{ statData.allget | amount }}</div>
              <div class="exp">{{ $t('accumulated_commission') }}</div>
            </div>
          </div>
        </a-col>
      </a-row>
      <div v-else class="spin-loading">
        <a-spin size="large" />
      </div>
    </div>

    <div class="panel-box">
      <div class="panel-header">
        <span class="tit">{{ $t('current_remaining_commission') }}</span>
      </div>
      <div v-if="statData" class="panel-body bal-box use-shadow">
        <div class="money">{{ statData.leftMoney | amount }}</div>
        <div class="btns">
          <a-button v-wave size="large" style="margin-bottom: 10px" @click="onTransferShow">
            <svg-icon name="swap" />
            {{ $t('commission_transfer') }}
          </a-button>
          <a-button v-if="showWithdraw" v-wave size="large" @click="onCashShow">
            <svg-icon name="wallet" />
            {{ $t('commission_withdrawal') }}
          </a-button>
        </div>
      </div>
      <div v-else class="spin-loading">
        <a-spin size="large" />
      </div>
    </div>

    <div class="panel-box">
      <div class="panel-header">
        <span class="tit">{{ $t('invitation_code_management') }}</span>
        <a-button class="right" type="link" @click="onCreateCode">{{ $t('generate') }}</a-button>
      </div>
      <a-table
        v-if="codeData"
        :data-source="codeData"
        :pagination="false"
        row-key="id"
        table-layout="fixed"
        class="code-table data-table use-shadow"
      >
        <a-table-column key="code" data-index="code" :title="$t('invitation_code')">
          <div slot="customRender" slot-scope="text">
            {{ text }}
            <svg-icon name="copy" class="copy-link" :title="$t('copy')" @click="onCopyCode(text)" />
          </div>
        </a-table-column>
        <a-table-column key="created_at" data-index="created_at" :title="$t('created_time')" align="right">
          <div slot="customRender" slot-scope="text">
            {{ text | datetime }}
          </div>
        </a-table-column>
      </a-table>
      <div v-else class="spin-loading">
        <a-spin size="large" />
      </div>
    </div>

    <div class="panel-box">
      <div class="panel-header">
        <span class="tit">{{ $t('commission_payment_record') }}</span>
      </div>
      <a-table
        v-if="giveData"
        :data-source="giveData"
        :pagination="false"
        row-key="id"
        table-layout="fixed"
        class="give-table data-table use-shadow"
      >
        <a-table-column key="created_at" data-index="created_at" :title="$t('release_time')">
          <div slot="customRender" slot-scope="text">
            {{ text | datetime }}
          </div>
        </a-table-column>
        <a-table-column key="get_amount" data-index="get_amount" :title="$t('commission')" :width="160" align="right">
          <div slot="customRender" slot-scope="text">
            {{ text | amount }}
          </div>
        </a-table-column>
      </a-table>
      <div v-else class="spin-loading">
        <a-spin size="large" />
      </div>
    </div>

    <transfer-modal ref="refTransfer" @change="getCodeData" />
    <cash-modal ref="refCash" @change="getCodeData" />
  </div>
</template>

<script>
import { getInviteCodes, createInviteCode, getInviteDetails } from './apis/invite'
import TransferModal from './components/TransferModal'
import CashModal from './components/CashModal'
import copy from 'copy-to-clipboard'
import { isEmpty } from 'lemutils'
import { mapState } from 'vuex'

export default {
  name: 'Invite',
  components: {
    TransferModal,
    CashModal
  },
  data() {
    return {
      codeData: null,
      giveData: null,
      statData: null
    }
  },
  computed: {
    ...mapState('auth', ['userConfig']),
    enableThreeSale() {
      return this.userConfig?.commission_distribution_enable === 1 // 启用3级分销 1：启用 0：禁用
    },
    threeSaleLabel() {
      const { commission_distribution_l1: a, commission_distribution_l2: b, commission_distribution_l3: c } = this.userConfig
      const p = (val) => (val / 100) * this.statData.rate + '%'
      return [a, b, c]
        .filter((val) => !isEmpty(val))
        .map((val) => p(val))
        .join(', ')
    },
    showWithdraw() {
      return this.userConfig.withdraw_close === 0 // 0: 开启提现， 1: 关闭提现
    }
  },
  mounted() {
    this.getCodeData()
    this.getGiveData()
  },
  methods: {
    async getCodeData() {
      const res = await getInviteCodes()
      this.codeData = res.data.codes ?? []
      this.statData = {
        regNum: res.data.stat[0], // 注册人数
        allget: res.data.stat[1], // 累计获得佣金
        confirmed: res.data.stat[2], // 确认中的佣金
        rate: res.data.stat[3], // 佣金比例
        leftMoney: res.data.stat[4] // 当前剩余佣金
      }
    },
    async getGiveData() {
      const res = await getInviteDetails()
      this.giveData = res.data ?? []
    },
    onCopyCode(text) {
      const content = `${location.origin + location.pathname}#/register?code=${text}`
      copy(content)
      this.$message.success(this.$t('invitation_code_copied') + ':' + content)
    },
    async onCreateCode() {
      const res = await createInviteCode()
      if (res.data === true) {
        this.$message.success(this.$t('new_invitation_code_generated'))
        this.getCodeData()
      }
    },
    onTransferShow() {
      this.$refs.refTransfer.showModal()
    },
    onCashShow() {
      this.$refs.refCash.showModal()
    }
  }
}
</script>

<style lang="scss" scoped>
.invite-container {
  .bal-box {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .money {
      font-size: 60px;
      text-shadow: 4px 4px 4px rgba(#000, 0.1);
      margin-left: 50px;
    }
    .btns {
      display: flex;
      flex-direction: column;

      .svg-icon {
        font-size: 19px;
        margin-right: 5px;
      }
    }
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    .right {
      height: 40px;
      padding: 0 16px;
      border-radius: 12px;
      font-weight: 700;
    }
  }

  .data-table {
    overflow: hidden;
    border-radius: 0 0 16px 16px;

    ::v-deep {
      .ant-table-placeholder {
        border-bottom: 0;
      }

      .ant-empty {
        margin: 56px 0;
      }
    }
  }
}

@at-root .is-darkmode {
  .invite-container {
    .panel-header {
      .tit {
        color: var(--theme-heading);
      }

      .right {
        color: var(--theme-accent);
        background: var(--theme-panel-soft);
        border-color: var(--theme-border);

        &:hover,
        &:focus {
          color: var(--theme-heading);
          background: var(--theme-accent-soft);
          border-color: rgba(142, 199, 255, 0.28);
        }
      }
    }

    .data-table {
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

        .ant-table-tbody > tr.ant-table-placeholder:hover > td,
        .ant-table-placeholder > td {
          background: var(--theme-panel);
          border-bottom-color: var(--theme-border);
        }

        .ant-table-placeholder {
          background: var(--theme-panel);
        }

        .ant-empty-description {
          color: var(--theme-faint);
        }

        .ant-empty-image {
          opacity: 0.72;
          filter: brightness(0.82);
        }
      }
    }
  }
}

@media screen and (max-width: 700px) {
  .invite-container {
    .panel-header {
      align-items: flex-start;
      flex-wrap: wrap;

      .right {
        padding: 0 14px;
      }
    }

    .bal-box {
      flex-direction: column;
      height: auto;
      .money {
        margin-left: 0;
        margin-bottom: 30px;
        font-size: 40px;
      }
    }
  }
}
</style>
