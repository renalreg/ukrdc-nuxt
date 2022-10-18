<template>
  <span
    v-if="disabled"
    v-tooltip="{ content: tooltip, delay: { show: 250, hide: 0 } }"
    class="menu-item-disabled"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
  >
    <slot />
  </span>
  <router-link
    v-else-if="to"
    v-slot="{ navigate }"
    v-tooltip="{ content: tooltip, delay: { show: 250, hide: 0 } }"
    custom
    :to="to"
  >
    <span
      class="menu-item"
      role="menuitem"
      :tabindex="disabled ? -1 : 0"
      @click="navigate"
      @keydown.enter.prevent="navigate"
    >
      <slot />
    </span>
  </router-link>
  <a
    v-else-if="href"
    v-tooltip="{ content: tooltip, delay: { show: 250, hide: 0 } }"
    :href="href"
    :target="target"
    class="menu-item"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
  >
    <slot />
  </a>
  <span
    v-else
    v-tooltip="{ content: tooltip, delay: { show: 250, hide: 0 } }"
    class="menu-item"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    @click="
      $emit('click');
      $emit('close');
    "
    @keydown.enter.prevent="
      $emit('click');
      $emit('close');
    "
  >
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    to: {
      type: [Object, String],
      required: false,
      default: null,
    },
    href: {
      type: String,
      required: false,
      default: null,
    },
    target: {
      type: String,
      required: false,
      default: null,
    },
    tooltip: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>

<style lang="postcss">
.menu-item-base {
  @apply block px-4 py-2 text-sm;
}
.menu-item {
  @apply menu-item-base cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-indigo-100 focus:text-gray-900;
}
.menu-item-disabled {
  @apply menu-item-base cursor-default text-gray-400;
}
</style>
