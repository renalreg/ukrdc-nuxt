<template>
  <div
    class="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 md:mt-2 lg:mt-0"
    :class="[
      styleNegative
        ? ['bg-red-100', 'text-red-800']
        : ['bg-green-100', 'text-green-800'],
    ]"
  >
    <svg
      class="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5"
      :class="[styleNegative ? ['text-red-500'] : ['text-green-500']]"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        v-if="negative"
        fill-rule="evenodd"
        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
        clip-rule="evenodd"
      />
      <path
        v-else
        fill-rule="evenodd"
        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
        clip-rule="evenodd"
      />
    </svg>

    <span class="sr-only"> {{ negative ? 'Decreased' : 'Increased' }} by </span>
    {{ Math.abs(delta) }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    delta: {
      type: Number,
      required: true,
    },
    invert: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    negative(): boolean {
      if (Math.sign(this.delta) === -1) {
        return true
      } else {
        return false
      }
    },
    styleNegative(): boolean {
      if (this.invert) {
        return !this.negative
      } else {
        return this.negative
      }
    },
  },

  methods: {},
})
</script>

<style></style>
