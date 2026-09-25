<template>
  <div class="auth-container">
    <div class="auth-tools">
      <button class="theme-toggle" type="button" @click="toggleDarkMode">
        <svg-icon :name="isDarkMode ? 'sun' : 'moon'" />
      </button>
    </div>
    <div class="auth-box">
      <rocket />
      <a-form-model ref="refForm" class="right-form" :model="formModel" :rules="formRules" @submit.prevent="onResetPassword">
        <div class="wrapper">
          <h2 class="title">
            {{ $t('找回密码') }}
            <b>{{ $t('使用邮箱找回') }}</b>
          </h2>
          <div class="tip" style="margin-bottom: 30px">
            <router-link class="blu" to="/login">{{ $t('返回登录') }}</router-link>
          </div>
          <a-form-model-item class="control" :label="$t('邮箱')" prop="email">
            <a-input v-model="formModel.email" class="input" size="large" :placeholder="$t('请输入邮箱')" allow-clear />
          </a-form-model-item>
          <a-form-model-item class="control" :label="$t('验证码')" prop="emailCode">
            <a-input v-model="formModel.emailCode" class="input" size="large" :max-length="32" :placeholder="$t('请输入验证码')">
              <a-button
                slot="suffix"
                type="primary"
                :loading="loading2"
                :disabled="seconds > 0"
                style="width: 110px"
                @click="onEmailSend()"
              >
                {{ seconds > 0 ? $t(`重新发送`) + `(${parseInt(seconds)})` : $t(`发送`) }}
              </a-button>
            </a-input>
          </a-form-model-item>
          <a-form-model-item class="control" :label="$t('密码')" prop="password">
            <a-input
              v-model="formModel.password"
              class="input"
              type="password"
              size="large"
              :max-length="64"
              :placeholder="$t('请输入密码')"
              allow-clear
            />
          </a-form-model-item>
          <a-form-model-item class="control" :label="$t('确认密码')" prop="password2">
            <a-input
              v-model="formModel.password2"
              class="input"
              type="password"
              size="large"
              :max-length="64"
              :placeholder="$t('请确认密码')"
              allow-clear
            />
          </a-form-model-item>
          <a-button type="primary" class="btn" style="margin-top: 30px" block :loading="loading" size="large" html-type="submit">
            {{ $t('重置密码') }}
          </a-button>
        </div>
      </a-form-model>
    </div>

    <a-modal :visible="visible" centered :footer="null" @cancel="visible = false">
      <div id="recaptcha" style="height: 80px"></div>
    </a-modal>
  </div>
</template>

<script>
import { resetPassword, sendEmailCode } from './apis/auth'
import Rocket from './components/Rocket'
import './styles/auth.scss'
import dayjs from 'dayjs'
import i18n from '@/i18n'
import { asyncLoadLib } from 'lemutils'
import { mapState } from 'vuex'
import { Darkmode } from '@/core/utils/ls'

export default {
  name: 'ResetPassword',
  components: {
    Rocket
  },
  data() {
    const password2Validator = (rule, value, callback) => {
      if (value === this.formModel.password) {
        callback()
      } else {
        callback(new Error(i18n.t('两次输入的密码不一致')))
      }
    }
    return {
      loading: false,
      loading2: false,
      isDarkMode: false,
      seconds: 0,
      visible: false,
      formModel: {
        email: '',
        emailCode: '',
        password: '',
        password2: '',
        captchaData: ''
      },
      formRules: {
        email: [
          { required: true, message: i18n.t('请输入邮箱'), trigger: 'blur' },
          { type: 'email', message: i18n.t('邮箱格式错误'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: i18n.t('请输入密码'), trigger: 'blur' },
          { min: 8, message: i18n.t('密码至少为8个字符'), trigger: 'blur' }
        ],
        password2: [
          { required: true, message: i18n.t('请确认密码'), trigger: 'blur' },
          { min: 8, message: i18n.t('密码至少为8个字符'), trigger: 'blur' },
          { validator: password2Validator, trigger: 'blur' }
        ],
        emailCode: [{ required: true, message: i18n.t('请输入验证码'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('auth', ['globalConfig'])
  },
  mounted() {
    this.isDarkMode = document.body.classList.contains('is-darkmode')
    const time = this.$ls.get('FindTimer')
    if (time) {
      const duration = 60 - (dayjs().valueOf() - time) / 1000
      console.log('duration', duration, dayjs().valueOf(), time)
      if (duration <= 60) {
        this.countdownTimer(duration)
      } else {
        this.$ls.remove('FindTimer')
      }
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      document.body.classList.toggle('is-darkmode', this.isDarkMode)
      this.$ls.set(Darkmode, this.isDarkMode ? 'dark' : 'light')
    },
    loadGoogleCaptcha() {
      this.visible = true
      this.$nextTick(() => {
        asyncLoadLib(['https://www.google.com/recaptcha/api.js?onload=onloadCallback2&render=explicit'], 'google-recaptcha2')

        window.onloadCallback2 = () => {
          // console.log(this.globalConfig.recaptcha_site_key)
          this.wid = window.grecaptcha.render('recaptcha', {
            sitekey: this.globalConfig.recaptcha_site_key,
            callback: () => {
              this.visible = false
              this.formModel.captchaData = window.grecaptcha.getResponse(this.wid)
              window.grecaptcha.reset(this.wid)

              this.onEmailSend(true)
            }
          })
        }
      })
    },
    countdownTimer(duration) {
      this.seconds = duration
      const timer = setInterval(() => {
        this.seconds--
        if (this.seconds <= 0) {
          clearInterval(timer)
          this.$ls.remove('FindTimer')
        }
      }, 1000)
    },
    onEmailSend(pass) {
      const { email } = this.formModel
      this.$refs.refForm.validateField('email', async (error) => {
        if (error) return
        if (this.globalConfig.is_recaptcha && !pass) {
          this.loadGoogleCaptcha()
          return
        }
        this.loading2 = true
        try {
          const res = await sendEmailCode({
            email,
            recaptcha_data: this.formModel.captchaData
          })
          if (res.data === true) {
            this.$message.success(this.$t('验证码发送成功，如未收到请检查垃圾邮件'))
            this.$ls.set('FindTimer', dayjs().valueOf())
            this.countdownTimer(60)
          }
        } catch {}
        this.loading2 = false
      })
    },
    onResetPassword() {
      const { email, password, emailCode } = this.formModel
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            await resetPassword({
              email,
              password,
              email_code: emailCode
            })
            this.$message.success(this.$t('密码重置成功，请登录'))
            this.$router.push('/login')
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
