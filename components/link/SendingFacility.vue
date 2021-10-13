<template>
  <p class="capitalize truncate">
    <NuxtLink v-if="code" class="hover:underline" :to="`/facilities/${code}`">{{ code }}</NuxtLink>
    <span v-else>Unknown Facility</span>
  </p>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    code: {
      type: String,
      required: false,
      default: null,
    },
  },
})
</script>
