<template>
  <modalMaxSlot ref="messageViewermodalMaxSlot">
    <div
      v-if="!isEmptyObject(messageData)"
      class="h-full box-border flex flex-col pt-4"
    >
      <div class="pl-8 pb-3 border-b border-gray-200">
        <Toggle
          v-if="messageData.dataType === 'XML'"
          v-model="formatMessage"
          label="Format XML"
        />
        <p v-else>
          {{ messageData.dataType }}
        </p>
      </div>

      <div
        class="font-mono text-xs text-left overflow-scroll w-full h-full px-4 box-border"
      >
        <pre>
            <code
              v-for="(line, index) in formattedMessageArray"
              :key="'code' + index"
              class="whitespace-pre"
              >{{ line }}</code
            >
          </pre>
      </div>
    </div>
    <div v-else class="pt-8">No message data available</div>
  </modalMaxSlot>
</template>

<script lang="ts">
import Vue from 'vue'

import formatXml from 'xml-formatter'
import objectUtilsMixin from '@/mixins/objectutils'
import { ConnectorMessageData } from '@/interfaces/mirth'

interface modalMaxSlotInterface extends Vue {
  show: () => void
  hide: () => void
  toggle: () => void
}

export default Vue.extend({
  mixins: [objectUtilsMixin],
  props: {
    messageData: {
      type: Object as () => ConnectorMessageData,
      required: true,
    },
  },
  data() {
    return {
      formatMessage: true,
    }
  },
  computed: {
    formattedMessage(): string {
      if (!this.formatMessage) {
        return this.messageData.content
      } else {
        return formatXml(this.messageData.content)
      }
    },
    formattedMessageArray(): string[] {
      return this.formattedMessage.split('\n')
    },
  },
  methods: {
    show(): void {
      const el = this.$refs.messageViewermodalMaxSlot as modalMaxSlotInterface
      el.show()
    },
    hide(): void {
      const el = this.$refs.messageViewermodalMaxSlot as modalMaxSlotInterface
      el.hide()
    },
    toggle(): void {
      const el = this.$refs.messageViewermodalMaxSlot as modalMaxSlotInterface
      el.toggle()
    },
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
