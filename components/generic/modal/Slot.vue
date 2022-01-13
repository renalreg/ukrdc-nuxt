<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed z-10 inset-0 overflow-y-auto">
      <!-- Use padding to push modal out from underneath the navbar and provide a region to close on small displays -->
      <div
        class="flex items-end sm:items-center justify-center px-4 pb-4 pt-32 md:px-4 md:py-4 text-center h-screen content-box"
      >
        <!-- Background overlay, show/hide based on modal state. -->
        <GenericBlackout :visible="visible" @click="hide()" />

        <!-- Modal panel, show/hide based on modal state. -->
        <TransitionModal>
          <div
            v-show="visible"
            class="inline-block align-bottom bg-white rounded-lg p-4 sm:p-6 text-left shadow-xl transform transition-all sm:align-middle sm:max-w-xl w-full max-h-full overflow-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <slot></slot>
          </div>
        </TransitionModal>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import useModal from '@/helpers/useModal'

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
