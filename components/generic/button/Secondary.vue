<template>
  <genericButtonBase
    type="button"
    class="border border-transparent text-white"
    :class="`text-${colour}-700 bg-${colour}-100 hover:bg-${colour}-200 focus:ring-${colour}-500`"
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
