<template>
  <div class="auth-container">
    <div class="auth-tools">
      <button class="theme-toggle" type="button" @click="toggleDarkMode">
        <svg-icon :name="isDarkMode ? 'sun' : 'moon'" />
      </button>
      <lang-change size="20px" />
    </div>
    <div class="auth-box">
      <a-form-model ref="refForm" class="right-form" :model="formModel" :rules="formRules" @submit.prevent="onLogin()">
        <div class="wrapper">
          <h2 class="title">
            {{ $t('account_login') }}
            <b>{{ $t('login_with_email_password') }}</b>
          </h2>
          <div class="tip" style="margin-bottom: 30px">
            {{ $t('m_45') }}
            <router-link class="blu" to="/register">{{ $t('register_now') }}</router-link>
          </div>
          <a-form-model-item class="control" :label="$t('email')" prop="email">
            <a-input v-model="formModel.email" class="input" size="large" :placeholder="$t('enter_email')" allow-clear />
          </a-form-model-item>
          <a-form-model-item class="control" :label="$t('password')" prop="password">
            <a-input
              v-model="formModel.password"
              class="input"
              type="password"
              size="large"
              :max-length="64"
              :placeholder="$t('enter_password')"
              allow-clear
            />
          </a-form-model-item>
          <div class="agree">
            <router-link class="blu" to="/reset-password">{{ $t('forgot_password') }}</router-link>
          </div>
          <a-button type="primary" class="btn" block :loading="loading" size="large" html-type="submit">{{ $t('login') }}</a-button>
        </div>
      </a-form-model>
    </div>

    <a-modal :visible="visible" centered :footer="null" @cancel="visible = false">
      <div id="recaptcha" style="height: 80px"></div>
    </a-modal>
  </div>
</template>

<script>
import { userLogin } from './apis/auth'
import LangChange from '@/views/stage/components/LangChange'
import { Authorization } from '@/core/utils/ls'
import { Darkmode } from '@/core/utils/ls'
import './styles/auth.scss'
import i18n from '@/i18n'
import { asyncLoadLib } from 'lemutils'
import { mapState } from 'vuex'

export default {
  name: 'Login',
  components: {
    LangChange
  },
  data() {
    return {
      loading: false,
      visible: false,
      isDarkMode: false,
      formModel: {
        email: '',
        password: '',
        captchaData: ''
      },
      formRules: {
        email: [
          { required: true, message: i18n.t('enter_email'), trigger: 'blur' },
          { type: 'email', message: i18n.t('email_format_error'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: i18n.t('enter_password'), trigger: 'blur' },
          { min: 8, message: i18n.t('password_must_be_at_least_8_ch'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('auth', ['globalConfig'])
  },
  mounted() {
    this.isDarkMode = document.body.classList.contains('is-darkmode')
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
        asyncLoadLib(['https://www.google.com/recaptcha/api.js?onload=onloadCallback3&render=explicit'], 'google-recaptcha3')

        window.onloadCallback3 = () => {
          // console.log(this.globalConfig.captchaKey)
          this.wid = window.grecaptcha.render('recaptcha', {
            sitekey: this.globalConfig.captchaKey,
            callback: () => {
              this.visible = false
              this.formModel.captchaData = window.grecaptcha.getResponse(this.wid)
              window.grecaptcha.reset(this.wid)

              this.onLogin(true)
            }
          })
        }
      })
    },
    onLogin(pass) {
      const { email, password, captchaData } = this.formModel
      this.$refs.refForm.validate(async (valid) => {
        if (valid) {
          if (this.globalConfig.captchaOn && !pass) {
            this.loadGoogleCaptcha()
            return
          }
          this.loading = true
          try {
            const { data } = await userLogin({
              email,
              password,
              captchaData
            })
            this.$ls.set(Authorization, data.auth_data)
            this.$message.success(this.$t('login_succeeded'))
            this.$router.push('/console')
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
