<template>
  <div>
    <LoadingIndicator v-if="loading"></LoadingIndicator>
    <slot v-else />
  </div>
</template>

<script lang="ts">
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
