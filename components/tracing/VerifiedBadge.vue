<template>
  <IconCheckCircle v-tooltip="'Verified by tracing'" class="-ml-1 mr-2 inline h-5 w-5 text-green-600" />
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import IconCheckCircle from "~/components/icons/hero/20/solid/IconCheckCircle.vue";

export default defineComponent({
  components: {
    IconCheckCircle,
  },
});
</script>
