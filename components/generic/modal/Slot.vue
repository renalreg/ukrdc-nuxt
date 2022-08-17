<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed inset-0 z-10 overflow-y-auto">
      <!-- Use padding to push modal out from underneath the navbar and provide a region to close on small displays -->
      <div
        class="content-box flex h-screen items-end justify-center px-4 pb-4 pt-32 text-center sm:items-center md:px-4 md:py-4"
      >
        <!-- Background overlay, show/hide based on modal state. -->
        <GenericBlackout :visible="visible" @click="hide()" />

        <!-- Modal panel, show/hide based on modal state. -->
        <TransitionModal>
          <div
            v-show="visible"
            class="inline-block max-h-full w-full transform overflow-auto rounded-lg bg-white p-4 text-left align-bottom shadow-xl transition-all sm:max-w-xl sm:p-6 sm:align-middle"
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
import { defineComponent } from "@nuxtjs/composition-api";
import useModal from "@/helpers/useModal";

export default defineComponent({
  setup() {
    const { visible, show, hide, toggle } = useModal();

    return {
      visible,
      show,
      hide,
      toggle,
    };
  },
});
</script>
