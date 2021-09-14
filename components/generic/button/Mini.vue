<template>
  <router-link v-if="to" v-slot="{ navigate }" custom :to="to">
    <button
      v-tooltip="{ content: tooltip, delay: { show: 500, hide: 0 } }"
      :aria-label="label"
      type="button"
      :class="`btn-mini-${colour}`"
      @click="navigate"
    >
      <slot />
    </button>
  </router-link>
  <button
    v-else
    v-tooltip="{ content: tooltip, delay: { show: 500, hide: 0 } }"
    :aria-label="label"
    type="button"
    :class="`btn-mini-${colour}`"
    @click="$emit('click')"
  >
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
    colour: {
      type: String,
      required: false,
      default: 'white',
    },
    tooltip: {
      type: String,
      required: false,
      default: null,
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
  },
})
</script>

<style lang="postcss">
.btn-mini-white {
  @apply btn-mini-base bg-white hover:bg-gray-50 focus:ring-indigo-500 border-gray-300 text-gray-700;
}
.btn-mini-indigo {
  @apply btn-mini-base bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 border-transparent text-white;
}
.btn-mini-green {
  @apply btn-mini-base bg-green-600 hover:bg-green-700 focus:ring-green-500 border-transparent text-white;
}
.btn-mini-yellow {
  @apply btn-mini-base bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 border-transparent text-white;
}
.btn-mini-red {
  @apply btn-mini-base bg-red-600 hover:bg-red-700 focus:ring-red-500 border-transparent text-white;
}
.btn-mini-base {
  @apply items-center
      px-2
      py-0.5
      h-7
      border
      shadow-sm
      text-sm
      font-medium
      rounded-sm
      focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>
