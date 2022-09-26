<!-- Tabs component formatted as a tab line. Tab elements include a name and href, and trigger router navigation on click. -->

<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <BaseSelect id="tabs" ref="selectEl" name="tabs" :value="$route.path" @change="switchTab">
        <option v-for="tab in tabs" :key="tab.name" :value="tab.href">
          {{ tab.name }}
        </option>
      </BaseSelect>
    </div>
    <div class="hidden sm:block">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-6" aria-label="Tabs">
          <NuxtLink
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.href"
            role="tab"
            class="whitespace-nowrap border-b-2 py-4 px-1 font-medium"
            :class="[
              urlCompare($route.path, tab.href)
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            ]"
            :aria-current="urlCompare($route.path, tab.href) ? 'page' : undefined"
            @click="$emit('input', tab)"
          >
            {{ tab.name }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useRouter } from "@nuxtjs/composition-api";

import BaseSelect from "~/components/base/BaseSelect.vue";
import { urlCompare } from "~/helpers/pathUtils";

export interface Tabs {
  name: string;
  href: string;
}

export default defineComponent({
  components: { BaseSelect },
  props: {
    tabs: {
      type: Array as () => Tabs[],
      required: true,
    },
  },
  setup(_, { emit }) {
    const router = useRouter();

    const selectEl = ref<HTMLFormElement>();

    function switchTab(href: string) {
      router.push({ path: href });
      emit("input", href);
    }

    return { selectEl, switchTab, urlCompare };
  },
});
</script>
