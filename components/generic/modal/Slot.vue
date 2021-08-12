<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 mt-16 md:mt-0">
        <!-- Background overlay, show/hide based on modal state. -->
        <GenericBlackout :visible="visible" @click="hide()" />

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!-- Modal panel, show/hide based on modal state. -->
        <TransitionModal>
          <div
            v-show="visible"
            class="
              inline-block
              align-bottom
              bg-white
              rounded-lg
              px-4
              pt-5
              pb-4
              text-left
              overflow-hidden
              shadow-xl
              transform
              transition-all
              sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6
            "
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
