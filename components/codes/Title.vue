<template>
  <div>
    <p class="font-medium text-gray-500 capitalize truncate inline">{{ codingStandard }} /</p>
    <p class="font-medium text-gray-800 truncate inline">
      {{ code }}
    </p>
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
