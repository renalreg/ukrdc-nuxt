<template>
  <li>
    <div class="flex items-center px-4 py-4 sm:px-6">
      <div class="min-w-0 flex-1 flex items-center">
        <div class="min-w-0 grid grid-cols-2 lg:grid-cols-3 lg:gap-4 w-full">
          <!-- Heading -->
          <div class="col-span-1 lg:col-span-2">
            <TextL1c class="truncate"> Message ID {{ message.messageId }} </TextL1c>
            <TextP class="mt-2 line-clamp-2">{{ channelName }}</TextP>
          </div>
          <!-- Recieved  -->
          <div class="col-span-1">
            <TextP> {{ connectorMessagesArray.length }} messages in chain</TextP>
            <TextP class="mt-2 line-clamp-2">
              {{ message.processed ? 'Processed' : 'Failed' }}
              {{ hasErrors ? ' with errors' : '' }}
            </TextP>
          </div>
        </div>
      </div>
      <div>
        <IconChevronRight />
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

import { ChannelMessage } from '@/interfaces/mirth'

import { isEmptyObject } from '@/utilities/objectUtils'
import { messageHasErrors } from '@/utilities/mirthUtils'

export default defineComponent({
  props: {
    message: {
      type: Object as () => ChannelMessage,
      required: true,
    },
  },
  setup(props) {
    const connectorMessagesArray = computed(() => {
      return Object.values(props.message.connectorMessages)
    })
    const channelName = computed(() => {
      let name: string = ''
      for (const msg of connectorMessagesArray.value) {
        if (!name.includes(msg.channelName)) {
          name = name + '/' + msg.channelName
        }
      }
      return name.substring(1)
    })

    const hasErrors = computed((): boolean => {
      return messageHasErrors(props.message)
    })

    return { connectorMessagesArray, channelName, hasErrors, isEmptyObject }
  },
})
</script>

<style scoped></style>
