<template>
  <div class="rounded-md border border-blue-400 bg-blue-50 p-4">
    <div class="flex items-center">
      <!-- Heroicon name: solid/information-circle -->
      <svg
        class="h-5 w-5 flex-shrink-0 text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        />
      </svg>
      <div class="ml-3 flex-1 md:flex md:justify-between">
        <div v-if="message" class="text-blue-700">
          {{ message }}
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    message: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>
