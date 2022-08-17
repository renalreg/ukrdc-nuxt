<template>
  <VMenu class="flex items-center">
    <button class="cursor-pointer text-gray-500 hover:text-gray-800">
      <IconMiniInformationCircle />
    </button>

    <!-- Popover content -->
    <template #popper>
      <slot />
    </template>
  </VMenu>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {},
});
</script>
