<template id="editor">
  <textarea
    :value="value"
    class="max-w-lg shadow-sm block w-full mb-4 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
    @input="$emit('input', $event.target.value)"
  ></textarea>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      default: '',
      type: String,
    },
  },
})
</script>
