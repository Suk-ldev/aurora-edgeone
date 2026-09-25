<template>
  <div class="error-container">
    <div class="pic">
      <lottie v-if="lottieOptions.animationData" :options="lottieOptions" class="in" :height="500" :width="500" />
    </div>
    <div class="right">
      <h2 class="title">{{ $t('似乎出了点问题') }}</h2>
      <p class="desc">{{ $t('请检查您的URL是否正确, 或点击重新登录') }}</p>
      <a-button class="btn" type="primary" round @click="onBack">{{ $t('重新登录') }}</a-button>
    </div>
  </div>
</template>

<script>
import Lottie from 'vue-lottie'
import axios from 'axios'
import { STATIC_URL } from '@/core/constants'

export default {
  name: 'Error',
  components: {
    Lottie
  },
  data() {
    return {
      lottieOptions: {
        animationData: null
      }
    }
  },
  mounted() {
    setTimeout(() => {
      axios.get(STATIC_URL + '/98488-bot-error-404.json').then((res) => {
        this.lottieOptions.animationData = res.data
      })
    }, 0)
  },
  methods: {
    onBack() {
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.error-container {
  background-color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  line-height: 1.5;
  overflow: auto;

  .pic {
    width: 500px;
    height: 500px;
  }

  .right {
    width: 300px;
    margin-left: 100px;
  }

  .title {
    font-size: 24px;
    margin: 20px 0 20px;
    color: #333;
    font-weight: 400;
  }

  .desc {
    font-size: 14px;
    color: #999;
    margin: 10px 0 20px;
  }

  .btn {
    width: 160px;
    font-size: 14px;
    height: 40px;
  }
}

@media screen and (max-width: 600px) {
  .error-container {
    flex-direction: column;
  }
}
</style>
