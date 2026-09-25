<template>
  <div class="agreement-container">
    <div class="logo">{{ $appName }}</div>
    <a-button type="text" icon="rollback" class="back" shape="circle" size="large" @click="$router.back()"></a-button>
    <div class="card">
      <div class="card-header">
        <h4>{{ $t('服务协议') }}</h4>
      </div>
      <div class="card-body">
        <div v-html="$t('用户协议完整内容', { appName: this.$appName })"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Agreement'
}
</script>

<style lang="scss">
.agreement-container {
  background-color: #f4f6f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;

  .logo {
    width: 40%;
    margin: 20px 0;
    margin-bottom: 40px;
    font-size: 24px;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: #666;
    text-align: center;
  }

  .back {
    position: fixed;
    left: 20px;
    top: 20px;
  }

  .card {
    width: 800px;
    border-top: 2px solid #{'rgba(var(--primary-color), 1)'};
    box-shadow: 0 4px 8px rgba(#000, 0.03);
    background-color: #fff;
    border-radius: 3px;
    position: relative;
    margin-bottom: 30px;

    .card-header {
      border-bottom: 1px solid #f9f9f9;
      line-height: 30px;
      min-height: 70px;
      padding: 15px 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      h4 {
        font-size: 16px;
        line-height: 28px;
        color: #{'rgba(var(--primary-color), 1)'};
        padding-right: 10px;
        margin-bottom: 0;
        font-weight: bold;
      }
    }

    .card-body {
      padding: 20px 25px;
      line-height: 2;
      font-size: 16px;

      ol {
        padding-left: 20px;
      }
      ul {
        padding-left: 20px;
      }
      h6:first-of-type {
        margin-top: 4px;
      }
      h6 {
        margin-top: 24px;
        font-size: 18px;
        color: inherit;
      }
      ol li {
        padding: 4px;
      }
      ul li {
        padding: 0;
      }

      p {
        font-weight: 500;
      }
    }
  }
}

@media screen and (max-width: 900px) {
  .agreement-container {
    .card {
      width: 600px;
    }
  }
}
@media screen and (max-width: 630px) {
  .agreement-container {
    .card {
      width: auto;
      margin: 0 10px;
    }
  }
}
</style>
