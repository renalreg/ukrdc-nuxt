<template>
  <TracingVerifiedBadge v-if="verified" />
  <TracingUnverifiedBadge v-else />
</template>

<script lang="ts">
export default defineComponent({
  props: {
    verified: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
