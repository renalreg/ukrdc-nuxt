<template>
  <GenericModalMaxSlot ref="messageViewerGenericModalMaxSlot">
    <GenericTabs
      v-model="currentTab"
      class="mx-auto px-4 py-4 border-b border-gray-200"
      :tabs="tabs"
    />
    <div
      class="flex flex-col w-full h-full box-border overflow-y-scroll overflow-x-hidden"
    >
      <div v-if="currentTab == 'Metadata'" id="viewerMetadata" class="p-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <GenericCardFlat
            v-for="(value, key) in nonNullMetadata"
            :key="key"
            class="relative rounded-lg px-4 py-4 flex items-center space-x-2"
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

      <div v-if="currentTab == 'Source'" id="viewerCode">
        <div
          v-if="!isEmptyObject(messageData)"
          class="h-full box-border flex flex-col pt-4 overflow-x-scroll"
        >
          <div class="pl-8 pb-3 border-b border-gray-200">
            <GenericToggle
              v-if="messageData.dataType === 'XML'"
              v-model="formatMessage"
              label="Format XML"
            />
            <p v-else>
              {{ messageData.dataType }}
            </p>
          </div>

          <div class="font-mono text-xs text-left px-4 box-border">
            <pre>
            <code
              v-for="(line, index) in formattedMessageArray"
              :key="'code' + index"
              class="whitespace-pre"
              >{{ line }}</code
            >
          </pre>
          </div>
        </div>
        <div v-else class="pt-8">No message data available</div>
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

export default Vue.extend({
  mixins: [objectUtilsMixin],
  props: {
    message: {
      type: Object as () => ConnectorMessage,
      required: true,
    },
  },
  data() {
    return {
      formatMessage: true,
      currentTab: 'Metadata',
      tabs: ['Metadata', 'Source'],
    }
  },
  computed: {
    messageData(): ConnectorMessageData {
      return this.message.encoded ? this.message.encoded : this.message.raw
    },
    formattedMessage(): string {
      if (!this.formatMessage) {
        return this.messageData.content
      } else {
        return formatXml(this.messageData.content)
      }
    },
    formattedMessageArray(): string[] {
      return this.formattedMessage.split('\n')
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
  methods: {
    show(): void {
      const el = this.$refs.messageViewerGenericModalMaxSlot as modalInterface
      el.show()
    },
    hide(): void {
      const el = this.$refs.messageViewerGenericModalMaxSlot as modalInterface
      el.hide()
    },
    toggle(): void {
      const el = this.$refs.messageViewerGenericModalMaxSlot as modalInterface
      el.toggle()
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
