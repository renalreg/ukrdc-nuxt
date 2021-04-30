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
            @viewSourceClick="$refs.messageViewerModal.show(item)"
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
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'
import objectUtilsMixin from '@/mixins/objectutils'
import { ChannelMessage, ConnectorMessage } from '@/interfaces/mirth'

interface ChainMap {
  [key: number]: ConnectorMessage[]
}

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin, objectUtilsMixin],

  data() {
    return {
      message: {} as ChannelMessage,
      chain: {} as ChainMap,
      openMessage: {} as ConnectorMessage,
      formatMessage: true,
    }
  },
  async fetch() {
    // Get the main record data
    const path = `${this.$config.apiBase}/mirth/channels/${this.$route.params.channel}/messages/${this.$route.params.id}/`
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
