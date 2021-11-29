<template>
  <div class="pl-3 pr-4 py-3 flex items-center justify-between">
    <div class="w-0 flex-1 flex items-center">
      <IconMiniPaperClip class="mr-2" />
      <TextP class="flex-1 w-0 truncate">
        {{ filename }}
      </TextP>
    </div>
    <div class="flex gap-4 ml-4 flex-shrink-0">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    filename: {
      type: String,
      required: true,
    },
  },
  setup() {},
})
</script>
