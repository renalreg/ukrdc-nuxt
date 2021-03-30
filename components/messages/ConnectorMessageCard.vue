<template>
  <div
    class="col-span-1 flex items-center justify-between border border-gray-200 bg-white truncate shadow-sm rounded-md"
  >
    <div class="flex-1 px-4 py-2 text-sm truncate">
      <p class="text-gray-900 font-medium hover:text-gray-600">
        {{ message.connectorName }}
      </p>
      <p class="text-gray-500">{{ message.sendAttempts }} send attempts</p>
      <span
        v-if="message.errorCode === 0"
        class="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-sm mt-2"
        >Success</span
      >
      <span
        v-else
        class="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-xs font-medium bg-red-100 rounded-sm mt-2"
        >Error code {{ message.errorCode }}</span
      >
      <button
        type="button"
        class="inline-flex items-center px-2 py-0.5 border border-gray-300 shadow-sm text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2 float-right"
        @click="$emit('viewClick')"
      >
        View message
      </button>
    </div>
  </div>
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
})
</script>
