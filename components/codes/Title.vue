<template>
  <div>
    <TextL1 class="capitalize truncate inline"> {{ codingStandard }} / </TextL1>
    <TextL1c class="capitalize truncate inline">
      {{ code }}
    </TextL1c>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    code: {
      type: String,
      required: true,
    },
    codingStandard: {
      type: String,
      required: true,
    },
  },
})
</script>
