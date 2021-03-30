<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <messagesViewer
      ref="messageViewerModal"
      class="max-h-full"
      :message-data="openMessage"
    />
    <div v-if="isEmptyObject(message)">Loading...</div>
    <div v-else>
      <h1>{{ channelName }}</h1>
      <p>Channel ID: {{ message.channelId }}</p>
      <p>Message ID: {{ message.messageId }}</p>
      <p>
        {{ message.connectorMessages.length }} items in connectorMessage chain:
      </p>
      <div v-for="(messages, index) in chain" :key="index">
        <div
          class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 justify-center"
        >
          <messagesConnectorMessageCard
            v-for="item in messages"
            :key="item.channelName + item.connectorName"
            :message="item"
            @viewClick="
              openMessage = item.encoded ? item.encoded : item.raw
              $refs.messageViewerModal.show()
            "
          />
        </div>

        <div v-if="index < Object.keys(chain).length - 1" class="align-center">
          <svg
            class="h-6 mx-auto my-2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 17l-4 4m0 0l-4-4m4 4V3"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'
import objectUtilsMixin from '@/mixins/objectutils'
import {
  ChannelMessage,
  ConnectorMessage,
  ConnectorMessageData,
} from '@/interfaces/mirth'

interface ChainMap {
  [key: number]: ConnectorMessage[]
}

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin, objectUtilsMixin],

  data() {
    return {
      message: {} as ChannelMessage,
      chain: {} as ChainMap,
      openMessage: {} as ConnectorMessageData,
      formatMessage: true,
    }
  },
  async fetch() {
    // Get the main record data
    const path = `/api/mirth/channels/${this.$route.params.channel}/messages/${this.$route.params.id}`
    const res: ChannelMessage = await this.$axios.$get(path)
    this.message = res
    this.parseChain()
  },
  computed: {
    channelName(): string {
      let name: string = ''
      for (const msg of this.message.connectorMessages) {
        if (!name.includes(msg.channelName)) {
          name = name + '/' + msg.channelName
        }
      }
      return name.substring(1)
    },
  },
  methods: {
    parseChain(): void {
      if (this.message.connectorMessages) {
        for (const msg of this.message.connectorMessages) {
          if (!(msg.chainId in this.chain)) {
            this.chain[msg.chainId] = []
          }
          this.chain[msg.chainId].push(msg)
        }
        for (const index in this.chain) {
          this.chain[index].sort((a: ConnectorMessage, b: ConnectorMessage) =>
            a.orderId > b.orderId ? 1 : -1
          )
        }
      }
    },
  },
})
</script>
