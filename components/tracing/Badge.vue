<template>
  <TracingVerifiedBadge v-if="verified" />
  <TracingUnverifiedBadge v-else />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    verified: {
      type: Boolean,
      required: true,
    },
  },
})
</script>
