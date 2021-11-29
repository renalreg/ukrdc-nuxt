<template>
  <transition :duration="200">
    <div v-show="visible" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen text-center">
        <GenericBlackout :visible="visible" />
        <LoadingIndicator colour="white" class="h-4"></LoadingIndicator>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
})
</script>
