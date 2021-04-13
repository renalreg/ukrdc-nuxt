<template>
  <genericButtonBase
    type="button"
    class="border border-transparent text-white"
    :class="`bg-${colour}-600 hover:bg-${colour}-700 focus:ring-${colour}-500`"
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
