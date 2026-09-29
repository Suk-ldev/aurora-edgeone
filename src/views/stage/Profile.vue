<template>
  <div class="profile-container">
    <div class="pro-bg use-shadow">
      <img id="banner" src="./assets/allyson.jpg" />
    </div>
    <div class="pro-bag use-shadow">
      <h3 class="tit">{{ $t('wallet') }}</h3>
      <div class="rmb">{{ userInfo.balance | amount }} {{ userConfig.currency }}</div>
      <div class="btns">
        <a-button v-wave type="button" size="large" style="margin-bottom: 10px" @click="onTransferShow">
          <svg-icon name="swap" />
          {{ $t('commission_transfer') }}
        </a-button>
        <a-button v-if="showWithdraw" v-wave type="button" size="large" style="margin-bottom: 0" @click="onCashShow">
          <svg-icon name="wallet" />
          {{ $t('commission_withdrawal') }}
        </a-button>
      </div>
    </div>

    <a-row :gutter="[30, 30]">
      <a-col :xs="24" :md="12">
        <a-card :title="$t('change_password')" class="pro-pwd">
          <mofify-password />
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-card :title="$t('notice_2')" class="pro-setting">
          <span class="tip">{{ $t('here_can_set_up_manage_integra') }}</span>
          <div class="item">
            <span>{{ $t('expiration_email_reminder') }}</span>
            <a-switch :default-checked="!!userInfo.remind_expire" @change="onExpireChange" />
          </div>
          <div class="item">
            <span>{{ $t('traffic_email_reminder') }}</span>
            <a-switch :default-checked="!!userInfo.remind_traffic" @change="onTrafficChange" />
          </div>
        </a-card>
        <a-card :title="$t('reset_subscription_information')" class="pro-reset">
          <a-alert class="tip" :message="$t('if_account_information_or_subs')" type="warning" show-icon />
          <div class="btn">
            <button v-wave type="button" class="n-button color-3" @click="resetSubscribe">
              <svg-icon name="arrow-clockwise" />
              {{ $t('confirm_reset') }}
            </button>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[30, 30]">
      <a-col :xs="24" :md="12">
        <a-card v-if="userConfig.telegram_discuss_link" :title="$t('m_telegram')" class="pro-tele">
          <div class="desc">{{ $t('join_official_discussion_group') }}</div>
          <button v-wave type="button" class="n-button color-1" @click="onJumpLink">
            <svg-icon name="telegram-logo" />
            {{ $t('join_now') }}
          </button>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-card v-if="userConfig.is_telegram == 1" :title="$t('bind_telegram')" class="pro-tele">
          <div class="desc">{{ $t('bind_telegram_bot_get_more_con') }}</div>
          <button v-wave type="button" class="n-button color-1" @click="onBindBot">
            <svg-icon name="robot" />
            {{ $t('start_now') }}
          </button>
        </a-card>
      </a-col>
    </a-row>

    <transfer-modal ref="refTransfer" @change="onOperateChange" />
    <cash-modal ref="refCash" @change="onOperateChange" />
    <telegram-modal ref="refTelegram" />
  </div>
</template>

<script>
import MofifyPassword from './components/MofifyPassword'
import TransferModal from './components/TransferModal'
import CashModal from './components/CashModal'
import TelegramModal from './components/TelegramModal'
import { resetSubscribe, updateRemind, getBotInfo } from './apis/profile'
import { mapState } from 'vuex'
import $ from 'jquery'

