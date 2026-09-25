<template>
  <a-modal v-model="visible" :title="$t('推广佣金划转至余额')" :confirm-loading="loading" :after-close="onClosed" @ok="onSubmit">
    <a-spin :spinning="loading">
      <a-alert :message="tipInfo" type="warning" show-icon />
      <a-form-model ref="refForm" :model="formModel" :rules="formRules" @submit.prevent="onSubmit">
        <a-form-model-item :label="$t('当前推广佣金余额')">
          <a-input :value="leftMoney" size="large" disabled />
        </a-form-model-item>
        <a-form-model-item :label="$t('划转金额')" prop="transfer_amount">
          <a-input v-model="formModel.transfer_amount" size="large" :placeholder="$t('请输入需要划转到余额的金额')" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { transferCommission } from '../apis/invite'
import { mapState } from 'vuex'
import i18n from '@/i18n'

export default {
  name: 'TransferModal',
  data() {
    return {
      visible: false,
      loading: false,
      leftMoney: 0,
      formModel: {
        transfer_amount: ''
      },
      formRules: {
        transfer_amount: [{ required: true, message: i18n.t('请输入当前需要划转的金额'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('auth', ['userInfo']),
    tipInfo() {
      return this.$t('划转后的余额仅用于X消费使用', { name: this.$appName })
    }
  },
  methods: {
    async showModal() {
      this.leftMoney = ((this.userInfo.commission_balance ?? 0) / 100).toFixed(2) // 当前剩余佣金
      this.visible = true
    },
    onSubmit() {
      const { transfer_amount } = this.formModel
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const res = await transferCommission({
              transfer_amount: transfer_amount * 100
            })
            if (res.data === true) {
              this.$message.success(this.$t('划转成功'))
              this.visible = false
              this.$emit('change')
              this.$store.dispatch('auth/getUserInfo')
            }
          } catch {}
          this.loading = false
        } else {
          return false
        }
      })
    },
    onClosed() {
      this.formModel.transfer_amount = ''
    }
  }
}
</script>
