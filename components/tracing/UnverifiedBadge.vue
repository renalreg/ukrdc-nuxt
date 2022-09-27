<template>
  <IconExclamationCircle v-tooltip="'Mismatch in tracing record'" class="-ml-1 mr-2 inline h-5 w-5 text-yellow-600" />
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import IconExclamationCircle from "../icons/hero/20/solid/IconExclamationCircle.vue";

export default defineComponent({
  components: {
    IconExclamationCircle,
  },
});
</script>
