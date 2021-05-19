<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <select
        id="tabs"
        name="tabs"
        class="
          block
          w-full
          focus:ring-indigo-500
          focus:border-indigo-500
          border-gray-300
          rounded-md
        "
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
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-6" aria-label="Tabs">
          <NuxtLink
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.href"
            role="tab"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            :class="[
              $route.path === tab.href
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
            :aria-current="$route.path === tab.href ? 'page' : undefined"
            @click="$emit('input', tab)"
          >
            {{ tab.name }}
          </NuxtLink>
        </nav>
      </div>
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
