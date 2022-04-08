<template>
  <div>
    <div class="mx-auto mb-4 flex max-w-7xl items-center">
      <h1 class="flex-grow text-2xl font-semibold text-gray-900">Renal Facilities</h1>
      <GenericToggle v-model="includeInactive" class="flex-shrink" label="Include inactive" :right-to-left="true" />
    </div>

    <FacilitiesTable :include-empty="includeInactive" @select="$router.push({ path: `/facilities/${$event}` })" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const includeInactive = ref(true);

    return { includeInactive };
  },
});
</script>
