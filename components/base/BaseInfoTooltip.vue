<template>
  <VMenu class="flex items-center">
    <button class="cursor-pointer text-gray-500 hover:text-gray-800">
      <IconInformationCircle />
    </button>

    <!-- Popover content -->
    <template #popper>
      <slot />
    </template>
  </VMenu>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

import IconInformationCircle from "../icons/hero/20/solid/IconInformationCircle.vue";

export default defineComponent({
  components: {
    IconInformationCircle,
  },
});
</script>
