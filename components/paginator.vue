<template>
  <nav
    class="px-4 py-3 flex items-center justify-between sm:px-6"
    aria-label="Pagination"
  >
    <div class="hidden sm:block">
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">{{ page * size + 1 }}</span>
        to
        <span class="font-medium">{{
          Math.min((page + 1) * size, total)
        }}</span>
        of
        <span class="font-medium">{{ total }}</span>
        results
      </p>
    </div>
    <div class="flex-1 flex justify-between sm:justify-end">
      <button
        v-show="page > 0"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        @click="prev()"
      >
        Previous
      </button>
      <button
        v-show="(page + 1) * size < total"
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
    page: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    scrollTag: {
      type: String,
      required: false,
      default: 'main',
    },
  },
  methods: {
    next(): void {
      this.$emit('next')
      this.toTop()
    },
    prev(): void {
      this.$emit('prev')
      this.toTop()
    },
    toTop(): void {
      document.getElementsByTagName(this.scrollTag)[0].scrollTop = 0
    },
  },
})
</script>

<style></style>
