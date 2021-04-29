<template>
  <nav
    class="overflow-hidden flex items-center justify-between px-2 py-2"
    aria-label="Pagination"
  >
    <div class="hidden sm:block">
      <p class="text-sm text-gray-700">
        {{ itemLabel }}
        <span class="font-medium">{{ value + 1 }}</span>
        of
        <span class="font-medium">{{ total }}</span>
      </p>
    </div>
    <div class="flex-1 flex justify-between sm:justify-end">
      <button
        :class="{ invisible: value <= 0 }"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        @click="prev()"
      >
        Previous
      </button>
      <button
        :class="{ invisible: value + 1 >= total }"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        @click="next()"
      >
        Next
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    itemLabel: {
      type: String,
      required: false,
      default: 'Item',
    },
  },
  methods: {
    next(): void {
      this.$emit('input', this.value + 1)
    },
    prev(): void {
      this.$emit('input', this.value - 1)
    },
  },
})
</script>

<style></style>
