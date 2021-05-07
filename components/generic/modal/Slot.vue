<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed z-10 inset-0 overflow-y-auto">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 mt-16 md:mt-0"
      >
        <!-- Background overlay, show/hide based on modal state. -->
        <transition
          enter-active-class="ease-out"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in"
          leave-class="opacity-100"
          leave-to-class="opacity-0 scale-90"
        >
          <div
            v-if="visible"
            class="fixed inset-0 transition-opacity"
            aria-hidden="true"
            @click="hide()"
          >
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
        </transition>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
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
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <slot></slot>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import useModal from '@/mixins/useModal'

export default defineComponent({
  setup() {
    const { visible, show, hide, toggle } = useModal()

    return {
      visible,
      show,
      hide,
      toggle,
    }
  },
})
</script>
