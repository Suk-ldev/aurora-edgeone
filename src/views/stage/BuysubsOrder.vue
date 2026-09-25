<template>
  <div class="buysubs-container">
    <div class="order-main">
      <a-row v-if="price && price.types" :gutter="[30, 30]">
        <a-col :md="24" :lg="14">
          <div class="plan-card use-shadow" style="margin-bottom: 0">
            <div v-if="price.tagTitle" v-html="price.tagTitle"></div>
            <div class="t1">{{ plan.name }}</div>
            <div class="t2" style="text-align: left">
              {{ price.value | amount }}
              <small>/{{ price.label }}</small>
            </div>
            <markdown class="plan-cont plan-markdown" :value="content" />
          </div>
        </a-col>
        <a-col :md="24" :lg="10">
          <div class="order-box use-shadow" style="margin-bottom: 30px">
            <div class="tit">{{ $t('付款周期') }}</div>
            <div v-if="defaultValue">
              <a-radio-group :default-value="defaultValue" button-style="solid" @change="onPlanChange">
                <a-radio-button v-for="item in price.types" :key="item.key" :value="item.key">
                  <div class="radio-flex">
                    <span>{{ item.label2 }}</span>
                    <span>{{ plan[item.key] | amount }}</span>
                  </div>
                </a-radio-button>
                <a-radio-button v-show="showResetPack" value="reset_price">
                  <a-tooltip :title="$t('重置流量包只会重置流量，不会延长到期时间，也不会改变重置日期。')" placement="left">
                    <div class="radio-flex">
                      <span>{{ $t('重置流量包') }}</span>
                      <span>{{ plan.reset_price | amount }}</span>
                    </div>
                  </a-tooltip>
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>

          <div v-if="select" class="order-box use-shadow order-make">
            <div class="tit">{{ $t('订单详情') }}</div>
            <div class="blocks">
              <div class="block">
                <span class="h2">
                  <svg-icon name="wallet" />
                  {{ $t('订单总额') }}
                </span>
                <div class="h4">
                  <span class="bo">{{ plan.name }} {{ select.label2 }}</span>
                  <span class="f20 bo" style="margin-left: 100px">
                    {{ select.cost | amount }}
                  </span>
                </div>
              </div>
              <div class="block">
                <span class="h2">
                  <svg-icon name="cell-signal-full" />
                  {{ $t('套餐流量') }}
                </span>
                <div class="h4">
                  <span class="f20 bo">{{ select.flow | flow }}{{ select.key === 'onetime_price' ? '' : '/' + $t('每月') }}</span>
                </div>
              </div>
              <div class="block">
                <span class="h2">
                  <svg-icon name="receipt-x" />
                  {{ $t('抵扣金额') }}
                </span>
                <div class="h4">
                  <a-input v-model="couponCode" class="input" :placeholder="$t('有优惠劵？')" />
                  <button v-wave class="n-button color-1" type="button" style="min-width: 70px" @click="onVerifyCoupon">
                    {{ $t('验证') }}
                  </button>
                </div>
              </div>
              <div class="block">
                <span class="h2">
                  <svg-icon name="receipt" />
                  {{ $t('折扣金额') }}
                </span>
                <div class="h4">
                  <span class="gra">-{{ couponAmount | amount }}</span>
                </div>
              </div>
              <div class="block">
                <div class="h4">
                  <span class="bo">{{ $t('支付总计') }}</span>
                  <span class="f20 bo">{{ totalAmount | amount }}</span>
                </div>
              </div>
            </div>
            <div class="btns">
              <a-button icon="shopping-cart" :loading="loading" class="btn" type="primary" @click="onMakeOrder">
                {{ $t('立即购买') }}
              </a-button>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getPlanInfo, makePlanOrder, verifyCoupon, getSubscribes } from './apis/subscribe'
import { getShowPrice, getShowContent, planTypes } from './utils/plan'
import { CouponEnum, ComboEnum } from './enums/buysubs'
import bytes from 'bytes'
import dayjs from 'dayjs'
import Markdown from './components/Markdown'
import './styles/plan.scss'

