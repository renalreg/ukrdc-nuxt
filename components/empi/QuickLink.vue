<!--
Big link cards used in the EMPI page, to direct to Merge etc.
-->

<template>
  <GenericCard class="group relative p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500">
    <div>
      <span class="inline-flex rounded-lg bg-indigo-50 p-3 text-indigo-700 ring-4 ring-white">
        <!-- Heroicon name: outline/link -->
        <svg
          class="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </span>
    </div>
    <div class="mt-4">
      <h3 class="text-lg font-medium">
        <NuxtLink :to="href" class="focus:outline-none">
          <!-- Extend touch target to entire panel -->
          <span class="absolute inset-0" aria-hidden="true"></span>
          {{ title }}
        </NuxtLink>
      </h3>
      <TextP>
        {{ description }}
      </TextP>
    </div>
    <span class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
        />
      </svg>
    </span>
  </GenericCard>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
  },
  setup() {},
});
</script>
