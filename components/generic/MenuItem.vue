<template>
  <router-link v-if="to" v-slot="{ navigate }" custom :to="to">
    <span
      class="menu-item-base"
      :class="classes"
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
    :href="href"
    :target="target"
    class="menu-item-base"
    :class="classes"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
  >
    <slot />
  </a>
  <span
    v-else
    class="menu-item-base"
    :class="classes"
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
import { computed, defineComponent } from "@nuxtjs/composition-api";

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
  },

  setup(props) {
    const classes = computed(() => {
      if (props.disabled) {
        return ["text-gray-400"];
      } else {
        return [
          "text-gray-700",
          "hover:bg-gray-100",
          "hover:text-gray-900",
          "focus:bg-indigo-100",
          "focus:text-gray-900",
          "cursor-pointer",
        ];
      }
    });

    return { classes };
  },
});
</script>

<style lang="postcss">
.menu-item-base {
  @apply block px-4 py-2 text-sm;
}
</style>
