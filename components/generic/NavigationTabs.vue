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
        <option
          v-for="tab in tabs"
          :key="tab.name"
          :selected="$route.path === tab.href"
        >
          {{ tab.name }}
        </option>
      </select>
    </div>
    <div class="hidden sm:block">
      <nav class="flex space-x-2" aria-label="Tabs">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.href"
          role="tab"
          :class="[
            $route.path === tab.href
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700',
            'px-3 py-2 font-medium text-sm rounded-md',
          ]"
          :aria-current="$route.path === tab.href ? 'page' : undefined"
          @click="$emit('input', tab)"
        >
          {{ tab.name }}
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export interface Tabs {
  name: string
  href: string
}

export default defineComponent({
  props: {
    tabs: {
      type: Array as () => Tabs[],
      required: true,
    },
  },
})
</script>
