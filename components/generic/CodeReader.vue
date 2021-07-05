<template>
  <div>
    <div v-if="contentType === 'XML'" class="pl-8 pb-3 pt-3 border-b border-gray-200">
      <GenericToggle v-model="formatMessage" label="Format XML" />
    </div>

    <div v-if="content" class="font-mono text-sm text-left px-4 box-border">
      <pre>
      <code
        v-for="(line, index) in formatMessageToXMLArray(content)"
        :key="'code' + index"
        class="whitespace-pre"
        >{{ line }}</code
      >
    </pre>
    </div>
    <div v-else>Empty file</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

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
  setup() {
    const formatMessage = ref(true)

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

    function formatMessageToXMLArray(content: string): string[] {
      return formatMessageToXML(content).split('\n')
    }

    return {
      formatMessage,
      formatMessageToXMLArray,
    }
  },
})
</script>

<style scoped>
pre {
  counter-reset: line;
}
code {
  counter-increment: line;
  display: block;
}
code:before {
  content: counter(line);
  user-select: none;
  -webkit-user-select: none;
  display: inline-block;
  width: 6ex;
  border-width: 0 1px 0 0;
  margin-right: 4px;
}
</style>
