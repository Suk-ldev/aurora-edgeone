<template>
  <a-modal v-model="visible" :title="$t('create_new_work_order')" :confirm-loading="loading" :after-close="onClosed" @ok="onSubmit">
    <a-spin :spinning="loading">
      <a-form-model ref="refForm" :model="formModel" :rules="formRules" @submit.prevent="onSubmit">
        <a-form-model-item :label="$t('subject')" prop="subject">
          <a-input v-model="formModel.subject" size="large" :max-length="64" :placeholder="$t('enter_work_order_problem')" allow-clear />
        </a-form-model-item>
        <a-form-model-item :label="$t('work_order_grade')" prop="level">
          <a-select v-model="formModel.level" size="large" :placeholder="$t('select_work_order_level')">
            <a-select-option v-for="item in Levels.toArray()" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :label="$t('message')" prop="message">
          <a-input v-model="formModel.message" type="textarea" size="large" :max-length="256" :rows="4" :placeholder="$t('describe_problem_encountered')" allow-clear />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { Levels } from '../enums/ticket'
import { saveTicket } from '../apis/ticket'
import i18n from '@/i18n'

export default {
  name: 'TicketModal',
  data() {
    return {
      visible: false,
      loading: false,
      formModel: {
        subject: '',
        level: Levels.LOW,
        message: ''
      },
      formRules: {
        subject: [{ required: true, message: i18n.t('enter_work_order_problem'), trigger: 'blur' }],
        level: [{ required: true, message: i18n.t('select_work_order_level'), trigger: 'change' }],
        message: [{ required: true, message: i18n.t('describe_problem_encountered'), trigger: 'blur' }]
      },
      Levels
    }
  },
  methods: {
    async showModal(row) {
      this.visible = true
    },
    onSubmit() {
      const { subject, level, message } = this.formModel
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            const res = await saveTicket({
              subject,
              level,
              message
            })
            if (res.data === true) {
              this.$message.success(this.$t('work_order_submitted'))
              this.visible = false
              this.$emit('change')
            }
          } catch {}
          this.loading = false
        } else {
          return false
        }
      })
    },
    onClosed() {
      console.log(222)
      this.formModel.message = ''
      this.formModel.subject = ''
      this.formModel.level = Levels.LOW
    }
  }
}
</script>
