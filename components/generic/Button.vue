<template>
  <router-link v-if="to" v-slot="{ navigate }" custom :to="to">
    <button
      v-tooltip="{ content: tooltip, delay: { show: 500, hide: 0 } }"
      :aria-label="label"
      type="button"
      :disabled="disabled"
      :class="[primary ? `btn-${colour}-primary` : `btn-${colour}`, disabled ? 'btn-disabled' : '']"
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
    :class="[primary ? `btn-${colour}-primary` : `btn-${colour}`, { 'btn-disabled': disabled }]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {
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
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    primary: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>

<style lang="postcss">
.btn-disabled {
  @apply opacity-50 cursor-default;
}
.btn-white {
  @apply btn-base focus:ring-gray-500 border-gray-300 text-gray-700;
}
.btn-white-primary {
  @apply btn-base-primary bg-white hover:bg-gray-50 focus:ring-indigo-500 border-gray-300 text-gray-700;
}
.btn-indigo {
  @apply btn-base focus:ring-indigo-500 border-indigo-500 text-indigo-700;
}
.btn-indigo-primary {
  @apply btn-base-primary bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 border-transparent text-white;
}
.btn-green {
  @apply btn-base focus:ring-green-500 border-green-500 text-green-700;
}
.btn-green-primary {
  @apply btn-base-primary bg-green-600 hover:bg-green-700 focus:ring-green-500 border-transparent text-white;
}
.btn-yellow {
  @apply btn-base focus:ring-yellow-500 border-yellow-500 text-yellow-700;
}
.btn-yellow-primary {
  @apply btn-base-primary bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 border-transparent text-white;
}
.btn-red {
  @apply btn-base focus:ring-red-500 border-red-500 text-red-700;
}
.btn-red-primary {
  @apply btn-base-primary bg-red-600 hover:bg-red-700 focus:ring-red-500 border-transparent text-white;
}
.btn-base {
  @apply btn-base-primary bg-white hover:bg-gray-50;
}
.btn-base-primary {
  @apply py-2 px-4 rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 border;
}
</style>
