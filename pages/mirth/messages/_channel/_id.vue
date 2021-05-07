<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <!-- XML viewer modal -->
    <messagesViewer ref="messageViewerModal" class="max-h-full" />

    <div class="mb-6">
      <TextH1 v-if="!isEmptyObject(message)"> {{ channelName }} </TextH1>
      <SkeleText v-else class="h-8 w-1/4 mb-2" />
      <TextL1 v-if="!isEmptyObject(message)">
        Message {{ message.messageId }}
      </TextL1>
      <SkeleText v-else class="h-4 w-1/2" />
    </div>

    <!-- Header card -->
    <GenericCard class="mb-8">
      <GenericCardContent>
        <GenericDl>
          <GenericDi>
            <TextDt>Message ID</TextDt>
            <TextDd v-if="!isEmptyObject(message)">
              {{ message.messageId }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Processed</TextDt>
            <TextDd v-if="!isEmptyObject(message)">
              {{ message.processed ? 'Yes' : 'No' }}
              {{ hasErrors ? '(with errors)' : '' }}
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
          <GenericDi>
            <TextDt>Chain</TextDt>
            <TextDd v-if="!isEmptyObject(message)">
              {{ message.connectorMessages.length }} messages across
              {{ Object.keys(chain).length }} chain links
            </TextDd>
            <SkeleText v-else class="h-6 w-full" />
          </GenericDi>
        </GenericDl>
      </GenericCardContent>
    </GenericCard>

    <!-- Chain grid -->
    <div v-if="!isEmptyObject(message)">
      <div v-for="(messages, index) in chain" :key="index">
        <div
          class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2 justify-center"
        >
          <messagesConnectorMessageCard
            v-for="item in messages"
            :key="item.channelName + item.connectorName"
            :message="item"
            @viewSourceClick="messageViewerModal.show(item)"
          />
        </div>

        <div v-if="index < Object.keys(chain).length - 1" class="align-center">
          <IconArrowDown />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useRoute,
  useFetch,
  useContext,
  computed,
} from '@nuxtjs/composition-api'

import { messageViewerModalInterface } from '@/interfaces/modal'
import { ChannelMessage, ConnectorMessage } from '@/interfaces/mirth'

import { isEmptyObject } from '@/utilities/objectUtils'

interface ChainMap {
  [key: number]: ConnectorMessage[]
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const { $axios, $config } = useContext()

    const message = ref({} as ChannelMessage)
    const chain = ref({} as ChainMap)

    // Template refs
    const messageViewerModal = ref<messageViewerModalInterface>()

    const channelName = computed(() => {
      let name: string = ''
      for (const msg of message.value.connectorMessages) {
        if (!name.includes(msg.channelName)) {
          name = name + '/' + msg.channelName
        }
      }
      return name.substring(1)
    })

    const hasErrors = computed(() => {
      for (const msg of message.value.connectorMessages) {
        if (msg.errorCode !== 0) {
          return true
        }
      }
      return false
    })

    useFetch(async () => {
      // Get the main record data
      const path = `${$config.apiBase}/mirth/channels/${route.value.params.channel}/messages/${route.value.params.id}/`
      const res: ChannelMessage = await $axios.$get(path)
      message.value = res
      parseChain()
    })

    function parseChain(): void {
      if (message.value.connectorMessages) {
        for (const msg of message.value.connectorMessages) {
          if (!(msg.chainId in chain.value)) {
            chain.value[msg.chainId] = []
          }
          chain.value[msg.chainId].push(msg)
        }
        for (const index in chain.value) {
          chain.value[index].sort((a: ConnectorMessage, b: ConnectorMessage) =>
            a.orderId > b.orderId ? 1 : -1
          )
        }
      }
    }

    return {
      messageViewerModal,
      message,
      chain,
      channelName,
      hasErrors,
      isEmptyObject,
    }
  },
})
</script>
