<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center text-center">
        <GenericBlackout :visible="visible" />
        <LoadingIndicator colour="white" class="h-4"></LoadingIndicator>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
});
</script>
