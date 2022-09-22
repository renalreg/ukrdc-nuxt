<template>
  <input
    ref="textBoxEl"
    class="block rounded-md border border-gray-300 bg-white py-2 placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    :value="value"
    @input="onInput"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    value: {
      default: "",
      type: String,
    },
    focus: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    const textBoxEl = ref<HTMLFormElement>();

    onMounted(() => {
      if (props.focus) {
        textBoxEl.value?.focus();
      }
    });

    function onInput() {
      emit("input", textBoxEl.value?.value);
    }

    return { textBoxEl, onInput };
  },
});
</script>
