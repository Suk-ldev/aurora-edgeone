<template>
  <a-modal v-model="visible" :title="$t('工单回复')" :width="800" :after-close="onClosed" :footer="false">
    <form class="ticket-chat" @submit.prevent="onSubmit">
      <div class="chat-tip">{{ $t('X个回复', { count: replyCount }) }}</div>
      <a-divider class="chat-line" />
      <div v-if="messages" class="chat-items">
        <template v-if="messages.length > 0">
          <div v-for="item in messages" :key="item.id" class="chat-item">
            <template v-if="item.is_me">
              <div class="right" style="text-align: right; margin-right: 20px">
                <span class="time">{{ item.updated_at | datetime }}</span>
                <span class="name">You</span>
                <p class="content">{{ item.message }}</p>
              </div>
              <a-avatar class="avatar">U</a-avatar>
            </template>
            <template v-else>
              <a-avatar class="avatar"><svg-icon name="user" /></a-avatar>
              <div class="right" style="text-align: left; margin-left: 20px">
                <span class="name">Administrator</span>
                <span class="time">{{ item.updated_at | datetime }}</span>
                <p class="content">{{ item.message }}</p>
              </div>
            </template>
          </div>
        </template>
      </div>
      <div v-else class="spin-loading">
        <a-spin size="large" />
      </div>
      <div class="chat-reply">
        <a-avatar class="avatar">U</a-avatar>
        <a-input v-model="replyContent" type="textarea" size="large" class="input" :max-length="256" :rows="4" :placeholder="$t('请描述你遇到的问题')" allow-clear />
      </div>
      <div class="chat-button">
        <button v-wave type="submit" class="n-button color-1">
          <svg-icon name="pencil-simple-line" />
          {{ $t('回复') }}
        </button>
      </div>
    </form>
  </a-modal>
</template>

<script>
import { getTicketInfo, replyTicket } from '../apis/ticket'

export default {
  name: 'Chat',
  data() {
    return {
      rowId: '',
      visible: false,
      messages: null,
      replyContent: '',
      replyCount: 0
    }
  },
  methods: {
    showModal(row) {
      this.visible = true
      this.rowId = row.id
      this.getMessages()
    },
    getMessages() {
      const getMessage = async () => {
        const res = await getTicketInfo(this.rowId)
        this.messages = res.data.message ?? []
        this.replyCount = this.messages.filter((row) => !row.is_me).length
      }
      getMessage()
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        getMessage()
      }, 10 * 1000)
    },
    async onSubmit() {
      if (!this.replyContent) {
        return this.$message.warning(this.$t('请输入内容'))
      }
      const res = await replyTicket({
        id: this.rowId,
        message: this.replyContent
      })
      if (res.data === true) {
        this.$message.success(this.$t('回复成功'))
        this.getMessages()
      }
    },
    onClosed() {
      this.messages = []
      this.replyContent = ''
      this.replyCount = 0
      clearInterval(this.timer)
    }
  }
}
</script>

<style lang="scss" scoped>
.ticket-chat {
  padding: 0 20px;

  .chat-line {
    margin: 0;
  }
  .chat-tip {
    padding: 0 0 20px;
  }
  .chat-items {
    margin-bottom: 30px;
  }
  .chat-item {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid var(--theme-border);
    padding: 20px 0;

    .name {
      color: var(--theme-heading);
      margin: 0 10px;
    }
    .time {
      font-size: 12px;
      color: var(--theme-faint);
    }
    .content {
      padding: 20px 10px 0;
      margin: 0;
    }
    .right {
      flex: 1;
    }
  }
  .chat-reply {
    display: flex;
    flex-direction: row;

    .avatar {
      margin-right: 20px;
    }

    .input {
      background-color: var(--theme-panel);
      flex: 1;
    }
  }
  .chat-button {
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
    .n-button {
      min-width: 100px;
    }
  }
  .avatar {
    width: 36px;
    height: 36px;
    background-color: #f2c4aa;
  }
}

@at-root .is-darkmode {
  .ticket-chat {
    color: var(--theme-text);

    .chat-item {
      border-bottom-color: var(--theme-border);

      .name {
        color: var(--theme-heading);
      }

      .time {
        color: var(--theme-faint);
      }

      .content {
        color: var(--theme-text);
      }
    }

    .chat-reply {
      .input {
        background-color: var(--theme-panel-soft);
      }
    }
  }
}
</style>
