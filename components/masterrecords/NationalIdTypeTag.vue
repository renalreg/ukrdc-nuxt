<template>
  <span
    class="inline-flex items-center h-5 px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="TagClass(nationalidType)"
  >
    {{ nationalidType.trim() }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    nationalidType: {
      type: String,
      required: true,
    },
  },
  methods: {
    TagClass(nationalidType: string): string[] {
      if (nationalidType.trim() === 'UKRDC') {
        return ['bg-red-100', 'text-red-800']
      } else if (nationalidType.trim() === 'NHS') {
        return ['bg-blue-100', 'text-blue-800']
      } else if (nationalidType.trim() === 'CHI') {
        return ['bg-purple-100', 'text-purple-800']
      } else if (nationalidType.trim() === 'HSC') {
        return ['bg-green-100', 'text-green-800']
      } else {
        return ['bg-gray-100', 'text-gray-800']
      }
    },
  },
})
</script>

<style></style>
