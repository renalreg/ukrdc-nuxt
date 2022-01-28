<template>
  <router-link v-if="to" v-slot="{ navigate }" custom :to="to">
    <button
      v-tooltip="{ content: tooltip, delay: { show: 500, hide: 0 } }"
      :aria-label="label"
      type="button"
      :disabled="disabled"
      :class="[
        `btn-mini-${colour}`,
        anchor !== 'left' ? 'rounded-l-md' : 'border-l-0',
        anchor !== 'right' ? 'rounded-r-md' : 'border-r-0',
        'border',
        { 'btn-mini-disabled': disabled },
      ]"
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
    :disabled="disabled"
    :class="[
      `btn-mini-${colour}`,
      anchor !== 'left' ? 'rounded-l-md' : 'border-l-0',
      anchor !== 'right' ? 'rounded-r-md' : 'border-r-0',
      'border',
      { 'btn-mini-disabled': disabled },
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

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
      default: "white",
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
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    anchor: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>

<style lang="postcss">
.btn-mini-disabled {
  @apply cursor-default opacity-50;
}
.btn-mini-white {
  @apply btn-mini-base border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}
.btn-mini-indigo {
  @apply btn-mini-base border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-mini-indigo-outline {
  @apply btn-mini-base border-indigo-600 bg-white text-indigo-600 hover:bg-gray-50 focus:ring-indigo-500;
}
.btn-mini-green {
  @apply btn-mini-base border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
}
.btn-mini-yellow {
  @apply btn-mini-base border-transparent bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500;
}
.btn-mini-red {
  @apply btn-mini-base border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}
.btn-mini-red-outline {
  @apply btn-mini-base border-red-600 bg-white text-red-600 hover:bg-gray-50 focus:ring-red-500;
}
.btn-mini-base {
  min-height: 2rem;
  @apply items-center
      px-2
      py-1
      text-sm
      font-medium
      shadow-sm
      focus:outline-none focus:ring-1;
}
</style>
