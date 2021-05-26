<template>
  <genericButtonBase
    type="button"
    class="border border-transparent text-white"
    :class="`btn-${colour}`"
    @click="$emit('click')"
  >
    <slot />
  </genericButtonBase>
</template>

<script>
export default {
  props: {
    colour: {
      type: String,
      required: false,
      default: 'indigo',
    },
  },
}
</script>

<style lang="postcss">
.btn-indigo {
  @apply bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-green {
  @apply bg-green-600 hover:bg-green-700 focus:ring-green-500;
}
.btn-yellow {
  @apply bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500;
}
.btn-red {
  @apply bg-red-600 hover:bg-red-700 focus:ring-red-500;
}
</style>
