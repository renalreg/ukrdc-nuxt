<template>
  <p class="capitalize truncate">
    <NuxtLink class="hover:underline" :to="`/facilities/${code}`">{{ code }}</NuxtLink>
  </p>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    code: {
      type: String,
      required: true,
    },
  },
})
</script>
