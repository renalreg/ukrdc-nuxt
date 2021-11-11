<template>
  <span :class="active ? 'opacity-100' : 'opacity-40'" class="cursor-pointer" @click="$emit('toggle')">
    <IconMiniFilter class="ml-2" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
})
</script>
