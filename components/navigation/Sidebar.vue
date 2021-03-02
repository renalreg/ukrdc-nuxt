<template>
  <div class="bg-white">
    <div v-if="showCloseButton" class="absolute top-0 right-0 -mr-12 pt-2">
      <button
        class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        @click="$emit('toggle')"
      >
        <span class="sr-only">Close sidebar</span>
        <!-- Heroicon name: outline/x -->
        <svg
          class="h-6 w-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
      <div class="flex-shrink-0 flex items-center px-4">
        <img
          class="h-8 w-auto"
          src="~/assets/ukrdc-indigo-600.svg"
          alt="Workflow"
        />
      </div>
      <nav class="mt-5 px-2 space-y-1">
        <!-- Current: "bg-gray-100 text-gray-900", Default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900" -->

        <NuxtLink
          v-for="item in pages"
          :key="item.url"
          :to="item.url"
          href="#"
          class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
          :class="[
            active == item.url
              ? ['bg-gray-100', 'text-gray-900']
              : ['text-gray-600', 'hover:bg-gray-50', 'hover:text-gray-900'],
          ]"
          @click.native="
            $emit('toggle')
            active = item.url
          "
        >
          <!-- Current: "text-gray-500", Default: "text-gray-400 group-hover:text-gray-500" -->
          <!-- Heroicon name: outline/home -->
          <svg
            class="text-gray-500 mr-4 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="item.svg"
            />
          </svg>
          {{ item.title }}
        </NuxtLink>
      </nav>
    </div>

    <div
      v-if="showProfile"
      class="flex-shrink-0 flex border-t border-gray-200 p-4"
    >
      <ProfileBadge @click="active = '/profile'" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface NavItem {
  title: string
  url: string
  svg: string
}

export default Vue.extend({
  props: {
    showCloseButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    showProfile: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      active: '/',
      pages: [
        {
          title: 'Dashboard',
          url: '/',
          svg:
            'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        },
        {
          title: 'Work Items',
          url: '/workitems',
          svg:
            'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
        },
      ] as NavItem[],
    }
  },
})
</script>

<style></style>
