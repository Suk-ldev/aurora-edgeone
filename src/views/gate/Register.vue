<template>
  <div class="auth-container">
    <div class="auth-tools">
      <button class="theme-toggle" type="button" @click="toggleDarkMode">
        <svg-icon :name="isDarkMode ? 'sun' : 'moon'" />
      </button>
    </div>
    <div class="auth-box">
      <rocket />
      <a-form-model
        ref="refForm"
        class="right-form"
        :model="formModel"
        :rules="formRules"
        @submit.prevent="onRegister()"
      >
        <div class="wrapper">
          <h2 class="title">
            {{ $t('账号注册') }}
            <b>{{ $t('使用邮箱注册') }}</b>
          </h2>
          <div class="tip" style="margin-bottom: 30px">
            {{ $t('已有账号？') }}
            <router-link class="blu" to="/login">{{ $t('立即登录') }}</router-link>
          </div>
          <a-form-model-item class="control" :label="$t('邮箱')" prop="email">
            <a-input v-model="formModel.email" class="input" size="large" :placeholder="$t('请输入邮箱')" allow-clear>
              <a-select v-if="emailSuffix.length > 0" slot="addonAfter" v-model="formModel.emailAddon" style="width: 140px">
                <a-select-option v-for="item in emailSuffix" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
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
          <a-form-model-item v-if="showInviteCode" class="control" :label="$t('邀请码')" prop="inviteCode">
            <a-input
              v-model="formModel.inviteCode"
              :disabled="!!$route.query.code"
              class="input"
              type="text"
              size="large"
              :max-length="64"
              :placeholder="needInviteCode ? $t('请输入邀请码（必填）') : $t('请输入邀请码（选填）')"
              allow-clear
            />
          </a-form-model-item>
          <a-form-model-item v-if="showEmailCode" class="control" :label="$t('验证码')" prop="emailCode">
            <a-input
              v-model="formModel.emailCode"
              class="input"
              type="text"
              size="large"
              :max-length="32"
              :placeholder="$t('请输入验证码')"
              allow-clear
            >
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
          <div class="agree">
            <a-checkbox v-model="formModel.agree" />
            {{ $t('我已阅读并同意') }}
            <router-link class="blu" to="/agreement">{{ $t('服务条款') }}</router-link>
          </div>
          <a-button type="primary" class="btn" block :loading="loading" size="large" html-type="submit">{{ $t('注册') }}</a-button>
        </div>
      </a-form-model>
    </div>

    <a-modal :visible="visible" centered :footer="null" @cancel="visible = false">
      <div id="recaptcha" style="height: 80px"></div>
    </a-modal>
  </div>
</template>

<script>
import { userRegister, sendEmailCode } from './apis/auth'
import { SHOW_REG_INVITE } from '@/core/constants'
import Rocket from './components/Rocket'
import './styles/auth.scss'
import i18n from '@/i18n'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import { asyncLoadLib } from 'lemutils'
import { Darkmode } from '@/core/utils/ls'

