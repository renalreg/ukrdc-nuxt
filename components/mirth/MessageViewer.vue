<template>
  <GenericModalMaxSlot ref="messageViewerGenericModalMaxSlot">
    <div class="flex flex-col h-full">
      <GenericTabsMini v-model="currentTab" class="flex-0 w-full px-4 py-2 border-b border-gray-200" :tabs="tabs" />
      <div class="flex-1 w-full min-h-0 overflow-scroll">
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
          <GenericCodeReader
            v-if="currentTab == type"
            :content="messageData.content"
            :content-type="messageData.dataType"
          />
        </div>
      </div>
    </div>
  </GenericModalMaxSlot>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api'

import { ConnectorMessage, ConnectorMessageData, MetaDataMap } from '@/interfaces/mirth'
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
      messageViewerGenericModalMaxSlot,
      hide,
      toggle,
      show,
    }
  },
})
</script>
