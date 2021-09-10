<template>
  <transition
    enter-active-class="transition-all transition-fast ease-out"
    enter-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all transition-fastest ease-in"
    leave-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-show="show"
      class="absolute mx-2 my-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="option-menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
})
</script>
