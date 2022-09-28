<template>
  <span :class="active ? 'opacity-100' : 'opacity-40'" class="cursor-pointer" @click="$emit('toggle')">
    <IconFunnel class="h-5 w-5" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import IconFunnel from "~/components/icons/hero/20/solid/IconFunnel.vue";

export default defineComponent({
  components: {
    IconFunnel,
  },
  props: {
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
});
</script>
