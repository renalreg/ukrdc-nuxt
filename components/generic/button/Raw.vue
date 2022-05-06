<template>
  <router-link v-if="to" v-slot="{ navigate }" custom :to="to">
    <button
      v-tooltip="{ content: tooltip, delay: { show: 500, hide: 0 } }"
      :class="{ 'btn-disabled': disabled }"
      :disabled="disabled"
      :aria-label="label"
      type="button"
      @click="navigate"
    >
      <slot />
    </button>
  </router-link>
  <button
    v-else
    v-tooltip="{ content: tooltip, delay: { show: 500, hide: 0 } }"
    :class="{ 'btn-disabled': disabled }"
    :disabled="disabled"
    :aria-label="label"
    type="button"
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
    label: {
      type: String,
      required: false,
      default: null,
    },
    tooltip: {
      type: String,
      required: false,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>

<style lang="postcss">
.btn-disabled {
  @apply cursor-default opacity-50;
}
</style>
