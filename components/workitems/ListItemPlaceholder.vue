<template>
  <li>
    <div class="block px-4 py-4 bg-white hover:bg-gray-50">
      <span class="animate-pulse flex items-center space-x-4">
        <span class="flex-1 flex space-x-2 truncate">
          <span class="space-y-1 flex flex-col text-gray-500 text-sm w-full">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </span>
        </span>
        <!-- Heroicon name: solid/chevron-right -->
        <svg
          class="flex-shrink-0 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </div>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
