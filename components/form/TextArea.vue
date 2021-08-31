<template id="editor">
  <div>
    <textarea
      :value="value"
      :maxLength="maxLength"
      class="
        max-w-lg
        shadow-sm
        block
        w-full
        mb-4
        focus:ring-indigo-500 focus:border-indigo-500
        sm:
        border-gray-300
        rounded-md
      "
      @input="$emit('input', $event.target.value)"
    ></textarea>
    <div v-if="maxLength">
      <TextL1 :class="[value && value.length >= maxLength ? 'text-red-600' : '']"
        >{{ value ? value.length : 0 }}/{{ maxLength }}</TextL1
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      default: '',
      type: String,
    },
    maxLength: {
      type: Number,
      default: undefined,
      required: false,
    },
  },
})
</script>
