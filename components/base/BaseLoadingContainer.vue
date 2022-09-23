<template>
  <div>
    <BaseLoadingIndicator v-if="loading"></BaseLoadingIndicator>
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import BaseLoadingIndicator from "~/components/base/BaseLoadingIndicator.vue";

export default defineComponent({
  components: {
    BaseLoadingIndicator,
  },
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup() {},
});
</script>
