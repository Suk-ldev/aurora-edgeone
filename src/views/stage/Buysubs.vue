<template>
  <div class="buysubs-container">
    <div class="buy-header">
      <h3 class="tit">{{ $t('选择最适合您的计划') }}</h3>
    </div>
    <div class="buy-tabs">
      <ul class="header">
        <li v-for="item in Filtered.toArray()" :key="item.value" :class="{ 'is-active': tab === item.value }" @click="tab = item.value">
          {{ item.label }}
        </li>
      </ul>
    </div>
    <div class="buy-plans">
      <a-row v-if="filterData" :gutter="30" type="flex" class="buy-row">
        <template v-if="filterData.length > 0">
          <a-col v-for="(plan, index) in filterData" :key="index" :sm="24" :md="12" :xl="8">
            <div :set="(price = getPrice(plan))" class="plan-card use-shadow">
              <div v-if="price.tagTitle" v-html="price.tagTitle"></div>
              <div class="t1">{{ plan.name }}</div>
              <div class="t2">
                {{ price.value | amount }}
                <small>/{{ price.label }}</small>
              </div>
              <button v-wave type="button" class="t3" @click="onBuyPlan(plan)">
                <i class="cart" />
                {{ $t('立即购买') }}
              </button>
              <markdown class="plan-cont plan-markdown" :value="getContent(plan)" />
            </div>
          </a-col>
        </template>
        <div v-else class="spin-loading" style="margin-top: 100px">
          <a-empty :description="$t('暂无数据')" />
        </div>
      </a-row>
      <div v-else class="spin-loading">
        <a-spin size="large" />
      </div>
    </div>
  </div>
</template>

<script>
import { getPlanList } from './apis/subscribe'
import { getShowPrice, getShowContent } from './utils/plan'
import { Filtered } from './enums/buysubs'
import Markdown from './components/Markdown'
import './styles/plan.scss'

export default {
  name: 'Buysubs',
  components: {
    Markdown
  },
  data() {
    return {
      planData: null,
      tab: Filtered.ALL,
      Filtered
    }
  },
  computed: {
    filterData() {
      if (this.tab === Filtered.PERIOD) {
        return this.planData.filter(
          (item) =>
            item.month_price !== null ||
            item.quarter_price !== null ||
            item.half_year_price !== null ||
            item.year_price !== null ||
            item.two_year_price !== null ||
            item.three_year_price !== null
        )
      } else if (this.tab === Filtered.ONE_TIME) {
        return this.planData.filter((item) => item.onetime_price !== null)
      }
      return this.planData
    }
  },
  mounted() {
    this.getPlanData()
  },
  methods: {
    async getPlanData() {
      const res = await getPlanList()
      this.planData = res.data ?? []
    },
    getPrice(plan) {
      return getShowPrice(plan)
    },
    getContent(plan) {
      return getShowContent(plan)
    },
    onBuyPlan(plan) {
      if (plan.capacity_limit === 0) {
        this.$message.warning(this.$t('该套餐已售罄'))
      } else {
        this.$router.push({
          path: '/stage/buysubs/order',
          query: {
            id: plan.id
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.buysubs-container {
  .buy-header {
    margin-bottom: 20px;
    .tit {
      font-size: 25px;
      color: var(--theme-heading);
    }
  }

  .buy-tabs {
    overflow: hidden;
    margin-bottom: 25px;
    .header {
      border: 1px solid #{'rgba(var(--primary-color), 1)'};
      border-radius: 38px;
      margin: 0;
      padding: 4px;
      overflow: hidden;
      list-style: none;
      float: left;

      li {
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        padding: 0 20px;
        color: #{'rgba(var(--primary-color), 1)'};
        font-size: 17px;
        float: left;
        border-radius: 32px;

        &.is-active {
          background-color: #{'rgba(var(--primary-color), 1)'};
          color: #fff;
        }
      }
    }
  }
}

@at-root .is-darkmode {
  .buysubs-container {
    .buy-header {
      .tit {
        color: var(--theme-heading);
      }
    }

    .buy-tabs {
      .header {
        background: var(--theme-panel-soft);
        border-color: rgba(142, 199, 255, 0.34);

        li {
          color: var(--theme-accent);

          &.is-active {
            color: #06101f;
            background-color: var(--theme-accent);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 700px) {
  .buy-row {
    display: block;
  }
}
</style>

<style lang="scss">
.plan-cont {
  .t0 {
    display: none;
  }
}
</style>
