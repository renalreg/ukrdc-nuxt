<template>
  <div>
    <nav class="group grid grid-cols-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200" aria-label="Tabs">
      <!-- Current: "text-gray-900", Default: "text-gray-500 hover:text-gray-700" -->
      <button
        class="truncate rounded-md focus:outline-none focus:ring-offset-gray-100"
        :class="!value ? 'tab-active' : 'tab-inactive'"
        @click="$emit('input', false)"
      >
        {{ falseLabel }}
      </button>

      <button
        class="truncate rounded-md focus:outline-none focus:ring-offset-gray-100"
        :class="value ? 'tab-active' : 'tab-inactive'"
        @click="$emit('input', true)"
      >
        {{ trueLabel }}
      </button>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    trueLabel: {
      type: String,
      required: true,
    },
    falseLabel: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="postcss">
.tab-active {
  @apply rounded-md border border-gray-300 bg-white p-1.5 shadow-sm focus:border-indigo-500;
}
.tab-inactive {
}
</style>
