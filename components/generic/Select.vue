<template>
  <select
    :value="value"
    class="sm: block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    @input="$emit('input', $event.target.value)"
  >
    <slot />
  </select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number, Boolean],
      required: true,
    },
  },
};
</script>
