<template>
  <div>
    <!-- Chain grid -->
    <MirthMessageChain v-if="message" :message="message" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import { MirthChannelMessageModel } from "@ukkidney/ukrdc-axios-ts";

export default defineComponent({
  props: {
    message: {
      type: Object as () => MirthChannelMessageModel,
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
