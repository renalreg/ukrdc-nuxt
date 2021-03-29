<template>
  <div>
    <div v-if="isEmptyObject(message)">Loading...</div>
    <div v-else>
      <p>Channel ID: {{ message.channelId }}</p>
      <p>Message ID: {{ message.messageId }}</p>
      <p>
        {{ message.connectorMessages.length }} items in connectorMessage chain:
      </p>
      <ul>
        <li
          v-for="item in message.connectorMessages"
          :key="item.channelName + item.connectorName"
        >
          - {{ item.connectorName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import dateUtilsMixin from '@/mixins/dateutils'
import codeUtilsMixin from '@/mixins/coddeutils'
import objectUtilsMixin from '@/mixins/objectutils'
import { ChannelMessage } from '@/interfaces/mirth'

export default Vue.extend({
  mixins: [dateUtilsMixin, codeUtilsMixin, objectUtilsMixin],

  data() {
    return {
      message: {} as ChannelMessage,
    }
  },
  async fetch() {
    // Get the main record data
    const path = `/api/mirth/channels/${this.$route.params.channel}/messages/${this.$route.params.id}`
    const res: ChannelMessage = await this.$axios.$get(path)
    this.message = res
  },
})
</script>
