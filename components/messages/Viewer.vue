<template>
  <GenericModalMaxSlot ref="messageViewerGenericModalMaxSlot">
    <GenericTabs
      v-model="currentTab"
      class="mx-auto px-4 py-2 border-b border-gray-200"
      :tabs="tabs"
    />
    <div
      class="flex flex-col w-full h-full box-border overflow-y-scroll overflow-x-hidden"
    >
      <div v-if="currentTab == 'metadata'" id="viewerMetadata" class="p-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <GenericCardFlat
            v-for="(value, key) in nonNullMetadata"
            :key="key"
            class="relative px-4 py-4 flex items-center space-x-2"
            :class="key.includes('ERROR') ? 'border-2 border-red-500' : ''"
          >
            <div class="flex-1 min-w-0">
              <span class="absolute inset-0" aria-hidden="true" />
              <p class="text-sm font-medium text-gray-900">{{ key }}</p>
              <p class="text-sm text-gray-500 line-clamp-3">
                {{ value }}
              </p>
            </div>
          </GenericCardFlat>
        </div>
      </div>

      <div v-for="(messageData, type) in availableMessageData" :key="type">
        <div
          v-if="currentTab == type"
          class="h-full box-border flex flex-col overflow-x-scroll"
        >
          <div
            v-if="messageData.dataType === 'XML'"
            class="pl-8 pb-3 pt-3 border-b border-gray-200"
          >
            <GenericToggle v-model="formatMessage" label="Format XML" />
          </div>

          <div class="font-mono text-xs text-left px-4 box-border">
            <pre>
            <code
              v-for="(line, index) in formatMessageToXMLArray(messageData)"
              :key="'code' + index"
              class="whitespace-pre"
              >{{ line }}</code
            >
          </pre>
          </div>
        </div>
      </div>
    </div>
  </GenericModalMaxSlot>
</template>

<script lang="ts">
import Vue from 'vue'

import formatXml from 'xml-formatter'
import objectUtilsMixin from '@/mixins/objectutils'
import {
  ConnectorMessageData,
  ConnectorMessage,
  MetaDataMap,
} from '@/interfaces/mirth'
import { modalInterface } from '@/interfaces/modal'

interface ConnectorMessageDataTabs {
  raw: ConnectorMessageData
  encoded: ConnectorMessageData
  sent: ConnectorMessageData
  response: ConnectorMessageData
}

export default Vue.extend({
  mixins: [objectUtilsMixin],
  data() {
    return {
      message: {} as ConnectorMessage,
      formatMessage: true,
      currentTab: 'metadata',
    }
  },
  computed: {
    availableMessageData(): ConnectorMessageDataTabs {
      const tabs = {} as ConnectorMessageDataTabs
      if (this.message.raw !== null) {
        tabs.raw = this.message.raw
      }
      if (this.message.encoded !== null) {
        tabs.encoded = this.message.encoded
      }
      if (this.message.sent !== null) {
        tabs.sent = this.message.sent
      }
      if (this.message.response !== null) {
        tabs.response = this.message.response
      }
      return tabs
    },
    tabs(): string[] {
      return ['metadata'].concat(Object.keys(this.availableMessageData))
    },
    nonNullMetadata(): MetaDataMap {
      if (this.message.metaDataMap) {
        return Object.fromEntries(
          Object.entries(this.message.metaDataMap).filter(([_, v]) => v != null)
        )
      } else {
        return {}
      }
    },
  },
  watch: {
    // Watch for changes in message. When message changes, reset to first tab.
    // Otherwise, you could open a message with the viewer set to a tab that no longer exists
    message() {
      this.currentTab = this.tabs[0]
    },
  },
  methods: {
    formatMessageToXML(messageData: ConnectorMessageData): string {
      if (messageData.content === null) {
        return ''
      }
      if (!this.formatMessage) {
        return messageData.content
      } else {
        return formatXml(messageData.content)
      }
    },
    formatMessageToXMLArray(messageData: ConnectorMessageData): string[] {
      return this.formatMessageToXML(messageData).split('\n')
    },
    hide(): void {
      const el = this.$refs.messageViewerGenericModalMaxSlot as modalInterface
      el.hide()
    },
    toggle(): void {
      const el = this.$refs.messageViewerGenericModalMaxSlot as modalInterface
      el.toggle()
    },
    show(message: ConnectorMessage): void {
      this.message = message
      const el = this.$refs.messageViewerGenericModalMaxSlot as modalInterface
      el.show()
    },
  },
})
</script>

<style scoped>
pre {
  counter-reset: line;
}
code {
  counter-increment: line;
  display: block;
}
code:before {
  content: counter(line);
  user-select: none;
  -webkit-user-select: none;
  display: inline-block;
  width: 6ex;
  border-width: 0 1px 0 0;
  margin-right: 4px;
}
</style>
