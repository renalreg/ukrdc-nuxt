<template>
  <div>
    <!-- Chain grid -->
    <MirthMessageChain v-if="message" :message="message" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import { ChannelMessage } from "@/interfaces/mirth";

export default defineComponent({
  props: {
    message: {
      type: Object as () => ChannelMessage,
      required: true,
    },
  },
  setup() {
    return {};
  },
  head: {
    title: "Mirth Message",
  },
});
</script>
