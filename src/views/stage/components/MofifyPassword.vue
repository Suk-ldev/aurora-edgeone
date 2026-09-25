<template>
  <a-spin :spinning="loading" class="mofify-password">
    <a-form-model ref="refForm" :model="formModel" :rules="formRules" @submit.prevent="onSubmit">
      <a-form-model-item :label="$t('旧密码')" prop="password1">
        <a-input v-model="formModel.password1" size="large" type="password" :max-length="64" :placeholder="$t('请输入旧密码')" allow-clear />
      </a-form-model-item>
      <a-form-model-item :label="$t('新密码')" prop="password2">
        <a-input v-model="formModel.password2" size="large" type="password" :max-length="64" :placeholder="$t('请输入新密码')" allow-clear />
      </a-form-model-item>
      <a-form-model-item :label="$t('确认密码')" prop="password3">
        <a-input v-model="formModel.password3" size="large" type="password" :max-length="64" :placeholder="$t('请确认密码')" allow-clear />
      </a-form-model-item>

      <div class="btn">
        <button v-wave type="submit" class="n-button color-3">
          <svg-icon name="pencil-simple-line" />
          {{ $t('确认修改') }}
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
        callback(new Error(i18n.t('两次输入的密码不一致')))
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
          { required: true, message: i18n.t('请输入旧密码'), trigger: 'blur' },
          { min: 8, message: i18n.t('密码至少为8个字符'), trigger: 'blur' }
        ],
        password2: [
          { required: true, message: i18n.t('请输入新密码'), trigger: 'blur' },
          { min: 8, message: i18n.t('密码至少为8个字符'), trigger: 'blur' }
        ],
        password3: [
          { required: true, message: i18n.t('请确认密码'), trigger: 'blur' },
          { min: 8, message: i18n.t('密码至少为8个字符'), trigger: 'blur' },
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
              this.$message.success(this.$t('密码修改成功'))
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
