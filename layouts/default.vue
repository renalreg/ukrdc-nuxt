<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="flex h-screen overflow-hidden bg-white">
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->

    <transition :duration="300">
      <div v-show="sbOpen" class="md:hidden">
        <div class="fixed inset-0 z-40 flex">
          <!--Off-canvas menu overlay, show/hide based on off-canvas menu state.-->
          <transition
            enter-active-class="transition-opacity ease-linear"
            enter-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity ease-linear"
            leave-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div v-show="sbOpen" class="fixed inset-0">
              <div class="absolute inset-0 bg-gray-600 opacity-75" @click="toggle()"></div>
            </div>
          </transition>

          <!--Off-canvas menu, show/hide based on off-canvas menu state.-->
          <transition
            enter-active-class="transition ease-in-out transform"
            enter-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition ease-in-out transform"
            leave-class="translate-x-0"
            leave-to-class="-translate-x-full"
          >
            <Sidebar
              v-show="sbOpen"
              :show-close-button="true"
              :show-profile="false"
              class="relative flex w-full max-w-xs flex-1 flex-col"
              @toggle="toggle()"
            />
          </transition>
          <!-- Force sidebar to shrink to fit close icon -->
          <transition
            enter-active-class="transition ease-in-out transform"
            enter-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition ease-in-out transform"
            leave-class="translate-x-0"
            leave-to-class="-translate-x-full"
          >
            <div v-show="sbOpen" class="w-14 flex-shrink-0"></div>
          </transition>
        </div>
      </div>
    </transition>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex w-64 flex-col">
        <Sidebar class="flex h-0 flex-1 flex-col border-r border-gray-200" />
      </div>
    </div>

    <!-- Main page -->
    <div class="flex w-0 flex-1 flex-col overflow-hidden">
      <!-- Mobile menu bar -->
      <div class="z-10 flex h-16 flex-shrink-0 items-center border-b border-gray-200 bg-white md:hidden">
        <!-- Sidebar menu button -->
        <div class="justify-left inline-flex flex-grow items-center">
          <button
            class="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            @click="toggle()"
          >
            <span class="sr-only">Open sidebar</span>
            <!-- Heroicon name: outline/menu -->
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div class="mr-1 flex flex-shrink-0">
          <ProfileBadge :right-to-left="true" :top-to-bottom="true" />
        </div>
      </div>

      <!-- Main page content -->
      <main class="relative z-0 flex-1 overflow-y-auto focus:outline-none" tabindex="0">
        <Nuxt class="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8" />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import "floating-vue/dist/style.css";

import { defineComponent, ref, useContext, useMeta } from "@nuxtjs/composition-api";

import ProfileBadge from "~/components/ProfileBadge.vue";
import Sidebar from "~/components/Sidebar.vue";
import useSensitive from "~/composables/useSensitive";

export default defineComponent({
  components: {
    Sidebar,
    ProfileBadge,
  },
  setup() {
    const { base } = useContext();
    const { link } = useMeta();
    const { sensitiveCssFilter } = useSensitive();
    link.value = [{ rel: "icon", type: "image/x-icon", href: `${base || "/"}favicon.ico` }];

    const sbOpen = ref(false);

    function toggle() {
      sbOpen.value = !sbOpen.value;
    }

    return { sbOpen, toggle, sensitiveCssFilter };
  },
  head: {},
});
</script>

<style lang="postcss">
html {
  font-size: 14px;
}

p {
  @apply text-gray-600;
}

b {
  @apply font-medium text-gray-900;
}

h1 {
  @apply text-2xl font-bold text-gray-900;
}

h2 {
  @apply text-lg font-medium leading-6 text-gray-900;
}

h3 {
  @apply font-medium text-gray-900;
}

h4 {
  @apply text-sm font-medium uppercase tracking-wide text-gray-600;
}

h5 {
  @apply font-medium text-gray-600;
}

h6 {
  @apply text-sm font-medium text-gray-500;
}

dt {
  @apply font-medium text-gray-500;
}

dd {
  @apply text-gray-900;
}

th {
  @apply text-sm font-medium uppercase tracking-wider text-gray-500;
}

label {
  @apply font-medium text-gray-500;
}

.v-popper__popper {
  font-size: 12px;
}

.v-popper--theme-dropdown .v-popper__inner {
  @apply rounded-md border border-gray-300 p-4 shadow-sm;
}

.sensitive {
  filter: v-bind(sensitiveCssFilter);
}
</style>
