<template>
  <div class="flex gap-2">
    <button
      type="button"
      class="focus:outline-none flex items-start gap-1 rounded-full border border-gray-300 bg-white px-2 py-1 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
