<!-- Description list container component, formatted as a responsive grid -->

<template>
  <dl class="grid grid-cols-1 gap-4" :class="[{ 'lg:grid-cols-3': cols >= 3 }, { 'sm:grid-cols-2': cols >= 2 }]">
    <slot></slot>
  </dl>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    cols: {
      type: Number,
      required: false,
      default: 3,
    },
  },
  setup() {},
});
</script>
