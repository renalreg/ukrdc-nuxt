<!-- 
Mini text box component used for things like little inline filter components.<template>
E.g. used in the Filter by Patient Number component in Data Files
-->

<template>
  <input
    ref="textBoxEl"
    class="block h-8 rounded-md border border-gray-300 bg-white px-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    :value="value"
    @input="onInput"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    value: {
      default: "",
      type: String,
    },
  },
  setup(_, { emit }) {
    const textBoxEl = ref<HTMLFormElement>();

    function onInput() {
      emit("input", textBoxEl.value?.value);
    }

    return { textBoxEl, onInput };
  },
});
</script>
