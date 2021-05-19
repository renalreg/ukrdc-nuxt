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
        :class="{ invisible: page <= 0 }"
        class="
          relative
          inline-flex
          items-center
          px-4
          py-2
          border border-gray-300
          text-sm
          font-medium
          rounded-md
          text-gray-700
          bg-white
          hover:bg-gray-50
        "
        @click="prev()"
      >
        Previous
      </button>
      <button
        :class="{ invisible: (page + 1) * size >= total }"
        class="
          ml-3
          relative
          inline-flex
          items-center
          px-4
          py-2
          border border-gray-300
          text-sm
          font-medium
          rounded-md
          text-gray-700
          bg-white
          hover:bg-gray-50
        "
        @click="next()"
      >
        Next
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
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

  setup(props, { emit }) {
    function next(): void {
      emit('next')
      toTop()
    }
    function prev(): void {
      emit('prev')
      toTop()
    }
    function toTop(): void {
      document.getElementsByTagName(props.scrollTag)[0].scrollTop = 0
    }

    return {
      next,
      prev,
    }
  },
})
</script>

<style></style>
