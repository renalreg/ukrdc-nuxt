<template>
  <genericCardMini
    class="col-span-1 flex items-center justify-between truncate"
  >
    <div class="flex-1 px-4 py-2 text-sm truncate">
      <p class="text-gray-900 font-medium hover:text-gray-600">
        {{ message.connectorName }}
      </p>
      <p class="text-gray-500">{{ message.sendAttempts }} send attempts</p>

      <div class="mt-2">
        <span
          v-if="errorMessage"
          class="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-sm"
          >Error</span
        >
        <span
          v-else
          class="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-sm"
          >Success</span
        >
        <genericButtonMini
          class="float-right"
          @click="$emit('viewSourceClick')"
        >
          View message
        </genericButtonMini>
      </div>
    </div>
  </genericCardMini>
</template>

<script lang="ts">
import Vue from 'vue'
import { ConnectorMessage } from '@/interfaces/mirth'

export default Vue.extend({
  props: {
    message: {
      type: Object as () => ConnectorMessage,
      required: true,
    },
  },
  computed: {
    errorMessage(): string | null {
      if (this.message.metaDataMap?.ERROR) {
        return this.message.metaDataMap.ERROR
      } else if (this.message.errorCode !== 0) {
        return `Error code ${this.message.errorCode}`
      }
      return null
    },
  },
})
</script>
