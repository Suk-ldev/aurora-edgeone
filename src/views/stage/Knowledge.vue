<template>
  <div class="knowledge-container">
    <div v-if="catalogs">
      <a-tabs v-if="catalogs.length > 0" class="doc-tabs" default-active-key="0" @change="onTabChange">
        <a-tab-pane v-for="(item, index) in catalogs" :key="index">
          <span slot="tab" :set="(icon = getIcon(item.tabTitle))">
            <svg-icon :name="icon.name" style="font-size: 22px" />
            {{ item.tabTitle }}
          </span>
        </a-tab-pane>
      </a-tabs>

      <div v-else class="empty-tip">
        <a-empty description="" :image-style="{ height: '200px' }" />
        <div class="tit">
          {{ $t('暂无数据') }}
        </div>
      </div>

      <div v-if="catalog" class="doc-main">
        <a-row :gutter="[20, 20]">
          <a-col :md="24" :lg="7">
            <div class="doc-dir use-shadow">
              <a-timeline>
                <a-timeline-item
                  v-for="doc in catalog.tabDocs"
                  :key="doc.id"
                  :class="{ 'is-active': doc.id === docId }"
                  @click="getDocInfo(doc.id)"
                >
                  <svg-icon name="file-doc" style="font-size: 21px" />
                  {{ doc.title }}
                </a-timeline-item>
              </a-timeline>
            </div>
          </a-col>
          <a-col :md="24" :lg="17">
            <div v-if="docContent" class="doc-content use-shadow">
              <div>
                <h2 class="title">{{ docTitle }}</h2>
                <markdown :key="signKey" class="html" :value="docContent"></markdown>
              </div>
            </div>
            <div v-else class="spin-loading">
              <a-spin size="large" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <div v-else class="spin-loading">
      <a-spin size="large" />
    </div>
  </div>
</template>

<script>
import { getKnowledgeCatalog, getKnowledgeInfo } from './apis/knowledge'
import Markdown from './components/Markdown'
import { getLang } from '@/i18n'

export default {
  name: 'Knowledge',
  components: {
    Markdown
  },
  data() {
    return {
      catalogs: null,
      catalog: null,
      docId: '',
      docContent: '',
      docTitle: ''
    }
  },
  computed: {
    signKey() {
      return btoa(encodeURIComponent(this.docContent)).substring(0, 10)
    }
  },
  mounted() {
    this.getCatalogs()
  },
  methods: {
    getCatalogs() {
      setTimeout(async () => {
        const { data = {} } = await getKnowledgeCatalog(getLang('-'))

        this.catalogs = Object.keys(data).map((key) => {
          return {
            tabTitle: key,
            tabDocs: data[key]
          }
        })

        if (this.catalogs.length > 0) {
          this.catalog = this.catalogs[0]

          if (this.catalog.tabDocs.length > 0) {
            this.getDocInfo(this.catalog.tabDocs[0].id)
          }
        }
      }, 100)
    },
    getIcon(title) {
      const t = title.toLowerCase()
      if (t.includes('window')) return { size: 25, name: 'windows-logo' }
      if (t.includes('macos')) return { size: 24, name: 'laptop' }
      if (t.includes('ios')) return { size: 24, name: 'device-mobile-speaker' }

      if (t.includes('iphone')) return { size: 26, name: 'device-mobile-speaker' }
      if (t.includes('openwrt')) return { size: 26, name: 'rss' }
      if (t.includes('tv')) return { size: 24, name: 'television-simple' }
      if (t.includes('linux')) return { size: 20, name: 'linux-logo' }
      if (t.includes('android')) return { size: 23, name: 'android-logo' }
      if (t.includes('other')) return { size: 26, name: 'books' }
      return { size: 28, name: 'book-open-text' }
    },
    onTabChange(index) {
      this.catalog = this.catalogs[index]

      if (this.catalog.tabDocs.length > 0) {
        this.getDocInfo(this.catalog.tabDocs[0].id)
      } else {
        this.docId = ''
        this.docTitle = ''
        this.docContent = ''
      }
    },

    async getDocInfo(id) {
      const res = await getKnowledgeInfo(id, getLang('-'))
      this.docId = id
      this.docTitle = res.data.title
      this.docContent = res.data.body
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledge-container {
  .doc-tabs {
    ::v-deep {
      .ant-tabs-nav-container {
        font-size: 18px;
      }
      .ant-tabs-nav .ant-tabs-tab:hover {
        color: #{'rgba(var(--primary-color), 1)'};
      }
      .ant-tabs-nav .ant-tabs-tab-active {
        text-shadow: none;
        color: #{'rgba(var(--primary-color), 1)'};
      }
      .ant-tabs-ink-bar {
        background-color: #{'rgba(var(--primary-color), 1)'};
      }
    }
  }

  .doc-dir {
    padding: 30px 20px 1px;

    ::v-deep {
      .ant-timeline {
        color: var(--theme-text);
        margin-bottom: -20px;
      }
      .ant-timeline-item {
        font-size: 18px;
        cursor: pointer;

        &:hover {
          color: #{'rgba(var(--primary-color), 1)'};
        }

        &.is-active {
          color: #{'rgba(var(--primary-color), 1)'};
        }

        .svg-icon {
          margin: 0 6px;
        }
      }
      .ant-timeline-item-head-blue {
        background-color: #{'rgba(var(--primary-color), 1)'};
        border: 0;
      }
      .ant-timeline-item-tail {
        border-color: #cce3fd;
      }
    }
  }
  .doc-content {
    padding: 20px 0;
    box-sizing: border-box;
    height: calc(100vh - 212px);
    overflow: auto;

    .title {
      font-size: 24px;
      text-align: center;
      margin: 20px 0;
    }

    .html {
      padding: 20px 20px 100px;
    }
  }
}

@at-root .is-darkmode {
  .knowledge-container {
    .doc-tabs {
      ::v-deep {
      .ant-tabs-bar {
          border-bottom-color: var(--theme-border);
        }

        .ant-tabs-tab {
          color: var(--theme-muted);
        }

        .ant-tabs-nav .ant-tabs-tab:hover,
        .ant-tabs-nav .ant-tabs-tab-active {
          color: var(--theme-accent);
        }

        .ant-tabs-ink-bar {
          background-color: var(--theme-accent);
        }
      }
    }

    .doc-dir {
      ::v-deep {
        .ant-timeline {
          color: var(--theme-muted);
        }

        .ant-timeline-item {
          &:hover,
          &.is-active {
            color: var(--theme-accent);
          }
        }

        .ant-timeline-item-tail {
          border-color: rgba(142, 199, 255, 0.28);
        }
      }
    }

    .doc-content {
      color: var(--theme-text);

      .title {
        color: var(--theme-heading);
      }
    }
  }
}
</style>
