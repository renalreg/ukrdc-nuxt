<template>
  <span>
    <TextL1 class="inline capitalize">{{ forename.toLowerCase() }}</TextL1>
    <TextL1 class="inline capitalize text-indigo-600">{{ surname.toLowerCase() }}</TextL1>
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
