<template id="editor">
  <div>
    <textarea
      :value="value"
      :maxLength="maxLength"
      class="sm: mb-4 block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    value: {
      default: "",
      type: String,
    },
    maxLength: {
      type: Number,
      default: undefined,
      required: false,
    },
  },
});
</script>
