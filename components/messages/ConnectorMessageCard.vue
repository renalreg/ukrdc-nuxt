<template>
  <genericCardMini
    class="col-span-1 flex items-center justify-between truncate"
  >
    <div class="flex-1 px-4 py-2 text-sm truncate">
      <TextH3>
        {{ message.connectorName }}
      </TextH3>
      <TextP>{{ message.sendAttempts }} send attempts</TextP>

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
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { ConnectorMessage } from '@/interfaces/mirth'

export default defineComponent({
  props: {
    message: {
      type: Object as () => ConnectorMessage,
      required: true,
    },
  },

  setup(props) {
    const errorMessage = computed(() => {
      if (props.message.metaDataMap?.ERROR) {
        return props.message.metaDataMap.ERROR
      } else if (props.message.errorCode !== 0) {
        return `Error code ${props.message.errorCode}`
      }
      return null
    })

    return { errorMessage }
  },
})
</script>
