<template>
  <select
    :value="value"
    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    @input="$emit('change', $event.target.value)"
  >
    <slot />
  </select>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String, Number, Boolean],
      required: false,
      default: undefined,
    },
  },
};
</script>
