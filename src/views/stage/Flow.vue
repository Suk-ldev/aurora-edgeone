<template>
  <div class="flow-container">
    <div class="flow-alert">{{ $t('流量明细仅保留近一个月数据以供查询。') }}</div>
    <a-table v-if="flowData" :data-source="flowData" :pagination="false" row-key="id" table-layout="fixed" :scroll="{ x: 520 }" class="flow-table data-table use-shadow">
      <a-table-column key="record_at" data-index="record_at" :title="$t('记录时间')" width="120px">
        <div slot="customRender" slot-scope="text">
          {{ text | date }}
        </div>
      </a-table-column>
      <a-table-column key="u" data-index="u" :title="$t('实际上行')" width="100px">
        <div slot="customRender" slot-scope="text">
          {{ text | flow }}
        </div>
      </a-table-column>
      <a-table-column key="d" data-index="d" :title="$t('实际下行')" width="100px">
        <div slot="customRender" slot-scope="text">
          {{ text | flow }}
        </div>
      </a-table-column>
      <a-table-column key="server_rate" data-index="server_rate" :title="$t('扣费倍率')" width="100px">
        <a-tag slot="customRender" slot-scope="text" color="pink">{{ text }} x</a-tag>
      </a-table-column>
      <a-table-column key="summary" data-index="summary" width="100px">
        <span slot="title">
          {{ $t('合计') }}
          <a-tooltip :title="$t('公式：(实际上行 + 实际下行) x 扣费倍率 = 扣除流量')" placement="right">
            <a-icon type="question-circle" />
          </a-tooltip>
        </span>
        <div slot="customRender" slot-scope="text">
          {{ text | flow }}
        </div>
      </a-table-column>
    </a-table>

    <div v-else class="spin-loading">
      <a-spin size="large" />
    </div>
  </div>
</template>

<script>
import { getFlowList } from './apis/flow'

export default {
  name: 'Flow',
  data() {
    return {
      flowData: null
    }
  },
  mounted() {
    this.getFlowData()
  },
  methods: {
    async getFlowData() {
      const res = await getFlowList()
      this.flowData = (res.data ?? []).map((row) => {
        return {
          ...row,
          id: this.$uuid(),
          u: row.u,
          d: row.d,
          summary: (row.u + row.d) * row.server_rate
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-container {
  .flow-alert {
    color: #f47272;
    font-size: 18px;
    position: relative;

    &:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      margin: -2px 5px 0 0;
      width: 4px;
      height: 18px;
      border-radius: 4px;
      background-color: #f47272;
    }
  }
}
</style>
