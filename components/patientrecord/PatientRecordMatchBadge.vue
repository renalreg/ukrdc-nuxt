<template>
  <IconExclamationCircle
    v-if="!verified"
    v-tooltip="'Value does not match other records for this patient'"
    class="-ml-1 mr-2 inline h-5 w-5 text-yellow-600"
  />
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import IconExclamationCircle from "~/components/icons/hero/20/solid/IconExclamationCircle.vue";

export default defineComponent({
  components: {
    IconExclamationCircle,
  },
  props: {
    verified: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
