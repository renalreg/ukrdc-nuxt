<!-- Tabs component formatted as floating buttons. 'input' event emitted on tab switch. -->

<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <select
        id="tabs"
        ref="selectEl"
        name="tabs"
        class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        @change="changeWithSelect"
      >
        <option v-for="tab in tabs" :key="tab">{{ tab }}</option>
      </select>
    </div>
    <div class="hidden sm:block">
      <nav class="flex space-x-2" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          role="tab"
          class="rounded-md px-3 py-2 font-medium capitalize"
          :class="value === tab ? 'bg-indigo-100 text-indigo-700 ' : 'text-gray-500 hover:text-gray-700'"
          :aria-selected="value === tab"
          @click="changeWithButton(tab)"
        >
          {{ tab }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    tabs: {
      type: Array as () => string[],
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  setup(_, { emit }) {
    const selectEl = ref<HTMLFormElement>();

    function changeWithSelect() {
      emit("input", selectEl.value?.value);
    }

    function changeWithButton(value: string) {
      emit("input", value);
    }

    return { selectEl, changeWithSelect, changeWithButton };
  },
});
</script>
