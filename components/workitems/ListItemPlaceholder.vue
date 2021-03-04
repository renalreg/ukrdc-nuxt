<template>
  <li>
    <div class="block hover:bg-gray-50">
      <div class="animate-pulse flex items-center px-4 py-4 sm:px-6">
        <div class="min-w-0 flex-1 flex items-center">
          <div
            class="min-w-0 px-4 grid grid-cols-3 lg:grid-cols-4 md:gap-4 w-full"
          >
            <!-- Name, DoB, gender -->
            <div class="col-span-2 space-y-1">
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <!-- National ID -->
            <div class="space-y-1">
              <div class="h-4 bg-gray-200 rounded w-full sm:w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-full sm:w-1/4"></div>
            </div>
            <!-- Details (large breakpoint only) -->
            <div class="hidden lg:block space-y-1">
              <div class="h-4 bg-gray-200 rounded w-full sm:w-1/3"></div>
              <div class="h-4 bg-gray-200 rounded w-full sm:w-1/2"></div>
            </div>
          </div>
        </div>
        <div>
          <!-- Heroicon name: solid/chevron-right -->
          <svg
            class="h-5 w-5 text-gray-400"
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
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
