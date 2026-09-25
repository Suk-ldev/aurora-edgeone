<template>
  <div class="order-info">
    <a-row v-if="orderData" :gutter="[30, 30]">
      <a-col :md="24" :lg="14">
        <div class="order-main use-shadow">
          <div class="g-group">
            <div class="header">{{ $t('订单详情') }}</div>
            <div class="items">
              <div class="item">
                <span class="tit">{{ $t('订单号') }}:</span>
                <span class="value">{{ orderData.trade_no }}</span>
              </div>
              <div class="item">
                <span class="tit">{{ $t('创建时间') }}:</span>
                <span class="value">{{ orderData.created_at | datetime }}</span>
              </div>
            </div>
            <button v-if="orderData.status === States.WAIT_PAY" v-wave type="button" class="btn-cancel n-button color-3" @click="onCancel">
              <svg-icon name="x" />
              {{ $t('取消订单') }}
            </button>
          </div>

          <a-divider />

          <div class="g-group">
            <div class="header">{{ $t('商品详情') }}</div>
            <div class="items">
              <div class="item">
                <span class="tit">{{ $t('商品名称') }}:</span>
                <span class="value">{{ orderData.plan.name }}</span>
              </div>
              <div class="item">
                <span class="tit">{{ $t('类型/周期') }}:</span>
                <span class="value">{{ orderData.periodLabel }}</span>
              </div>
              <div class="item">
                <span class="tit">{{ $t('产品流量') }}:</span>
                <span class="value">
                  {{ orderData.flowValue | flow }}{{ orderData.period === 'onetime_price' ? '' : '/' + $t('每月') }}
                </span>
              </div>
            </div>
            <div class="tag-state2">
              <span>{{ orderStateLabel }}</span>
            </div>
          </div>

          <template v-if="orderData.status === States.WAIT_PAY">
            <a-divider />

            <div class="g-group">
              <div class="header">{{ $t('支付方式') }}</div>
              <div class="items">
                <div v-for="item in payments" :key="item.id" class="item" :style="{ width: paymentWidth }" @click="payType = item.id">
                  <button v-wave type="button" class="btn-payment" :class="{ 'is-active': payType === item.id }">
                    <img v-show="item.icon" :src="item.icon" width="30" />
                    {{ item.name }}
                    <template v-if="item.handling_fee_percent">({{ item.handling_fee_percent + '%' }}{{ $t('手续费') }})</template>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </a-col>
      <a-col :md="24" :lg="10">
        <div class="order-side use-shadow">
          <div class="g-group">
            <div class="header">{{ $t('订单摘要') }}</div>
            <div class="items">
              <div class="item">
                <span class="tit">{{ $t('商品价格') }}:</span>
                <span class="value">{{ orderData.plan[orderData.period] | amount }}</span>
              </div>
              <div class="item">
                <span class="tit">{{ $t('余额支付') }}:</span>
                <span class="value">{{ orderData.balance_amount | amount }}</span>
              </div>
              <div class="item">
                <span class="tit">{{ $t('抵扣金额') }}:</span>
                <span class="value">{{ orderData.discount_amount | amount }}</span>
              </div>
              <div v-if="orderData.surplus_amount > 0" class="item">
                <span class="tit">{{ $t('折抵金额') }}:</span>
                <span class="value">{{ orderData.surplus_amount | amount }}</span>
              </div>
              <div v-if="orderData.refund_amount > 0" class="item">
                <span class="tit">{{ $t('退款金额') }}:</span>
                <span class="value">{{ orderData.refund_amount | amount }}</span>
              </div>
              <div class="item">
                <span class="tit">{{ $t('总计') }}:</span>
                <span class="value">{{ orderData.total_amount | amount }}</span>
              </div>
            </div>
          </div>

          <template v-if="orderData.status === States.WAIT_PAY">
            <a-divider />

            <div class="g-btns">
              <a-button v-wave icon="shopping-cart" :loading="loading" class="btn" type="primary" @click="onCallPay">
                {{ $t('立即支付') }}
              </a-button>
            </div>
          </template>
        </div>
      </a-col>
    </a-row>

    <div v-else class="spin-loading">
      <a-spin size="large" />
    </div>
  </div>
</template>

<script>
import { getOrderInfo, cancelOrder, checkoutOrder, getOrderPayments } from './apis/order'
import { planTypes } from './utils/plan'
import { States } from './enums/order'
import bytes from 'bytes'

