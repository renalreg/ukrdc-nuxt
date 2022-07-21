<!--
Re-usable formatted code title component.
-->

<template>
  <div>
    <p class="inline truncate font-medium capitalize text-gray-500">{{ codingStandard }} /</p>
    <p class="inline truncate font-medium text-gray-800">
      {{ code }}
    </p>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    code: {
      type: String,
      required: true,
    },
    codingStandard: {
      type: String,
      required: true,
    },
  },
});
</script>
