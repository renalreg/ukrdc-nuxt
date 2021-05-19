<template>
  <select
    :value="value"
    class="
      block
      focus:ring-indigo-500
      focus:border-indigo-500
      w-full
      shadow-sm
      sm:text-sm
      border-gray-300
      rounded-md
    "
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
}
</script>
