<template>
  <div class="dashboard-container">
    <div v-if="latestNotice" class="notice-strip use-shadow">
      <div class="notice-title">
        <svg-icon name="megaphone" />
        {{ $t('公告') }}
      </div>
      <button type="button" class="notice-content" @click="onNoticeShow(latestNotice)">
        <span class="notice-name">{{ latestNotice.title }}</span>
        <span class="notice-date">{{ latestNotice.updated_at | date }}</span>
      </button>
      <a-button class="notice-action" @click="onNoticeShow(latestNotice)">
        {{ $t('查看详情') }}
      </a-button>
    </div>

    <div class="dashboard-workspace">
      <div class="dashboard-left">
        <div class="overview-box">
          <div v-if="isVIP" class="account-card use-shadow">
            <div class="account-head">
              <div class="account-avatar">{{ userInitial }}</div>
              <div class="account-title">
                <div class="email">{{ accountEmail }}</div>
                <div class="plan">{{ comboType === ComboEnum.UNBUY ? $t('未购买订阅') : $t('我的订阅') }}</div>
              </div>
              <a-button class="account-action" type="primary" @click="$router.push('/stage/profile')">
                <svg-icon name="user-circle" />
                {{ $t('个人中心') }}
              </a-button>
            </div>
            <a-row class="metric-row" :gutter="[16, 16]">
              <a-col :md="12" :xl="6">
                <div class="item" @click="onBuySubs">
                  <div class="icon">
                    <svg-icon name="calendar-check" />
                  </div>
                  <div class="right">
                    <template v-if="comboType === ComboEnum.PERIOD">
                      <div class="tit">{{ expiredDate | date }}</div>
                      <div class="exp">
                        <span v-if="expiredResidue > 0">{{ $t('到期时间') }}</span>
                        <span v-else style="color: #ff4200">{{ $t('已过期') }}</span>
                      </div>
                    </template>
                    <template v-else-if="comboType === ComboEnum.ONE_TIME">
                      <div class="tit">{{ $t('无') }}</div>
                      <div class="exp">
                        <span>{{ $t('到期时间') }}</span>
                      </div>
                    </template>
                    <template v-else-if="comboType === ComboEnum.UNBUY">
                      <div class="exp">
                        <span>{{ $t('未购买订阅') }}</span>
                      </div>
                    </template>
                  </div>
                  <a-icon class="arrow" type="right" />
                </div>
              </a-col>
              <a-col :md="12" :xl="6">
                <div class="item" @click="$router.push('/stage/invite')">
                  <div class="icon">
                    <svg-icon name="currency-jpy" />
                  </div>
                  <div class="right">
                    <div class="tit">{{ userInfo.balance | amount }}</div>
                    <div class="exp">{{ $t('帐户余额') }}</div>
                  </div>
                  <a-icon class="arrow" type="right" />
                </div>
              </a-col>
              <a-col :md="12" :xl="6">
                <div class="item" @click="$router.push('/stage/mysubs')">
                  <div class="icon">
                    <svg-icon name="chart-bar" />
                  </div>
                  <div class="right">
                    <template v-if="comboType === ComboEnum.PERIOD">
                      <div v-if="expiredResidue > 0" class="tit">{{ leftFlow | flow }}</div>
                      <div v-else class="tit">{{ $t('无') }}</div>
                    </template>
                    <template v-if="comboType === ComboEnum.ONE_TIME">
                      <div class="tit">{{ leftFlow | flow }}</div>
                    </template>
                    <template v-if="comboType === ComboEnum.UNBUY">
                      <div class="tit">{{ $t('无') }}</div>
                    </template>
                    <div class="exp">{{ $t('剩余流量') }}</div>
                  </div>
                  <a-icon class="arrow" type="right" />
                </div>
              </a-col>
              <a-col :md="12" :xl="6">
                <div class="item" @click="$router.push('/stage/ticket')">
                  <div class="icon">
                    <svg-icon name="alarm" />
                  </div>
                  <div class="right">
                    <div class="tit">{{ workOrders }} {{ $t('条') }}</div>
                    <div class="exp">{{ $t('待办工单') }}</div>
                  </div>
                  <a-icon class="arrow" type="right" />
                </div>
              </a-col>
            </a-row>
          </div>
          <div v-else class="spin-loading">
            <a-spin size="large" />
          </div>
        </div>

        <subscribe-info @change="onSubscribeChange" />

        <div class="panel-box">
          <div class="panel-header">
            <span class="tit">{{ $t('流量明细') }}</span>
          </div>
          <div class="panel-body flow-box use-shadow" style="padding: 0">
            <div v-if="chartData">
              <div v-if="chartData.length > 0" ref="refChart" class="chart-box"></div>
              <div v-else class="no-data">
                <a-empty :image="simpleImage" :description="$t('暂无数据')" />
              </div>
            </div>
            <div v-else class="spin-loading">
              <a-spin size="large" />
            </div>
          </div>
        </div>
      </div>

      <aside class="dashboard-right">
        <div class="panel-box node-panel">
          <div class="panel-header">
            <span class="tit">
              <svg-icon name="server" />
              {{ $t('节点状态') }}
            </span>
            <span class="status-legend">
              <i class="ok"></i>{{ $t('正常') }}
              <i class="bad"></i>{{ $t('故障') }}
            </span>
          </div>
          <a-table
            v-if="serverData"
            :data-source="serverData"
            :pagination="serverData.length > 12 ? { pageSize: 12, simple: true } : false"
            table-layout="fixed"
            row-key="id"
            size="middle"
            class="server-table data-table use-shadow"
          >
            <a-table-column key="name" data-index="name" :title="$t('名称')" width="190px" />
            <a-table-column key="rate" data-index="rate" :title="$t('倍率')" width="90px">
              <a-tag slot="customRender" slot-scope="text" color="blue">{{ text }} x</a-tag>
            </a-table-column>
            <a-table-column key="badge" data-index="badge" :title="$t('状态')" width="105px">
              <div slot="customRender" slot-scope="text" class="node-status">
                <span class="node-dot" :class="{ offline: text === 'error' }"></span>
              </div>
            </a-table-column>
          </a-table>
          <div v-else class="spin-loading">
            <a-spin size="large" />
          </div>
        </div>
      </aside>
    </div>
    <transition name="slide-fade">
      <a-alert v-show="showTip" type="warning" banner closable class="unpay-tip">
        <div slot="message" class="cont">
          {{ $t('检测到还有没支付的订单') }},
          <router-link to="/stage/order" class="link">{{ $t('立即支付') }}</router-link>
        </div>
      </a-alert>
    </transition>
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent } from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { getAccountInfo, getNoticeList } from './apis/dashboard'
import { getFlowList } from './apis/flow'
import { getServerNodes } from './apis/subscribe'
import { ComboEnum } from './enums/buysubs'
import SubscribeInfo from './components/SubscribeInfo'
import dayjs from 'dayjs'
import bytes from 'bytes'
import { mapState } from 'vuex'

