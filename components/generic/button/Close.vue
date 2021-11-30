<template>
  <div class="flex gap-2">
    <button
      type="button"
      class="flex items-start gap-1 px-2 py-1 border border-gray-300 shadow-sm rounded-full bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      @click="$emit('click')"
    >
      <TextL1>Close</TextL1>
      <!-- Heroicon name: outline/x -->
      <svg
        class="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
