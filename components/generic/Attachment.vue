<template>
  <div class="flex items-center justify-between py-3 pl-3 pr-4">
    <div class="flex w-0 flex-1 items-center">
      <IconMiniPaperClip class="mr-2" />
      <TextP class="blurred w-0 flex-1 truncate">
        {{ filename }}
      </TextP>
    </div>
    <div class="ml-4 flex flex-shrink-0 gap-4">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    filename: {
      type: String,
      required: true,
    },
  },
  setup() {},
});
</script>