echarts.use([TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, LineChart, LabelLayout, UniversalTransition, CanvasRenderer])

export default {
  name: 'Dashboard',
  components: {
    SubscribeInfo
  },
  data() {
    return {
      chartData: null,
      workOrders: 0,
      expiredDate: '',
      expiredResidue: null,
      comboType: null,
      leftFlow: '',
      planId: '',
      serverData: null,
      noticeData: [],
      simpleImage: '',
      showTip: false,
      ComboEnum
    }
  },
  computed: {
    ...mapState('auth', ['userInfo']),
    accountEmail() {
      return this.userInfo?.email || '-'
    },
    userInitial() {
      return this.accountEmail.substring(0, 1).toUpperCase()
    },
    isVIP() {
      return true
    },
    latestNotice() {
      return this.noticeData.find((row) => row.show !== false) || null
    }
  },
  created() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  mounted() {
    this.initFlowChart()
    this.initMySubscribe()
    this.getServerData()
    this.getNoticeData()
  },
  methods: {
    async initMySubscribe() {
      const res = await getAccountInfo()
      this.workOrders = res.data[1] ?? 0 // 工单数量

      const hasUnpay = Boolean(res.data[0]) // 是否有未支付的订单 1有0无
      if (hasUnpay) {
        this.showTip = true
      }
    },
    async getNoticeData() {
      try {
        const res = await getNoticeList()
        this.noticeData = res.data ?? []
      } catch {
        this.noticeData = []
      }
    },
    onNoticeShow(row) {
      const children = [
        this.$createElement('div', {
          domProps: {
            innerHTML: row.content
          }
        })
      ]

      if (row.img_url) {
        children.push(
          this.$createElement('img', {
            attrs: {
              src: row.img_url,
              width: '100%'
            },
            style: {
              marginTop: '10px'
            }
          })
        )
      }

      this.$info({
        title: row.title,
        okText: this.$t('我知道了'),
        closable: true,
        width: 580,
        mask: true,
        icon: 'bell',
        content: this.$createElement('div', { class: 'notice-rich-content' }, children)
      })
    },
    onSubscribeChange({ expiredDate, expiredResidue, leftFlow, planId, comboType }) {
      this.expiredDate = expiredDate
      this.expiredResidue = expiredResidue
      this.comboType = comboType
      this.leftFlow = leftFlow
      this.planId = planId
    },
    onBuySubs() {
      if (this.planId) {
        this.$router.push('/stage/buysubs/order?id=' + this.planId)
      } else {
        this.$router.push('/stage/buysubs')
      }
    },
    async getServerData() {
      const res = await getServerNodes()
      this.serverData = (res.data ?? []).map((row) => {
        return {
          ...row,
          id: this.$uuid(),
          badge: this.getServerBadge(row)
        }
      })
    },
    getServerBadge(row) {
      return this.isServerOnline(row) ? 'processing' : 'error'
    },
    isServerOnline(row) {
      if (row.is_online !== null && row.is_online !== undefined) {
        return Boolean(row.is_online)
      }

      if (row.last_check_at) {
        return Math.abs(dayjs.unix(row.last_check_at).diff(dayjs(), 'second', true)) <= 5 * 60
      }

      return true
    },
    async initFlowChart() {
      const { data = [] } = await getFlowList()
      this.chartData = data
      if (data.length === 0) return
      await this.$nextTick()
      const el = this.$refs.refChart
      const chart = echarts.init(el)
      chart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            if (params.length === 0) return ''
            return (
              params[0].name +
              '<br>' +
              params
                .map((item) => {
                  return item.marker + item.seriesName + ' ' + bytes(item.value)
                })
                .join('<br>')
            )
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: 100,
          right: 60,
          top: 40,
          bottom: 40
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.map((row) => dayjs.unix(row.record_at).format('YYYY-MM-DD'))
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value) => {
              return bytes(value)
            }
          }
        },
        series: [
          {
            name: this.$t('上行'),
            data: data.map((row) => row.u),
            type: 'line',
            smooth: true,
            showSymbol: false,
            stack: 'flow',
            areaStyle: {}
          },
          {
            name: this.$t('下行'),
            data: data.map((row) => row.d),
            type: 'line',
            smooth: true,
            showSymbol: false,
            stack: 'flow',
            areaStyle: {}
          }
        ]
      })

      window.addEventListener(
        'resize',
        () => {
          chart.resize()
        },
        false
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  .notice-strip {
    min-height: 58px;
    margin-bottom: 24px;
    padding: 12px 20px;
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr) max-content;
    align-items: center;
    gap: 18px;
    border-radius: 12px;

    .notice-title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--theme-heading);
      font-size: 14px;
      font-weight: 800;

      .svg-icon {
        color: var(--theme-heading);
        font-size: 18px;
      }
    }

    .notice-content {
      min-width: 0;
      padding: 0;
      border: 0;
      color: var(--theme-muted);
      background: transparent;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
    }

    .notice-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .notice-date {
      flex: 0 0 auto;
      color: var(--theme-faint);
      font-size: 12px;
    }

    .notice-action {
      min-width: 80px;
      height: 32px;
      border-radius: 10px;
    }
  }

  .dashboard-workspace {
    display: grid;
    grid-template-columns: minmax(0, 658px) minmax(420px, 470px);
    gap: 24px;
    align-items: start;
  }

  .dashboard-left,
  .dashboard-right {
    min-width: 0;
  }

  .dashboard-right {
    position: sticky;
    top: 88px;
  }

  .account-card {
    padding: 24px;
  }

  @at-root .is-darkmode {
    .dashboard-container {
      .account-head {
        border-bottom-color: var(--theme-border);
      }

      .account-avatar {
        color: var(--theme-accent);
        background: var(--theme-accent-soft);
        border-color: rgba(142, 199, 255, 0.18);
      }

      .account-title {
        .email {
          color: var(--theme-heading);
        }

        .plan {
          color: var(--theme-muted);
        }
      }

      .account-card {
        .icon {
          color: var(--theme-accent);
          background-color: var(--theme-accent-soft);
          border-color: rgba(142, 199, 255, 0.18);
        }

        .tit {
          color: var(--theme-heading);
        }

        .exp {
          color: var(--theme-muted);
        }
      }

      .node-panel {
        .status-legend {
          color: var(--theme-muted);
        }

        .server-table {
          ::v-deep {
            .ant-tag-blue {
              color: var(--theme-accent);
              background: rgba(56, 189, 248, 0.12);
              border-color: rgba(56, 189, 248, 0.28);
            }
          }
        }
      }
    }
  }

  .account-head {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 22px;
    margin-bottom: 18px;
    border-bottom: 1px solid var(--theme-border);
  }

  .account-avatar {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--theme-accent);
    font-size: 24px;
    font-weight: 800;
    background: var(--theme-accent-soft);
    border: 1px solid var(--theme-border);
  }

  .account-title {
    min-width: 0;
    flex: 1;

    .email {
      color: var(--theme-heading);
      font-size: 20px;
      font-weight: 800;
      line-height: 1.35;
      word-break: break-all;
    }

    .plan {
      margin-top: 4px;
      color: var(--theme-muted);
      font-size: 14px;
      font-weight: 600;
    }
  }

  .account-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    border-radius: 999px;

    .svg-icon {
      font-size: 17px;
    }
  }

  .metric-row {
    margin-top: 0;
  }

  .account-card {
    .item {
      height: 70px;
      padding: 8px 6px;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;

      &:hover {
        background: transparent;
        box-shadow: none;
        transform: none;
      }
    }

    .icon {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      border-radius: 10px;

      .svg-icon {
        font-size: 18px;
      }
    }

    .right {
      min-width: 0;
      flex: 1;
    }

    .tit {
      max-width: 100%;
      overflow: hidden;
      color: var(--theme-heading);
      font-size: 18px;
      line-height: 1.25;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .exp {
      margin-top: 4px;
      font-size: 12px;
    }

    .arrow {
      display: none;
    }
  }

  ::v-deep {
    .dashboard-left {
      .subscribe-info {
        display: block;

        .col-gap {
          width: 100%;
          height: 0;
        }

        .col-2 {
          width: 100% !important;
        }

        .import-btns {
          min-height: auto;
          padding-top: 20px;
        }
      }
    }
  }

  .flow-box {
    overflow: hidden;

    .chart-box {
      height: 280px;
      width: 100%;
    }
    .no-data {
      height: 240px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      color: var(--theme-faint);
    }
  }

  .node-panel {
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      .tit {
        display: inline-flex;
        align-items: center;
        gap: 8px;

        .svg-icon {
          color: var(--theme-accent);
          font-size: 20px;
        }
      }
    }

    .status-legend {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--theme-muted);
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;

      i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }

      .ok {
        background: #22c55e;
      }

      .bad {
        background: #ff3b5c;
      }

    }

    .server-table {
      overflow: hidden;

      ::v-deep {
        .ant-table {
          border-radius: 12px;
        }

        .ant-table-tbody > tr > td,
        .ant-table-thead > tr > th {
          padding: 9px 12px;
          font-size: 12px;
        }

        .ant-tag-blue {
          color: var(--theme-accent);
          background: var(--theme-accent-soft);
          border-color: var(--theme-border);
          border-radius: 999px;
          font-weight: 700;
        }
      }
    }

    .node-dot {
      width: 9px;
      height: 9px;
      display: inline-block;
      flex: 0 0 auto;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);

      &.offline {
        background: #ff3b5c;
        box-shadow: 0 0 0 4px rgba(255, 59, 92, 0.12);
      }

    }

    .node-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
  }
  .unpay-tip {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 25px;
    width: 440px;
    max-width: 90%;
    background-color: var(--theme-panel);
    box-shadow: var(--theme-shadow);
    z-index: 100;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 40px;
    border: 0;
    border-radius: 6px;

    .cont {
      color: var(--theme-warning);
    }

    .link {
      color: var(--theme-heading);
      font-weight: bold;
    }

    ::v-deep {
      .ant-alert-icon {
        color: var(--theme-warning);
        top: 16px;
        font-size: 18px;
      }
      .ant-alert-close-icon {
        top: 14px;
        right: 10px;
        font-size: 14px;
      }
    }
  }
}

@media screen and (max-width: 980px) {
  .dashboard-container {
    .dashboard-workspace {
      display: block;
    }

    .dashboard-right {
      position: static;
    }
  }
}

@media screen and (max-width: 700px) {
  .dashboard-container {
    .notice-strip {
      grid-template-columns: minmax(0, 1fr) max-content;
      gap: 10px;
      padding: 12px 14px;

      .notice-title {
        grid-column: 1 / -1;
      }

      .notice-content {
        gap: 8px;
      }

      .notice-action {
        padding: 0 12px;
      }
    }

    .account-card {
      padding: 16px;
    }

    .account-head {
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 12px;
    }

    .account-avatar {
      width: 48px;
      height: 48px;
      font-size: 20px;
    }

    .account-title {
      flex: 1 1 calc(100% - 60px);

      .email {
        font-size: 17px;
      }
    }

    .account-action {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>

<style lang="scss">
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}
</style>
