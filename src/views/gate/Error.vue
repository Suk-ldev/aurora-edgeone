<template>
  <div class="error-container">
    <h2 class="title">{{ $t('seems_there_problem') }}</h2>
    <p class="desc">{{ $t('check_if_url_correct_or_click') }}</p>
    <a-button class="btn" type="primary" @click="onBack">{{ $t('re_login') }}</a-button>
  </div>
</template>

<script>
export default {
  name: 'Error',
  methods: {
    onBack() {
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.error-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  line-height: 1.5;
  text-align: center;

  .title {
    font-size: 22px;
    font-weight: 500;
    margin: 0 0 8px;
  }

  .desc {
    font-size: 14px;
    color: #999;
    margin: 0 0 24px;
  }

  .btn {
    width: 160px;
    height: 40px;
    font-size: 14px;
  }
}
</style>
