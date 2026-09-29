<template>
  <a-modal v-model="visible" :title="$t('apply_withdrawal')" :confirm-loading="loading" :after-close="onClosed" @ok="onSubmit">
    <a-spin :spinning="loading">
      <a-form-model ref="refForm" :model="formModel" :rules="formRules" @submit.prevent="onSubmit">
        <a-form-model-item :label="$t('withdrawal_method')" prop="withdraw_method">
          <a-select v-model="formModel.withdraw_method" size="large" :placeholder="$t('select_withdrawal_method')">
            <a-select-option v-for="item in methods" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :label="$t('withdrawal_account')" prop="withdraw_account">
          <a-input v-model="formModel.withdraw_account" size="large" :placeholder="$t('enter_withdrawal_account')" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { cashCommission } from '../apis/invite'
import i18n from '@/i18n'
import { mapState } from 'vuex'

export default {
  name: 'CashModal',
  data() {
    return {
      visible: false,
      loading: false,
      methods: [],
      formModel: {
        withdraw_method: '',
        withdraw_account: ''
      },
      formRules: {
        withdraw_method: [{ required: true, message: i18n.t('select_withdrawal_method'), trigger: 'change' }],
        withdraw_account: [{ required: true, message: i18n.t('enter_withdrawal_account'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('auth', ['userConfig'])
  },
  methods: {
    async showModal() {
      this.visible = true

      this.methods = this.userConfig.withdraw_methods ?? []
      if (this.methods.length > 0) {
        this.formModel.withdraw_method = this.methods[0]
      }
    },
    onSubmit() {
      const { withdraw_method, withdraw_account } = this.formModel
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const res = await cashCommission({
              withdraw_method,
              withdraw_account
            })
            if (res.data === true) {
              this.$message.success(this.$t('withdrawal_application_initiat'))
              this.visible = false
              this.$emit('change')
              this.$router.push('/console/support')
            }
          } catch {}
          this.loading = false
        } else {
          return false
        }
      })
    },
    onClosed() {
      this.formModel.withdraw_account = ''
      this.formModel.withdraw_method = ''
    }
  }
}
</script>
