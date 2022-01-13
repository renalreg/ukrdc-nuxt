<template>
  <div>
    <GenericCard class="mb-6">
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt>Connector Name</TextDt>
            <TextDd v-if="connectorMessage">
              {{ connectorMessage.connectorName }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Send Attempts</TextDt>
            <TextDd v-if="connectorMessage">
              {{ connectorMessage.sendAttempts }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Status</TextDt>
            <TextDd v-if="connectorMessage">
              <span
                v-if="errorMessage"
                class="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-sm font-medium bg-red-100 rounded-sm"
                >Error</span
              >
              <span
                v-else
                class="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-sm font-medium bg-green-100 rounded-sm"
                >Success</span
              >
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
        </GenericDl>
        <slot></slot>
      </GenericCardContent>
    </GenericCard>

    <div class="mb-6"><GenericTabsMini v-model="currentTab" :tabs="tabs" /></div>
    <div class="flex-1">
      <div v-if="currentTab == 'metadata'" id="viewerMetadata">
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

      <div v-for="(connectorMessageData, type) in availableconnectorMessageData" :key="type">
        <GenericCard v-if="currentTab == type">
          <GenericCodeReader :content="connectorMessageData.content" :content-type="connectorMessageData.dataType" />
        </GenericCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useRoute, watch } from '@nuxtjs/composition-api'

import { ChannelMessage, ConnectorMessage, ConnectorMessageData, MetaDataMap } from '@/interfaces/mirth'
import { connectorMessageError } from '~/helpers/utils/mirthUtils'

interface ConnectorMessageDataTabs {
  raw: ConnectorMessageData
  encoded: ConnectorMessageData
  sent: ConnectorMessageData
  response: ConnectorMessageData
}

export default defineComponent({
  props: {
    message: {
      type: Object as () => ChannelMessage,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute()

    // Data refs
    const connectorMessage = computed(() => {
      const orderId = parseInt(route.value.params.orderId)
      return props.message.connectorMessages[orderId] as ConnectorMessage
    })
    const formatconnectorMessage = ref(true)

    // Manage viewer tabs
    const currentTab = ref('metadata')

    const tabs = computed(() => {
      return ['metadata'].concat(Object.keys(availableconnectorMessageData.value))
    })

    watch(connectorMessage, () => {
      currentTab.value = tabs.value[0]
    })

    // Handle connectorMessage and metadata
    const availableconnectorMessageData = computed<ConnectorMessageDataTabs>(() => {
      const tabs = {} as ConnectorMessageDataTabs
      if (connectorMessage.value) {
        if (connectorMessage.value.raw !== null) {
          tabs.raw = connectorMessage.value.raw
        }
        if (connectorMessage.value.encoded !== null) {
          tabs.encoded = connectorMessage.value.encoded
        }
        if (connectorMessage.value.sent !== null) {
          tabs.sent = connectorMessage.value.sent
        }
        if (connectorMessage.value.response !== null) {
          tabs.response = connectorMessage.value.response
        }
      }
      return tabs
    })

    const nonNullMetadata = computed<MetaDataMap>(() => {
      if (connectorMessage.value?.metaDataMap) {
        return Object.fromEntries(Object.entries(connectorMessage.value.metaDataMap).filter(([_, v]) => v != null))
      } else {
        return {}
      }
    })

    const errorMessage = computed(() => {
      return connectorMessage.value ? connectorMessageError(connectorMessage.value) : null
    })

    return {
      connectorMessage,
      currentTab,
      tabs,
      nonNullMetadata,
      availableconnectorMessageData,
      formatconnectorMessage,
      errorMessage,
    }
  },
  head: {
    title: 'Mirth Message',
  },
})
</script>