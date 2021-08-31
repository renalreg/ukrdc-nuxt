<template>
  <div>
    <div class="mb-6">
      <TextH1 v-if="message"> Message {{ message.messageId }} </TextH1>
      <SkeleText v-else class="h-8 w-1/4 mb-2" />
    </div>

    <!-- Header card -->
    <MirthMessageCard :message="message" />

    <!-- Chain grid -->
    <MirthMessageChain v-if="message" :message="message" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, useContext, onMounted } from '@nuxtjs/composition-api'

import { ChannelMessage } from '@/interfaces/mirth'

export default defineComponent({
  fetchOnServer: false,

  setup() {
    const route = useRoute()
    const { $axios, $config } = useContext()

    // Data refs

    const message = ref<ChannelMessage>()

    // Data fetching

    async function fetchMessage() {
      message.value = await $axios.$get(
        `${$config.apiBase}/v1/mirth/channels/${route.value.params.channel}/messages/${route.value.params.id}/`
      )
    }

    onMounted(() => {
      fetchMessage()
    })

    return {
      message,
    }
  },
})
</script>
