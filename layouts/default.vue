<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="h-screen flex overflow-hidden bg-gray-50">
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->

    <transition :duration="300">
      <div v-show="sbOpen" class="md:hidden">
        <div class="fixed inset-0 flex z-40">
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
              <div
                class="absolute inset-0 bg-gray-600 opacity-75"
                @click="toggle()"
              ></div>
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
            <NavigationSidebar
              v-show="sbOpen"
              :show-close-button="true"
              :show-profile="false"
              class="relative flex-1 flex flex-col max-w-xs w-full"
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
            <div v-show="sbOpen" class="flex-shrink-0 w-14"></div>
          </transition>
        </div>
      </div>
    </transition>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64">
        <NavigationSidebar
          class="flex flex-col h-0 flex-1 border-r border-gray-200"
        />
      </div>
    </div>

    <!-- Main page -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <!-- Mobile menu bar -->
      <div
        class="md:hidden z-10 h-16 flex-shrink-0 flex items-center bg-white border-b border-gray-200"
      >
        <!-- Sidebar menu button -->
        <div class="inline-flex items-center justify-left flex-grow">
          <button
            class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div class="flex-shrink-0 flex mr-4">
          <ProfileBadge :right-to-left="true" />
        </div>
      </div>

      <!-- Main page content -->
      <main
        class="flex-1 relative z-0 overflow-y-auto focus:outline-none"
        tabindex="0"
      >
        <Nuxt class="py-6" />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      sbOpen: false,
    }
  },
  methods: {
    toggle() {
      this.sbOpen = !this.sbOpen
      console.log(this.sbOpen)
    },
  },
})
</script>

<style></style>
