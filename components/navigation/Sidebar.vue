<template>
  <div class="bg-gray-50">
    <div v-if="showCloseButton" class="absolute top-0 right-0 -mr-12 pt-2">
      <button
        class="
          ml-1
          flex
          items-center
          justify-center
          h-10
          w-10
          rounded-full
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white
        "
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="flex-1 h-0 pt-8 pb-4 overflow-y-auto">
      <div class="flex-shrink-0 flex items-center px-4 mb-2">
        <img class="w-full h-auto" src="~/assets/UKKA_UKRDC.svg" alt="Workflow" />
      </div>
      <nav class="mt-6 px-2 space-y-1">
        <!-- Current: "bg-gray-100 text-gray-900", Default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900" -->

        <div v-for="item in pages" :key="item.title">
          <div v-if="item.visible">
            <div v-if="item.url">
              <NuxtLink
                :to="item.url"
                href="#"
                class="group flex items-center px-2 py-2 font-medium rounded-md text-lg"
                :class="[
                  $route.path == item.url
                    ? ['bg-gray-100', 'text-gray-900']
                    : ['text-gray-600', 'hover:bg-gray-50', 'hover:text-gray-900'],
                ]"
                @click.native="$emit('toggle')"
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.svg" />
                </svg>
                {{ item.title }}
              </NuxtLink>
            </div>
            <div v-else>
              <h3
                :id="item.title + '_Heading'"
                class="px-3 mt-5 mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider"
              >
                {{ item.title }}
              </h3>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <div v-if="showProfile" class="flex-shrink-0 flex border-t border-gray-200 p-4">
      <ProfileBadge />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'

interface NavItem {
  title: string
  url: string
  svg: string
  visible: boolean
}

export default defineComponent({
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

  setup() {
    const { $hasPermission } = useContext()

    const pages = ref([
      {
        title: 'Dashboard',
        url: '/',
        svg: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        visible: true,
      },
      {
        title: 'Records',
        url: '/masterrecords',
        svg: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
        visible: $hasPermission('ukrdc:records:read'),
      },
      {
        title: 'Administration',
        visible:
          $hasPermission('ukrdc:workitems:read') ||
          $hasPermission('ukrdc:workitems:write') ||
          $hasPermission('ukrdc:errors:read') ||
          $hasPermission('ukrdc:errors:write') ||
          $hasPermission('ukrdc:mirth:read') ||
          $hasPermission('ukrdc:mirth:write'),
      },
      {
        title: 'Work Items',
        url: '/workitems',
        svg: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
        visible: $hasPermission('ukrdc:workitems:read'),
      },
      {
        title: 'Errors',
        url: '/errors',
        svg: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        visible: $hasPermission('ukrdc:errors:read') || $hasPermission('ukrdc:errors:write'),
      },
      {
        title: 'Channels',
        url: '/mirth',
        svg: 'M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20',
        visible: $hasPermission('ukrdc:mirth:read'),
      },
    ] as NavItem[])

    return { pages }
  },
})
</script>
