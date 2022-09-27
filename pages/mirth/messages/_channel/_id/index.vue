<template>
  <div>
    <!-- Chain grid -->
    <MirthMessageChain v-if="message" :message="message" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { ChannelMessageModel } from "@ukkidney/ukrdc-axios-ts";

import MirthMessageChain from "~/components/MirthMessageChain.vue";

export default defineComponent({
  components: {
    MirthMessageChain,
  },
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
