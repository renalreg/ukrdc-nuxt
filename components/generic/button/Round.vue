<template>
  <button
    v-tooltip="tooltip"
    type="button"
    class="
      inline-flex
      items-center
      p-1
      border border-gray-300
      rounded-full
      shadow-sm
      text-gray-400
      hover:text-gray-500
      bg-white
      hover:bg-gray-50
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    "
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    tooltip: {
      type: String,
      required: false,
      default: null,
    },
  },
})
</script>
