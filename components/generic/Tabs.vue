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
      <nav class="flex space-x-2" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          role="tab"
          class="px-3 py-2 font-medium text-sm rounded-md capitalize"
          :class="
            value === tab
              ? 'bg-indigo-100 text-indigo-700 '
              : 'text-gray-500 hover:text-gray-700'
          "
          :aria-selected="value === tab"
          @click="$emit('input', tab)"
        >
          {{ tab }}
        </button>
      </nav>
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
