<template>
  <router-link v-if="to" v-slot="{ navigate }" custom :to="to">
    <button
      v-tooltip="{ content: tooltip, delay: { show: 500, hide: 0 } }"
      :aria-label="label"
      type="button"
      class="btn-round-base"
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
    class="btn-round-base"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts">
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
    label: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>

<style lang="postcss">
.btn-round-base {
  @apply inline-flex
      items-center
      rounded-full
      border border-gray-300
      bg-white
      p-1
      text-gray-400
      shadow-sm
      hover:bg-gray-50
      hover:text-gray-500
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
}
</style>
