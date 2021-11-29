<template>
  <div>
    <div v-if="contentType === 'XML'" class="pl-8 pb-3 pt-3 border-b border-gray-200">
      <GenericToggle v-model="formatMessage" label="Format XML" />
    </div>

    <div v-if="content" class="font-mono text-sm text-left px-4 box-border">
      <code class="whitespace-pre block mt-2">{{ formattedMessage }}</code>
    </div>
    <div v-else>Empty file</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'

import formatXml from 'xml-formatter'

export default defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const formatMessage = ref(false)
    const formattedMessage = computed(() => {
      return formatMessageToXML(props.content)
    })

    function formatMessageToXML(content: string): string {
      if (content === null) {
        return ''
      }
      if (!formatMessage.value) {
        return content
      } else {
        return formatXml(content)
      }
    }

    return {
      formatMessage,
      formattedMessage,
    }
  },
})
</script>
