<template>
  <div>
    <div class="mb-6 flex items-end gap-4">
      <div class="flex-grow">
        <TextH1 v-if="message">
          {{ message.msgStatus === 'ERROR' ? 'Error' : 'Message' }} {{ message.id }} from {{ message.facility }}
        </TextH1>
        <SkeleText v-else class="mb-2 h-8 w-1/4" />
        <TextL1 v-if="message" class="line-clamp-1">
          {{ messageSummary }}
        </TextL1>
        <SkeleText v-else class="h-4 w-1/2" />
      </div>
    </div>

    <NuxtChild v-if="message" :message="message" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, useMeta, useRoute } from '@nuxtjs/composition-api'

import { Message } from '@/interfaces/messages'

import { MessageSummary } from '@/helpers/utils/messageUtils'

import fetchMessages from '~/helpers/fetch/fetchMessages'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { fetchMessage } = fetchMessages()

    // Head

    const { title } = useMeta()
    title.value = `Error ${route.value.params.id}`

    // Data refs

    const message = ref<Message>()

    const messageSummary = computed(() => {
      if (message.value) {
        return MessageSummary(message.value)
      }
      return ''
    })

    // Data fetching

    onMounted(async () => {
      message.value = await fetchMessage(route.value.params.id)
    })

    return {
      message,
      messageSummary,
    }
  },
  head: {
    title: 'Message',
  },
})
</script>
