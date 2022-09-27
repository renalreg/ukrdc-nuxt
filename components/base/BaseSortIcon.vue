<template>
  <span :class="active ? 'opacity-100' : 'opacity-40'" class="cursor-pointer" @click="$emit('toggle')">
    <IconBarsArrowUp v-show="asc" class="h-5 w-5" />
    <IconBarsArrowDown v-show="!asc" class="h-5 w-5" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import IconBarsArrowDown from "~/components/icons/hero/20/solid/IconBarsArrowDown.vue";
import IconBarsArrowUp from "~/components/icons/hero/20/solid/IconBarsArrowUp.vue";

export default defineComponent({
  components: {
    IconBarsArrowDown,
    IconBarsArrowUp,
  },
  props: {
    asc: {
      type: Boolean,
      required: false,
      default: false,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
});
</script>