export default {
  name: 'BuysubsOrder',
  components: {
    Markdown
  },
  data() {
    return {
      subscribe: null,
      plan: null,
      couponCode: '',
      couponValue: 0,
      defaultValue: '',
      couponType: CouponEnum.NUMBER,
      select: null,
      loading: false
    }
  },
  computed: {
    price() {
      if (!this.plan) return {}
      return getShowPrice(this.plan)
    },
    content() {
      if (!this.plan) return ''
      return getShowContent(this.plan)
    },
    totalAmount() {
      // J4j2KSIb  14wL6neY
      if (!this.select) return 0
      const calcRes =
        this.couponType === CouponEnum.NUMBER ? this.select.cost - this.couponValue : this.select.cost * (1 - this.couponValue / 100)
      return Math.max(calcRes, 0)
    },
    couponAmount() {
      return this.couponType === CouponEnum.NUMBER ? this.couponValue : this.select.cost * (this.couponValue / 100)
    },
    usedFlow() {
      return this.subscribe?.d + this.subscribe?.u
    },
    allFlow() {
      return this.subscribe?.transfer_enable ?? 0
    },
    leftFlow() {
      const left = this.allFlow - this.usedFlow
      return left > 0 ? left : 0
    },
    comboType() {
      if (!this.subscribe) return null

      // plan或者plan_id为null，未购买
      // expired_at为null, 按流量买
      // expired_at不为null，按周期买

      if (this.subscribe.plan === null) {
        return ComboEnum.UNBUY
      } else if (this.subscribe.expired_at === null) {
        return ComboEnum.ONE_TIME
      } else {
        return ComboEnum.PERIOD
      }
    },
    expiredResidue() {
      if (this.expiredDate > 0) {
        return dayjs.unix(this.expiredDate).diff(dayjs(), 'second')
      } else {
        return null
      }
    },
    expiredDate() {
      return this.subscribe?.expired_at
    },
    percent() {
      const percent = parseFloat(((this.usedFlow / this.allFlow) * 100).toFixed(2))
      console.log('percent', percent)
      return percent
    },
    showResetPack() {
      // 如果是周期性订阅，未过期
      if (this.comboType === ComboEnum.UNBUY) return false
      if (this.comboType === ComboEnum.PERIOD) {
        if (this.expiredResidue <= 0) {
          return false
        }
      }
      return this.percent >= 80 && this.plan.reset_price > 0 && this.subscribe.plan_id == this.$route.query.id
    }
  },
  mounted() {
    this.getPlanData()
    this.getSubscribeInfo()
  },
  methods: {
    async getSubscribeInfo() {
      const res = await getSubscribes()
      this.subscribe = res.data
    },
    async getPlanData() {
      const res = await getPlanInfo(this.$route.query.id)
      this.plan = res.data ?? null

      this.$nextTick(() => {
        let value
        if (this.$route.query.type === 'reset') {
          value = 'reset_price'
        } else {
          value = this.price.types[0].key
        }
        this.defaultValue = value
        this.$nextTick(() => {
          this.onPlanChange({ target: { value } })
        })
      })
    },
    onPlanChange({ target }) {
      const key = target.value
      console.log('key', key)
      const item = planTypes.find((item) => item.key === key)
      if (key === 'reset_price') {
        this.select = {
          key,
          label: this.$t('重置流量包'),
          label2: this.$t('重置流量包'),
          cost: this.plan[key],
          flow: bytes.parse(this.plan.transfer_enable + 'GB') // 统一转为字节
        }
      } else {
        this.select = {
          key,
          label: item?.label,
          label2: item?.label2,
          cost: this.plan[key],
          flow: bytes.parse(this.plan.transfer_enable + 'GB') // 统一转为字节
        }
      }
    },
    onMakeOrder() {
      const make = async () => {
        this.loading = true
        try {
          const res = await makePlanOrder({
            period: this.select.key,
            plan_id: this.$route.query.id,
            coupon_code: this.couponCode
          })
          if (res.data) {
            this.$message.success(this.$t('下单成功'))
            this.$router.replace('/stage/order/info?id=' + res.data)
          }
        } catch {}
        this.loading = false
      }

      const isContinuePlan = this.subscribe.plan_id == this.$route.query.id

      if (this.comboType === ComboEnum.UNBUY) {
        // 如果未订阅，直接下单
        make()
      } else if (this.comboType === ComboEnum.PERIOD) {
        // 如果用户是周期性订阅，并且订阅还未过期，则提示
        if (this.expiredResidue > 0 && !isContinuePlan) {
          this.$confirm({
            title: this.$t('注意'),
            content: this.$t('请注意，变更订阅会导致当前订阅被新订阅覆盖。'),
            icon: 'exclamation-circle',
            onOk: () => {
              make()
            }
          })
        } else {
          make()
        }
      } else if (this.comboType === ComboEnum.ONE_TIME) {
        // 如果用户是一次性订阅，如果流量还未用尽。则提示
        if (this.leftFlow > 0 && !isContinuePlan) {
          this.$confirm({
            title: this.$t('注意'),
            content: this.$t('请注意，变更订阅会导致当前订阅被新订阅覆盖。'),
            icon: 'exclamation-circle',
            onOk: () => {
              make()
            }
          })
        } else {
          make()
        }
      }
    },
    async onVerifyCoupon() {
      try {
        if (!this.couponCode) {
          return this.$notification.error({
            message: this.$t('提示'),
            description: this.$t('请输入优惠券')
          })
        }

        const { id } = this.$route.query
        // console.log('id', typeof id)
        const res = await verifyCoupon({
          code: this.couponCode,
          plan_id: id
        })
        // 优惠券类型
        this.couponType = res.data.type ?? CouponEnum.NUMBER
        // 为Null表示优惠券不限制套餐使用，如果有值则必须包含当前套餐ID
        if (res.data.value && (res.data.limit_plan_ids === null || res.data.limit_plan_ids.includes(String(id)))) {
          this.couponValue = res.data.value
          console.log('couponValue', this.couponValue)
        } else {
          this.couponValue = 0
          this.$notification.error({
            message: this.$t('提示'),
            description: this.$t('无效的优惠券')
          })
        }
      } catch {}
    }
  }
}
</script>

