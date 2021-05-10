<template>
  <genericButtonBase
    type="button"
    class="border border-gray-300 shadow-sm"
    :class="`focus:ring-${colour}-500`"
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