export default {
  name: 'OrderInfo',
  data() {
    return {
      orderData: null,
      payments: [],
      payType: '',
      loading: false,
      States
    }
  },
  computed: {
    orderStateLabel() {
      return States.getLabel(this.orderData.status)
    },
    paymentWidth() {
      const w = Math.max.apply(
        null,
        this.payments.map((item) => {
          const width = item.name.split('').reduce((sum, v) => {
            return (sum += v.charCodeAt(0) > 127 ? 15 : 10)
          }, 0)
          if (item.handling_fee_percent > 0) {
            return width + 120
          }
          return width
        })
      )
      return w + 70 + 'px'
    }
  },
  mounted() {
    this.getOrderData()
    this.getPayments()

    this.$store.dispatch('auth/getUserInfo')
  },
  methods: {
    async getOrderData() {
      const res = await getOrderInfo(this.$route.query.id)
      const orderData = res.data ?? {}
      orderData.periodLabel = planTypes.find((item) => item.key === orderData.period)?.label2
      orderData.flowValue = bytes.parse(orderData.plan.transfer_enable + 'GB') // 统一转为字节

      this.orderData = orderData
    },
    async getPayments() {
      const res = await getOrderPayments()
      this.payments = res.data ?? []
      if (this.payments.length > 0) {
        this.payType = this.payments[0].id
      }
    },
    async onCancel() {
      this.$confirm({
        title: this.$t('注意'),
        content: this.$t('确定要取消该订单吗？'),
        onOk: async () => {
          const res = await cancelOrder(this.orderData.trade_no)
          if (res.data === true) {
            this.$message.success(this.$t('订单已取消'))
            this.getOrderData()
          }
        }
      })
    },
    async onCallPay() {
      /* eslint-disable */
      const res = await checkoutOrder(this.orderData.trade_no, this.payType)
      // 1:url 0:二维码 -1金额为0不做任何操作
      if (res.type === 1) {
        const url = res.data
        window.location.href = url
      } else if (res.type === 0) {
        this.$router.replace({
          path: '/pay/qrcode',
          query: {
            img: encodeURIComponent(res.data),
            orderNo: this.orderData.trade_no
          }
        })
      } else if (res.type === -1) {
        // 金额为0
        this.$message.success(this.$t('支付成功'))
        this.getOrderData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order-info {
  .order-main {
    padding: 40px 80px;
  }
  .order-side {
    padding: 40px 80px;
  }
  .g-group {
    position: relative;
    .header {
      font-size: 20px;
      margin-bottom: 16px;
    }
    .items {
      &.disabled {
        filter: grayscale(0.2);
        pointer-events: none;
      }
    }

    .item {
      padding: 8px 0;
    }
    .tit {
      color: var(--theme-muted);
      font-size: 18px;
      margin-right: 5px;
    }
    .value {
      font-size: 18px;
      word-wrap: break-word;
      word-break: break-all;
    }

    .tag-state2 {
      width: 120px;
      height: 120px;
      background: url('./assets/yz.png') no-repeat center;
      background-size: contain;
      text-align: center;
      overflow: hidden;
      position: absolute;
      right: 0;
      top: 0;
      transform: rotate(45deg) perspective(400px);

      span {
        display: block;
        margin-top: 50px;
        font-size: 18px;
        color: #fff;
      }
    }

    .btn-cancel {
      position: absolute;
      right: 0;
      top: 0;
      min-width: 120px;
      height: 36px;
    }
    .btn-payment {
      width: 100%;
      height: 46px;
      background: rgba(49, 139, 246, 0.16);
      border-radius: 4px;
      text-align: left;
      font-size: 14px;
      border: 1px solid transparent;
      padding: 0 15px;
      cursor: pointer;
      color: #{'rgba(var(--primary-color), 1)'};

      img {
        margin-right: 5px;
      }

      &.is-active {
        background: #fcdddd;
        border: 1px solid #d7414a;
        color: #df555b;
      }
    }
  }

  .g-btns {
    text-align: right;

    .btn {
      height: 56px;
      width: 100%;
      font-size: 18px;

      ::v-deep .anticon {
        font-size: 24px;
        top: 2px;
        position: relative;
      }
    }
  }
}

@media screen and (max-width: 800px) {
  .order-info {
    padding: 0;

    .g-group {
      .tag-state2 {
        transform: scale(0.7) rotate(45deg) perspective(400px);
        right: -30px;
      }
    }

    .g-btns {
      .btn {
        height: 50px;
      }
    }

    .order-main,
    .order-side {
      padding: 20px;
    }
  }
}
</style>
