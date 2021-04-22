<template>
  <span
    class="inline-flex items-center h-5 px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="TagClass(nationalidType)"
  >
    <slot></slot>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    colour: {
      type: String,
      required: false,
      default: 'gray',
    },
  },
  methods: {
    TagClass(): string[] {
      return [`bg-${this.colour}-100`, `text-${this.colour}-800`]
    },
  },
})
</script>

<style></style>
