<template id="editor">
  <div>
    <textarea
      ref="textAreaEl"
      :value="value"
      :maxLength="maxLength"
      class="sm: mb-4 block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      @input="onInput"
    ></textarea>
    <div v-if="maxLength">
      <h5 :class="[value && value.length >= maxLength ? 'text-red-600' : '']">
        {{ value ? value.length : 0 }}/{{ maxLength }}
      </h5>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

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

  setup(_, { emit }) {
    const textAreaEl = ref<HTMLTextAreaElement>();

    function onInput() {
      emit("input", textAreaEl.value?.value);
    }

    return { textAreaEl, onInput };
  },
});
</script>
