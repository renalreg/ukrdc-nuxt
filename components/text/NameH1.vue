<template>
  <span>
    <TextH1 class="inline capitalize">{{ forename.toLowerCase() }}</TextH1>
    <TextH1 class="inline capitalize text-indigo-600">{{ surname.toLowerCase() }}</TextH1>
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    forename: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
  },
})
</script>
