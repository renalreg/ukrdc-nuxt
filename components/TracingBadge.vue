<template>
  <IconCheckCircle v-if="verified" v-tooltip="'Verified by tracing'" class="-ml-1 mr-2 inline h-5 w-5 text-green-600" />
  <IconExclamationCircle
    v-else
    v-tooltip="'Mismatch in tracing record'"
    class="-ml-1 mr-2 inline h-5 w-5 text-yellow-600"
  />
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import IconCheckCircle from "~/components/icons/hero/20/solid/IconCheckCircle.vue";
import IconExclamationCircle from "~/components/icons/hero/20/solid/IconExclamationCircle.vue";

export default defineComponent({
  components: {
    IconExclamationCircle,
    IconCheckCircle,
  },
  props: {
    verified: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
