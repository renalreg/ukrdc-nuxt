<template>
  <div>
    <nav class="grid grid-cols-2 group rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium" aria-label="Tabs">
      <button
        class="p-1.5 border rounded-l-md rounded-r-none truncate"
        :class="!value ? ' bg-indigo-600  border-indigo-700  text-white' : 'focus:bg-gray-200 border-gray-300'"
        @click="$emit('input', false)"
      >
        {{ falseLabel }}
      </button>

      <button
        class="p-1.5 border rounded-r-md rounded-l-none truncate"
        :class="value ? ' bg-indigo-600 border-indigo-700  text-white' : 'focus:bg-gray-200 border-gray-300'"
        @click="$emit('input', true)"
      >
        {{ trueLabel }}
      </button>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

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
    return {}
  },
})
</script>
