<template>
  <a-spin :spinning="loading" class="mofify-password">
    <a-form-model ref="refForm" :model="formModel" :rules="formRules" @submit.prevent="onSubmit">
      <a-form-model-item :label="$t('old_password')" prop="password1">
        <a-input v-model="formModel.password1" size="large" type="password" :max-length="64" :placeholder="$t('enter_old_password')" allow-clear />
      </a-form-model-item>
      <a-form-model-item :label="$t('new_password')" prop="password2">
        <a-input v-model="formModel.password2" size="large" type="password" :max-length="64" :placeholder="$t('enter_new_password')" allow-clear />
      </a-form-model-item>
      <a-form-model-item :label="$t('confirm_password')" prop="password3">
        <a-input v-model="formModel.password3" size="large" type="password" :max-length="64" :placeholder="$t('confirm_password_2')" allow-clear />
      </a-form-model-item>

      <div class="btn">
        <button v-wave type="submit" class="n-button color-3">
          <svg-icon name="pencil-simple-line" />
          {{ $t('confirm_modification') }}
        </button>
      </div>
    </a-form-model>
  </a-spin>
</template>

<script>
import { changePassword } from '@/views/gate/apis/auth'
import i18n from '@/i18n'

export default {
  name: 'MofifyPassword',
  data() {
    const password2Validator = (rule, value, callback) => {
      if (value === this.formModel.password2) {
        callback()
      } else {
        callback(new Error(i18n.t('two_input_passwords_do_not_mat')))
      }
    }
    return {
      visible: false,
      loading: false,
      formModel: {
        password1: '',
        password2: '',
        password3: ''
      },
      formRules: {
        password1: [
          { required: true, message: i18n.t('enter_old_password'), trigger: 'blur' },
          { min: 8, message: i18n.t('password_must_be_at_least_8_ch'), trigger: 'blur' }
        ],
        password2: [
          { required: true, message: i18n.t('enter_new_password'), trigger: 'blur' },
          { min: 8, message: i18n.t('password_must_be_at_least_8_ch'), trigger: 'blur' }
        ],
        password3: [
          { required: true, message: i18n.t('confirm_password_2'), trigger: 'blur' },
          { min: 8, message: i18n.t('password_must_be_at_least_8_ch'), trigger: 'blur' },
          { validator: password2Validator, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      const { password1, password2 } = this.formModel
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const res = await changePassword({
              old_password: password1,
              new_password: password2
            })
            if (res.data === true) {
              this.$message.success(this.$t('password_changed_successfully'))
            }
          } catch {}
          this.loading = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mofify-password {
  padding-bottom: 20px;
  ::v-deep {
    .ant-form-item {
      margin-bottom: 10px;
    }
    .ant-form-item-label > label {
      font-size: 16px;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    .n-button {
      height: 36px;
    }
  }
}

@at-root .is-darkmode {
  .mofify-password {
    ::v-deep {
      .ant-form-item-label > label {
        color: var(--theme-text);
      }
    }
  }
}
</style>
