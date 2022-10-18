<template>
  <transition
    enter-active-class="ease-out"
    enter-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in"
    leave-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="visible" class="fixed inset-0 transition-opacity" aria-hidden="true" @click="$emit('click')">
      <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
