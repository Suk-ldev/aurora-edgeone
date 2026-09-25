<template>
  <div class="pay-qrcode">
    <div class="wrapper">
      <div class="site">{{ $t('订单编号') }}：{{ $route.query.orderNo }}</div>
      <div class="red-text">！!{{ $t('请尽快支付，支付完成后，请刷新订单页面') }}！！</div>
      <div class="qr-code-container">
        <div class="qr-code">
          <img :src="imgSrc" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { getOrderState } from './apis/order'

export default {
  name: 'PayQrcode',
  data() {
    return {
      imgSrc: ''
    }
  },
  mounted() {
    this.initImg()
    this.checkOrder()
  },
  methods: {
    initImg() {
      const img = decodeURIComponent(this.$route.query.img)
      if (img.endsWith('jpg', 'png', 'jpeg', 'webp') || img.includes('data:image')) {
        this.imgSrc = img
      } else {
        QRCode.toDataURL(img).then((url) => {
          this.imgSrc = url
        })
      }
    },
    checkOrder() {
      setTimeout(() => {
        const { orderNo } = this.$route.query
        getOrderState(orderNo).then((res) => {
          const state = Number(res.data)

          // 3: 表示支付成功
          if (state === 3) {
            this.$router.replace('/stage/order/info?id=' + orderNo)
          } else {
            this.checkOrder()
          }
        })
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-qrcode {
  height: 100vh;
  color: var(--theme-text);
  background-color: var(--theme-page);
  background-image: radial-gradient(at 80% 20%, rgba(122, 242, 255, 0.558) 0, transparent 40%),
    radial-gradient(at 20% 0, rgba(107, 250, 255, 0.445) 0, transparent 30%), radial-gradient(at 40% 50%, #dbfff1 0, transparent 40%),
    radial-gradient(at 68% 50%, rgba(133, 212, 255, 0.583) 0, transparent 40%), radial-gradient(at 0 100%, #fff 0, transparent 40%),
    radial-gradient(at 80% 100%, #fff 0, transparent 40%), radial-gradient(at 0 0, rgba(133, 182, 255, 0.738) 0, transparent 40%);
  display: flex;
  justify-content: center;
  align-items: center;

  .wrapper {
    width: 360px;
    margin: 0 auto;
    padding: 20px;
  }
  .logo {
    width: 65px;
    height: 65px;
    margin: 0 auto 20px;
  }

  .site {
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 20px;
    color: var(--theme-heading);
  }

  .logo img {
    width: 100%;
    height: 100%;
  }

  .gray-text {
    font-size: 14px;
    text-align: center;
    color: var(--theme-muted);
    line-height: 1.5;
    margin-bottom: 15px;
  }

  .red-text {
    font-size: 14px;
    text-align: center;
    color: #f00;
    line-height: 1.5;
    margin-bottom: 15px;
  }

  .qr-code-container {
    width: 220px;
    background-color: var(--theme-panel);
    border-radius: 10px;
    margin: 20px auto;
    -webkit-box-shadow: 0px 0px 30px 0px rgba(148, 145, 148, 0.2);
    -moz-box-shadow: 0px 0px 30px 0px rgba(148, 145, 148, 0.2);
    box-shadow: 0px 0px 30px 0px rgba(148, 145, 148, 0.2);
  }

  .qr-code-container h2 {
    font-size: 20px;
    text-align: center;
    color: var(--theme-heading);
    margin: 20px;
  }

  .qr-code-container h2 small {
    color: var(--theme-muted);
    font-size: 80%;
    padding-left: 5px;
  }

  .address-text {
    font-size: 12px;
    text-align: center;
    color: var(--theme-muted);
    margin-bottom: 20px;
  }

  .qr-code {
    width: 220px;
    height: 220px;
    border: 1px solid #f2f2f2;
    box-sizing: border-box;
  }

  .qr-code > img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .timer {
    width: 140px;
    margin: 0 auto;
    font-size: 14px;
  }

  .timer .label {
    display: flex;
    align-items: center;
  }

  .timer .label,
  .timer .value {
    display: flex;
    align-items: center;
    padding: 5px 0;
  }

  .timer .label span {
    color: var(--theme-muted);
  }

  .timer .value span {
    color: var(--theme-heading);
    font-size: 16px;
  }

  .timer .label span,
  .timer .value span {
    flex: 1;
    text-align: center;
  }
}

@at-root .is-darkmode {
  .pay-qrcode {
    .timer .label span {
      color: var(--theme-muted);
    }

    .timer .value span {
      color: var(--theme-heading);
    }

    .address-text {
      color: var(--theme-muted);
    }
  }
}
</style>
