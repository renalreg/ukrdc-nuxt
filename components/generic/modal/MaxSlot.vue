<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed z-10 inset-0">
      <div class="items-end justify-center h-screen w-screen block p-0 mt-16 md:mt-0">
        <!-- Modal panel, show/hide based on modal state. -->
        <TransitionModal>
          <div
            v-show="visible"
            class="inline-block align-bottom vibrancy shadow-xl transform transition-all sm:align-middle h-full w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="block absolute top-0 right-0 pt-2 pr-6 z-50">
              <GenericButtonClose @click="hide()" />
            </div>
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

<style scoped>
.vibrancy {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
}
</style>
