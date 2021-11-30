<!-- Tabs component formatted as a tab line. 'input' event emitted on tab switch. -->

<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <select
        id="tabs"
        name="tabs"
        class="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
        @change="$emit('input', $event.target.value)"
      >
        <option v-for="tab in tabs" :key="tab">{{ tab }}</option>
      </select>
    </div>
    <div class="hidden sm:block">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab"
            role="tab"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium"
            :class="
              value === tab
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            "
            :aria-selected="value === tab"
            @click="$emit('input', tab)"
          >
            {{ tab }}
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    tabs: {
      type: Array as () => string[],
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
})
</script>
