<!-- Tabs component formatted as floating buttons. 'input' event emitted on tab switch. -->

<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <BaseSelect id="tabs" ref="selectEl" name="tabs" :value="$route.path" @change="switchTab">
        <option v-for="tab in tabs" :key="tab">{{ tab }}</option>
      </BaseSelect>
    </div>
    <div class="hidden sm:block" :class="{ 'tab-container-primary': !mini }">
      <nav class="flex" :class="[mini ? 'tab-nav-mini' : 'tab-nav-primary']" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          role="tab"
          :class="[
            mini ? 'tab-base-mini' : 'tab-base-primary',
            { 'tab-active-mini': tabIsActive(tab) && mini },
            { 'tab-active-primary': tabIsActive(tab) && !mini },
            { 'tab-inactive-mini': !tabIsActive(tab) && mini },
            { 'tab-inactive-primary': !tabIsActive(tab) && !mini },
          ]"
          :aria-selected="tabIsActive(tab)"
          @click="switchTab(tab)"
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
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    tabs: {
      type: Array as () => string[],
      required: true,
    },
    value: {
      type: String,
      required: false,
      default: "",
    },
    mini: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    const selectEl = ref<HTMLFormElement>();

    function tabIsActive(tab: String) {
      return props.value === tab;
    }

    function switchTab(value: string) {
      emit("input", value);
    }

    return { selectEl, tabIsActive, switchTab };
  },
});
</script>

<style scoped lang="postcss">
.tab-container-primary {
  @apply border-b border-gray-200;
}

.tab-nav-primary {
  @apply -mb-px space-x-6;
}

.tab-base-primary {
  @apply whitespace-nowrap border-b-2 py-4 px-1 font-medium;
}

.tab-active-primary {
  @apply border-indigo-500 text-indigo-600;
}

.tab-inactive-primary {
  @apply border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700;
}

.tab-nav-mini {
  @apply space-x-2;
}

.tab-base-mini {
  @apply rounded-md px-3 py-2 font-medium capitalize;
}

.tab-active-mini {
  @apply bg-indigo-100 text-indigo-700;
}

.tab-inactive-mini {
  @apply text-gray-500 hover:text-gray-700;
}
</style>
