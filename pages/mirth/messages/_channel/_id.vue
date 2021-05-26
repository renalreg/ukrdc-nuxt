<template>
  <div>
    <div class="mb-6">
      <TextH1 v-if="!isEmptyObject(message)"> Message {{ message.messageId }} </TextH1>
      <SkeleText v-else class="h-8 w-1/4 mb-2" />
    </div>

    <!-- Header card -->
    <MirthMessageCard :message="message" />

    <!-- Chain grid -->
    <MirthMessageChain v-if="!isEmptyObject(message)" :message="message" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, useFetch, useContext } from '@nuxtjs/composition-api'

import { ChannelMessage } from '@/interfaces/mirth'

import { isEmptyObject } from '@/utilities/objectUtils'

export default defineComponent({
  setup() {
    const route = useRoute()
    const { $axios, $config } = useContext()

    const message = ref({} as ChannelMessage)

    useFetch(async () => {
      // Get the main record data
      const path = `${$config.apiBase}/mirth/channels/${route.value.params.channel}/messages/${route.value.params.id}/`
      const res: ChannelMessage = await $axios.$get(path)
      message.value = res
    })

    return {
      message,
      isEmptyObject,
    }
  },
})
</script>
