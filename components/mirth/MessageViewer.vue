<template>
  <GenericModalMaxSlot ref="messageViewerGenericModalMaxSlot">
    <GenericTabs v-model="currentTab" class="mx-auto px-4 py-2 border-b border-gray-200" :tabs="tabs" />
    <div class="flex flex-col w-full h-full box-border overflow-y-scroll overflow-x-hidden">
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
              <p class="font-medium text-gray-900">{{ key }}</p>
              <p class="text-gray-500 line-clamp-3">
                {{ value }}
              </p>
            </div>
          </GenericCardFlat>
        </div>
      </div>

      <div v-for="(messageData, type) in availableMessageData" :key="type">
        <div v-if="currentTab == type" class="h-full box-border flex flex-col overflow-x-scroll">
          <div v-if="messageData.dataType === 'XML'" class="pl-8 pb-3 pt-3 border-b border-gray-200">
            <GenericToggle v-model="formatMessage" label="Format XML" />
          </div>

          <div class="font-mono text-sm text-left px-4 box-border">
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
import { defineComponent, ref, computed, watch } from '@nuxtjs/composition-api'

import formatXml from 'xml-formatter'
import { ConnectorMessageData, ConnectorMessage, MetaDataMap } from '@/interfaces/mirth'
import { modalInterface } from '@/interfaces/modal'

interface ConnectorMessageDataTabs {
  raw: ConnectorMessageData
  encoded: ConnectorMessageData
  sent: ConnectorMessageData
  response: ConnectorMessageData
}

export default defineComponent({
  setup() {
    const message = ref({} as ConnectorMessage)
    const formatMessage = ref(true)

    // Manage viewer tabs
    const currentTab = ref('metadata')

    const tabs = computed(() => {
      return ['metadata'].concat(Object.keys(availableMessageData.value))
    })

    watch(message, () => {
      currentTab.value = tabs.value[0]
    })

    // Handle message and metadata
    const availableMessageData = computed<ConnectorMessageDataTabs>(() => {
      const tabs = {} as ConnectorMessageDataTabs
      if (message.value.raw !== null) {
        tabs.raw = message.value.raw
      }
      if (message.value.encoded !== null) {
        tabs.encoded = message.value.encoded
      }
      if (message.value.sent !== null) {
        tabs.sent = message.value.sent
      }
      if (message.value.response !== null) {
        tabs.response = message.value.response
      }
      return tabs
    })

    const nonNullMetadata = computed<MetaDataMap>(() => {
      if (message.value.metaDataMap) {
        return Object.fromEntries(Object.entries(message.value.metaDataMap).filter(([_, v]) => v != null))
      } else {
        return {}
      }
    })

    function formatMessageToXML(messageData: ConnectorMessageData): string {
      if (messageData.content === null) {
        return ''
      }
      if (!formatMessage.value) {
        return messageData.content
      } else {
        return formatXml(messageData.content)
      }
    }

    function formatMessageToXMLArray(messageData: ConnectorMessageData): string[] {
      return formatMessageToXML(messageData).split('\n')
    }

    // Modal visibility
    const messageViewerGenericModalMaxSlot = ref<modalInterface>()

    function hide(): void {
      messageViewerGenericModalMaxSlot.value?.hide()
    }

    function toggle(): void {
      messageViewerGenericModalMaxSlot.value?.toggle()
    }

    function show(messageToShow: ConnectorMessage): void {
      message.value = messageToShow
      messageViewerGenericModalMaxSlot.value?.show()
    }

    return {
      currentTab,
      tabs,
      nonNullMetadata,
      availableMessageData,
      formatMessage,
      formatMessageToXMLArray,
      messageViewerGenericModalMaxSlot,
      hide,
      toggle,
      show,
    }
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
