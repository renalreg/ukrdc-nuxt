<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed z-10 inset-0 overflow-y-auto">
      <div
        class="flex items-end justify-center h-screen w-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Modal panel, show/hide based on modal state. -->
        <transition
          enter-active-class="ease-out"
          enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in"
          leave-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-show="visible"
            class="inline-block align-bottom vibrancy shadow-xl transform transition-all sm:align-middle h-full w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                class="rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                @click="hide()"
              >
                <span class="sr-only">Close</span>
                <!-- Heroicon name: outline/x -->
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <slot></slot>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    show(): void {
      this.visible = true
    },
    hide(): void {
      this.visible = false
    },
    toggle(): void {
      this.visible = !this.visible
    },
  },
})
</script>

<style scoped>
.vibrancy {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
}
</style>
