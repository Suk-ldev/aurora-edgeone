<template>
  <div class="order-container">
    <div v-if="orderData">
      <div v-if="orderData.length > 0">
        <a-table :data-source="orderData" :pagination="false" row-key="trade_no" table-layout="fixed" :scroll="{ x: 970 }" class="order-table data-table use-shadow">
          <a-table-column key="trade_no" data-index="trade_no" :title="'#' + $t('order_number')" width="250px">
            <span slot="customRender" slot-scope="text, record" style="color: #{'rgba(var(--primary-color), 1)'}; cursor: pointer" @click="onView(record)">
              {{ text }}
            </span>
          </a-table-column>
          <a-table-column key="periodLabel" data-index="periodLabel" :title="$t('cycle')" width="120px">
            <a-tag slot="customRender" slot-scope="text" color="pink">{{ text }}</a-tag>
          </a-table-column>
          <a-table-column key="amountValue" data-index="amountValue" :title="$t('order_amount') + '(' + unit + ')'" width="130px">
            <div slot="customRender" slot-scope="text">
              {{ text | amount }}
            </div>
          </a-table-column>
          <a-table-column key="statusLabel" data-index="statusLabel" :title="$t('order_status')" width="100px">
            <div slot="customRender" slot-scope="text, record">
              <a-badge :status="record.statusBadge" />
              {{ text }}
            </div>
          </a-table-column>
          <a-table-column key="created_at" data-index="created_at" :title="$t('created_time')" width="170px">
            <div slot="customRender" slot-scope="text">
              {{ text | datetime }}
            </div>
          </a-table-column>
          <a-table-column :title="$t('operation')" align="center" width="200px">
            <template slot-scope="record">
              <span>
                <a-button type="link" @click="onView(record)">{{ $t('view_details') }}</a-button>
                <a-button :disabled="record.status !== States.WAIT_PAY" type="link" @click="onCancel(record)">{{ $t('cancel') }}</a-button>
              </span>
            </template>
          </a-table-column>
        </a-table>
      </div>

      <div v-else class="empty-tip">
        <a-empty description="" :image-style="{ height: '200px' }" />
        <div class="tit">
          {{ $t('have_not_purchased_service_yet') }}
          <a href="javascript:void(0)" @click="$router.push('/console/catalog')">{{ $t('buy_now') }}</a>
        </div>
      </div>
    </div>

    <div v-else class="spin-loading">
      <a-spin size="large" />
    </div>
  </div>
</template>

<script>
import { getOrderList, cancelOrder } from './apis/order'
import { planTypes } from './utils/plan'
import { States } from './enums/order'
import { mapState } from 'vuex'

export default {
  name: 'Order',
  data() {
    return {
      orderData: null,
      States
    }
  },
  computed: {
    ...mapState('auth', ['userConfig']),
    unit() {
      return this.userConfig?.currency_symbol
    }
  },
  mounted() {
    this.getOrderData()
  },
  methods: {
    async getOrderData() {
      const res = await getOrderList()
      this.orderData = (res.data ?? []).map((row) => {
        const getBadge = (status) => {
          if (status === States.WAIT_PAY) return 'warning'
          if (status === States.CANCEL) return 'error'
          if (status === States.OPENING) return 'processing'
          if (status === States.END) return 'success'
        }
        return {
          ...row,
          periodLabel: planTypes.find((item) => item.key === row.period)?.label2,
          amountValue: row.total_amount,
          statusLabel: States.getLabel(row.status),
          statusBadge: getBadge(row.status)
        }
      })
    },
    onView(record) {
      this.$router.push('/console/orders/info?id=' + record.trade_no)
    },
    async onCancel(record) {
      this.$confirm({
        title: this.$t('note'),
        content: this.$t('sure_want_cancel_this_order'),
        onOk: async () => {
          const res = await cancelOrder(record.trade_no)
          if (res.data === true) {
            this.$message.success(this.$t('order_canceled'))
            this.getOrderData()
          }
        }
      })
    }
  }
}
</script>