export default {
  name: 'Register',
  components: {
    Rocket
  },
  data() {
    return {
      loading: false,
      loading2: false,
      isDarkMode: false,
      seconds: 0,
      visible: false,
      action: '',
      formModel: {
        agree: false,
        email: '',
        emailAddon: '',
        password: '',
        password2: '',
        emailCode: '',
        inviteCode: '',
        captchaData: ''
      }
    }
  },
  computed: {
    ...mapState('auth', ['globalConfig']),
    showEmailCode() {
      return this.globalConfig.is_email_verify
    },
    needInviteCode() {
      return this.globalConfig.is_invite_force
    },
    showInviteCode() {
      if (this.needInviteCode || this.$route.query.code) return true
      return SHOW_REG_INVITE
    },
    emailSuffix() {
      const list = (this.globalConfig.email_whitelist_suffix || []).map((item) => '@' + item)
      if (list.length > 0) {
        this.formModel.emailAddon = list[0] // eslint-disable-line
      }
      return list
    },
    formRules() {
      const password2Validator = (rule, value, callback) => {
        if (value === this.formModel.password) {
          callback()
        } else {
          callback(new Error(i18n.t('两次输入的密码不一致')))
        }
      }
      const emailValidator = (rule, value, callback) => {
        if (this.formModel.email.includes('@')) {
          callback(new Error(i18n.t('邮箱格式错误')))
        } else {
          callback()
        }
      }
      const rules = {
        email: [{ required: true, message: i18n.t('请输入邮箱'), trigger: 'blur' }],
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

      if (this.emailSuffix.length > 0) {
        rules.email.push({ validator: emailValidator, trigger: 'blur' })
      } else {
        rules.email.push({ type: 'email', message: i18n.t('邮箱格式错误'), trigger: 'blur' })
      }
      if (this.needInviteCode) {
        rules.inviteCode = [{ required: true, message: i18n.t('请输入邀请码'), trigger: 'blur' }]
      }
      return rules
    }
  },
  mounted() {
    this.isDarkMode = document.body.classList.contains('is-darkmode')
    this.formModel.inviteCode = this.$route.query.code ?? ''

    const time = this.$ls.get('RegTimer')
    if (time) {
      const duration = 60 - (dayjs().valueOf() - time) / 1000
      console.log('duration', duration, dayjs().valueOf(), time)
      if (duration <= 60) {
        this.countdownTimer(duration)
      } else {
        this.$ls.remove('RegTimer')
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
        asyncLoadLib(['https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit'], 'google-recaptcha')

        window.onloadCallback = () => {
          // console.log(this.globalConfig.recaptcha_site_key)
          this.wid = window.grecaptcha.render('recaptcha', {
            sitekey: this.globalConfig.recaptcha_site_key,
            callback: () => {
              this.visible = false
              this.formModel.captchaData = window.grecaptcha.getResponse(this.wid)
              window.grecaptcha.reset(this.wid)

              if (this.action === 'register') {
                this.onRegister(true)
              } else {
                this.onEmailSend(true)
              }
            }
          })
        }
      })
    },
    getEmailValue() {
      const { email, emailAddon } = this.formModel
      return this.emailSuffix.length > 0 ? email + emailAddon : email
    },
    countdownTimer(duration) {
      this.seconds = duration
      const timer = setInterval(() => {
        this.seconds--
        if (this.seconds <= 0) {
          clearInterval(timer)
          this.$ls.remove('RegTimer')
        }
      }, 1000)
    },
    onEmailSend(pass) {
      this.$refs.refForm.validateField('email', async (error) => {
        if (error) return
        if (this.globalConfig.is_recaptcha && !pass) {
          this.action = 'sendEmail'
          this.loadGoogleCaptcha()
          return
        }
        this.loading2 = true
        try {
          const res = await sendEmailCode({
            email: this.getEmailValue(),
            recaptcha_data: this.formModel.captchaData
          })
          if (res.data === true) {
            this.$message.success(this.$t('验证码发送成功，如未收到请检查垃圾邮件'))
            this.$ls.set('RegTimer', dayjs().valueOf())
            this.countdownTimer(60)
          }
        } catch {}
        this.loading2 = false
      })
    },
    onRegister(pass) {
      const { agree, password, inviteCode, emailCode, captchaData } = this.formModel
      if (!agree) return this.$message.info(this.$t('请先同意服务条款'))
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          if (this.globalConfig.is_recaptcha && !pass && this.action !== 'sendEmail') {
            this.action = 'register'
            this.loadGoogleCaptcha()
            return
          }
          this.loading = true
          try {
            await userRegister({
              email: this.getEmailValue(),
              password,
              invite_code: inviteCode,
              email_code: emailCode,
              recaptcha_data: captchaData
            })
            this.$message.success(this.$t('注册成功，请登录'))
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
