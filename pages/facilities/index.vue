<template>
  <div>
    <div class="mx-auto mb-4 flex max-w-7xl items-baseline">
      <h1 class="flex-grow text-2xl font-semibold text-gray-900">Renal Facilities</h1>
      <div class="mb-4 flex flex-col gap-2">
        <div class="flex flex-row-reverse">
          <FormCheckbox
            v-model="includeInactive"
            :right-to-left="true"
            label="Include facilities who have not sent any data files in the last 12 months"
          />
        </div>
        <div class="flex flex-row-reverse">
          <FormCheckbox
            v-model="includeEmpty"
            :right-to-left="true"
            label="Include facilities who have no patient records held in the UKRDC"
          />
        </div>
      </div>
    </div>

    <FacilitiesTable
      :include-empty="includeEmpty"
      :include-inactive="includeInactive"
      @select="$router.push({ path: `/facilities/${$event}` })"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const includeInactive = ref(true);
    const includeEmpty = ref(false);

    return { includeInactive, includeEmpty };
  },
});
</script>
