<template>
  <div class="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
    <div class="flex items-center px-6 py-4 md:max-w-l md:mx-auto lg:max-w-2xl">
      <div class="w-full">
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"
          >
            <!-- Heroicon name: solid/search -->
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <form @submit.prevent="$emit('submit')">
            <input
              id="search"
              ref="searchBoxRef"
              name="search"
              class="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search"
              type="search"
              :value="value"
              @input="$emit('input', $event.target.value)"
            />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
    focus: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {}
  },
  mounted() {
    console.log('mounted')
    if (this.focus) {
      const el = this.$refs.searchBoxRef as HTMLFormElement
      el.focus()
    }
  },
  methods: {},
})
</script>
