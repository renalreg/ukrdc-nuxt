<template>
  <router-link v-if="to" v-slot="{ navigate }" custom :to="to">
    <button v-tooltip="tooltip" type="button" class="btn-mini-base" @click="navigate">
      <slot />
    </button>
  </router-link>
  <button v-else v-tooltip="tooltip" type="button" class="btn-mini-base" @click="$emit('click')">
    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    to: {
      type: [Object, String],
      required: false,
      default: null,
    },
    tooltip: {
      type: String,
      required: false,
      default: null,
    },
  },
})
</script>

<style lang="postcss">
.btn-mini-base {
  @apply items-center
      px-2
      py-0.5
      h-7
      border border-gray-300
      shadow-sm
      text-sm
      font-medium
      rounded-sm
      text-gray-700
      bg-white
      hover:bg-gray-50
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}
</style>
