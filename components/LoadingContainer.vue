<template>
  <div>
    <LoadingIndicator v-if="loading"></LoadingIndicator>
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup() {},
});
</script>
