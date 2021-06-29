<template>
  <span
    class="inline-flex items-center h-5 px-2.5 py-0.5 rounded-full text-sm font-medium"
    :class="TagClass(nationalidType)"
  >
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    colour: {
      type: String,
      required: false,
      default: 'gray',
    },
  },

  setup(props) {
    function TagClass(): string[] {
      return [`bg-${props.colour}-100`, `text-${props.colour}-800`]
    }

    return {
      TagClass,
    }
  },
})
</script>

<style></style>
