<!-- Tabs component formatted as floating buttons. 'input' event emitted on tab switch. -->

<template>
  <div :class="[sticky ? 'sticky top-4 z-50' : '']">
    <div :class="[eagerToCollapse ? 'lg:hidden' : 'sm:hidden']">
      <label for="tabs" class="sr-only">Select a tab</label>
      <BaseSelect id="tabs" ref="selectEl" name="tabs" :value="value" @change="setValue">
        <option v-for="tab in tabs" :key="tab.value">{{ tab.name }}</option>
      </BaseSelect>
    </div>
    <div class="hidden" :class="[eagerToCollapse ? 'lg:block' : 'sm:block']">
      <nav class="flex" :class="[mini ? 'tab-nav-mini' : 'tab-nav-primary']" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          role="tab"
          :class="[
            mini ? 'tab-base-mini' : 'tab-base-primary',
            { 'tab-active-mini': tabIsActive(tab) && mini },
            { 'tab-active-primary': tabIsActive(tab) && !mini },
            { 'tab-inactive-mini': !tabIsActive(tab) && mini },
            { 'tab-inactive-primary': !tabIsActive(tab) && !mini },
          ]"
          :aria-selected="tabIsActive(tab)"
          @click="setValue(tab.value)"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

import BaseSelect from "~/components/base/BaseSelect.vue";
import { ModelTabItem } from "~/interfaces/tabs";

export default defineComponent({
  components: { BaseSelect },
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    tabs: {
      type: Array as () => ModelTabItem[],
      required: true,
    },
    value: {
      type: [String, Number],
      required: false,
      default: "",
    },
    mini: {
      type: Boolean,
      required: false,
      default: false,
    },
    sticky: {
      type: Boolean,
      required: false,
      default: false,
    },
    eagerToCollapse: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    const selectEl = ref<HTMLFormElement>();

    function tabIsActive(tab: ModelTabItem) {
      return props.value === tab.value;
    }

    function setValue(value: any) {
      emit("input", value);
    }

    return { selectEl, tabIsActive, setValue };
  },
});
</script>

<style scoped lang="postcss">
.tab-nav-primary {
  @apply -mb-px flex space-x-6 border-b border-gray-200;
}

.tab-base-primary {
  @apply whitespace-nowrap border-b-2 px-1 py-4 font-medium;
}

.tab-active-primary {
  @apply border-indigo-500 text-indigo-600;
}

.tab-inactive-primary {
  @apply border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700;
}

.tab-nav-mini {
  @apply inline-flex space-x-2 rounded-lg bg-gray-100 p-1;
}

.tab-base-mini {
  @apply rounded-md px-2 py-2 font-medium capitalize text-gray-600;
}

.tab-active-mini {
  @apply bg-white text-gray-900 shadow;
}

.tab-inactive-mini {
  @apply text-gray-500 hover:text-gray-700;
}
</style>
