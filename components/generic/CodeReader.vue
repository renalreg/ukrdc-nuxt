<template>
  <div>
    <div v-if="contentType === 'XML'" class="border-b border-gray-200 pl-8 pb-3 pt-3">
      <BaseToggle v-model="formatMessage" label="Format XML" />
    </div>

    <div v-if="content" class="box-border px-4 text-left font-mono text-sm">
      <code class="mt-2 block whitespace-pre">{{ formattedMessage }}</code>
    </div>
    <div v-else>Empty file</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@nuxtjs/composition-api";
import formatXml from "xml-formatter";
import BaseToggle from "@/components/base/BaseToggle.vue";

export default defineComponent({
  components: { BaseToggle },
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
    const formatMessage = ref(true);
    const formattedMessage = computed(() => {
      return formatMessageToXML(props.content);
    });

    function formatMessageToXML(content: string): string {
      if (content === null) {
        return "";
      }
      if (!formatMessage.value) {
        return content;
      } else {
        return formatXml(content);
      }
    }

    return {
      formatMessage,
      formattedMessage,
    };
  },
});
</script>
