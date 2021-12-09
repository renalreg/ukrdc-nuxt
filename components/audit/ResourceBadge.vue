<template>
  <GenericCardMini class="px-2 py-1">
    <TextL2>{{ resource }} {{ resourceId ? resourceId : '' }}</TextL2>
  </GenericCardMini>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    resource: {
      type: String,
      required: true,
    },
    resourceId: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup() {},
})
</script>
