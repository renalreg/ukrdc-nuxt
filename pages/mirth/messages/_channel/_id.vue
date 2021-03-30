<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
    <modalMaxSlot ref="messageViewerModal" class="max-h-full">
      <div
        v-if="!isEmptyObject(openMessage)"
        class="h-full box-border flex flex-col pt-4"
      >
        <div class="pl-8 pb-3 border-b border-gray-200">
          <Toggle
            v-if="openMessage.dataType === 'XML'"
            v-model="formatMessage"
            label="Format XML"
          />
          <p v-else>
            {{ openMessage.dataType }}
          </p>
        </div>

        <div
          class="font-mono text-xs text-left overflow-scroll w-full h-full px-4 box-border"
        >
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
      <div v-else>No message data available</div>
    </modalMaxSlot>
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
          <div
            v-for="item in messages"
            :key="item.channelName + item.connectorName"
            class="col-span-1 flex items-center justify-between border border-gray-200 bg-white truncate shadow-sm rounded-md"
          >
            <div class="flex-1 px-4 py-2 text-sm truncate">
              <p class="text-gray-900 font-medium hover:text-gray-600">
                {{ item.connectorName }}
              </p>
              <p class="text-gray-500">{{ item.sendAttempts }} send attempts</p>
              <span
                v-if="item.errorCode === 0"
                class="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-sm mt-2"
                >Success</span
              >
              <span
                v-else
                class="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-sm mt-2"
                >Error code {{ item.errorCode }}</span
              >
              <button
                type="button"
                class="inline-flex items-center px-2 py-0.5 border border-gray-300 shadow-sm text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2 float-right"
                @click="
                  openMessage = item.encoded ? item.encoded : item.raw
                  $refs.messageViewerModal.show()
                "
              >
                View message
              </button>
            </div>
          </div>
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

import formatXml from 'xml-formatter'

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
    formattedMessage(): string {
      if (!this.formatMessage) {
        return this.openMessage.content
      } else {
        return formatXml(this.openMessage.content)
      }
    },
    formattedMessageArray(): string[] {
      return this.formattedMessage.split('\n')
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
