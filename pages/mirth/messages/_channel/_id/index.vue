<template>
  <div>
    <!-- Chain grid -->
    <MirthMessageChain v-if="message" :message="message" />
  </div>
</template>

<script lang="ts">
import { ChannelMessageModel } from "@ukkidney/ukrdc-axios-ts";

export default defineComponent({
  props: {
    message: {
      type: Object as () => ChannelMessageModel,
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