export default {
  name: 'Profile',
  components: {
    MofifyPassword,
    TransferModal,
    CashModal,
    TelegramModal
  },
  computed: {
    ...mapState('auth', ['userInfo', 'userConfig']),
    showWithdraw() {
      return this.userConfig.withdraw_close === 0 // 0: 开启提现， 1: 关闭提现
    }
  },
  mounted() {
    this.initBanner()
  },
  methods: {
    initBanner() {
      const Scene3D = {
        background: $('#banner'),
        maxWidth: $(window).width(),
        maxHeight: $(window).height(),
        move: function (layer, x, y) {
          layer.css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)')
        }
      }

      $(window)
        .on('resize', function () {
          Scene3D.maxWidth = $(window).width()
          Scene3D.maxHeight = $(window).height()
        })
        .on('mousemove', function (event) {
          const eventX = event.pageX
          const eventY = event.pageY
          const percentX = (eventX - Scene3D.maxWidth / 2) / Scene3D.maxWidth
          const percentY = (eventY - Scene3D.maxHeight / 2) / Scene3D.maxHeight

          Scene3D.move(Scene3D.background, percentX * 40, percentY * 15)
        })
    },
    resetSubscribe() {
      this.$confirm({
        title: this.$t('sure_want_reset_subscription_i'),
        content: this.$t('if_subscription_address_or_inf'),
        icon: 'exclamation-circle',
        onOk: async () => {
          await resetSubscribe()
          this.$message.success(this.$t('reset_succeeded'))
        }
      })
    },
    onJumpLink() {
      window.open(this.userConfig.telegram_discuss_link, '_blank')
    },
    async onBindBot() {
      const res = await getBotInfo()
      console.log(res)
      const username = res.data?.username
      this.$refs.refTelegram.showModal(username)
    },
    onExpireChange(checked) {
      updateRemind({ remind_expire: checked ? 1 : 0 })
    },
    onTrafficChange(checked) {
      updateRemind({ remind_traffic: checked ? 1 : 0 })
    },
    onTransferShow() {
      this.$refs.refTransfer.showModal()
    },
    onCashShow() {
      this.$refs.refCash.showModal()
    },
    onOperateChange() {}
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  padding-bottom: 30px;
  .pro-bg {
    width: 100%;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: calc(100% + 100px);
      display: block;
      margin-top: -50px;
      margin-left: -50px;
    }
  }

  .pro-bag {
    border-radius: 12px;
    width: calc(100% - 80px);
    margin: -60px auto 50px;
    padding: 20px 220px 20px 30px;
    position: relative;
    overflow: hidden;

    .tit {
      color: var(--theme-muted);
      font-size: 14px;
      font-weight: 700;
    }
    .rmb {
      color: var(--theme-heading);
      font-size: 36px;
      font-weight: 600;
      margin-bottom: 5px;
      position: relative;
      top: 18px;
    }
    .btns {
      position: absolute;
      right: 20px;
      top: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .svg-icon {
        font-size: 19px;
        margin-right: 5px;
      }
    }

    .n-button {
      height: 36px;
      margin-bottom: 20px;

      .svg-icon {
        font-size: 24px;
        margin-right: 5px;
      }
    }
  }

  .pro-setting {
    position: relative;
    .tip {
      font-size: 12px;
      color: var(--theme-faint);
      position: absolute;
      left: 82px;
      top: 22px;
    }

    .item {
      font-weight: 600;
      font-size: 14px;
      padding: 10px 0;
      color: var(--theme-text);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      > span {
        flex: 1;
      }
    }
  }
  .pro-reset {
    margin-top: 30px;

    .btn {
      display: flex;
      justify-content: flex-end;
      padding: 20px 0;

      .n-button {
        height: 36px;
      }
    }
  }

  .pro-tele {
    padding-bottom: 15px;
    .desc {
      font-size: 16px;
      margin-bottom: 12px;
    }

    .n-button {
      height: 36px;
    }
  }

  ::v-deep {
    .ant-card {
      border: 0;
      border-radius: 12px;
      background-color: var(--theme-panel);
      box-shadow: var(--theme-shadow);
    }
    .ant-card-head {
      border-bottom: 0;
    }
    .ant-card-body {
      padding: 10px 24px;
    }
    .ant-card-head-title {
      font-size: 18px;
      color: var(--theme-heading);
      font-weight: 600;
    }
  }
}

@at-root .is-darkmode {
  .profile-container {
    .pro-bg {
      border-color: rgba(148, 163, 184, 0.14);
    }

    .pro-bag {
      background: var(--theme-panel);
      border-color: var(--theme-border);

      .tit {
        color: var(--theme-faint);
      }

      .rmb {
        color: var(--theme-heading);
      }
    }

    .pro-setting {
      .tip {
        color: var(--theme-faint);
      }

      .item {
        color: var(--theme-text);
      }
    }

    .pro-tele {
      .desc {
        color: var(--theme-muted);
      }
    }

    ::v-deep {
      .ant-card {
        background-color: var(--theme-panel);
      }

      .ant-card-head-title {
        color: var(--theme-heading);
      }
    }
  }
}

@media screen and (max-width: 700px) {
  .profile-container {
    .pro-bag {
      width: 90%;
      padding-right: 30px;
      .rmb {
        text-align: center;
      }
      .btns {
        position: static;
        margin-top: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>
