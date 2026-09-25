<template>
  <div class="auth-container">
    <div class="auth-tools">
      <button class="theme-toggle" type="button" @click="toggleDarkMode">
        <svg-icon :name="isDarkMode ? 'sun' : 'moon'" />
      </button>
      <lang-change size="20px" />
    </div>
    <div class="auth-box">
      <rocket />
      <a-form-model ref="refForm" class="right-form" :model="formModel" :rules="formRules" @submit.prevent="onLogin()">
        <div class="wrapper">
          <h2 class="title">
            {{ $t('账号登录') }}
            <b>{{ $t('使用邮箱和密码登录') }}</b>
          </h2>
          <div class="tip" style="margin-bottom: 30px">
            {{ $t('还没有账号？') }}
            <router-link class="blu" to="/register">{{ $t('立即注册') }}</router-link>
          </div>
          <a-form-model-item class="control" :label="$t('邮箱')" prop="email">
            <a-input v-model="formModel.email" class="input" size="large" :placeholder="$t('请输入邮箱')" allow-clear />
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
          <div class="agree">
            <router-link class="blu" to="/reset-password">{{ $t('忘记密码？') }}</router-link>
          </div>
          <a-button type="primary" class="btn" block :loading="loading" size="large" html-type="submit">{{ $t('登录') }}</a-button>
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
import Rocket from './components/Rocket'
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
    Rocket,
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
          { required: true, message: i18n.t('请输入邮箱'), trigger: 'blur' },
          { type: 'email', message: i18n.t('邮箱格式错误'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: i18n.t('请输入密码'), trigger: 'blur' },
          { min: 8, message: i18n.t('密码至少为8个字符'), trigger: 'blur' }
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
          // console.log(this.globalConfig.recaptcha_site_key)
          this.wid = window.grecaptcha.render('recaptcha', {
            sitekey: this.globalConfig.recaptcha_site_key,
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
          if (this.globalConfig.is_recaptcha && !pass) {
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
            this.$message.success(this.$t('登录成功'))
            this.$router.push('/stage')
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
