<template>
  <div class="ticket-container">
    <div class="ticket-header">
      <a-button v-wave type="primary" @click="onAdd()">
        <svg-icon name="plus" />
        {{ $t('create_new_work_order') }}
      </a-button>
    </div>

    <a-table v-if="ticketData" :data-source="ticketData" :pagination="false" row-key="id" table-layout="fixed" :scroll="{ x: 970 }" class="ticket-table data-table use-shadow">
      <a-table-column key="index" data-index="index" title="#" width="60px" />
      <a-table-column key="subject" data-index="subject" :title="$t('subject')" width="200px" />
      <a-table-column key="levelLabel" data-index="levelLabel" :title="$t('work_order_level')" width="100px" />
      <a-table-column key="statusLabel" data-index="statusLabel" :title="$t('work_order_status')" width="100px">
        <div slot="customRender" slot-scope="text, record">
          <a-badge :status="record.status === States.HANDLING ? 'error' : 'processing'" />
          {{ text }}
        </div>
      </a-table-column>
      <a-table-column key="created_at" data-index="created_at" :title="$t('created_time')" width="170px">
        <div slot="customRender" slot-scope="text">
          {{ text | datetime }}
        </div>
      </a-table-column>
      <a-table-column key="updated_at" data-index="updated_at" :title="$t('last_reply')" width="170px">
        <div slot="customRender" slot-scope="text">
          {{ text | datetime }}
        </div>
      </a-table-column>
      <a-table-column :title="$t('operation')" align="center" width="170px">
        <template slot-scope="text, record">
          <span>
            <a-button type="link" @click="onView(record)">{{ $t('view') }}</a-button>
            <a-button :disabled="record.status === States.CLOSED" type="link" @click="onClose(record)">{{ $t('close') }}</a-button>
          </span>
        </template>
      </a-table-column>
    </a-table>

    <div v-else class="spin-loading">
      <a-spin size="large" />
    </div>

    <ticket-modal ref="refModal" @change="getTicketData" />
    <ticket-chat ref="refChat" />
  </div>
</template>

<script>
import TicketModal from './components/TicketModal'
import TicketChat from './components/TicketChat'
import { getTicketList, closeTicket } from './apis/ticket'
import { Levels, States } from './enums/ticket'

export default {
  name: 'Ticket',
  components: {
    TicketModal,
    TicketChat
  },
  data() {
    return {
      ticketData: null,
      States,
      Levels
    }
  },
  mounted() {
    this.getTicketData()
  },
  methods: {
    async getTicketData() {
      const res = await getTicketList()
      this.ticketData = (res.data ?? []).map((row, index) => {
        return {
          ...row,
          index: index + 1,
          levelLabel: Levels.getLabel(row.level),
          statusLabel: States.getLabel(row.status)
        }
      })
    },
    onAdd() {
      this.$refs.refModal.showModal()
    },
    onView(row) {
      this.$refs.refChat.showModal(row)
    },
    onClose(record) {
      this.$confirm({
        title: this.$t('note'),
        content: this.$t('sure_want_close_this_work_orde'),
        onOk: async () => {
          const res = await closeTicket(record.id)
          if (res.data === true) {
            this.$message.success(this.$t('work_order_closed'))
            this.getTicketData()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ticket-container {
  .ticket-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 16px;
  }
}

@at-root .is-darkmode {
  .ticket-container {
    .ticket-header {
      .ant-btn {
        color: var(--theme-text);
        background: var(--theme-panel-soft);
        border-color: var(--theme-border-strong);
      }
    }
  }
}
</style>
