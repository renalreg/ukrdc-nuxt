<template>
  <NuxtLink
    v-if="to"
    v-tooltip="{ content: tooltip, delay: { show: 500, hide: 0 } }"
    :aria-label="label"
    type="button"
    :disabled="disabled"
    :class="[
      'flex',
      'items-center',
      'justify-center',
      primary ? `btn-${colour}-primary` : `btn-${colour}`,
      round ? 'btn-round' : 'btn-not-round',
      tight ? 'p-1' : 'px-4 py-2',
      { 'btn-disabled': disabled },
    ]"
    :to="to"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    v-tooltip="{ content: tooltip, delay: { show: 500, hide: 0 } }"
    :aria-label="label"
    type="button"
    :disabled="disabled"
    :class="[
      'flex',
      'items-center',
      primary ? `btn-${colour}-primary` : `btn-${colour}`,
      round ? 'btn-round' : 'btn-not-round',
      tight ? 'p-1' : 'px-4 py-2',
      { 'btn-disabled': disabled },
    ]"
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
    primary: {
      type: Boolean,
      required: false,
      default: false,
    },
    round: {
      type: Boolean,
      required: false,
      default: false,
    },
    tight: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style lang="postcss">
.btn-disabled {
  @apply cursor-default opacity-50;
}
.btn-white {
  @apply btn-base border-gray-300 text-gray-700 focus:ring-gray-500;
}
.btn-white-primary {
  @apply btn-base-primary border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}
.btn-indigo {
  @apply btn-base border-indigo-500 text-indigo-700 focus:ring-indigo-500;
}
.btn-indigo-primary {
  @apply btn-base-primary border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-blue {
  @apply btn-base border-blue-500 text-blue-700 focus:ring-blue-500;
}
.btn-blue-primary {
  @apply btn-base-primary border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}
.btn-purple {
  @apply btn-base border-purple-500 text-purple-700 focus:ring-purple-500;
}
.btn-purple-primary {
  @apply btn-base-primary border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500;
}
.btn-green {
  @apply btn-base border-green-500 text-green-700 focus:ring-green-500;
}
.btn-green-primary {
  @apply btn-base-primary border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
}
.btn-yellow {
  @apply btn-base border-yellow-500 text-yellow-700 focus:ring-yellow-500;
}
.btn-yellow-primary {
  @apply btn-base-primary border-transparent bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500;
}
.btn-red {
  @apply btn-base border-red-500 text-red-700 focus:ring-red-500;
}
.btn-red-primary {
  @apply btn-base-primary border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}
.btn-round {
  @apply rounded-full;
}
.btn-not-round {
  @apply rounded-md;
}
.btn-base {
  @apply btn-base-primary bg-white hover:bg-gray-50;
}
.btn-base-primary {
  @apply border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>
