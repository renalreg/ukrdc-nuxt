<template>
  <div>
    <LoadingIndicator v-if="fetchSourceInProgress"></LoadingIndicator>
    <GenericCard v-else-if="source && source.content">
      <GenericCodeReader
        :content="source.content"
        :content-type="source.contentType"
        class="h-full box-border flex flex-col overflow-x-scroll"
      />
    </GenericCard>

    <div v-else class="w-full h-full flex">
      <div class="w-full text-center mb-auto mt-auto">Missing or empty source file</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import fetchMessages from '~/helpers/fetch/fetchMessages'

import { ErrorSource, Message } from '~/interfaces/messages'

export default defineComponent({
  props: {
    message: {
      type: Object as () => Message,
      required: true,
    },
  },
  setup(props) {
    const { fetchMessageSource, fetchSourceInProgress } = fetchMessages()

    const source = ref<ErrorSource>()
    const error = ref<string>()

    onMounted(async () => {
      try {
        source.value = await fetchMessageSource(props.message)
      } catch (e: any) {
        error.value = e.response.data.detail
      }
    })

    return {
      fetchSourceInProgress,
      source,
      error,
    }
  },
})
</script>
