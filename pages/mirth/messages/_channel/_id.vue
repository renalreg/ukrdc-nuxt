<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <!-- XML viewer modal -->
    <messagesViewer
      ref="messageViewerModal"
      class="max-h-full"
      :message-data="openMessage"
    />
    <div v-if="isEmptyObject(message)"><messagesSummaryCardPlaceholder /></div>

    <div v-else>
      <!-- Header card -->
      <div class="bg-white shadow overflow-hidden rounded-md mb-8">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ channelName }}
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            {{ message.channelId }}
          </p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Message ID</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ message.messageId }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Processed</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ message.processed ? 'Yes' : 'No' }}
                {{ hasErrors ? '(with errors)' : '' }}
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">
                {{ message.connectorMessages.length }} messages across
                {{ Object.keys(chain).length }} chain links
              </dt>
            </div>
          </dl>
        </div>
      </div>

      <!-- Chain grid -->
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
    const path = `${this.$config.apiBase}/mirth/channels/${this.$route.params.channel}/messages/${this.$route.params.id}`
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
    hasErrors(): boolean {
      for (const msg of this.message.connectorMessages) {
        if (msg.errorCode !== 0) {
          return true
        }
      }
      return false
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
