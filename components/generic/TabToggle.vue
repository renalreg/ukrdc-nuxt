<template>
  <div>
    <nav
      class="grid grid-cols-2 group p-0.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
      aria-label="Tabs"
    >
      <!-- Current: "text-gray-900", Default: "text-gray-500 hover:text-gray-700" -->
      <button
        class="focus:ring-2 focus:ring-indigo-500 rounded-md focus:outline-none focus:ring-offset-gray-100"
        @click="$emit('input', false)"
      >
        <div :class="!value ? 'p-1.5 rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5' : ''">
          {{ falseLabel }}
        </div>
      </button>

      <button
        class="focus:ring-2 focus:ring-indigo-500 rounded-md focus:outline-none focus:ring-offset-gray-100"
        @click="$emit('input', true)"
      >
        <div :class="value ? 'p-1.5 rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5' : ''">
          {{ trueLabel }}
        </div>
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