<style lang="scss" scoped>
.buysubs-container {
  .order-box {
    padding: 20px;
    .tit {
      font-size: 20px;
      color: var(--theme-heading);
      margin-bottom: 15px;
      font-weight: bold;
    }

    .radio-flex {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    ::v-deep {
      .ant-radio-group {
        display: block;
      }
      .ant-radio-button-wrapper {
        margin-bottom: 10px;
        display: block;
        border-radius: 4px;
        border: 1.02px solid #d9d9d9;

        &.ant-radio-button-wrapper-checked {
          background: #{'rgba(var(--primary-color), 0.35)'};
          border: 1px solid #{'rgba(var(--primary-color), 1)'};
          color: #{'rgba(var(--primary-color), 1)'};
        }

        &:before {
          display: none;
        }
      }
    }
  }

  .order-make {
    padding: 20px 30px;
    .block {
      font-size: 16px;
      margin-bottom: 20px;
      .f20 {
        font-size: 20px;
      }
      .bo {
        font-weight: bold;
      }
      .gra {
        color: var(--theme-muted);
      }
      .h2 {
        color: var(--theme-muted);
        margin-bottom: 5px;
        display: block;

        .svg-icon {
          font-size: 22px;
          margin-right: 5px;
        }
      }
      .h4 {
        padding-left: 30px;
        display: flex;
        justify-content: space-between;
      }
      .input {
        flex: 1;
        margin-right: 15px;
      }
    }

    .btns {
      text-align: right;
      margin: 40px 0 20px;

      .btn {
        height: 38px;

        ::v-deep .anticon {
          font-size: 18px;
          top: 2px;
          position: relative;
        }
      }
    }
  }
}

@at-root .is-darkmode {
  .buysubs-container {
    .order-box,
    .order-make {
      color: var(--theme-text);

      .tit,
      .bo,
      .f20 {
        color: var(--theme-heading);
      }

      .gra,
      .h2 {
        color: var(--theme-muted);
      }
    }

    .order-box {
      ::v-deep {
        .ant-radio-button-wrapper {
          color: var(--theme-text);
          background: var(--theme-panel-soft);
          border-color: var(--theme-border);

          &.ant-radio-button-wrapper-checked {
            color: var(--theme-accent);
            background: var(--theme-accent-soft);
            border-color: rgba(142, 199, 255, 0.42);
          }
        }
      }
    }
  }
}
</style>
