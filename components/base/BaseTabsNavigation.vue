<!-- Tabs component formatted as a tab line. Tab elements include a name and href, and trigger router navigation on click. -->

<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <BaseSelect id="tabs" ref="selectEl" name="tabs" :value="selectedHref" @change="switchTab">
        <option v-for="tab in tabs" :key="tab.name" :value="tab.href" :selected="tabIsActive(tab)">
          {{ tab.name }}
        </option>
      </BaseSelect>
    </div>
    <div class="hidden sm:block" :class="{ 'tab-container-primary': !mini }">
      <nav class="flex" :class="[mini ? 'tab-nav-mini' : 'tab-nav-primary']" aria-label="Tabs">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.href"
          role="tab"
          :class="[
            mini ? 'tab-base-mini' : 'tab-base-primary',
            { 'tab-active-mini': tabIsActive(tab) && mini },
            { 'tab-active-primary': tabIsActive(tab) && !mini },
            { 'tab-inactive-mini': !tabIsActive(tab) && mini },
            { 'tab-inactive-primary': !tabIsActive(tab) && !mini },
          ]"
          :aria-current="tabIsActive(tab) ? 'page' : undefined"
          @click="$emit('input', tab)"
        >
          {{ tab.name }}
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useRoute, useRouter } from "@nuxtjs/composition-api";

import BaseSelect from "~/components/base/BaseSelect.vue";
import { urlCompare, urlStartsWith } from "~/helpers/pathUtils";
import { TabItem } from "~/interfaces/tabs";

export default defineComponent({
  components: { BaseSelect },
  props: {
    tabs: {
      type: Array as () => TabItem[],
      required: true,
    },
    mini: {
      type: Boolean,
      required: false,
      default: false,
    },
    id: {
      type: String,
      required: false,
      default: "tabs",
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();

    const selectEl = ref<HTMLFormElement>();

    const selectedHref = computed(() => {
      // We need to allow our BaseSelect component's current value to account for tabs having children,
      // so we use tabIsActive to find the current active tab, and set the value to that.
      // Without this, any href tab items with children will break the currently selected tab in
      // the select/option UI for these tabs.
      for (const tab of props.tabs) {
        if (tabIsActive(tab)) {
          return tab.href;
        }
      }
    });

    function tabIsActive(tab: TabItem) {
      if (tab.hasChildren) {
        return urlStartsWith(route.value.path, tab.href);
      }
      return urlCompare(route.value.path, tab.href);
    }

    function switchTab(href: string) {
      router.push({ path: href });
      emit("input", href);
    }

    return { selectEl, selectedHref, tabIsActive, switchTab };
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
  @apply whitespace-nowrap border-b-2 px-1 py-4 font-medium;
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
