<template>
  <div class="bg-gray-50">
    <div v-if="showCloseButton" class="absolute top-0 right-0 -mr-12 pt-2">
      <button
        class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
    <div class="h-0 flex-1 overflow-y-auto pt-6 pb-4">
      <div class="mb-2 flex flex-shrink-0 items-center px-4">
        <img class="h-auto w-full" src="~/assets/UKKA_UKRDC.svg" alt="Workflow" />
      </div>
      <div v-if="$config.deploymentEnv !== 'production'" class="bg-yellow-700 py-2 text-center capitalize text-white">
        {{ $config.deploymentEnv }}
      </div>
      <nav class="mt-6 space-y-1 px-2">
        <div v-for="item in pages" :key="item.key">
          <div v-if="item.visible && item.url">
            <NuxtLink
              :to="item.url"
              class="group flex items-center rounded-md px-2 py-2 text-lg font-medium"
              :class="[
                $route.path == item.url
                  ? ['bg-gray-100', 'text-gray-900']
                  : ['text-gray-600', 'hover:bg-gray-50', 'hover:text-gray-900'],
              ]"
              @click.native="$emit('toggle')"
            >
              <svg
                class="mr-4 h-6 w-6 text-gray-500"
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
          <div v-else-if="item.visible">
            <h3
              :id="item.title + '_Heading'"
              class="mt-5 mb-3 px-3 text-sm font-semibold uppercase tracking-wider text-gray-500"
            >
              {{ item.title }}
            </h3>
          </div>
        </div>
      </nav>
    </div>

    <div v-if="showProfile" class="flex flex-shrink-0 border-t border-gray-200 p-1">
      <ProfileBadge />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";

import usePermissions from "~/composables/usePermissions";

interface NavItem {
  title: string;
  key: string;
  url: string;
  svg: string;
  visible: boolean;
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
    const { hasPermission, availableFacilities, firstFacility, hasMultipleFacilities } = usePermissions();

    const pages = computed(() => {
      return [
        // Dashboard for multi-facility users
        {
          title: "Dashboard",
          key: "dashboard",
          url: "/",
          svg: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
          visible: hasMultipleFacilities.value,
        },
        // Dashboard for single-facility users
        {
          title: "Dashboard",
          key: "dashboard-single-unit",
          url: firstFacility.value ? `/facilities/${firstFacility.value}` : "/",
          svg: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
          visible: !hasMultipleFacilities.value && availableFacilities.value?.length === 1,
        },
        {
          title: "Records",
          key: "records",
          url: "/masterrecords",
          svg: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
          visible: hasPermission("ukrdc:records:read"),
        },
        {
          title: "Data Admin",
          key: "data-admin",
          visible:
            hasPermission("ukrdc:workitems:read") ||
            hasPermission("ukrdc:workitems:write") ||
            hasPermission("ukrdc:messages:read") ||
            hasPermission("ukrdc:messages:write"),
        },
        {
          title: "EMPI",
          key: "empi",
          url: "/empi",
          svg: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          visible: hasPermission("ukrdc:empi:write"),
        },
        {
          title: "Work Items",
          key: "work-items",
          url: "/workitems",
          svg: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
          visible: hasPermission("ukrdc:workitems:read"),
        },
        {
          title: "Data Files",
          key: "messages",
          url: "/messages",
          svg: "M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20",
          visible: hasPermission("ukrdc:messages:read") || hasPermission("ukrdc:messages:write"),
        },
        {
          title: "System",
          visible:
            hasPermission("ukrdc:mirth:read") ||
            hasPermission("ukrdc:mirth:write") ||
            hasPermission("ukrdc:codes:read") ||
            hasPermission("ukrdc:codes:write") ||
            hasMultipleFacilities.value,
        },
        {
          title: "Facilities",
          key: "facilities",
          url: "/facilities",
          svg: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
          visible: hasMultipleFacilities.value,
        },
        {
          title: "Channels",
          key: "mirth",
          url: "/mirth",
          svg: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
          visible: hasPermission("ukrdc:mirth:read"),
        },
        {
          title: "Codes",
          key: "codes",
          url: "/codes",
          svg: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
          visible: hasPermission("ukrdc:codes:read"),
        },
      ] as NavItem[];
    });

    return { pages };
  },
});
</script>
