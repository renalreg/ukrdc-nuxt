<template>
  <input
    class="
      block
      bg-white
      border border-gray-300
      rounded-md
      py-2
      placeholder-gray-500
      focus:outline-none
      focus:text-gray-900
      focus:placeholder-gray-400
      focus:ring-1
      focus:ring-indigo-500
      focus:border-indigo-500
    "
    :value="value"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      default: '',
      type: String,
    },
  },
})
</script>
